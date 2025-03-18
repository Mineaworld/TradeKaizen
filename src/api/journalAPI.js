// Journal API service

export const fetchJournalEntries = async () => {
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
};

export const fetchJournalEntryById = async (entryId) => {
  try {
    const response = await fetch(`/api/journal/entries/${entryId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch journal entry with id ${entryId}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in fetchJournalEntryById for id ${entryId}:`, error);
    throw error;
  }
};

export const createJournalEntry = async (entryData) => {
  try {
    const response = await fetch("/api/journal/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...entryData,
        date: entryData.date || new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create journal entry");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in createJournalEntry:", error);
    throw error;
  }
};

export const updateJournalEntry = async (entryId, entryData) => {
  try {
    const response = await fetch(`/api/journal/entries/${entryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entryData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update journal entry with id ${entryId}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in updateJournalEntry for id ${entryId}:`, error);
    throw error;
  }
};

export const deleteJournalEntry = async (entryId) => {
  try {
    const response = await fetch(`/api/journal/entries/${entryId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete journal entry with id ${entryId}`);
    }

    return true;
  } catch (error) {
    console.error(`Error in deleteJournalEntry for id ${entryId}:`, error);
    throw error;
  }
};

export const addTradeToJournal = async (entryId, tradeData) => {
  try {
    const response = await fetch(`/api/journal/entries/${entryId}/trades`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tradeData),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to add trade to journal entry with id ${entryId}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in addTradeToJournal for entry id ${entryId}:`, error);
    throw error;
  }
};
