"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { JournalEntry } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { PlusIcon, Calendar, Filter, BarChart3, Download } from "lucide-react";
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
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent } from "@/components/ui/dialog";

function adaptFormDataToEntry(
  formData: any,
  userId?: string
): Omit<JournalEntry, "id" | "created_at" | "updated_at"> {
  // Normalize direction and outcome
  const direction = formData.trade_direction === "LONG" || formData.trade_direction === "SHORT"
    ? formData.trade_direction
    : formData.trade_direction?.toUpperCase() === "BUY" ? "LONG" : formData.trade_direction?.toUpperCase() === "SELL" ? "SHORT" : "LONG";
  const outcome = ["WIN", "LOSS", "BREAKEVEN"].includes(formData.trade_outcome)
    ? formData.trade_outcome
    : formData.trade_outcome?.toUpperCase() === "PROFIT" ? "WIN" : formData.trade_outcome?.toUpperCase() === "LOSS" ? "LOSS" : formData.trade_outcome?.toUpperCase() === "BREAKEVEN" ? "BREAKEVEN" : "WIN";
  return {
    trade_date:
      typeof formData.trade_date === "string"
        ? formData.trade_date
        : formData.trade_date.toISOString().split("T")[0],
    trade_pair: formData.trade_pair,
    trade_direction: direction,
    entry_price: Number(formData.entry_price),
    exit_price: Number(formData.exit_price),
    position_size: Number(formData.position_size),
    trade_outcome: outcome,
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
    net_pnl: formData.net_pnl || null,
    session: formData.session || null,
    account_id: formData.account_id || null,
  };
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year" | "all">(
    "all"
  );
  const [activeTab, setActiveTab] = useState<"entries" | "analytics">(
    "entries"
  );
  const [filters, setFilters] = useState<{
    direction: "long" | "short" | null;
    outcome: "win" | "loss" | null;
    pair: string;
    dateRange: { from: Date | null; to: Date | null };
  }>({
    direction: null,
    outcome: null,
    pair: "",
    dateRange: { from: null, to: null },
  });
  const { toast } = useToast();
  const { user } = useAuth();
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

  // Calculate filtered entries based on current filters
  const filteredEntries = entries.filter((entry) => {
    if (filters.direction && entry.trade_direction !== filters.direction)
      return false;
    if (filters.outcome && entry.trade_outcome !== filters.outcome)
      return false;
    if (
      filters.pair &&
      !entry.trade_pair?.toLowerCase().includes(filters.pair.toLowerCase())
    )
      return false;

    const entryDate = new Date(entry.trade_date);
    if (filters.dateRange.from && entryDate < filters.dateRange.from)
      return false;
    if (filters.dateRange.to && entryDate > filters.dateRange.to) return false;
    return true;
  });

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
      const profitLoss =
        (entry.exit_price - entry.entry_price) *
        entry.position_size *
        (entry.trade_direction === "LONG" ? 1 : -1);
      const netPnl = entry.net_pnl !== undefined && entry.net_pnl !== null ? entry.net_pnl : profitLoss;
      const { data, error } = await supabase
        .from("journal_entries")
        .insert([
          {
            ...entry,
            user_id: user.id,
            profit_loss: profitLoss,
            net_pnl: netPnl,
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
          updates.net_pnl = entry.net_pnl !== undefined && entry.net_pnl !== null ? entry.net_pnl : updates.profit_loss;
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
      trade_direction: "LONG",
      entry_price: 45000,
      exit_price: 46000,
      position_size: 1,
      trade_outcome: "WIN",
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
      net_pnl: 1000,
      session: "London Session",
      account_id: null,
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
    return (
      <div className="container mx-auto py-6 space-y-8">
        <Skeleton className="h-10 w-1/4 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto py-6 space-y-8"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Trading Journal</h1>
            <p className="text-muted-foreground mt-1">
              Track and analyze your trading performance
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={createSampleEntry}
              variant="outline"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Sample Entry
            </Button>
            <Button
              onClick={() => {
                setEditingEntry(null);
                setIsEntryModalOpen(true);
              }}
              className="gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              New Entry
            </Button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Trades
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {filteredEntries.length}
                </h3>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="p-3 bg-primary/10 rounded-full">
                      <BarChart3 className="w-6 h-6 text-primary" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total number of trades in the selected period</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </Card>
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Win Rate
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {filteredEntries.length > 0
                    ? `${Math.round(
                        (filteredEntries.filter(
                          (e) => e.trade_outcome === "WIN"
                        ).length /
                          filteredEntries.length) *
                          100
                      )}%`
                    : "0%"}
                </h3>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Percentage of profitable trades</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </Card>
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total P/L
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  $
                  {filteredEntries
                    .reduce((sum, entry) => sum + (entry.net_pnl || 0), 0)
                    .toLocaleString()}
                </h3>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Filter className="w-6 h-6 text-primary" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total profit/loss across all trades</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "entries" | "analytics")
          }
          className="w-full"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="entries">Trade Entries</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Select
                value={timeframe}
                onValueChange={(value: "week" | "month" | "year" | "all") =>
                  setTimeframe(value)
                }
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() =>
                  setFilters({
                    direction: null,
                    outcome: null,
                    pair: "",
                    dateRange: { from: null, to: null },
                  })
                }
                className="w-full sm:w-auto"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          <TabsContent value="entries" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <JournalFilters onApplyFilters={handleApplyFilters} />
              <div className="text-sm text-muted-foreground">
                Showing {filteredEntries.length} of {entries.length} entries
              </div>
            </div>
            <JournalEntryList
              entries={filteredEntries}
              loading={loading}
              onEdit={(entry) => {
                setEditingEntry(entry);
                setIsEntryModalOpen(true);
              }}
              onDelete={deleteEntry}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <TradeStatistics entries={filteredEntries} timeframe={timeframe} />
          </TabsContent>
        </Tabs>
      </motion.div>
      <Dialog open={isEntryModalOpen} onOpenChange={(open) => {
        setIsEntryModalOpen(open);
        if (!open) setEditingEntry(null);
      }}>
        <DialogContent className="max-w-2xl">
          <JournalEntryForm
            onSubmit={async (data) => {
              if (editingEntry && editingEntry.id) {
                await updateEntry(editingEntry.id, data);
              } else {
                await createEntry(data);
              }
              setIsEntryModalOpen(false);
              setEditingEntry(null);
            }}
            onCancel={() => {
              setIsEntryModalOpen(false);
              setEditingEntry(null);
            }}
            defaultValues={editingEntry || undefined}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
