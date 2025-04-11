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
          className="bg-card/50 p-3 rounded-lg border border-border/50"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{item.name}</span>
            <div className="space-x-4">
              <span className="text-sm text-primary">{item.winRate}%</span>
              <span className="text-sm text-primary/70">${item.avgProfit}</span>
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
          className="bg-card/50 p-3 rounded-lg border border-border/50"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{item.name}</span>
            <div className="space-x-4">
              <span className="text-sm text-primary">{item.trades} trades</span>
              <span className="text-sm text-primary/70">{item.ratio}:1</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="container mx-auto px-4 py-8 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="space-y-4 md:space-y-6 text-center lg:text-left">
          <motion.div
            className="space-y-3 md:space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Master Your{" "}
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Trading Journey
              </span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              TradeKaizen is your all-in-one trading journal platform, crafted
              to empower you in analyzing patterns, tracking performance, and
              refining your trading strategies.
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button asChild size="lg" className="w-full sm:w-auto text-base">
              <Link href="/register">Get Started for Free</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base"
            >
              <Link href="#features">Explore Analytics</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="relative order-first lg:order-last mt-8 lg:mt-0"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-background via-background/50 to-background/10 rounded-xl border border-border/50 shadow-2xl overflow-hidden backdrop-blur-sm">
            {/* Dashboard Preview */}
            <div className="absolute inset-0 p-4 sm:p-5 md:p-6 lg:p-8">
              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                <div className="bg-card p-2 sm:p-3 md:p-4 rounded-lg border border-border">
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
                <div className="bg-card p-2 sm:p-3 md:p-4 rounded-lg border border-border">
                  <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                    Win Rate
                  </div>
                  <div className="text-base sm:text-lg md:text-xl font-bold">
                    68.5%
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">
                    199 trades total
                  </div>
                </div>
                <div className="bg-card p-2 sm:p-3 md:p-4 rounded-lg border border-border">
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
                <div className="bg-card p-2 sm:p-3 md:p-4 rounded-lg border border-border">
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
                <div className="bg-card p-4 sm:p-5 rounded-lg border border-border">
                  <div className="text-sm font-medium mb-4">
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
                <div className="bg-card p-4 sm:p-5 rounded-lg border border-border">
                  <div className="text-sm font-medium mb-4">
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

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-background/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-l from-background/40 via-background/20 to-transparent pointer-events-none" />
          </div>

          {/* Floating Elements */}
          <motion.div
            className="absolute -right-2 sm:-right-4 -top-2 sm:-top-4 bg-card p-2 sm:p-3 rounded-lg border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-green-500" />
          </motion.div>
          <motion.div
            className="absolute -left-2 sm:-left-4 -bottom-2 sm:-bottom-4 bg-card p-2 sm:p-3 rounded-lg border border-border shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <PieChart className="w-4 h-4 sm:w-6 sm:h-6 text-blue-500" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
