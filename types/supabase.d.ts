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
