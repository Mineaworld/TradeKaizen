"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const performanceData = [
  { date: '2024-01', pnl: 2500 },
  { date: '2024-02', pnl: -1200 },
  { date: '2024-03', pnl: 4500 },
  { date: '2024-04', pnl: 3200 },
]

const strategyData = [
  { name: 'Breakout', trades: 45, winRate: 68 },
  { name: 'Trend Following', trades: 32, winRate: 72 },
  { name: 'Mean Reversion', trades: 28, winRate: 65 },
  { name: 'Scalping', trades: 56, winRate: 58 },
]

const assetAllocation = [
  { name: 'Stocks', value: 45 },
  { name: 'Forex', value: 30 },
  { name: 'Crypto', value: 15 },
  { name: 'Commodities', value: 10 },
]

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))']

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+$9,000</div>
            <p className="text-xs text-muted-foreground">Last 3 months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65.8%</div>
            <p className="text-xs text-muted-foreground">161 trades</p>
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
            <CardTitle className="text-sm font-medium">Avg. Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">-$280</div>
            <p className="text-xs text-muted-foreground">Per losing trade</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" allowDecimals={false} />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="pnl" 
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Strategy Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={strategyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" allowDecimals={false} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="winRate" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

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
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {assetAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {assetAllocation.map((item, index) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Sharpe Ratio</span>
                <span className="font-bold">1.8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Max Drawdown</span>
                <span className="font-bold text-red-600">-12.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Profit Factor</span>
                <span className="font-bold">2.1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Risk/Reward Ratio</span>
                <span className="font-bold">1:2.5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average Trade Duration</span>
                <span className="font-bold">2h 15m</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}