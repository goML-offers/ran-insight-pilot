import { useEffect, useState } from "react";
import { Activity, AlertTriangle, TrendingUp, Radio } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getDashboardKPIs, type DashboardKPIs as KPIData } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface KPICardProps {
  title: string;
  value: string;
  trend?: string;
  icon: React.ReactNode;
  status: "success" | "warning" | "critical";
}

const KPICard = ({ title, value, trend, icon, status }: KPICardProps) => {
  const statusColors = {
    success: "text-success",
    warning: "text-warning",
    critical: "text-destructive animate-status-blink",
  };

  return (
    <Card className="flex items-center gap-4 border-border/50 bg-card/50 p-4 backdrop-blur">
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
        status === "success" ? "bg-success/10" :
        status === "warning" ? "bg-warning/10" :
        "bg-destructive/10"
      }`}>
        <div className={statusColors[status]}>{icon}</div>
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="text-xl font-bold text-foreground">{value}</p>
        {trend && <p className="text-xs text-secondary">{trend}</p>}
      </div>
    </Card>
  );
};

export const DashboardHeader = () => {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const data = await getDashboardKPIs();
        setKpiData(data);
      } catch (error) {
        console.error('Failed to fetch KPIs:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard KPIs. Using fallback data.",
          variant: "destructive",
        });
        // Fallback data
        setKpiData({
          rrc_success_rate: 98.2,
          active_cells: 25,
          critical_alarms: 3,
          network_load: 67,
          status: 'Operational'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
    const interval = setInterval(fetchKPIs, 30000);
    return () => clearInterval(interval);
  }, [toast]);

  if (loading) {
    return (
      <header className="border-b border-border bg-gradient-to-r from-background via-card to-background px-6 py-4">
        <div className="animate-pulse">Loading dashboard...</div>
      </header>
    );
  }

  return (
    <header className="border-b border-border bg-gradient-to-r from-background via-card to-background px-6 py-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow shadow-lg">
            <Radio className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">RAN Co-pilot</h1>
            <p className="text-sm text-muted-foreground">Network Operations Center</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 rounded-full px-3 py-1 ${
            kpiData?.status === 'Operational' 
              ? 'bg-success/10' 
              : kpiData?.status === 'Degraded'
              ? 'bg-warning/10'
              : 'bg-destructive/10'
          }`}>
            <div className={`h-2 w-2 rounded-full animate-pulse ${
              kpiData?.status === 'Operational' 
                ? 'bg-success' 
                : kpiData?.status === 'Degraded'
                ? 'bg-warning'
                : 'bg-destructive'
            }`} />
            <span className={`text-xs font-medium ${
              kpiData?.status === 'Operational' 
                ? 'text-success' 
                : kpiData?.status === 'Degraded'
                ? 'text-warning'
                : 'text-destructive'
            }`}>
              System {kpiData?.status || 'Unknown'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="RRC Success Rate"
          value={`${kpiData?.rrc_success_rate.toFixed(1)}%`}
          trend={kpiData && kpiData.rrc_success_rate >= 95 ? "+0.3% from yesterday" : "Below target"}
          icon={<TrendingUp className="h-6 w-6" />}
          status={kpiData && kpiData.rrc_success_rate >= 95 ? "success" : kpiData && kpiData.rrc_success_rate >= 90 ? "warning" : "critical"}
        />
        <KPICard
          title="Active Cells"
          value={kpiData?.active_cells.toString() || "0"}
          trend="Monitoring all cells"
          icon={<Activity className="h-6 w-6" />}
          status="success"
        />
        <KPICard
          title="Critical Alarms"
          value={kpiData?.critical_alarms.toString() || "0"}
          trend={kpiData && kpiData.critical_alarms > 0 ? `${kpiData.critical_alarms} new in last hour` : "All clear"}
          icon={<AlertTriangle className="h-6 w-6" />}
          status={kpiData && kpiData.critical_alarms === 0 ? "success" : kpiData && kpiData.critical_alarms < 5 ? "warning" : "critical"}
        />
        <KPICard
          title="Network Load"
          value={`${kpiData?.network_load.toFixed(1)}%`}
          trend={kpiData && kpiData.network_load < 60 ? "Normal range" : kpiData && kpiData.network_load < 85 ? "Moderate" : "High load"}
          icon={<Radio className="h-6 w-6" />}
          status={kpiData && kpiData.network_load < 60 ? "success" : kpiData && kpiData.network_load < 85 ? "warning" : "critical"}
        />
      </div>
    </header>
  );
};
