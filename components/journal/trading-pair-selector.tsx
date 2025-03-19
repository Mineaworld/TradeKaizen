"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Plus, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { ALL_TRADING_PAIRS } from "@/lib/constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TradingPairSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TradingPairSelector({
  value,
  onChange,
  className,
}: TradingPairSelectorProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [customPairs, setCustomPairs] = useState<string[]>([]);
  const [isAddingPair, setIsAddingPair] = useState(false);
  const [newPair, setNewPair] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allPairs, setAllPairs] = useState<string[]>([]);
  const [deletingPair, setDeletingPair] = useState("");

  // Initialize trading pairs
  useEffect(() => {
    const defaultPairs = ALL_TRADING_PAIRS || [];
    if (defaultPairs.length > 0) {
      setAllPairs(defaultPairs);
    }
  }, []);

  // Fetch custom pairs
  useEffect(() => {
    const fetchCustomPairs = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("custom_trading_pairs")
          .select("pair")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching custom pairs:", error);
          return;
        }

        if (data) {
          const customPairsList = data.map((item) => item.pair).filter(Boolean);
          setCustomPairs(customPairsList);
          setAllPairs((prev) => {
            const uniquePairs = Array.from(
              new Set([...prev, ...customPairsList])
            );
            return uniquePairs.sort();
          });
        }
      } catch (error) {
        console.error("Error in fetchCustomPairs:", error);
      }
    };

    fetchCustomPairs();
  }, [user]);

  const handleAddPair = async () => {
    if (!user || !newPair.trim() || customPairs.includes(newPair)) {
      setIsAddingPair(false);
      setNewPair("");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("custom_trading_pairs").insert({
        user_id: user.id,
        pair: newPair,
      });

      if (!error) {
        setCustomPairs((prev) => [...prev, newPair]);
        setAllPairs((prev) => {
          const uniquePairs = Array.from(new Set([...prev, newPair]));
          return uniquePairs.sort();
        });
        onChange(newPair);
        setOpen(false);
      } else {
        console.error("Error adding custom pair:", error);
      }
    } catch (error) {
      console.error("Error in handleAddPair:", error);
    }
    setLoading(false);
    setIsAddingPair(false);
    setNewPair("");
  };

  const handleDeletePair = async (pairToDelete: string) => {
    if (!user || !customPairs.includes(pairToDelete)) return;

    setDeletingPair(pairToDelete);
    try {
      const { error } = await supabase
        .from("custom_trading_pairs")
        .delete()
        .eq("user_id", user.id)
        .eq("pair", pairToDelete);

      if (!error) {
        setCustomPairs((prev) => prev.filter((pair) => pair !== pairToDelete));
        setAllPairs((prev) => prev.filter((pair) => pair !== pairToDelete));
        if (value === pairToDelete) {
          onChange("");
        }
      } else {
        console.error("Error deleting custom pair:", error);
      }
    } catch (error) {
      console.error("Error in handleDeletePair:", error);
    }
    setDeletingPair("");
  };

  const handleAddNewPairClick = () => {
    setOpen(false);
    setTimeout(() => setIsAddingPair(true), 0);
  };

  const filteredPairs = searchQuery
    ? allPairs.filter((pair) =>
        pair.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allPairs;

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "justify-between w-full",
              !value && "text-muted-foreground",
              className
            )}
          >
            {value || "Select trading pair"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <div className="flex flex-col">
            <div className="flex items-center border-b px-3">
              <Input
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus-visible:ring-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trading pairs..."
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {filteredPairs.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">
                  No trading pair found.
                </p>
              ) : (
                <div className="p-1">
                  {filteredPairs.map((pair) => (
                    <div
                      key={pair}
                      className="flex items-center justify-between group hover:bg-accent rounded-sm"
                    >
                      <button
                        className={cn(
                          "relative flex w-full items-center px-2 py-1.5 text-sm outline-none",
                          value === pair && "text-accent-foreground font-medium"
                        )}
                        onClick={() => {
                          onChange(pair);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === pair ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {pair}
                      </button>
                      {customPairs.includes(pair) && (
                        <button
                          className="invisible group-hover:visible p-2 hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePair(pair);
                          }}
                          disabled={deletingPair === pair}
                        >
                          {deletingPair === pair ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {user && (
              <div className="border-t p-1">
                <button
                  className="relative flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  onClick={handleAddNewPairClick}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add new pair
                </button>
                <Dialog open={isAddingPair} onOpenChange={setIsAddingPair}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Trading Pair</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={newPair}
                        onChange={(e) => setNewPair(e.target.value)}
                        placeholder="Enter new trading pair (e.g. BTC/USDT)"
                      />
                      <Button onClick={handleAddPair} disabled={loading}>
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Add"
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
