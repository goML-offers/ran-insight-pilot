import { Activity, AlertTriangle, TrendingUp, Radio } from "lucide-react";
import { Card } from "@/components/ui/card";

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
          <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-success">System Operational</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Overall Success Rate"
          value="98.2%"
          trend="+0.3% from yesterday"
          icon={<TrendingUp className="h-6 w-6" />}
          status="success"
        />
        <KPICard
          title="Active Cells"
          value="1,247"
          trend="12 degraded"
          icon={<Activity className="h-6 w-6" />}
          status="warning"
        />
        <KPICard
          title="Critical Alarms"
          value="3"
          trend="2 new in last hour"
          icon={<AlertTriangle className="h-6 w-6" />}
          status="critical"
        />
        <KPICard
          title="Network Load"
          value="67%"
          trend="Normal range"
          icon={<Radio className="h-6 w-6" />}
          status="success"
        />
      </div>
    </header>
  );
};
