"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Scatter,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { Progress } from "@/components/ui/progress";

const performanceData = [
  { date: "2024-01", pnl: 2500, drawdown: -500, equity: 102500, change: 2.5 },
  {
    date: "2024-02",
    pnl: -1200,
    drawdown: -1700,
    equity: 101300,
    change: -1.2,
  },
  { date: "2024-03", pnl: 4500, drawdown: -300, equity: 105800, change: 4.4 },
  { date: "2024-04", pnl: 3200, drawdown: -800, equity: 109000, change: 3.0 },
  {
    date: "2024-05",
    pnl: -2100,
    drawdown: -2900,
    equity: 106900,
    change: -1.9,
  },
  { date: "2024-06", pnl: 5400, drawdown: -600, equity: 112300, change: 5.1 },
];

const strategyData = [
  {
    name: "Breakout",
    trades: 45,
    winRate: 68,
    avgProfit: 380,
    riskReward: 2.1,
  },
  {
    name: "Trend Following",
    trades: 32,
    winRate: 72,
    avgProfit: 450,
    riskReward: 2.4,
  },
  {
    name: "Mean Reversion",
    trades: 28,
    winRate: 65,
    avgProfit: 320,
    riskReward: 1.8,
  },
  {
    name: "Scalping",
    trades: 56,
    winRate: 58,
    avgProfit: 180,
    riskReward: 1.5,
  },
  {
    name: "ICT Method",
    trades: 38,
    winRate: 75,
    avgProfit: 520,
    riskReward: 2.8,
  },
];

const assetAllocation = [
  { name: "Forex", value: 40, return: 12.5 },
  { name: "Indices", value: 30, return: 15.2 },
  { name: "Commodities", value: 20, return: 8.7 },
  { name: "Crypto", value: 10, return: 18.4 },
];

const timeframePerformance = [
  { timeframe: "M1", accuracy: 45, volume: 120 },
  { timeframe: "M5", accuracy: 58, volume: 85 },
  { timeframe: "M15", accuracy: 65, volume: 65 },
  { timeframe: "H1", accuracy: 72, volume: 45 },
  { timeframe: "H4", accuracy: 78, volume: 25 },
  { timeframe: "D1", accuracy: 82, volume: 15 },
];

// Updated color schemes with more distinct colors
const lightThemeColors = [
  "hsl(221, 83%, 53%)", // Bright blue
  "hsl(142, 76%, 36%)", // Forest green
  "hsl(346, 84%, 61%)", // Deep pink
  "hsl(27, 96%, 61%)", // Bright orange
  "hsl(271, 91%, 65%)", // Vibrant purple
];

const darkThemeColors = [
  "hsl(217, 91%, 60%)", // Lighter blue
  "hsl(142, 71%, 45%)", // Bright green
  "hsl(346, 89%, 70%)", // Light pink
  "hsl(27, 96%, 67%)", // Light orange
  "hsl(271, 81%, 70%)", // Light purple
];

const CustomTooltip = ({ active, payload, label }: any) => {
  const { theme } = useTheme();

  if (active && payload && payload.length) {
    return (
      <div
        className={`${
          theme === "dark" ? "bg-slate-800" : "bg-white"
        } border rounded-lg p-3 shadow-lg`}
      >
        <p className="font-medium mb-1">{label}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} className="flex items-center gap-2 text-sm">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: pld.color }}
            />
            <span>{pld.name}: </span>
            <span className="font-semibold">
              {typeof pld.value === "number"
                ? pld.name.toLowerCase().includes("rate") ||
                  pld.name.toLowerCase().includes("return")
                  ? `${pld.value}%`
                  : pld.name.toLowerCase().includes("profit") ||
                    pld.name.toLowerCase().includes("pnl")
                  ? `$${pld.value}`
                  : pld.value
                : pld.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const chartColors = theme === "dark" ? darkThemeColors : lightThemeColors;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+$12,300</div>
            <p className="text-xs text-muted-foreground">
              +15.8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67.5%</div>
            <p className="text-xs text-muted-foreground">199 trades total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$420</div>
            <p className="text-xs text-muted-foreground">Per winning trade</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">-$2,900</div>
            <p className="text-xs text-muted-foreground">-2.6% from equity</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="allocation">Portfolio</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Equity Curve</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={performanceData}>
                      <defs>
                        <linearGradient
                          id="equityGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={chartColors[0]}
                            stopOpacity={0.1}
                          />
                          <stop
                            offset="95%"
                            stopColor={chartColors[0]}
                            stopOpacity={0.01}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={
                          theme === "dark"
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)"
                        }
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        stroke={
                          theme === "dark"
                            ? "rgba(255,255,255,0.7)"
                            : "rgba(0,0,0,0.7)"
                        }
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        yAxisId="left"
                        stroke={
                          theme === "dark"
                            ? "rgba(255,255,255,0.7)"
                            : "rgba(0,0,0,0.7)"
                        }
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value.toLocaleString()}`}
                        domain={[90000, 120000]}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke={
                          theme === "dark"
                            ? "rgba(255,255,255,0.7)"
                            : "rgba(0,0,0,0.7)"
                        }
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}%`}
                        domain={[-5, 10]}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="equity"
                        name="Account Balance"
                        stroke={chartColors[0]}
                        strokeWidth={2}
                        fill="url(#equityGradient)"
                        dot={{
                          stroke: chartColors[0],
                          strokeWidth: 2,
                          fill: theme === "dark" ? "#1e1e1e" : "#ffffff",
                          r: 4,
                        }}
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="change"
                        name="Monthly Change %"
                        fill={chartColors[1]}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={40}
                      >
                        {performanceData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.change >= 0
                                ? chartColors[1]
                                : theme === "dark"
                                ? "hsl(0, 100%, 70%)"
                                : "hsl(0, 90%, 50%)"
                            }
                            fillOpacity={0.7}
                          />
                        ))}
                      </Bar>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">
                      Initial Balance
                    </span>
                    <span className="font-semibold">$100,000</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">
                      Current Balance
                    </span>
                    <span className="font-semibold text-green-500">
                      $112,300
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Max Drawdown</span>
                    <span className="font-semibold text-red-500">-$2,900</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Timeframe Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={timeframePerformance}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={
                          theme === "dark"
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)"
                        }
                      />
                      <XAxis
                        dataKey="timeframe"
                        stroke={
                          theme === "dark"
                            ? "rgba(255,255,255,0.7)"
                            : "rgba(0,0,0,0.7)"
                        }
                      />
                      <YAxis
                        yAxisId="left"
                        stroke={
                          theme === "dark"
                            ? "rgba(255,255,255,0.7)"
                            : "rgba(0,0,0,0.7)"
                        }
                        domain={[0, 100]}
                        label={{
                          value: "Win Rate %",
                          angle: -90,
                          position: "insideLeft",
                          offset: -5,
                          style: {
                            fill:
                              theme === "dark"
                                ? "rgba(255,255,255,0.7)"
                                : "rgba(0,0,0,0.7)",
                            fontSize: 12,
                          },
                        }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke={
                          theme === "dark"
                            ? "rgba(255,255,255,0.7)"
                            : "rgba(0,0,0,0.7)"
                        }
                        label={{
                          value: "Number of Trades",
                          angle: 90,
                          position: "insideRight",
                          offset: 5,
                          style: {
                            fill:
                              theme === "dark"
                                ? "rgba(255,255,255,0.7)"
                                : "rgba(0,0,0,0.7)",
                            fontSize: 12,
                          },
                        }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="top" height={36} />
                      <Bar
                        yAxisId="right"
                        dataKey="volume"
                        name="Number of Trades"
                        fill={chartColors[3]}
                        fillOpacity={0.7}
                        radius={[4, 4, 0, 0]}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="accuracy"
                        name="Win Rate %"
                        stroke={chartColors[2]}
                        strokeWidth={3}
                        dot={{
                          stroke: chartColors[2],
                          strokeWidth: 2,
                          fill: theme === "dark" ? "#1e1e1e" : "#ffffff",
                          r: 4,
                        }}
                        activeDot={{
                          stroke: chartColors[2],
                          strokeWidth: 2,
                          fill: chartColors[2],
                          r: 6,
                        }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Strategy Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={strategyData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={
                          theme === "dark"
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)"
                        }
                      />
                      <XAxis
                        dataKey="name"
                        stroke={
                          theme === "dark"
                            ? "rgba(255,255,255,0.7)"
                            : "rgba(0,0,0,0.7)"
                        }
                      />
                      <YAxis
                        yAxisId="left"
                        stroke={
                          theme === "dark"
                            ? "rgba(255,255,255,0.7)"
                            : "rgba(0,0,0,0.7)"
                        }
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke={
                          theme === "dark"
                            ? "rgba(255,255,255,0.7)"
                            : "rgba(0,0,0,0.7)"
                        }
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="winRate"
                        fill={chartColors[0]}
                        name="Win Rate %"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="avgProfit"
                        fill={chartColors[1]}
                        name="Avg Profit $"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk/Reward Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={strategyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar
                        dataKey="trades"
                        fill="hsl(var(--chart-3))"
                        name="Number of Trades"
                      />
                      <Line
                        type="monotone"
                        dataKey="riskReward"
                        stroke="hsl(var(--chart-4))"
                        name="Risk/Reward Ratio"
                        strokeWidth={2}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={assetAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {assetAllocation.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={chartColors[index % chartColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Asset Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={assetAllocation} layout="vertical">
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={
                          theme === "dark"
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)"
                        }
                      />
                      <XAxis
                        type="number"
                        stroke={
                          theme === "dark"
                            ? "rgba(255,255,255,0.7)"
                            : "rgba(0,0,0,0.7)"
                        }
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        stroke={
                          theme === "dark"
                            ? "rgba(255,255,255,0.7)"
                            : "rgba(0,0,0,0.7)"
                        }
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="return" name="Return %">
                        {assetAllocation.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={chartColors[index % chartColors.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
