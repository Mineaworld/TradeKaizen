"use client";

import { useMemo } from "react";
import { JournalEntry } from "@/types/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TradeStatisticsProps {
  entries: JournalEntry[];
  timeframe?: "week" | "month" | "year" | "all";
}

export default function TradeStatistics({
  entries,
  timeframe = "all",
}: TradeStatisticsProps) {
  const stats = useMemo(() => {
    if (!entries.length) return null;

    const totalTrades = entries.length;
    const winningTrades = entries.filter(
      (e) => e.trade_outcome === "WIN"
    ).length;
    const losingTrades = entries.filter(
      (e) => e.trade_outcome === "LOSS"
    ).length;
    const breakEvenTrades = entries.filter(
      (e) => e.trade_outcome === "BREAKEVEN"
    ).length;

    const totalProfitLoss = entries.reduce((sum, e) => sum + e.profit_loss, 0);
    const winRate = (winningTrades / totalTrades) * 100;

    const avgRiskRewardRatio =
      entries.reduce((sum, e) => sum + (e.risk_reward_ratio || 0), 0) /
      entries.length;

    const avgTradeExecutionRating =
      entries.reduce((sum, e) => sum + (e.trade_execution_rating || 0), 0) /
      entries.length;

    // Calculate profit factor (gross profit / gross loss)
    const grossProfit = entries
      .filter((e) => e.profit_loss > 0)
      .reduce((sum, e) => sum + e.profit_loss, 0);
    const grossLoss = Math.abs(
      entries
        .filter((e) => e.profit_loss < 0)
        .reduce((sum, e) => sum + e.profit_loss, 0)
    );
    const profitFactor =
      grossLoss === 0 ? grossProfit : grossProfit / grossLoss;

    // Calculate average profit per trade
    const avgProfitPerTrade = totalProfitLoss / totalTrades;

    // Calculate largest win and loss
    const largestWin = Math.max(...entries.map((e) => e.profit_loss));
    const largestLoss = Math.min(...entries.map((e) => e.profit_loss));

    return {
      totalTrades,
      winningTrades,
      losingTrades,
      breakEvenTrades,
      totalProfitLoss,
      winRate,
      avgRiskRewardRatio,
      avgTradeExecutionRating,
      profitFactor,
      avgProfitPerTrade,
      largestWin,
      largestLoss,
    };
  }, [entries]);

  const profitLossData = useMemo(() => {
    return entries.map((entry) => ({
      date: new Date(entry.trade_date).toLocaleDateString(),
      pnl: entry.profit_loss,
    }));
  }, [entries]);

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTrades}</div>
            <p className="text-xs text-muted-foreground">
              W: {stats.winningTrades} L: {stats.losingTrades} BE:{" "}
              {stats.breakEvenTrades}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.winRate.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Profit Factor: {stats.profitFactor.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                stats.totalProfitLoss >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {stats.totalProfitLoss.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg: {stats.avgProfitPerTrade.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Risk/Reward
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.avgRiskRewardRatio.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Execution: {stats.avgTradeExecutionRating.toFixed(1)}/10
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profit/Loss History</CardTitle>
          <CardDescription>Trade P&L over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitLossData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="pnl"
                  fill="currentColor"
                  className="fill-primary"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Best Trade</CardTitle>
            <CardDescription>Largest winning trade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {stats.largestWin.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Worst Trade</CardTitle>
            <CardDescription>Largest losing trade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {stats.largestLoss.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
