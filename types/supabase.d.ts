import { Database } from "./supabase";

export type JournalEntry =
  Database["public"]["Tables"]["journal_entries"]["Row"];
export type NewJournalEntry =
  Database["public"]["Tables"]["journal_entries"]["Insert"];
export type Strategy = Database["public"]["Tables"]["strategies"]["Row"];

export interface CustomTradingPair {
  id: number;
  created_at: string;
  user_id: string;
  pair: string;
}

export interface JournalEntry {
  id: number;
  created_at: string;
  updated_at: string;
  trade_date: string;
  trade_pair: string;
  trade_direction: "LONG" | "SHORT";
  entry_price: number;
  exit_price: number;
  position_size: number;
  profit_loss: number;
  trade_outcome: "WIN" | "LOSS" | "BREAKEVEN";
  trade_duration: string;
  trade_setup: string | null;
  trade_notes: string | null;
  emotions: string[] | null;
  trade_mistakes: string[] | null;
  trade_lessons: string[] | null;
  strategy_id: number | null;
  tags: string[] | null;
  trade_screenshot: string | null;
  user_id: string;
  mood_before: string | null;
  mood_after: string | null;
  self_rating: number | null;
  risk_reward_ratio: number | null;
  stop_loss: number | null;
  take_profit: number | null;
  risk_per_trade: number | null;
  commission_fees: number | null;
  slippage: number | null;
  trade_quality_score: number | null;
  market_conditions: string | null;
  trade_timeframe: string | null;
  trade_execution_rating: number | null;
  trade_management_notes: string | null;
  trade_exit_reason: string | null;
}

export type NewJournalEntry = Omit<
  JournalEntry,
  "id" | "created_at" | "updated_at"
>;

export interface Strategy {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  name: string;
  description: string | null;
  rules: string | null;
  timeframes: string[] | null;
  markets: string[] | null;
  indicators: string[] | null;
  win_rate: number | null;
  risk_reward: number | null;
  average_profit: number | null;
  average_loss: number | null;
}
