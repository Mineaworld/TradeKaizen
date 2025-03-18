"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { ALL_TRADING_PAIRS } from "@/lib/constants";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
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

  const allTradingPairs = [...ALL_TRADING_PAIRS, ...customPairs].sort();

  useEffect(() => {
    const fetchCustomPairs = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("custom_trading_pairs")
        .select("pair")
        .eq("user_id", user.id);

      if (data) {
        setCustomPairs(data.map((item) => item.pair));
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
    const { error } = await supabase.from("custom_trading_pairs").insert({
      user_id: user.id,
      pair: newPair,
    });
    setLoading(false);

    if (!error) {
      setCustomPairs([...customPairs, newPair]);
      onChange(newPair);
      setOpen(false);
    }

    setIsAddingPair(false);
    setNewPair("");
  };

  return (
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
        <Command>
          <CommandInput placeholder="Search trading pairs..." />
          <CommandEmpty>No trading pair found.</CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-y-auto">
            {allTradingPairs.map((pair) => (
              <CommandItem
                key={pair}
                value={pair}
                onSelect={() => {
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
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup>
            <Dialog open={isAddingPair} onOpenChange={setIsAddingPair}>
              <DialogTrigger asChild>
                <CommandItem
                  onSelect={() => {
                    setIsAddingPair(true);
                    return false; // Prevent default behavior
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add new pair
                </CommandItem>
              </DialogTrigger>
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
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
