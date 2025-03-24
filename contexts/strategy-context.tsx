"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Strategy, CreateStrategyInput } from "@/types/strategy";
import { useAuth } from "./auth-context";

interface StrategyContextType {
  strategies: Strategy[];
  isLoading: boolean;
  error: string | null;
  createStrategy: (data: CreateStrategyInput) => Promise<Strategy | null>;
  refreshStrategies: () => Promise<void>;
}

const StrategyContext = createContext<StrategyContextType | undefined>(
  undefined
);

export function StrategyProvider({ children }: { children: React.ReactNode }) {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchStrategies = async () => {
    if (!user) {
      setStrategies([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/strategies");
      if (!response.ok) {
        throw new Error("Failed to fetch strategies");
      }
      const data = await response.json();
      setStrategies(data);
    } catch (err: any) {
      console.error("Error fetching strategies:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createStrategy = async (
    data: CreateStrategyInput
  ): Promise<Strategy | null> => {
    if (!user) return null;

    try {
      const response = await fetch("/api/strategies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create strategy");
      }

      const newStrategy = await response.json();
      setStrategies((prev) => [newStrategy, ...prev]);
      return newStrategy;
    } catch (err: any) {
      console.error("Error creating strategy:", err);
      setError(err.message);
      return null;
    }
  };

  const refreshStrategies = async () => {
    await fetchStrategies();
  };

  useEffect(() => {
    fetchStrategies();
  }, [user]);

  return (
    <StrategyContext.Provider
      value={{
        strategies,
        isLoading,
        error,
        createStrategy,
        refreshStrategies,
      }}
    >
      {children}
    </StrategyContext.Provider>
  );
}

export function useStrategies() {
  const context = useContext(StrategyContext);
  if (context === undefined) {
    throw new Error("useStrategies must be used within a StrategyProvider");
  }
  return context;
}
