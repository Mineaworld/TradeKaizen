"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUpIcon, ArrowDownIcon, ActivityIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAccounts } from "@/app/hooks/useAccounts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Account types and interfaces
interface TradingAccount {
  id: string;
  name: string;
  type: "funded" | "real";
  balance: number;
  availableBalance: number;
  provider?: string;
  phase?: number;
  lastUpdated: string;
}

// Update AccountSwitcher to accept accounts as a prop
function AccountSwitcher({
  accounts,
  selectedAccount,
  onAccountChange,
}: {
  accounts: TradingAccount[];
  selectedAccount: string;
  onAccountChange: (accountId: string) => void;
}) {
  const { theme } = useTheme();
  const colorMode = theme === "dark" ? colors.dark : colors.light;

  return (
    <div className="flex items-center gap-4">
      <Select value={selectedAccount} onValueChange={onAccountChange}>
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Select account" />
        </SelectTrigger>
        <SelectContent>
          <div className="mb-2 px-2 text-sm font-semibold text-muted-foreground">
            Funded Accounts
          </div>
          {accounts
            .filter((acc) => acc.type === "funded")
            .map((account) => (
              <SelectItem key={account.id} value={account.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{account.name}</span>
                  <Badge variant="outline" style={{ color: colorMode.success }}>
                    ${account.balance.toLocaleString()}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          <div className="my-2 px-2 text-sm font-semibold text-muted-foreground">
            Real Accounts
          </div>
          {accounts
            .filter((acc) => acc.type === "real")
            .map((account) => (
              <SelectItem key={account.id} value={account.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{account.name}</span>
                  <Badge variant="outline" style={{ color: colorMode.primary }}>
                    ${account.balance.toLocaleString()}
                  </Badge>
                </div>
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Sample data - Replace with real data from your API
const performanceData = [
  { x: "2024-02-16", y: 102500 },
  { x: "2024-02-17", y: 101300 },
  { x: "2024-02-18", y: 105800 },
  { x: "2024-02-19", y: 109000 },
  { x: "2024-02-20", y: 106900 },
];

const tradingActivityData = [
  { x: "2024-02-16", y: 8 },
  { x: "2024-02-17", y: 5 },
  { x: "2024-02-18", y: 12 },
  { x: "2024-02-19", y: 6 },
  { x: "2024-02-20", y: 4 },
];

const recentTrades = [
  {
    id: 1,
    pair: "EUR/USD",
    type: "BUY",
    entry: 1.0876,
    exit: 1.0923,
    pnl: 470,
    date: "2024-02-20",
  },
  {
    id: 2,
    pair: "GBP/JPY",
    type: "SELL",
    entry: 185.43,
    exit: 184.89,
    pnl: 540,
    date: "2024-02-20",
  },
  {
    id: 3,
    pair: "BTC/USD",
    type: "BUY",
    entry: 51240,
    exit: 51180,
    pnl: -60,
    date: "2024-02-20",
  },
  {
    id: 4,
    pair: "XAU/USD",
    type: "SELL",
    entry: 2024.5,
    exit: 2021.75,
    pnl: 275,
    date: "2024-02-20",
  },
];

const marketOverview = [
  { pair: "EUR/USD", price: "1.0892", change: 0.15 },
  { pair: "GBP/USD", price: "1.2634", change: -0.08 },
  { pair: "USD/JPY", price: "150.25", change: 0.32 },
  { pair: "BTC/USD", price: "51480", change: 1.25 },
  { pair: "ETH/USD", price: "3120", change: 2.15 },
  { pair: "XAU/USD", price: "2025.40", change: -0.45 },
];

interface ChartProps {
  data: { x: string; y: number }[];
  type: "area" | "bar";
  height?: number;
  title?: string;
}

// Color palette constants
const colors = {
  light: {
    primary: "#0EA5E9", // Sky blue
    success: "#10B981", // Emerald
    warning: "#F59E0B", // Amber
    error: "#EF4444", // Red
    info: "#6366F1", // Indigo
    chart: {
      area: {
        stroke: "#0EA5E9",
        fill: ["rgba(14, 165, 233, 0.5)", "rgba(14, 165, 233, 0.0)"],
      },
      bar: {
        primary: "#0EA5E9",
        positive: "#10B981",
        negative: "#EF4444",
      },
    },
  },
  dark: {
    primary: "#38BDF8", // Lighter sky blue
    success: "#34D399", // Lighter emerald
    warning: "#FBBF24", // Lighter amber
    error: "#F87171", // Lighter red
    info: "#818CF8", // Lighter indigo
    chart: {
      area: {
        stroke: "#38BDF8",
        fill: ["rgba(56, 189, 248, 0.5)", "rgba(56, 189, 248, 0.0)"],
      },
      bar: {
        primary: "#38BDF8",
        positive: "#34D399",
        negative: "#F87171",
      },
    },
  },
};

function ChartComponent({ data, type, height = 300, title = "" }: ChartProps) {
  const { theme } = useTheme();
  const colorMode = theme === "dark" ? colors.dark : colors.light;

  const options: ApexOptions = {
    chart: {
      type,
      toolbar: {
        show: false,
      },
      background: "transparent",
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    theme: {
      mode: theme === "dark" ? "dark" : "light",
    },
    stroke: {
      curve: "smooth",
      width: type === "area" ? 3 : 0,
    },
    colors:
      type === "area"
        ? [colorMode.chart.area.stroke]
        : [colorMode.chart.bar.primary],
    fill: {
      type: type === "area" ? "gradient" : "solid",
      gradient:
        type === "area"
          ? {
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.2,
              stops: [0, 90, 100],
              colorStops: [
                {
                  offset: 0,
                  color: colorMode.chart.area.fill[0],
                  opacity: 1,
                },
                {
                  offset: 100,
                  color: colorMode.chart.area.fill[1],
                  opacity: 1,
                },
              ],
            }
          : undefined,
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor:
        theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      strokeDashArray: 3,
      padding: {
        top: -20,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.7)"
              : "rgba(0, 0, 0, 0.6)",
          fontSize: "12px",
        },
        format: "dd MMM",
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.7)"
              : "rgba(0, 0, 0, 0.6)",
          fontSize: "12px",
        },
        formatter: (value) => {
          return type === "area"
            ? `$${value.toLocaleString()}`
            : value.toString();
        },
      },
    },
    tooltip: {
      theme: theme === "dark" ? "dark" : "light",
      x: {
        format: "dd MMM yyyy",
      },
      y: {
        formatter: (value) => {
          return type === "area"
            ? `$${value.toLocaleString()}`
            : `${value} trades`;
        },
      },
      style: {
        fontSize: "12px",
      },
    },
    states: {
      hover: {
        filter: {
          type: "lighten",
        },
      },
      active: {
        filter: {
          type: "darken",
        },
      },
    },
  };

  return (
    <Chart
      options={options}
      series={[{ name: title, data }]}
      type={type}
      height={height}
    />
  );
}

export default function DashboardPage() {
  const { theme } = useTheme();
  const colorMode = theme === "dark" ? colors.dark : colors.light;
  const {
    accounts,
    loading,
    error,
    fetchAccountTrades,
  } = useAccounts();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [recentTrades, setRecentTrades] = useState<any[]>([]);

  // Set default selected account when accounts load
  useEffect(() => {
    if (accounts.length && !selectedAccountId) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  // Fetch trades when selected account changes
  useEffect(() => {
    if (!selectedAccountId) return;
    fetchAccountTrades(selectedAccountId, 10).then((trades) => {
      setRecentTrades(
        trades.map((t: any) => ({
          id: t.id,
          symbol: t.symbol,
          entryPrice: t.entryPrice,
          exitPrice: t.exitPrice,
          profitLoss: t.profitLoss,
          status: t.status,
          entryDate: t.entryDate,
          exitDate: t.exitDate,
        }))
      );
    });
  }, [selectedAccountId, fetchAccountTrades]);

  if (loading) return <div className="p-6">Loading accounts...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!accounts.length) return <div className="p-6">No accounts found.</div>;

  const selectedAccount =
    accounts.find((acc) => acc.id === selectedAccountId) || accounts[0];

  // Placeholder for charts (since no performance history)
  const chartPlaceholder = [
    { x: selectedAccount.lastUpdated, y: Number(selectedAccount.balance) },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header with Account Switcher */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Trading Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Trader</p>
          </div>
          <AccountSwitcher
            accounts={accounts}
            selectedAccount={selectedAccountId!}
            onAccountChange={setSelectedAccountId}
          />
        </div>
        {selectedAccount.type === "funded" && (
          <Card className="bg-muted/50">
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-sm">
                  {selectedAccount.provider}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Phase {selectedAccount.phase}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Last Updated: {selectedAccount.lastUpdated}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Account Balance
            </CardTitle>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className="text-2xl font-bold"
              style={{ color: colorMode.primary }}
            >
              ${Number(selectedAccount.balance).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Available: ${Number(selectedAccount.availableBalance).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Charts Section (placeholder) */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartComponent
                data={chartPlaceholder}
                type="area"
                title="Account Balance"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Trading Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No activity data available
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Market Overview & Recent Trades */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pair</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>24h Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marketOverview.map((market) => (
                    <TableRow key={market.pair}>
                      <TableCell className="font-medium">
                        {market.pair}
                      </TableCell>
                      <TableCell>{market.price}</TableCell>
                      <TableCell>
                        <span
                          className={`flex items-center ${
                            market.change >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {market.change >= 0 ? (
                            <ArrowUpIcon className="mr-1 h-4 w-4" />
                          ) : (
                            <ArrowDownIcon className="mr-1 h-4 w-4" />
                          )}
                          {Math.abs(market.change)}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Entry Price</TableHead>
                    <TableHead>Exit Price</TableHead>
                    <TableHead>P&L</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTrades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell className="font-medium">
                        {trade.symbol}
                      </TableCell>
                      <TableCell>{trade.entryPrice}</TableCell>
                      <TableCell>{trade.exitPrice ?? '-'}</TableCell>
                      <TableCell
                        className={
                          trade.profitLoss >= 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        ${trade.profitLoss ?? '-'}
                      </TableCell>
                      <TableCell>{trade.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
