import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

// Types
export interface TradingAccount {
  id: string;
  name: string;
  type: "funded" | "real";
  provider?: string;
  phase?: number;
  balance: number;
  availableBalance: number;
  initialBalance: number;
  profitTarget?: number;
  maxDrawdown?: number;
  isActive: boolean;
  createdAt: string;
  lastUpdated: string;
}

export interface AccountPerformance {
  balance: number;
  equity: number;
  dailyPnl: number;
  openPositions: number;
  timestamp: string;
}

export interface Trade {
  id: string;
  pair: string;
  type: "BUY" | "SELL";
  entryPrice: number;
  exitPrice?: number;
  volume: number;
  pnl?: number;
  status: "OPEN" | "CLOSED";
  openedAt: string;
  closedAt?: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useAccounts() {
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch accounts
  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from("trading_accounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setAccounts(
        data.map((account) => ({
          ...account,
          availableBalance: account.available_balance,
          initialBalance: account.initial_balance,
          profitTarget: account.profit_target,
          maxDrawdown: account.max_drawdown,
          isActive: account.is_active,
          createdAt: account.created_at,
          lastUpdated: account.last_updated,
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch accounts");
      toast({
        title: "Error",
        description: "Failed to fetch trading accounts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch account performance
  const fetchAccountPerformance = async (
    accountId: string,
    days: number = 30
  ) => {
    try {
      const { data, error } = await supabase
        .from("account_performance_history")
        .select("*")
        .eq("account_id", accountId)
        .gte(
          "timestamp",
          new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
        )
        .order("timestamp", { ascending: true });

      if (error) throw error;

      return data.map((perf) => ({
        balance: perf.balance,
        equity: perf.equity,
        dailyPnl: perf.daily_pnl,
        openPositions: perf.open_positions,
        timestamp: perf.timestamp,
      }));
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch account performance",
        variant: "destructive",
      });
      return [];
    }
  };

  // Fetch account trades
  const fetchAccountTrades = async (accountId: string, limit: number = 50) => {
    try {
      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .eq("account_id", accountId)
        .order("opened_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map((trade) => ({
        id: trade.id,
        pair: trade.pair,
        type: trade.type,
        entryPrice: trade.entry_price,
        exitPrice: trade.exit_price,
        volume: trade.volume,
        pnl: trade.pnl,
        status: trade.status,
        openedAt: trade.opened_at,
        closedAt: trade.closed_at,
      }));
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch trades",
        variant: "destructive",
      });
      return [];
    }
  };

  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = supabase
      .channel("trading_accounts_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trading_accounts",
        },
        () => {
          fetchAccounts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    accounts,
    loading,
    error,
    fetchAccountPerformance,
    fetchAccountTrades,
    refetch: fetchAccounts,
  };
}
