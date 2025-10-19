import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getTimeSeries, type TimeSeriesData } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const alarmData = [
  { category: "Critical", count: 3, fill: "#ef4444" },
  { category: "Major", count: 7, fill: "#f59e0b" },
  { category: "Minor", count: 12, fill: "#3b82f6" },
  { category: "Warning", count: 18, fill: "#10b981" },
];

export const AnalyticsView = () => {
  const [kpiData, setKpiData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getTimeSeries(24);
        setKpiData(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        toast({
          title: "Error",
          description: "Failed to load analytics data. Using fallback data.",
          variant: "destructive",
        });
        // Fallback data
        const fallbackData: TimeSeriesData[] = [];
        for (let i = 0; i < 24; i++) {
          const date = new Date();
          date.setHours(date.getHours() - (24 - i));
          fallbackData.push({
            timestamp: date.toISOString(),
            rrc_success_rate: 95 + Math.random() * 4,
            handover_success_rate: 94 + Math.random() * 4,
            throughput_mbps: 120 + Math.random() * 30,
          });
        }
        setKpiData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [toast]);

  const formattedKpiData = kpiData.map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    rrcRate: item.rrc_success_rate,
    handoverRate: item.handover_success_rate,
    throughput: item.throughput_mbps,
  }));

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <div className="animate-pulse">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-background p-6">
      <div className="grid gap-6">
        {/* KPI Trends Chart */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-foreground">Network KPI Trends</CardTitle>
            <CardDescription>RRC and Handover Success Rates (Last 24 Hours)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formattedKpiData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" className="text-xs" />
                <YAxis className="text-xs" domain={[80, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="rrcRate" 
                  stroke="#0ea5e9" 
                  strokeWidth={2}
                  name="RRC Success Rate (%)"
                  dot={{ fill: '#0ea5e9', r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="handoverRate" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Handover Rate (%)"
                  dot={{ fill: '#10b981', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Network Throughput Chart */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-foreground">Network Throughput</CardTitle>
            <CardDescription>Data throughput over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={formattedKpiData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="throughput" 
                  stroke="#ea580c" 
                  fill="#ea580c" 
                  fillOpacity={0.3}
                  name="Throughput (Mbps)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Alarm Distribution Chart */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-foreground">Alarm Distribution</CardTitle>
            <CardDescription>Active alarms by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={alarmData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="category" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-card backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Performance degradation detected in Cell-456. RRC success rate has dropped by 2.3% in the last hour.
            </p>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs font-medium text-foreground">Recommendation:</p>
              <p className="text-sm text-secondary">Consider adjusting antenna tilt or reviewing interference patterns.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
