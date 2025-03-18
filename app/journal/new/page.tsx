"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import JournalEntryForm from "@/components/journal/journal-entry-form";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export default function NewJournalEntryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to add a journal entry.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Handle null/undefined values more thoroughly
      const entryPrice = parseFloat(data.entry_price?.toString() || "0");
      const exitPrice = parseFloat(data.exit_price?.toString() || "0");
      const positionSize = parseFloat(data.position_size?.toString() || "0");
      
      // Calculate profit loss with safer value handling
      const profitLoss = 
        (exitPrice - entryPrice) * 
        positionSize * 
        (data.trade_direction === "LONG" ? 1 : -1);
      
      // Ensure all required fields have values
      const entryData = {
        ...data,
        entry_price: entryPrice,
        exit_price: exitPrice,
        position_size: positionSize,
        tags: Array.isArray(data.tags) ? data.tags : [],
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profit_loss: profitLoss,
        strategy_id: data.strategy_id || null,
      };

      const { error } = await supabase
        .from("journal_entries")
        .insert(entryData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Journal entry created successfully",
      });

      // Redirect back to journal page
      router.push("/journal");
      router.refresh();
    } catch (error: any) {
      console.error("Error adding journal entry:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add journal entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Add New Journal Entry</h1>
      <JournalEntryForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
