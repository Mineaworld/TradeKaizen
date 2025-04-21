"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, LineChart, PieChart } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
} from "recharts";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

const strategyData = [
  { name: "Breakout", winRate: 68, avgProfit: 450 },
  { name: "Mean Rev", winRate: 72, avgProfit: 380 },
  { name: "ICT", winRate: 65, avgProfit: 520 },
];

const riskRewardData = [
  { name: "Trend", trades: 45, ratio: 2.1 },
  { name: "Reversal", trades: 32, ratio: 1.8 },
  { name: "Breakout", trades: 28, ratio: 2.4 },
  { name: "Scalping", trades: 55, ratio: 1.5 },
  { name: "ICT", trades: 39, ratio: 2.2 },
];

export default function Hero() {
  const isMobile = useMediaQuery("(max-width: 640px)");

  const MobileStrategyView = () => (
    <div className="space-y-3">
      {strategyData.map((item) => (
        <div
          key={item.name}
          className="bg-white dark:bg-card/50 p-3 rounded-lg border shadow-sm"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">
              {item.name}
            </span>
            <div className="space-x-4">
              <span className="text-sm font-semibold text-primary">
                {item.winRate}%
              </span>
              <span className="text-sm font-medium text-primary/80">
                ${item.avgProfit}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const MobileRiskRewardView = () => (
    <div className="space-y-3">
      {riskRewardData.map((item) => (
        <div
          key={item.name}
          className="bg-white dark:bg-card/50 p-3 rounded-lg border shadow-sm"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">
              {item.name}
            </span>
            <div className="space-x-4">
              <span className="text-sm font-semibold text-primary">
                {item.trades} trades
              </span>
              <span className="text-sm font-medium text-primary/80">
                {item.ratio}:1
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-white dark:to-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />

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
                  Master Your{" "}
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
              <div className="relative w-full aspect-[4/3] bg-white dark:bg-gradient-to-br dark:from-background dark:via-background/50 dark:to-background/10 rounded-xl border shadow-xl overflow-hidden backdrop-blur-sm">
                {/* Dashboard Preview Content */}
                <div className="absolute inset-0 p-4 sm:p-5 md:p-6 lg:p-8">
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                    <div className="bg-white dark:bg-card p-2 sm:p-3 md:p-4 rounded-lg border shadow-sm">
                      <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                        Total P&L
                      </div>
                      <div className="text-base sm:text-lg md:text-xl font-bold text-green-500">
                        +$12,307
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">
                        +15.8% from last month
                      </div>
                    </div>
                    <div className="bg-white dark:bg-card p-2 sm:p-3 md:p-4 rounded-lg border shadow-sm">
                      <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                        Win Rate
                      </div>
                      <div className="text-base sm:text-lg md:text-xl font-bold text-primary">
                        69%
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">
                        199 trades total
                      </div>
                    </div>
                    <div className="bg-white dark:bg-card p-2 sm:p-3 md:p-4 rounded-lg border shadow-sm">
                      <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                        Avg. Profit
                      </div>
                      <div className="text-base sm:text-lg md:text-xl font-bold text-green-500">
                        $420
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">
                        Per winning trade
                      </div>
                    </div>
                    <div className="bg-white dark:bg-card p-2 sm:p-3 md:p-4 rounded-lg border shadow-sm">
                      <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                        Max Drawdown
                      </div>
                      <div className="text-base sm:text-lg md:text-xl font-bold text-red-500">
                        -$2,900
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">
                        -2.6% from equity
                      </div>
                    </div>
                  </div>

                  {/* Charts Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                    <div className="bg-white dark:bg-card p-4 sm:p-5 rounded-lg border shadow-sm">
                      <div className="text-sm font-medium mb-4 text-foreground">
                        Strategy Performance
                      </div>
                      {isMobile ? (
                        <MobileStrategyView />
                      ) : (
                        <div className="h-[140px] sm:h-[160px] lg:h-[180px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={strategyData}
                              margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                            >
                              <XAxis
                                dataKey="name"
                                tick={{
                                  fontSize: 11,
                                  fill: "hsl(var(--muted-foreground))",
                                }}
                                axisLine={{ stroke: "hsl(var(--border))" }}
                              />
                              <YAxis
                                hide={false}
                                tick={{
                                  fontSize: 11,
                                  fill: "hsl(var(--muted-foreground))",
                                }}
                                axisLine={{ stroke: "hsl(var(--border))" }}
                              />
                              <Tooltip
                                contentStyle={{
                                  background: "hsl(var(--card))",
                                  border: "1px solid hsl(var(--border))",
                                  borderRadius: "0.5rem",
                                  fontSize: "12px",
                                  padding: "8px 12px",
                                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                }}
                                cursor={{ fill: "hsl(var(--muted)/0.1)" }}
                              />
                              <Bar
                                dataKey="winRate"
                                fill="hsl(var(--primary))"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={40}
                              />
                              <Bar
                                dataKey="avgProfit"
                                fill="hsl(var(--primary)/0.3)"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={40}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                    <div className="bg-white dark:bg-card p-4 sm:p-5 rounded-lg border shadow-sm">
                      <div className="text-sm font-medium mb-4 text-foreground">
                        Risk/Reward Analysis
                      </div>
                      {isMobile ? (
                        <MobileRiskRewardView />
                      ) : (
                        <div className="h-[140px] sm:h-[160px] lg:h-[180px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={riskRewardData}
                              margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                            >
                              <XAxis
                                dataKey="name"
                                tick={{
                                  fontSize: 11,
                                  fill: "hsl(var(--muted-foreground))",
                                }}
                                axisLine={{ stroke: "hsl(var(--border))" }}
                              />
                              <YAxis
                                hide={false}
                                tick={{
                                  fontSize: 11,
                                  fill: "hsl(var(--muted-foreground))",
                                }}
                                axisLine={{ stroke: "hsl(var(--border))" }}
                              />
                              <Tooltip
                                contentStyle={{
                                  background: "hsl(var(--card))",
                                  border: "1px solid hsl(var(--border))",
                                  borderRadius: "0.5rem",
                                  fontSize: "12px",
                                  padding: "8px 12px",
                                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                }}
                              />
                              <Area
                                type="monotone"
                                dataKey="trades"
                                stackId="1"
                                stroke="hsl(var(--primary))"
                                fill="hsl(var(--primary)/0.2)"
                                strokeWidth={2}
                              />
                              <Area
                                type="monotone"
                                dataKey="ratio"
                                stackId="2"
                                stroke="hsl(var(--primary)/0.7)"
                                fill="hsl(var(--primary)/0.1)"
                                strokeWidth={2}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enhanced Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-white/30 to-transparent dark:from-background/50 dark:via-background/30 dark:to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-l from-white/50 via-white/30 to-transparent dark:from-background/50 dark:via-background/30 dark:to-transparent pointer-events-none" />
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -right-3 sm:-right-6 -top-3 sm:-top-6 bg-white dark:bg-card/95 p-2.5 sm:p-3.5 rounded-lg border shadow-lg backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <TrendingUp className="w-5 h-5 sm:w-7 sm:h-7 text-green-500" />
              </motion.div>
              <motion.div
                className="absolute -left-3 sm:-left-6 -bottom-3 sm:-bottom-6 bg-white dark:bg-card/95 p-2.5 sm:p-3.5 rounded-lg border shadow-lg backdrop-blur-sm"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <PieChart className="w-5 h-5 sm:w-7 sm:h-7 text-primary" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
