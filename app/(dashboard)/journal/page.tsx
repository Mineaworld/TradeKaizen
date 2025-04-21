"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { JournalEntry } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import JournalEntryList from "@/components/journal/journal-entry-list";
import JournalEntryForm from "@/components/journal/journal-entry-form";
import JournalFilters from "@/components/journal/journal-filters";
import TradeStatistics from "@/components/journal/trade-statistics";
import { useAuth } from "@/contexts/auth-context";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function adaptFormDataToEntry(
  formData: any,
  userId?: string
): Omit<JournalEntry, "id" | "created_at" | "updated_at"> {
  return {
    trade_date:
      typeof formData.trade_date === "string"
        ? formData.trade_date
        : formData.trade_date.toISOString().split("T")[0],
    trade_pair: formData.trade_pair,
    trade_direction: formData.trade_direction,
    entry_price: Number(formData.entry_price),
    exit_price: Number(formData.exit_price),
    position_size: Number(formData.position_size),
    trade_outcome: formData.trade_outcome,
    trade_duration: formData.trade_duration,
    trade_setup: formData.trade_setup || null,
    trade_notes: formData.trade_notes || null,
    emotions: formData.emotions || null,
    trade_mistakes: formData.trade_mistakes || null,
    trade_lessons: formData.trade_lessons || null,
    strategy_id: formData.strategy_id || null,
    tags: formData.tags || null,
    trade_screenshot: formData.trade_screenshot || null,
    user_id: userId || "",
    profit_loss: 0, // This will be calculated in createEntry
  };
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year" | "all">(
    "all"
  );
  const [filters, setFilters] = useState({
    direction: null as string | null,
    outcome: null as string | null,
    pair: "",
    dateRange: {
      from: undefined as Date | undefined,
      to: undefined as Date | undefined,
    },
  });
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      redirect("/login");
    }
  }, [user, isLoading]);

  useEffect(() => {
    if (user) {
      fetchJournalEntries();
    }
  }, [user]);

  // Add new useEffect to fetch entries when filters change
  useEffect(() => {
    if (user) {
      fetchJournalEntries();
    }
  }, [filters]);

  // Filter entries based on timeframe
  const filteredEntries = useMemo(() => {
    if (timeframe === "all") return entries;

    const now = new Date();
    const cutoffDate = new Date();

    switch (timeframe) {
      case "week":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "month":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return entries.filter((entry) => new Date(entry.trade_date) >= cutoffDate);
  }, [entries, timeframe]);

  async function fetchJournalEntries() {
    if (!user) return;

    try {
      setLoading(true);

      // First check if the table exists
      const { error: tableCheckError } = await supabase
        .from("journal_entries")
        .select("count")
        .limit(1)
        .throwOnError();

      if (tableCheckError) {
        // If the table doesn't exist, show specific error
        toast({
          title: "Database table not found",
          description:
            "The journal_entries table doesn't exist in the database. Please create it first.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      let query = supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("trade_date", { ascending: false });

      // Apply filters
      if (filters.direction) {
        query = query.eq("trade_direction", filters.direction);
      }

      if (filters.outcome) {
        query = query.eq("trade_outcome", filters.outcome);
      }

      if (filters.pair) {
        query = query.ilike("trade_pair", `%${filters.pair}%`);
      }

      if (filters.dateRange.from instanceof Date) {
        query = query.gte(
          "trade_date",
          filters.dateRange.from.toISOString().split("T")[0]
        );
      }

      if (filters.dateRange.to instanceof Date) {
        query = query.lte(
          "trade_date",
          filters.dateRange.to.toISOString().split("T")[0]
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching journal entries",
        description: error.message,
        variant: "destructive",
      });
      console.error("Journal fetch error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createEntry(
    entry: Omit<JournalEntry, "id" | "created_at" | "updated_at">
  ) {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("journal_entries")
        .insert([
          {
            ...entry,
            user_id: user.id,
            profit_loss:
              (entry.exit_price - entry.entry_price) *
              entry.position_size *
              (entry.trade_direction === "LONG" ? 1 : -1),
          },
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Journal entry created successfully",
      });

      setEntries([data[0], ...entries]);
    } catch (error: any) {
      toast({
        title: "Error creating entry",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  async function updateEntry(id: number, entry: Partial<JournalEntry>) {
    try {
      // Update profit loss if prices or position size changed
      let updates = { ...entry };
      if (
        "entry_price" in entry ||
        "exit_price" in entry ||
        "position_size" in entry ||
        "trade_direction" in entry
      ) {
        const currentEntry = entries.find((e) => e.id === id);
        if (currentEntry) {
          const entryPrice = entry.entry_price || currentEntry.entry_price;
          const exitPrice = entry.exit_price || currentEntry.exit_price;
          const positionSize =
            entry.position_size || currentEntry.position_size;
          const direction =
            entry.trade_direction || currentEntry.trade_direction;

          updates.profit_loss =
            (exitPrice - entryPrice) *
            positionSize *
            (direction === "LONG" ? 1 : -1);
        }
      }

      const { error } = await supabase
        .from("journal_entries")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Journal entry updated successfully",
      });

      // Refresh entries after update
      fetchJournalEntries();
      setEditingEntry(null);
    } catch (error: any) {
      toast({
        title: "Error updating entry",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  async function deleteEntry(id: number) {
    try {
      const { error } = await supabase
        .from("journal_entries")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Journal entry deleted successfully",
      });

      setEntries(entries.filter((entry) => entry.id !== id));
    } catch (error: any) {
      toast({
        title: "Error deleting entry",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  const handleApplyFilters = (newFilters: any) => {
    // Validate filters - don't allow empty string values
    const sanitizedFilters = {
      ...newFilters,
      direction: newFilters.direction === "" ? null : newFilters.direction,
      outcome: newFilters.outcome === "" ? null : newFilters.outcome,
    };
    setFilters(sanitizedFilters);
  };

  // Add this new function to create a sample entry
  async function createSampleEntry() {
    if (!user) return;

    const sampleEntry = {
      trade_date: new Date().toISOString().split("T")[0],
      trade_pair: "BTC/USD",
      trade_direction: "buy",
      entry_price: 45000,
      exit_price: 46000,
      position_size: 1,
      trade_outcome: "profit",
      trade_duration: 60, // Changed to number (minutes)
      trade_setup: "breakout",
      trade_notes: "Good entry point based on technical analysis.",
      emotions: "Excited",
      trade_mistakes: "None",
      trade_lessons: "Stick to the plan.",
      strategy_id: null,
      tags: ["crypto", "trading"],
      trade_screenshot: null,
      user_id: user.id,
      profit_loss: 1000,
    };

    try {
      await createEntry(sampleEntry);
      toast({
        title: "Sample entry created",
        description: "A sample trade entry has been added to your journal.",
      });
      fetchJournalEntries();
    } catch (error: any) {
      toast({
        title: "Error creating sample entry",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Trading Journal</h1>
        <div className="flex gap-2">
          <Button onClick={createSampleEntry} variant="outline">
            Add Sample Entry
          </Button>
          <Button asChild>
            <Link href="/journal/new" className="flex items-center gap-2">
              <PlusIcon className="w-4 h-4" /> New Entry
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <JournalFilters onApplyFilters={handleApplyFilters} />
          <Select
            value={timeframe}
            onValueChange={(value: "week" | "month" | "year" | "all") =>
              setTimeframe(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TradeStatistics entries={filteredEntries} timeframe={timeframe} />

        <JournalEntryList
          entries={filteredEntries}
          loading={loading}
          onEdit={setEditingEntry}
          onDelete={deleteEntry}
        />
      </div>
    </div>
  );
}
