import { Card } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const kpiData = [
  { time: "00:00", rrc: 96.5, handover: 98.2, throughput: 450 },
  { time: "04:00", rrc: 97.1, handover: 98.5, throughput: 380 },
  { time: "08:00", rrc: 94.8, handover: 97.8, throughput: 720 },
  { time: "12:00", rrc: 93.2, handover: 96.9, throughput: 890 },
  { time: "16:00", rrc: 95.4, handover: 97.5, throughput: 950 },
  { time: "20:00", rrc: 96.8, handover: 98.1, throughput: 680 },
];

const alarmData = [
  { category: "Hardware", count: 5 },
  { category: "Software", count: 12 },
  { category: "Configuration", count: 8 },
  { category: "Performance", count: 15 },
  { category: "Connectivity", count: 7 },
];

export const AnalyticsView = () => {
  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-background via-card to-background p-6">
      <div className="space-y-6">
        {/* KPI Trends */}
        <Card className="border-border/50 bg-card/50 p-6 backdrop-blur">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Network KPI Trends - Last 24h</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={kpiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="rrc" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
                name="RRC Success Rate (%)"
                dot={{ fill: 'hsl(var(--chart-1))' }}
              />
              <Line 
                type="monotone" 
                dataKey="handover" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                name="Handover Success (%)"
                dot={{ fill: 'hsl(var(--chart-2))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Throughput Area Chart */}
          <Card className="border-border/50 bg-card/50 p-6 backdrop-blur">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Network Throughput (Mbps)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={kpiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="throughput" 
                  stroke="hsl(var(--secondary))" 
                  fill="hsl(var(--secondary) / 0.2)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Alarm Distribution */}
          <Card className="border-border/50 bg-card/50 p-6 backdrop-blur">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Active Alarms by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={alarmData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="category" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '11px' }}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--primary))"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Insights Card */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6 backdrop-blur">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20">
              <div className="h-3 w-3 rounded-full bg-primary animate-pulse-glow" />
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-foreground">AI Insights</h4>
              <p className="text-sm text-muted-foreground">
                Performance degradation detected in Cell-456 starting at 12:00. RRC success rate dropped by 3.6% 
                correlating with a configuration change 2 hours prior. Recommend reverting tx_power parameter.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
