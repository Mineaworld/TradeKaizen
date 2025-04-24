"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useMediaQuery } from "@/hooks/use-media-query";

const strategyData = [
  { name: "Breakout", winRate: 68, avgProfit: 450 },
  { name: "Mean Reversion", winRate: 72, avgProfit: 380 },
  { name: "Trend", winRate: 65, avgProfit: 520 },
  { name: "ICT", winRate: 70, avgProfit: 480 },
];

const riskRewardData = [
  { name: "Jan", ratio: 1.8, trades: 45 },
  { name: "Feb", ratio: 2.1, trades: 52 },
  { name: "Mar", ratio: 1.9, trades: 48 },
  { name: "Apr", ratio: 2.4, trades: 55 },
  { name: "May", ratio: 2.2, trades: 50 },
  { name: "Jun", ratio: 2.5, trades: 58 },
];

export default function Hero() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const CustomTooltip = ({ active, payload, label, type }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 border rounded-lg shadow-lg p-3 backdrop-blur-sm">
          <p className="text-sm font-semibold mb-1">{label}</p>
          {type === "strategy" ? (
            <>
              <p className="text-sm text-muted-foreground">
                Win Rate:{" "}
                <span className="text-primary">{payload[0].value}%</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Avg Profit:{" "}
                <span className="text-green-500">
                  ${payload[0].payload.avgProfit}
                </span>
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                R/R Ratio:{" "}
                <span className="text-primary">{payload[0].value}:1</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Trades:{" "}
                <span className="text-primary">
                  {payload[0].payload.trades}
                </span>
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-background via-background to-background/50">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-6 md:space-y-8 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
              <motion.div
                className="space-y-4 md:space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-foreground">
                  Master Your <br />
                  <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                    Trading Journey
                  </span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                  TradeKaizen is your all-in-one trading journal platform,
                  crafted to empower you in analyzing patterns, tracking
                  performance, and refining your trading strategies.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto text-base font-medium bg-primary hover:bg-primary/90"
                >
                  <Link href="/register">Get Started for Free</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-base font-medium border-primary/20 hover:bg-primary/10"
                >
                  <Link href="#features">Explore Analytics</Link>
                </Button>
              </motion.div>
            </div>

            {/* Right Column - Dashboard Preview */}
            <motion.div
              className="relative lg:ml-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="relative w-full min-h-[600px] sm:aspect-[4/3] bg-gradient-to-br from-background/95 to-background/80 dark:from-background/90 dark:to-background/70 rounded-xl border shadow-2xl overflow-y-auto">
                {/* Glass effect overlay */}
                <div className="absolute inset-0 backdrop-blur-[2px]" />

                {/* Dashboard Preview Content */}
                <div className="relative z-10 p-4 sm:p-5 md:p-6 lg:p-8">
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4">
                    <div className="bg-background/80 dark:bg-card/80 p-3 sm:p-4 rounded-lg border shadow-sm backdrop-blur-sm">
                      <div className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">
                        Total P&L
                      </div>
                      <div className="text-sm sm:text-lg lg:text-xl font-bold text-green-500">
                        +$12,307
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">
                        +15.8% from last month
                      </div>
                    </div>
                    <div className="bg-background/80 dark:bg-card/80 p-3 sm:p-4 rounded-lg border shadow-sm backdrop-blur-sm">
                      <div className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">
                        Win Rate
                      </div>
                      <div className="text-sm sm:text-lg lg:text-xl font-bold text-primary">
                        69%
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">
                        199 trades total
                      </div>
                    </div>
                    <div className="bg-background/80 dark:bg-card/80 p-3 sm:p-4 rounded-lg border shadow-sm backdrop-blur-sm">
                      <div className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">
                        Avg. Profit
                      </div>
                      <div className="text-sm sm:text-lg lg:text-xl font-bold text-green-500">
                        $420
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">
                        Per winning trade
                      </div>
                    </div>
                    <div className="bg-background/80 dark:bg-card/80 p-3 sm:p-4 rounded-lg border shadow-sm backdrop-blur-sm">
                      <div className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">
                        Drawdown
                      </div>
                      <div className="text-sm sm:text-lg lg:text-xl font-bold text-red-500">
                        -$2,900
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">
                        -2.6% from equity
                      </div>
                    </div>
                  </div>

                  {/* Charts Section */}
                  <div className="grid grid-cols-1 gap-4 mt-4">
                    <div className="bg-background/80 dark:bg-card/80 p-3 sm:p-5 rounded-lg border shadow-sm backdrop-blur-sm">
                      <div className="text-xs sm:text-sm font-medium mb-3 sm:mb-4 text-foreground flex items-center justify-between">
                        <span>Strategy Performance</span>
                        <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                      </div>
                      <div className="h-[250px] w-full">
                        <ResponsiveContainer
                          width="100%"
                          height="100%"
                          debounce={1}
                        >
                          <BarChart
                            data={strategyData}
                            barGap={4}
                            margin={{ top: 5, right: 5, left: -15, bottom: 5 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              className="stroke-muted/20"
                              horizontal={true}
                              vertical={false}
                            />
                            <XAxis
                              dataKey="name"
                              stroke="currentColor"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                              interval={0}
                              tick={{ fontSize: 9 }}
                            />
                            <YAxis
                              stroke="currentColor"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                              tickFormatter={(value) => `${value}%`}
                              tick={{ fontSize: 9 }}
                            />
                            <Tooltip
                              content={(props) => (
                                <CustomTooltip {...props} type="strategy" />
                              )}
                            />
                            <Bar
                              dataKey="winRate"
                              fill="currentColor"
                              className="fill-primary/80"
                              radius={[4, 4, 0, 0]}
                              maxBarSize={40}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="bg-background/80 dark:bg-card/80 p-3 sm:p-5 rounded-lg border shadow-sm backdrop-blur-sm">
                      <div className="text-xs sm:text-sm font-medium mb-3 sm:mb-4 text-foreground flex items-center justify-between">
                        <span>Risk/Reward Ratio</span>
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                      </div>
                      <div className="h-[250px] w-full">
                        <ResponsiveContainer
                          width="100%"
                          height="100%"
                          debounce={1}
                        >
                          <AreaChart
                            data={riskRewardData}
                            margin={{ top: 5, right: 5, left: -15, bottom: 5 }}
                          >
                            <defs>
                              <linearGradient
                                id="colorRatio"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="currentColor"
                                  stopOpacity={0.2}
                                  className="text-primary"
                                />
                                <stop
                                  offset="95%"
                                  stopColor="currentColor"
                                  stopOpacity={0.05}
                                  className="text-primary"
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              className="stroke-muted/20"
                              horizontal={true}
                              vertical={false}
                            />
                            <XAxis
                              dataKey="name"
                              stroke="currentColor"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                              interval={0}
                              tick={{ fontSize: 9 }}
                            />
                            <YAxis
                              stroke="currentColor"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                              tickFormatter={(value) => `${value}:1`}
                              tick={{ fontSize: 9 }}
                            />
                            <Tooltip
                              content={(props) => (
                                <CustomTooltip {...props} type="ratio" />
                              )}
                            />
                            <Area
                              type="monotone"
                              dataKey="ratio"
                              stroke="currentColor"
                              strokeWidth={2}
                              className="stroke-primary"
                              fill="url(#colorRatio)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
