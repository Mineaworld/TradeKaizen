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
  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Master Your <br />
              Trading Journey <br />
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                With Data-Driven Insights
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              TradeKaizen is your all-in-one trading journal platform, crafted
              to empower you in analyzing patterns, tracking performance, and
              refining your trading strategies. Transform every trade into a
              valuable learning experience.
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/register">Get Started for Free</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="#features">Explore Trading Analytics</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="relative lg:-mt-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-background via-background/50 to-background/10 rounded-xl border border-border/50 shadow-2xl overflow-hidden backdrop-blur-sm">
            {/* Dashboard Preview */}
            <div className="absolute inset-0 p-6">
              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="text-sm text-muted-foreground mb-2">
                    Total P&L
                  </div>
                  <div className="text-xl font-bold text-green-500">
                    +$12,307
                  </div>
                  <div className="text-xs text-muted-foreground">
                    +15.8% from last month
                  </div>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="text-sm text-muted-foreground mb-2">
                    Win Rate
                  </div>
                  <div className="text-xl font-bold">68.5%</div>
                  <div className="text-xs text-muted-foreground">
                    199 trades total
                  </div>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="text-sm text-muted-foreground mb-2">
                    Avg. Profit
                  </div>
                  <div className="text-xl font-bold text-green-500">$420</div>
                  <div className="text-xs text-muted-foreground">
                    Per winning trade
                  </div>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="text-sm text-muted-foreground mb-2">
                    Max Drawdown
                  </div>
                  <div className="text-xl font-bold text-red-500">-$2,900</div>
                  <div className="text-xs text-muted-foreground">
                    -2.6% from equity
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="text-sm font-medium mb-4">
                    Strategy Performance
                  </div>
                  <div className="h-[160px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={strategyData}
                        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                      >
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis hide />
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "0.5rem",
                          }}
                        />
                        <Bar
                          dataKey="winRate"
                          fill="hsl(var(--primary))"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="avgProfit"
                          fill="hsl(var(--primary)/0.3)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="text-sm font-medium mb-4">
                    Risk/Reward Analysis
                  </div>
                  <div className="h-[160px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={riskRewardData}
                        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                      >
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis hide />
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "0.5rem",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="trades"
                          stackId="1"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary)/0.1)"
                        />
                        <Area
                          type="monotone"
                          dataKey="ratio"
                          stackId="2"
                          stroke="hsl(var(--primary)/0.5)"
                          fill="hsl(var(--primary)/0.05)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-background/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-l from-background/40 via-background/20 to-transparent pointer-events-none" />
          </div>

          {/* Floating Elements */}
          <motion.div
            className="absolute -right-4 -top-4 bg-card p-3 rounded-lg border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <TrendingUp className="w-6 h-6 text-green-500" />
          </motion.div>
          <motion.div
            className="absolute -left-4 -bottom-4 bg-card p-3 rounded-lg border border-border shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <PieChart className="w-6 h-6 text-blue-500" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
