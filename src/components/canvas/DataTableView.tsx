import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronRight, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { getCellPerformance, type CellPerformance } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export const DataTableView = () => {
  const [cellData, setCellData] = useState<CellPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCellData = async () => {
      try {
        const data = await getCellPerformance(100);
        setCellData(data);
      } catch (error) {
        console.error('Failed to fetch cell performance:', error);
        toast({
          title: "Error",
          description: "Failed to load cell performance data. Using fallback data.",
          variant: "destructive",
        });
        // Fallback data
        setCellData([
          { cell_id: "cell_001", rrc_success_rate: 98.5, handover_success_rate: 97.2, network_load: 45, active_alarms: 0, status: "Optimal" },
          { cell_id: "cell_002", rrc_success_rate: 95.2, handover_success_rate: 94.1, network_load: 72, active_alarms: 2, status: "Degraded" },
          { cell_id: "cell_003", rrc_success_rate: 88.1, handover_success_rate: 86.5, network_load: 91, active_alarms: 5, status: "Critical" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCellData();
  }, [toast]);

  const getTrend = (rrcRate: number) => {
    if (rrcRate >= 97) return "up";
    if (rrcRate < 93) return "down";
    return "stable";
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-background via-card to-background">
        <div className="animate-pulse">Loading cell performance data...</div>
      </div>
    );
  }

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
                <TableHead className="text-foreground">RRC Success Rate</TableHead>
                <TableHead className="text-foreground">Handover Rate</TableHead>
                <TableHead className="text-foreground">Load</TableHead>
                <TableHead className="text-foreground">Active Alarms</TableHead>
                <TableHead className="text-foreground">Status</TableHead>
                <TableHead className="text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cellData.map((cell) => {
                const trend = getTrend(cell.rrc_success_rate);
                return (
                  <TableRow key={cell.cell_id} className="animate-fade-in hover:bg-muted/50">
                    <TableCell className="font-medium text-foreground">{cell.cell_id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={cell.rrc_success_rate >= 95 ? "text-success" : cell.rrc_success_rate >= 90 ? "text-warning" : "text-destructive"}>
                          {cell.rrc_success_rate.toFixed(1)}%
                        </span>
                        {trend === "up" && <TrendingUp className="h-4 w-4 text-success" />}
                        {trend === "down" && <TrendingDown className="h-4 w-4 text-destructive" />}
                        {trend === "stable" && <Minus className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cell.handover_success_rate >= 95 ? "text-success" : cell.handover_success_rate >= 90 ? "text-warning" : "text-destructive"}>
                        {cell.handover_success_rate.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
                          <div 
                            className={`h-full ${
                              cell.network_load >= 85 ? "bg-destructive" : 
                              cell.network_load >= 60 ? "bg-warning" : 
                              "bg-success"
                            }`}
                            style={{ width: `${cell.network_load}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{cell.network_load.toFixed(0)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={cell.active_alarms > 0 ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {cell.active_alarms}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          cell.status === "Optimal" ? "default" : 
                          cell.status === "Degraded" ? "secondary" : 
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
                );
              })}
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
