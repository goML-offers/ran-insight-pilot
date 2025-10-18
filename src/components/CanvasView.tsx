import { useState } from "react";
import { Map, BarChart3, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapView } from "./canvas/MapView";
import { AnalyticsView } from "./canvas/AnalyticsView";
import { DataTableView } from "./canvas/DataTableView";

type ViewType = "map" | "analytics" | "table";

// Example heatmap data - this would come from the Co-pilot in production
const exampleHeatmapData = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [-74.006, 40.7128] as [number, number] },
      properties: { value: -84.2, color: "#00FF00" },
    },
    {
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [-73.9851, 40.7589] as [number, number] },
      properties: { value: -97.6, color: "#FFA500" },
    },
    {
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [-73.9352, 40.7306] as [number, number] },
      properties: { value: -115.1, color: "#FF0000" },
    },
  ],
};

export const CanvasView = () => {
  const [activeView, setActiveView] = useState<ViewType>("map");
  const [heatmapData, setHeatmapData] = useState<typeof exampleHeatmapData | undefined>(undefined);

  const views = [
    { id: "map" as ViewType, label: "Geospatial", icon: Map },
    { id: "analytics" as ViewType, label: "Analytics", icon: BarChart3 },
    { id: "table" as ViewType, label: "Data", icon: Table2 },
  ];

  return (
    <div className="flex h-full flex-col bg-background">
      {/* View Switcher */}
      <div className="flex items-center gap-2 border-b border-border bg-card/30 px-6 py-3 backdrop-blur">
        {views.map((view) => {
          const Icon = view.icon;
          return (
            <Button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              variant={activeView === view.id ? "default" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              {view.label}
            </Button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeView === "map" && <MapView heatmapData={heatmapData} kpiName="RSRP Signal Strength" />}
        {activeView === "analytics" && <AnalyticsView />}
        {activeView === "table" && <DataTableView />}
      </div>
    </div>
  );
};
