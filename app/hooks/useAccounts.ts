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
  symbol: string;
  entryPrice: number;
  exitPrice?: number;
  positionSize?: number;
  profitLoss?: number;
  status: "OPEN" | "CLOSED";
  entryDate: string;
  exitDate?: string;
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
        .from("accounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setAccounts(
        data.map((account) => ({
          ...account,
          availableBalance: account.available_balance ?? 0,
          initialBalance: account.initial_balance ?? account.balance ?? 0,
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

  // Fetch account trades
  const fetchAccountTrades = async (accountId: string, limit: number = 50) => {
    try {
      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .eq("account_id", accountId)
        .order("entry_date", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map((trade) => ({
        id: trade.id,
        symbol: trade.symbol,
        entryPrice: trade.entry_price,
        exitPrice: trade.exit_price,
        positionSize: trade.position_size,
        profitLoss: trade.profit_loss,
        status: trade.status,
        entryDate: trade.entry_date,
        exitDate: trade.exit_date,
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
    fetchAccountTrades,
    refetch: fetchAccounts,
  };
}
