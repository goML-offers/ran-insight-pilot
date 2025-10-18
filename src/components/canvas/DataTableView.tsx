import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronRight, TrendingDown, TrendingUp } from "lucide-react";

const cellData = [
  { 
    id: "Cell-123", 
    site: "Manhattan-01", 
    rrcRate: 96.5, 
    handoverRate: 98.2, 
    load: 45, 
    alarms: 0,
    trend: "up",
    status: "optimal" 
  },
  { 
    id: "Cell-456", 
    site: "Manhattan-02", 
    rrcRate: 93.2, 
    handoverRate: 96.9, 
    load: 87, 
    alarms: 2,
    trend: "down",
    status: "degraded" 
  },
  { 
    id: "Cell-789", 
    site: "Brooklyn-05", 
    rrcRate: 91.8, 
    handoverRate: 95.1, 
    load: 92, 
    alarms: 4,
    trend: "down",
    status: "critical" 
  },
  { 
    id: "Cell-234", 
    site: "Queens-12", 
    rrcRate: 97.3, 
    handoverRate: 99.1, 
    load: 38, 
    alarms: 0,
    trend: "up",
    status: "optimal" 
  },
  { 
    id: "Cell-567", 
    site: "Bronx-08", 
    rrcRate: 95.8, 
    handoverRate: 97.6, 
    load: 62, 
    alarms: 1,
    trend: "stable",
    status: "optimal" 
  },
];

export const DataTableView = () => {
  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-background via-card to-background p-6">
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <div className="border-b border-border p-6">
          <h3 className="text-lg font-semibold text-foreground">Network Cell Performance</h3>
          <p className="text-sm text-muted-foreground">Real-time monitoring of all active cells</p>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-foreground">Cell ID</TableHead>
                <TableHead className="text-foreground">Site</TableHead>
                <TableHead className="text-foreground">RRC Success Rate</TableHead>
                <TableHead className="text-foreground">Handover Rate</TableHead>
                <TableHead className="text-foreground">Load</TableHead>
                <TableHead className="text-foreground">Active Alarms</TableHead>
                <TableHead className="text-foreground">Status</TableHead>
                <TableHead className="text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cellData.map((cell) => (
                <TableRow key={cell.id} className="animate-fade-in hover:bg-muted/50">
                  <TableCell className="font-medium text-foreground">{cell.id}</TableCell>
                  <TableCell className="text-muted-foreground">{cell.site}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={cell.rrcRate >= 95 ? "text-success" : cell.rrcRate >= 93 ? "text-warning" : "text-destructive"}>
                        {cell.rrcRate}%
                      </span>
                      {cell.trend === "up" && <TrendingUp className="h-4 w-4 text-success" />}
                      {cell.trend === "down" && <TrendingDown className="h-4 w-4 text-destructive" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cell.handoverRate >= 97 ? "text-success" : cell.handoverRate >= 95 ? "text-warning" : "text-destructive"}>
                      {cell.handoverRate}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
                        <div 
                          className={`h-full ${
                            cell.load >= 85 ? "bg-destructive" : 
                            cell.load >= 60 ? "bg-warning" : 
                            "bg-success"
                          }`}
                          style={{ width: `${cell.load}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{cell.load}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={cell.alarms > 0 ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {cell.alarms}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        cell.status === "optimal" ? "default" : 
                        cell.status === "degraded" ? "secondary" : 
                        "destructive"
                      }
                      className="capitalize"
                    >
                      {cell.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="gap-1 text-xs"
                    >
                      Investigate
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="border-t border-border p-4">
          <p className="text-xs text-muted-foreground">
            Showing {cellData.length} cells • Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </Card>
    </div>
  );
};
