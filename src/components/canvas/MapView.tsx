import { MapPin, Navigation, Zap, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const MapView = () => {
  const cells = [
    { id: "Cell-123", lat: "40.7128", lng: "-74.0060", status: "optimal", load: 45 },
    { id: "Cell-456", lat: "40.7589", lng: "-73.9851", status: "degraded", load: 87 },
    { id: "Cell-789", lat: "40.7306", lng: "-73.9352", status: "critical", load: 92 },
  ];

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-background via-card to-background p-6">
      {/* Map Placeholder */}
      <div className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-muted/30 backdrop-blur">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        
        {/* Center Focus Point */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative flex h-32 w-32 items-center justify-center">
            <div className="absolute h-full w-full animate-pulse rounded-full border-2 border-primary/30" />
            <div className="absolute h-24 w-24 animate-pulse rounded-full border-2 border-primary/50 animation-delay-150" />
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow shadow-lg">
              <Navigation className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Cell Markers */}
        {cells.map((cell, idx) => {
          const positions = [
            { top: "30%", left: "25%" },
            { top: "60%", left: "65%" },
            { top: "45%", left: "75%" },
          ];
          
          const statusConfig = {
            optimal: { color: "success", icon: Zap },
            degraded: { color: "warning", icon: AlertCircle },
            critical: { color: "destructive", icon: AlertCircle },
          };

          const config = statusConfig[cell.status as keyof typeof statusConfig];
          const Icon = config.icon;

          return (
            <div
              key={cell.id}
              className="absolute animate-fade-in"
              style={{ ...positions[idx], animationDelay: `${idx * 150}ms` }}
            >
              <Card className="w-48 border-border/50 bg-card/90 p-3 backdrop-blur transition-all hover:scale-105 hover:shadow-lg">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-${config.color}/10`}>
                      <Icon className={`h-4 w-4 text-${config.color}`} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{cell.id}</p>
                      <p className="text-xs text-muted-foreground">Load: {cell.load}%</p>
                    </div>
                  </div>
                  <Badge 
                    variant={cell.status === "optimal" ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {cell.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{cell.lat}, {cell.lng}</span>
                </div>
              </Card>
            </div>
          );
        })}

        {/* Legend */}
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

        {/* Info Banner */}
        <Card className="absolute right-6 top-6 border-secondary/20 bg-secondary/10 p-3 backdrop-blur">
          <p className="text-sm font-medium text-secondary">
            3 cells displayed • Click any cell for details
          </p>
        </Card>
      </div>
    </div>
  );
};
