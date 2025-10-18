import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Zap, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

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
  
  const MAPBOX_TOKEN = "pk.eyJ1IjoiYWJoaW5hdi10aGUtd2l6YXJkIiwiYSI6ImNtZ3duMmthdzB5MWsyd3MydnlzYjd0aGIifQ.JYNx6D_Ngl1g2F2d5vW9dA";

  // Static cell data for display when no heatmap
  const cells = [
    { id: "Cell-123", lat: 40.7128, lng: -74.0060, status: "optimal", load: 45 },
    { id: "Cell-456", lat: 40.7589, lng: -73.9851, status: "degraded", load: 87 },
    { id: "Cell-789", lat: 40.7306, lng: -73.9352, status: "critical", load: 92 },
  ];

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-74.0, 40.73],
      zoom: 11,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add cell markers
    cells.forEach((cell) => {
      const statusConfig = {
        optimal: { color: "#10b981", icon: Zap },
        degraded: { color: "#f59e0b", icon: AlertCircle },
        critical: { color: "#ef4444", icon: AlertCircle },
      };

      const config = statusConfig[cell.status as keyof typeof statusConfig];

      const el = document.createElement("div");
      el.className = "cell-marker";
      el.style.width = "32px";
      el.style.height = "32px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = config.color;
      el.style.border = "3px solid white";
      el.style.cursor = "pointer";
      el.style.boxShadow = "0 4px 6px rgba(0,0,0,0.3)";

      const marker = new mapboxgl.Marker(el)
        .setLngLat([cell.lng, cell.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="padding: 8px;">
              <h3 style="font-weight: bold; margin-bottom: 4px;">${cell.id}</h3>
              <p style="font-size: 12px; margin: 2px 0;">Status: ${cell.status}</p>
              <p style="font-size: 12px; margin: 2px 0;">Load: ${cell.load}%</p>
              <p style="font-size: 11px; color: #888; margin-top: 4px;">${cell.lat.toFixed(4)}, ${cell.lng.toFixed(4)}</p>
            </div>`
          )
        );

      if (map.current) {
        marker.addTo(map.current);
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

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
                <div className="h-3 w-3 rounded-full bg-success" />
                <span className="text-xs text-muted-foreground">Optimal (0-60% load)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-warning" />
                <span className="text-xs text-muted-foreground">Degraded (60-85% load)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive" />
                <span className="text-xs text-muted-foreground">Critical (85%+ load)</span>
              </div>
            </div>
          </Card>
        )}

        {/* Info Banner */}
        <Card className="absolute right-6 top-6 border-secondary/20 bg-secondary/10 p-3 backdrop-blur">
          <p className="text-sm font-medium text-secondary">
            {heatmapData
              ? `${heatmapData.features.length} data points • Click to view details`
              : "3 cells displayed • Click any cell for details"}
          </p>
        </Card>
      </div>
    </div>
  );
};
