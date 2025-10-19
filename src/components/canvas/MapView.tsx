import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card } from "@/components/ui/card";
import { getCellStatus, type CellStatus } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface HeatmapData {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    geometry: {
      type: "Point";
      coordinates: [number, number];
    };
    properties: {
      value: number;
      color: string;
    };
  }>;
}

interface MapViewProps {
  heatmapData?: HeatmapData;
  kpiName?: string;
}

export const MapView = ({ heatmapData, kpiName }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const [cells, setCells] = useState<CellStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const MAPBOX_TOKEN = "pk.eyJ1IjoiYWJoaW5hdi10aGUtd2l6YXJkIiwiYSI6ImNtZ3duMmthdzB5MWsyd3MydnlzYjd0aGIifQ.JYNx6D_Ngl1g2F2d5vW9dA";

  // Fetch cell status data
  useEffect(() => {
    const fetchCells = async () => {
      try {
        const data = await getCellStatus();
        setCells(data);
      } catch (error) {
        console.error('Failed to fetch cell status:', error);
        toast({
          title: "Error",
          description: "Failed to load cell status data. Using fallback data.",
          variant: "destructive",
        });
        // Fallback data
        setCells([
          { cell_id: "cell_001", latitude: 28.7041, longitude: 77.1025, status: "Optimal", load_percentage: 45, rrc_success_rate: 98.5 },
          { cell_id: "cell_002", latitude: 28.7050, longitude: 77.1035, status: "Degraded", load_percentage: 72, rrc_success_rate: 95.2 },
          { cell_id: "cell_003", latitude: 28.698, longitude: 77.095, status: "Critical", load_percentage: 91, rrc_success_rate: 88.1 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCells();
    const interval = setInterval(fetchCells, 30000);
    return () => clearInterval(interval);
  }, [toast]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current || cells.length === 0) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const initialCenter: [number, number] = [cells[0].longitude, cells[0].latitude];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: initialCenter,
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add cell markers from API data
    cells.forEach((cell) => {
      const el = document.createElement("div");
      el.className = "cell-marker";
      
      const color = cell.status === "Optimal" ? "#10b981" : 
                    cell.status === "Degraded" ? "#f59e0b" : "#ef4444";
      
      el.innerHTML = `
        <div style="
          background: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: transform 0.2s;
        "></div>
      `;
      
      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.2)";
      });
      
      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
      });

      const cellPopup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold;">${cell.cell_id}</h3>
          <p style="margin: 4px 0;">Status: <strong>${cell.status}</strong></p>
          <p style="margin: 4px 0;">Load: <strong>${cell.load_percentage.toFixed(1)}%</strong></p>
          <p style="margin: 4px 0;">RRC Rate: <strong>${cell.rrc_success_rate.toFixed(1)}%</strong></p>
          <p style="margin: 4px 0; font-size: 12px; color: #888;">
            Lat: ${cell.latitude.toFixed(4)}, Lon: ${cell.longitude.toFixed(4)}
          </p>
        </div>
      `);

      new mapboxgl.Marker(el)
        .setLngLat([cell.longitude, cell.latitude])
        .setPopup(cellPopup)
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [cells]);

  // Update heatmap layer
  useEffect(() => {
    if (!map.current || !heatmapData) return;

    const mapInstance = map.current;

    mapInstance.on("load", () => {
      // Remove existing heatmap if present
      if (mapInstance.getLayer("kpi-heatmap")) {
        mapInstance.removeLayer("kpi-heatmap");
      }
      if (mapInstance.getSource("heatmap-data")) {
        mapInstance.removeSource("heatmap-data");
      }

      // Add heatmap source
      mapInstance.addSource("heatmap-data", {
        type: "geojson",
        data: heatmapData,
      });

      // Add heatmap layer
      mapInstance.addLayer({
        id: "kpi-heatmap",
        type: "heatmap",
        source: "heatmap-data",
        paint: {
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "value"],
            -120, 0,
            -60, 1,
          ],
          "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 12, 3],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0, "rgba(33,102,172,0)",
            0.2, "rgb(103,169,207)",
            0.4, "rgb(209,229,240)",
            0.6, "rgb(253,219,199)",
            0.8, "rgb(239,138,98)",
            1, "rgb(178,24,43)",
          ],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 12, 30],
          "heatmap-opacity": 0.8,
        },
      });

      // Add click handler for heatmap points
      mapInstance.on("click", "kpi-heatmap", (e) => {
        if (!e.features || !e.features[0]) return;

        const coordinates = (e.features[0].geometry as any).coordinates.slice();
        const { value } = e.features[0].properties as { value: number };

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        if (popup.current) {
          popup.current.remove();
        }

        popup.current = new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(
            `<div style="padding: 8px;">
              <h3 style="font-weight: bold; margin-bottom: 4px;">${kpiName || "KPI Value"}</h3>
              <p style="font-size: 14px; margin: 2px 0;">Value: ${value.toFixed(2)}</p>
              <p style="font-size: 11px; color: #888; margin-top: 4px;">
                ${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}
              </p>
            </div>`
          )
          .addTo(mapInstance);
      });

      mapInstance.on("mouseenter", "kpi-heatmap", () => {
        mapInstance.getCanvas().style.cursor = "pointer";
      });

      mapInstance.on("mouseleave", "kpi-heatmap", () => {
        mapInstance.getCanvas().style.cursor = "";
      });
    });

    // If map already loaded, trigger update
    if (mapInstance.loaded()) {
      mapInstance.fire("load");
    }
  }, [heatmapData, kpiName]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-background via-card to-background">
        <div className="animate-pulse">Loading map data...</div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-background via-card to-background p-6">
      <div className="relative h-full w-full overflow-hidden rounded-xl border border-border shadow-lg">
        <div ref={mapContainer} className="absolute inset-0" />

        {/* Heatmap Legend */}
        {heatmapData && (
          <Card className="absolute bottom-6 left-6 border-border/50 bg-card/90 p-4 backdrop-blur">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              {kpiName || "KPI"} Heatmap
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[rgb(33,102,172)]" />
                <span className="text-xs text-muted-foreground">Low Density</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[rgb(253,219,199)]" />
                <span className="text-xs text-muted-foreground">Medium Density</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[rgb(178,24,43)]" />
                <span className="text-xs text-muted-foreground">High Density</span>
              </div>
            </div>
          </Card>
        )}

        {/* Cell Status Legend */}
        {!heatmapData && (
          <Card className="absolute bottom-6 left-6 border-border/50 bg-card/90 p-4 backdrop-blur">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Cell Status</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#10b981] border-2 border-white"></div>
                <span className="text-xs">Optimal ({cells.filter(c => c.status === 'Optimal').length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#f59e0b] border-2 border-white"></div>
                <span className="text-xs">Degraded ({cells.filter(c => c.status === 'Degraded').length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#ef4444] border-2 border-white"></div>
                <span className="text-xs">Critical ({cells.filter(c => c.status === 'Critical').length})</span>
              </div>
            </div>
          </Card>
        )}

        {/* Info Banner */}
        <Card className="absolute right-6 top-6 border-secondary/20 bg-secondary/10 p-3 backdrop-blur">
          <p className="text-sm font-medium text-secondary">
            {heatmapData
              ? `${heatmapData.features.length} data points • Click to view details`
              : `${cells.length} cells displayed • Click any cell for details`}
          </p>
        </Card>
      </div>
    </div>
  );
};
