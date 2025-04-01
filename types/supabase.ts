export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      journal_entries: {
        Row: {
          id: number;
          created_at: string;
          updated_at: string;
          user_id: string;
          trade_date: string;
          trade_pair: string;
          entry_price: number;
          exit_price: number;
          position_size: number;
          profit_loss: number;
          trade_direction: string;
          trade_duration: number;
          trade_notes: string | null;
          trade_setup: string | null;
          trade_outcome: string;
          trade_screenshot: string | null;
          strategy_id: number | null;
          tags: string[] | null;
          emotions: string | null;
          trade_mistakes: string | null;
          trade_lessons: string | null;
          net_pnl?: number | null;
          risk_reward_ratio?: number | null;
          stop_loss?: number | null;
          take_profit?: number | null;
          risk_per_trade?: number | null;
          commission_fees?: number | null;
          slippage?: number | null;
          trade_quality_score?: number | null;
          market_conditions?: string | null;
          trade_timeframe?: string | null;
          trade_execution_rating?: number | null;
          trade_management_notes?: string | null;
          trade_exit_reason?: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          trade_date: string;
          trade_pair: string;
          entry_price: number;
          exit_price: number;
          position_size: number;
          profit_loss?: number;
          trade_direction: string;
          trade_duration?: number;
          trade_notes?: string | null;
          trade_setup?: string | null;
          trade_outcome: string;
          trade_screenshot?: string | null;
          strategy_id?: number | null;
          tags?: string[] | null;
          emotions?: string | null;
          trade_mistakes?: string | null;
          trade_lessons?: string | null;
          net_pnl?: number | null;
          risk_reward_ratio?: number | null;
          stop_loss?: number | null;
          take_profit?: number | null;
          risk_per_trade?: number | null;
          commission_fees?: number | null;
          slippage?: number | null;
          trade_quality_score?: number | null;
          market_conditions?: string | null;
          trade_timeframe?: string | null;
          trade_execution_rating?: number | null;
          trade_management_notes?: string | null;
          trade_exit_reason?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          trade_date?: string;
          trade_pair?: string;
          entry_price?: number;
          exit_price?: number;
          position_size?: number;
          profit_loss?: number;
          trade_direction?: string;
          trade_duration?: number;
          trade_notes?: string | null;
          trade_setup?: string | null;
          trade_outcome?: string;
          trade_screenshot?: string | null;
          strategy_id?: number | null;
          tags?: string[] | null;
          emotions?: string | null;
          trade_mistakes?: string | null;
          trade_lessons?: string | null;
          net_pnl?: number | null;
          risk_reward_ratio?: number | null;
          stop_loss?: number | null;
          take_profit?: number | null;
          risk_per_trade?: number | null;
          commission_fees?: number | null;
          slippage?: number | null;
          trade_quality_score?: number | null;
          market_conditions?: string | null;
          trade_timeframe?: string | null;
          trade_execution_rating?: number | null;
          trade_management_notes?: string | null;
          trade_exit_reason?: string | null;
        };
      };
      strategies: {
        Row: {
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
        };
        Insert: {
          id?: number;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          name: string;
          description?: string | null;
          rules?: string | null;
          timeframes?: string[] | null;
          markets?: string[] | null;
          indicators?: string[] | null;
          win_rate?: number | null;
          risk_reward?: number | null;
          average_profit?: number | null;
          average_loss?: number | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          rules?: string | null;
          timeframes?: string[] | null;
          markets?: string[] | null;
          indicators?: string[] | null;
          win_rate?: number | null;
          risk_reward?: number | null;
          average_profit?: number | null;
          average_loss?: number | null;
        };
      };
      custom_trading_pairs: {
        Row: {
          id: number;
          created_at: string;
          user_id: string;
          pair: string;
        };
        Insert: {
          id?: number;
          created_at?: string;
          user_id: string;
          pair: string;
        };
        Update: {
          id?: number;
          created_at?: string;
          user_id?: string;
          pair?: string;
        };
        Relationships: [
          {
            foreignKeyName: "custom_trading_pairs_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Export types from the .d.ts file
export type { JournalEntry, NewJournalEntry, Strategy } from "./supabase.d";
