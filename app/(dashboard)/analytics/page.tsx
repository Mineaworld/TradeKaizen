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
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { Progress } from "@/components/ui/progress";
import { Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const performanceData = [
  { date: "Jan", pnl: 2500, drawdown: -500, equity: 102500, change: 2.5 },
  { date: "Feb", pnl: -1200, drawdown: -1700, equity: 101300, change: -1.2 },
  { date: "Mar", pnl: 4500, drawdown: -300, equity: 105800, change: 4.4 },
  { date: "Apr", pnl: 3200, drawdown: -800, equity: 109000, change: 3.0 },
  { date: "May", pnl: -2100, drawdown: -2900, equity: 106900, change: -1.9 },
  { date: "Jun", pnl: 5400, drawdown: -600, equity: 112300, change: 5.1 },
];

const strategyData = [
  {
    name: "Breakout",
    trades: 45,
    winRate: 68,
    avgProfit: 380,
    riskReward: 2.1,
    description: "Trading breakouts from key support/resistance levels",
  },
  {
    name: "Trend Following",
    trades: 32,
    winRate: 72,
    avgProfit: 450,
    riskReward: 2.4,
    description: "Following established market trends with momentum",
  },
  {
    name: "Mean Reversion",
    trades: 28,
    winRate: 65,
    avgProfit: 320,
    riskReward: 1.8,
    description: "Trading price returns to the average after extremes",
  },
  {
    name: "Scalping",
    trades: 56,
    winRate: 58,
    avgProfit: 180,
    riskReward: 1.5,
    description: "Quick trades capturing small price movements",
  },
  {
    name: "ICT Method",
    trades: 38,
    winRate: 75,
    avgProfit: 520,
    riskReward: 2.8,
    description: "Institutional trading concepts and market structure",
  },
];

const assetAllocation = [
  {
    name: "Forex",
    value: 40,
    return: 12.5,
    description: "Currency pairs trading",
  },
  {
    name: "Indices",
    value: 30,
    return: 15.2,
    description: "Stock market indices",
  },
  {
    name: "Commodities",
    value: 20,
    return: 8.7,
    description: "Raw materials and resources",
  },
  {
    name: "Crypto",
    value: 10,
    return: 18.4,
    description: "Cryptocurrency markets",
  },
];

const timeframePerformance = [
  {
    timeframe: "M1",
    accuracy: 45,
    volume: 120,
    description: "1-minute chart trades",
  },
  {
    timeframe: "M5",
    accuracy: 58,
    volume: 85,
    description: "5-minute chart trades",
  },
  {
    timeframe: "M15",
    accuracy: 65,
    volume: 65,
    description: "15-minute chart trades",
  },
  {
    timeframe: "H1",
    accuracy: 72,
    volume: 45,
    description: "1-hour chart trades",
  },
  {
    timeframe: "H4",
    accuracy: 78,
    volume: 25,
    description: "4-hour chart trades",
  },
  {
    timeframe: "D1",
    accuracy: 82,
    volume: 15,
    description: "Daily chart trades",
  },
];

// Professional color schemes with better contrast
const lightThemeColors = {
  primary: "hsl(221, 83%, 53%)",
  success: "hsl(142, 76%, 36%)",
  warning: "hsl(27, 96%, 61%)",
  error: "hsl(346, 84%, 61%)",
  info: "hsl(199, 89%, 48%)",
  accent: "hsl(271, 91%, 65%)",
  muted: "hsl(215, 16%, 47%)",
};

const darkThemeColors = {
  primary: "hsl(217, 91%, 60%)",
  success: "hsl(142, 71%, 45%)",
  warning: "hsl(27, 96%, 67%)",
  error: "hsl(346, 89%, 70%)",
  info: "hsl(199, 89%, 60%)",
  accent: "hsl(271, 81%, 70%)",
  muted: "hsl(215, 20%, 65%)",
};

const CustomTooltip = ({ active, payload, label, type }: any) => {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkThemeColors : lightThemeColors;

  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 border rounded-lg p-3 shadow-lg backdrop-blur-sm">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} className="flex items-center gap-2 text-sm">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: pld.color }}
            />
            <span className="text-muted-foreground">{pld.name}:</span>
            <span className="font-medium">
              {type === "currency"
                ? `$${pld.value.toLocaleString()}`
                : type === "percentage"
                ? `${pld.value}%`
                : pld.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ChartHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="flex items-center gap-2 mb-4">
    <h3 className="font-medium">{title}</h3>
    <HoverCard>
      <HoverCardTrigger>
        <Info className="h-4 w-4 text-muted-foreground" />
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <p className="text-sm text-muted-foreground">{description}</p>
      </HoverCardContent>
    </HoverCard>
  </div>
);

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkThemeColors : lightThemeColors;

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track your trading performance and insights
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total P&L
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+$12,300</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-green-100 dark:bg-green-900/20">
                <div
                  className="h-full rounded-full bg-green-600"
                  style={{ width: "75%" }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                +15.8% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">67.5%</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-primary-100 dark:bg-primary-900/20">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: "67.5%" }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                199 trades total
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$420</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-green-100 dark:bg-green-900/20">
                <div
                  className="h-full rounded-full bg-green-600"
                  style={{ width: "82%" }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                Per winning trade
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Max Drawdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">-$2,900</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-red-100 dark:bg-red-900/20">
                <div
                  className="h-full rounded-full bg-red-500"
                  style={{ width: "35%" }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                -2.6% from equity
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Equity Curve */}
        <Card className="col-span-2">
          <CardHeader>
            <ChartHeader
              title="Equity Curve"
              description="Shows your account balance progression over time, including profits, losses, and drawdowns."
            />
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={colors.primary}
                        stopOpacity={0.1}
                      />
                      <stop
                        offset="95%"
                        stopColor={colors.primary}
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted/20"
                  />
                  <XAxis
                    dataKey="date"
                    stroke="currentColor"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="currentColor"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="currentColor"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    content={(props) => (
                      <CustomTooltip {...props} type="currency" />
                    )}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="equity"
                    stroke={colors.primary}
                    strokeWidth={2}
                    fill="url(#colorPnl)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="change"
                    stroke={colors.success}
                    strokeWidth={2}
                    dot={{ fill: colors.success, strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Strategy Performance */}
        <Card>
          <CardHeader>
            <ChartHeader
              title="Strategy Performance"
              description="Compare the effectiveness of different trading strategies based on win rate and average profit."
            />
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={strategyData} barGap={8}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted/20"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="currentColor"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="currentColor"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    content={(props) => (
                      <CustomTooltip {...props} type="percentage" />
                    )}
                  />
                  <Bar
                    dataKey="winRate"
                    fill={colors.primary}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Asset Allocation */}
        <Card>
          <CardHeader>
            <ChartHeader
              title="Asset Allocation"
              description="Distribution of your trading capital across different asset classes and their returns."
            />
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetAllocation}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {assetAllocation.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={Object.values(colors)[index]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={(props) => (
                      <CustomTooltip {...props} type="percentage" />
                    )}
                  />
                  <Legend
                    verticalAlign="middle"
                    align="right"
                    layout="vertical"
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Timeframe Analysis */}
        <Card className="col-span-2">
          <CardHeader>
            <ChartHeader
              title="Timeframe Analysis"
              description="Compare trading accuracy and volume across different timeframes to identify your most effective trading periods."
            />
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={timeframePerformance}>
                  <PolarGrid className="stroke-muted/20" />
                  <PolarAngleAxis
                    dataKey="timeframe"
                    stroke="currentColor"
                    fontSize={12}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    stroke="currentColor"
                    fontSize={12}
                  />
                  <Radar
                    name="Accuracy"
                    dataKey="accuracy"
                    stroke={colors.primary}
                    fill={colors.primary}
                    fillOpacity={0.2}
                  />
                  <Tooltip
                    content={(props) => (
                      <CustomTooltip {...props} type="percentage" />
                    )}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
