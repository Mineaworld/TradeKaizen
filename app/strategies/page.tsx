"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, Percent, Timer, TrendingUp, BarChart } from "lucide-react"

const strategies = [
  {
    name: "Breakout Trading",
    description: "Capitalize on price movements that break through established support or resistance levels.",
    winRate: 68,
    avgReturn: 2.4,
    timeframe: "1h-4h",
    type: "Momentum",
    metrics: [
      { label: "Win Rate", value: "68%", icon: Percent },
      { label: "Avg Return", value: "2.4%", icon: TrendingUp },
      { label: "Timeframe", value: "1h-4h", icon: Timer },
      { label: "Type", value: "Momentum", icon: BarChart },
    ]
  },
  {
    name: "Trend Following",
    description: "Follow established market trends using moving averages and momentum indicators.",
    winRate: 72,
    avgReturn: 1.8,
    timeframe: "4h-1d",
    type: "Trend",
    metrics: [
      { label: "Win Rate", value: "72%", icon: Percent },
      { label: "Avg Return", value: "1.8%", icon: TrendingUp },
      { label: "Timeframe", value: "4h-1d", icon: Timer },
      { label: "Type", value: "Trend", icon: BarChart },
    ]
  },
  {
    name: "Mean Reversion",
    description: "Trade price returns to the statistical mean after periods of extreme movement.",
    winRate: 65,
    avgReturn: 1.5,
    timeframe: "15m-1h",
    type: "Mean Reversion",
    metrics: [
      { label: "Win Rate", value: "65%", icon: Percent },
      { label: "Avg Return", value: "1.5%", icon: TrendingUp },
      { label: "Timeframe", value: "15m-1h", icon: Timer },
      { label: "Type", value: "Mean Reversion", icon: BarChart },
    ]
  },
  {
    name: "Range Trading",
    description: "Trade bounces between established support and resistance levels in sideways markets.",
    winRate: 70,
    avgReturn: 1.2,
    timeframe: "1h-4h",
    type: "Range",
    metrics: [
      { label: "Win Rate", value: "70%", icon: Percent },
      { label: "Avg Return", value: "1.2%", icon: TrendingUp },
      { label: "Timeframe", value: "1h-4h", icon: Timer },
      { label: "Type", value: "Range", icon: BarChart },
    ]
  },
  {
    name: "Momentum Trading",
    description: "Capture strong price movements with high volume and market sentiment.",
    winRate: 63,
    avgReturn: 2.8,
    timeframe: "5m-30m",
    type: "Momentum",
    metrics: [
      { label: "Win Rate", value: "63%", icon: Percent },
      { label: "Avg Return", value: "2.8%", icon: TrendingUp },
      { label: "Timeframe", value: "5m-30m", icon: Timer },
      { label: "Type", value: "Momentum", icon: BarChart },
    ]
  },
  {
    name: "Swing Trading",
    description: "Capture medium-term moves in the market over several days or weeks.",
    winRate: 75,
    avgReturn: 3.2,
    timeframe: "1d-1w",
    type: "Swing",
    metrics: [
      { label: "Win Rate", value: "75%", icon: Percent },
      { label: "Avg Return", value: "3.2%", icon: TrendingUp },
      { label: "Timeframe", value: "1d-1w", icon: Timer },
      { label: "Type", value: "Swing", icon: BarChart },
    ]
  }
]

export default function StrategiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Trading Strategies</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {strategies.map((strategy) => (
          <Card key={strategy.name} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">{strategy.name}</CardTitle>
                <Badge variant="secondary">{strategy.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{strategy.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                {strategy.metrics.map((metric) => {
                  const Icon = metric.icon
                  return (
                    <div key={metric.label} className="flex items-center space-x-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <div className="space-y-0.5">
                        <p className="text-xs text-muted-foreground">{metric.label}</p>
                        <p className="font-medium">{metric.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}