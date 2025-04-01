// Journal API service

export const fetchJournalEntries = async (filters = {}) => {
  try {
    let url = "/api/journal/entries";
    const queryParams = new URLSearchParams();

    // Add filters to query parameters
    if (filters.direction) queryParams.append("direction", filters.direction);
    if (filters.outcome) queryParams.append("outcome", filters.outcome);
    if (filters.pair) queryParams.append("pair", filters.pair);
    if (filters.dateRange?.from)
      queryParams.append("dateFrom", filters.dateRange.from.toISOString());
    if (filters.dateRange?.to)
      queryParams.append("dateTo", filters.dateRange.to.toISOString());

    const queryString = queryParams.toString();
    if (queryString) url += `?${queryString}`;

    const response = await fetch(url);
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
    // Calculate profit_loss if trade data is available
    if (
      entryData.entry_price &&
      entryData.exit_price &&
      entryData.position_size &&
      entryData.trade_direction
    ) {
      const profitLoss =
        (entryData.exit_price - entryData.entry_price) *
        entryData.position_size *
        (entryData.trade_direction === "LONG" ? 1 : -1);
      entryData.profit_loss = profitLoss;
    }

    const response = await fetch("/api/journal/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...entryData,
        date:
          entryData.trade_date || entryData.date || new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to create journal entry");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in createJournalEntry:", error);
    throw error;
  }
};

export const updateJournalEntry = async (entryId, entryData) => {
  try {
    // Calculate profit_loss if trade data is available
    if (
      entryData.entry_price &&
      entryData.exit_price &&
      entryData.position_size &&
      entryData.trade_direction
    ) {
      const profitLoss =
        (entryData.exit_price - entryData.entry_price) *
        entryData.position_size *
        (entryData.trade_direction === "LONG" ? 1 : -1);
      entryData.profit_loss = profitLoss;
    }

    const response = await fetch(`/api/journal/entries/${entryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...entryData,
        updated_at: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message ||
          `Failed to update journal entry with id ${entryId}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in updateJournalEntry for id ${entryId}:`, error);
    throw error;
  }
};

export const deleteJournalEntry = async (entryId) => {
  try {
    // First delete any associated screenshots
    try {
      await fetch(`/api/journal/entries/${entryId}/screenshots`, {
        method: "DELETE",
      });
    } catch (screenshotError) {
      console.warn(
        `Failed to delete screenshots for entry ${entryId}`,
        screenshotError
      );
      // Continue with entry deletion even if screenshot deletion fails
    }

    const response = await fetch(`/api/journal/entries/${entryId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message ||
          `Failed to delete journal entry with id ${entryId}`
      );
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
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message ||
          `Failed to add trade to journal entry with id ${entryId}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in addTradeToJournal for entry id ${entryId}:`, error);
    throw error;
  }
};

export const addScreenshotToJournal = async (entryId, screenshotData) => {
  try {
    const response = await fetch(
      `/api/journal/entries/${entryId}/screenshots`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(screenshotData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message ||
          `Failed to add screenshot to journal entry with id ${entryId}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      `Error in addScreenshotToJournal for entry id ${entryId}:`,
      error
    );
    throw error;
  }
};
