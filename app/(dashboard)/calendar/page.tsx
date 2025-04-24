"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  TrendingUp,
  TrendingDown,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Enhanced mock data with more realistic trading scenarios
const mockTradeData: Record<
  string,
  {
    profit: number;
    totalTrades: number;
    winRate: number;
    trades: Array<{
      pair: string;
      profit: number;
      direction: "long" | "short";
    }>;
  }
> = {
  "2025-04-01": {
    profit: 1250,
    totalTrades: 3,
    winRate: 75,
    trades: [
      { pair: "BTC/USD", profit: 800, direction: "long" },
      { pair: "ETH/USD", profit: 300, direction: "long" },
      { pair: "SOL/USD", profit: 150, direction: "long" },
    ],
  },
  "2025-04-02": {
    profit: -150,
    totalTrades: 4,
    winRate: 50,
    trades: [
      { pair: "BTC/USD", profit: 300, direction: "long" },
      { pair: "ETH/USD", profit: -200, direction: "short" },
      { pair: "SOL/USD", profit: -250, direction: "short" },
      { pair: "BNB/USD", profit: 0, direction: "long" },
    ],
  },
  "2025-04-03": {
    profit: 0,
    totalTrades: 2,
    winRate: 50,
    trades: [
      { pair: "BTC/USD", profit: 200, direction: "long" },
      { pair: "ETH/USD", profit: -200, direction: "short" },
    ],
  },
  "2025-04-04": {
    profit: -850,
    totalTrades: 5,
    winRate: 20,
    trades: [
      { pair: "BTC/USD", profit: -500, direction: "short" },
      { pair: "ETH/USD", profit: -200, direction: "short" },
      { pair: "SOL/USD", profit: -150, direction: "short" },
      { pair: "BNB/USD", profit: 100, direction: "long" },
      { pair: "XRP/USD", profit: -100, direction: "short" },
    ],
  },
  "2025-04-05": {
    profit: 480,
    totalTrades: 4,
    winRate: 75,
    trades: [
      { pair: "BTC/USD", profit: 200, direction: "long" },
      { pair: "ETH/USD", profit: 180, direction: "long" },
      { pair: "SOL/USD", profit: 100, direction: "long" },
      { pair: "BNB/USD", profit: 0, direction: "short" },
    ],
  },
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [isMobileView, setIsMobileView] = useState(false);

  // Add useEffect for mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const daysInMonth = currentDate.daysInMonth();
  const firstDayOfMonth = currentDate.startOf("month").day();
  const lastDayOfMonth = currentDate.endOf("month").day();

  const previousMonth = () => {
    setCurrentDate(currentDate.subtract(1, "month"));
  };

  const nextMonth = () => {
    setCurrentDate(currentDate.add(1, "month"));
  };

  const getDayData = (day: number) => {
    const dateStr = currentDate.date(day).format("YYYY-MM-DD");
    return mockTradeData[dateStr as keyof typeof mockTradeData] || null;
  };

  const monthlyTotal = Object.values(mockTradeData).reduce(
    (sum, day) => sum + day.profit,
    0
  );

  const monthlyTrades = Object.values(mockTradeData).reduce(
    (sum, day) => sum + day.totalTrades,
    0
  );

  const monthlyWinRate =
    Object.values(mockTradeData).reduce((sum, day) => sum + day.winRate, 0) /
    Object.keys(mockTradeData).length;

  const renderMobileCalendar = () => {
    return (
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-4 bg-card rounded-lg p-3">
          <Button variant="ghost" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {currentDate.format("MMMM YYYY")}
          </h2>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-xs font-medium text-muted-foreground p-1"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-start-${i}`} className="aspect-square" />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dayData = getDayData(day);
            return (
              <Dialog key={day}>
                <DialogTrigger asChild>
                  <button
                    className={`
                      relative aspect-square w-full p-1 rounded-lg
                      flex flex-col items-center justify-center
                      transition-all hover:bg-accent
                      ${dayData ? "font-medium" : "text-muted-foreground"}
                      ${
                        dayData?.profit > 0
                          ? "bg-green-100/50 dark:bg-green-900/20"
                          : ""
                      }
                      ${
                        dayData?.profit < 0
                          ? "bg-red-100/50 dark:bg-red-900/20"
                          : ""
                      }
                    `}
                  >
                    <span className="text-sm">{day}</span>
                    {dayData && (
                      <>
                        <span
                          className={`text-[10px] font-medium mt-0.5
                            ${
                              dayData.profit > 0
                                ? "text-green-600 dark:text-green-400"
                                : ""
                            }
                            ${
                              dayData.profit < 0
                                ? "text-red-600 dark:text-red-400"
                                : ""
                            }
                          `}
                        >
                          {dayData.profit > 0 ? "+" : ""}
                          {dayData.profit.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </span>
                        <div className="absolute top-0.5 right-0.5">
                          <div
                            className={`w-1.5 h-1.5 rounded-full
                              ${
                                dayData.winRate >= 50
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }
                            `}
                          />
                        </div>
                      </>
                    )}
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      Trades for {currentDate.date(day).format("MMMM D, YYYY")}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    {dayData ? (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">
                                Daily Summary
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">
                                    Total P/L
                                  </span>
                                  <span
                                    className={`font-semibold ${
                                      dayData.profit > 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {dayData.profit > 0 ? "+" : ""}
                                    {dayData.profit.toLocaleString("en-US", {
                                      style: "currency",
                                      currency: "USD",
                                    })}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">
                                    Win Rate
                                  </span>
                                  <span className="font-semibold">
                                    {dayData.winRate.toFixed(1)}%
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">
                                    Total Trades
                                  </span>
                                  <span className="font-semibold">
                                    {dayData.totalTrades}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">
                                Performance
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">
                                    Avg. Trade P/L
                                  </span>
                                  <span className="font-semibold">
                                    {(
                                      dayData.profit / dayData.totalTrades
                                    ).toLocaleString("en-US", {
                                      style: "currency",
                                      currency: "USD",
                                    })}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">
                                    Best Trade
                                  </span>
                                  <span className="font-semibold text-green-600">
                                    +
                                    {Math.max(
                                      ...dayData.trades.map((t) => t.profit)
                                    ).toLocaleString("en-US", {
                                      style: "currency",
                                      currency: "USD",
                                    })}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">
                                    Worst Trade
                                  </span>
                                  <span className="font-semibold text-red-600">
                                    {Math.min(
                                      ...dayData.trades.map((t) => t.profit)
                                    ).toLocaleString("en-US", {
                                      style: "currency",
                                      currency: "USD",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        <div className="space-y-4">
                          <h3 className="font-medium">Trade Details</h3>
                          <div className="space-y-2">
                            {dayData.trades.map((trade, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 border rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`p-2 rounded-full ${
                                      trade.direction === "long"
                                        ? "bg-green-100 dark:bg-green-900/30"
                                        : "bg-red-100 dark:bg-red-900/30"
                                    }`}
                                  >
                                    {trade.direction === "long" ? (
                                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      {trade.pair}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {trade.direction.toUpperCase()}
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={`font-semibold ${
                                    trade.profit > 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {trade.profit > 0 ? "+" : ""}
                                  {trade.profit.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Trade
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8 space-y-4">
                        <div className="text-muted-foreground">
                          No trades recorded for this day
                        </div>
                        <Button className="gap-2">
                          <Plus className="h-4 w-4" />
                          Add Trade
                        </Button>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            );
          })}
          {Array.from({ length: 6 - lastDayOfMonth }, (_, i) => (
            <div key={`empty-end-${i}`} className="aspect-square" />
          ))}
        </div>

        {/* Mobile Monthly Summary */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          <Card className="p-3">
            <CardHeader className="p-0">
              <CardTitle className="text-xs text-muted-foreground">
                Monthly P&L
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-1">
              <div
                className={`text-sm font-bold ${
                  monthlyTotal > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {monthlyTotal > 0 ? "+" : ""}
                {monthlyTotal.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                })}
              </div>
            </CardContent>
          </Card>
          <Card className="p-3">
            <CardHeader className="p-0">
              <CardTitle className="text-xs text-muted-foreground">
                Total Trades
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-1">
              <div className="text-sm font-bold">{monthlyTrades}</div>
            </CardContent>
          </Card>
          <Card className="p-3">
            <CardHeader className="p-0">
              <CardTitle className="text-xs text-muted-foreground">
                Win Rate
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-1">
              <div className="text-sm font-bold">
                {monthlyWinRate.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderDesktopCalendar = () => {
    return (
      <div className="hidden md:block">
        {/* Existing desktop calendar code */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Trading Calendar</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-lg font-medium min-w-[140px] text-center">
                {currentDate.format("MMMM YYYY")}
              </div>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4 mb-4">
          {[
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ].map((day) => (
            <div key={day} className="font-medium text-center">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4">
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div
              key={`empty-start-${index}`}
              className="min-h-[120px] p-2 border rounded-lg bg-muted/20"
            />
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => (
            <div key={`day-${index + 1}`}>{renderDayCell(index + 1)}</div>
          ))}

          {Array.from({ length: 6 - lastDayOfMonth }).map((_, index) => (
            <div
              key={`empty-end-${index}`}
              className="min-h-[120px] p-2 border rounded-lg bg-muted/20"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Monthly Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Total Profit/Loss
                    </div>
                    <div
                      className={`text-2xl font-bold ${
                        monthlyTotal >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {monthlyTotal >= 0 ? "+" : ""}
                      {monthlyTotal.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-primary/10">
                    {monthlyTotal >= 0 ? (
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Trading Days
                    </div>
                    <div className="text-xl font-bold">
                      {Object.keys(mockTradeData).length}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Total Trades
                    </div>
                    <div className="text-xl font-bold">{monthlyTrades}</div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm text-muted-foreground">
                      Win Rate
                    </div>
                    <div className="text-sm font-medium">
                      {monthlyWinRate.toFixed(1)}%
                    </div>
                  </div>
                  <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`absolute h-full ${
                        monthlyWinRate >= 50 ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{ width: `${monthlyWinRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <BarChart2 className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-medium">Best Trading Day</div>
                    <div className="text-sm text-muted-foreground">
                      {
                        Object.entries(mockTradeData).reduce((a, b) =>
                          a[1].profit > b[1].profit ? a : b
                        )[0]
                      }
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <BarChart2 className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-medium">Most Active Day</div>
                    <div className="text-sm text-muted-foreground">
                      {
                        Object.entries(mockTradeData).reduce((a, b) =>
                          a[1].totalTrades > b[1].totalTrades ? a : b
                        )[0]
                      }
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <BarChart2 className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-medium">Average Daily Trades</div>
                    <div className="text-sm text-muted-foreground">
                      {(
                        monthlyTrades / Object.keys(mockTradeData).length
                      ).toFixed(1)}{" "}
                      trades
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderDayCell = (day: number) => {
    const dayData = getDayData(day);
    const dateStr = currentDate.date(day).format("YYYY-MM-DD");

    return (
      <Dialog>
        <DialogTrigger asChild>
          <div
            className={`
              min-h-[120px] p-2 border rounded-lg cursor-pointer
              transition-all hover:shadow-md hover:scale-[1.02]
              ${
                dayData?.profit !== undefined && dayData.profit > 0
                  ? "bg-green-50 dark:bg-green-950/30"
                  : ""
              }
              ${
                dayData?.profit !== undefined && dayData.profit < 0
                  ? "bg-red-50 dark:bg-red-950/30"
                  : ""
              }
            `}
          >
            <div className="flex justify-between items-start">
              <div className="font-medium">{day}</div>
              {dayData && (
                <Badge
                  variant={dayData.profit > 0 ? "success" : "destructive"}
                  className="text-xs"
                >
                  {dayData.totalTrades} trades
                </Badge>
              )}
            </div>
            {dayData && (
              <div className="mt-2 space-y-1">
                <div
                  className={`
                    font-semibold text-sm
                    ${
                      dayData.profit > 0
                        ? "text-green-600 dark:text-green-400"
                        : ""
                    }
                    ${
                      dayData.profit < 0 ? "text-red-600 dark:text-red-400" : ""
                    }
                  `}
                >
                  {dayData.profit > 0 ? "+" : ""}
                  {dayData.profit.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <div className="relative w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`absolute h-full ${
                        dayData.winRate >= 50 ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{ width: `${dayData.winRate}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {dayData.winRate.toFixed(0)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Trades for {currentDate.date(day).format("MMMM D, YYYY")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {dayData ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Daily Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Total P/L
                          </span>
                          <span
                            className={`font-semibold ${
                              dayData.profit > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {dayData.profit > 0 ? "+" : ""}
                            {dayData.profit.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Win Rate
                          </span>
                          <span className="font-semibold">
                            {dayData.winRate.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Total Trades
                          </span>
                          <span className="font-semibold">
                            {dayData.totalTrades}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Avg. Trade P/L
                          </span>
                          <span className="font-semibold">
                            {(
                              dayData.profit / dayData.totalTrades
                            ).toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Best Trade
                          </span>
                          <span className="font-semibold text-green-600">
                            +
                            {Math.max(
                              ...dayData.trades.map((t) => t.profit)
                            ).toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Worst Trade
                          </span>
                          <span className="font-semibold text-red-600">
                            {Math.min(
                              ...dayData.trades.map((t) => t.profit)
                            ).toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">Trade Details</h3>
                  <div className="space-y-2">
                    {dayData.trades.map((trade, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              trade.direction === "long"
                                ? "bg-green-100 dark:bg-green-900/30"
                                : "bg-red-100 dark:bg-red-900/30"
                            }`}
                          >
                            {trade.direction === "long" ? (
                              <ArrowUpRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{trade.pair}</div>
                            <div className="text-sm text-muted-foreground">
                              {trade.direction.toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`font-semibold ${
                            trade.profit > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {trade.profit > 0 ? "+" : ""}
                          {trade.profit.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Trade
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="text-muted-foreground">
                  No trades recorded for this day
                </div>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Trade
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="p-4">
      {renderMobileCalendar()}
      {renderDesktopCalendar()}
    </div>
  );
}
