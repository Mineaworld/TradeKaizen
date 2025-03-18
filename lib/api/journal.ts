import { JournalEntry } from "@/types/supabase";

export async function fetchJournalEntries(): Promise<JournalEntry[]> {
  try {
    const response = await fetch("/api/journal/entries");
    if (!response.ok) {
      throw new Error("Failed to fetch journal entries");
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error in fetchJournalEntries:", error);
    throw error;
  }
}

// Convert other functions to TypeScript similarly...
