import { useState } from "react";
import { Map, BarChart3, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapView } from "./canvas/MapView";
import { AnalyticsView } from "./canvas/AnalyticsView";
import { DataTableView } from "./canvas/DataTableView";

type ViewType = "map" | "analytics" | "table";

export const CanvasView = () => {
  const [activeView, setActiveView] = useState<ViewType>("map");

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
        {activeView === "map" && <MapView />}
        {activeView === "analytics" && <AnalyticsView />}
        {activeView === "table" && <DataTableView />}
      </div>
    </div>
  );
};
