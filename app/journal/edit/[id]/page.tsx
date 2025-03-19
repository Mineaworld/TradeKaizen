"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import JournalEntryForm from "@/components/journal/journal-entry-form";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export default function EditJournalEntryPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJournalEntry() {
      try {
        // Get the journal entry
        const { data, error } = await supabase
          .from("journal_entries")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) throw error;
        setEntry(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load journal entry. " + error.message,
          variant: "destructive",
        });
        router.push("/journal");
      } finally {
        setLoading(false);
      }
    }

    fetchJournalEntry();
  }, [params.id, router, toast]);

  const handleUpdateJournal = async (data: any) => {
    try {
      const formattedDate = data.date.toISOString().split("T")[0];

      // Calculate PnL
      const pnl =
        (data.exit_price - data.entry_price) *
        data.position_size *
        (data.trade_direction === "LONG" ? 1 : -1);

      // Update journal entry with all trading fields
      const { error } = await supabase
        .from("journal_entries")
        .update({
          title: data.title,
          content: data.content,
          date: formattedDate,
          mood: data.mood,
          trade_pair: data.trade_pair,
          trade_direction: data.trade_direction,
          entry_price: data.entry_price,
          exit_price: data.exit_price,
          position_size: data.position_size,
          trade_outcome: data.trade_outcome,
          trade_duration: data.trade_duration,
          trade_setup: data.trade_setup,
          trade_notes: data.trade_notes,
          emotions: data.emotions,
          trade_mistakes: data.trade_mistakes,
          trade_lessons: data.trade_lessons,
          strategy_id: data.strategy_id,
          risk_reward_ratio: data.risk_reward_ratio,
          net_pnl: pnl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Journal entry updated successfully",
      });

      return Number(params.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update journal entry",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleCancel = () => {
    router.push("/journal");
  };

  if (loading) {
    return (
      <div className="container py-10 max-w-4xl">
        <Skeleton className="h-10 w-3/4 mb-6" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="container py-10 max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight mb-6">
          Journal Entry Not Found
        </h1>
        <p>
          The journal entry you are looking for does not exist or you do not
          have permission to view it.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Edit Journal Entry
      </h1>
      <JournalEntryForm
        entry={entry}
        onSubmit={handleUpdateJournal}
        onCancel={handleCancel}
      />
    </div>
  );
}
