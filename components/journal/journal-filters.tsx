"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown, FilterX } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

// Import common trading pairs from a shared location
const COMMON_TRADING_PAIRS = [
  "BTC/USD",
  "ETH/USD",
  "BNB/USD",
  "XRP/USD",
  "SOL/USD",
  "DOGE/USD",
  "ADA/USD",
  "AVAX/USD",
  "MATIC/USD",
  "DOT/USD",
  "EUR/USD",
  "GBP/USD",
  "USD/JPY",
  "USD/CAD",
  "SPY",
  "AAPL",
  "MSFT",
  "TSLA",
  "NVDA",
  "AMZN",
];

interface JournalFiltersProps {
  onApplyFilters: (filters: any) => void;
}

export default function JournalFilters({
  onApplyFilters,
}: JournalFiltersProps) {
  const [direction, setDirection] = useState("");
  const [outcome, setOutcome] = useState("");
  const [pair, setPair] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [openTradePair, setOpenTradePair] = useState(false);

  const applyFilters = () => {
    onApplyFilters({
      direction,
      outcome,
      pair,
      dateRange,
    });
  };

  const resetFilters = () => {
    setDirection("");
    setOutcome("");
    setPair("");
    setDateRange({ from: undefined, to: undefined });
    onApplyFilters({
      direction: "",
      outcome: "",
      pair: "",
      dateRange: { from: undefined, to: undefined },
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Filter Entries</CardTitle>
        <CardDescription>
          Filter your journal entries by specific criteria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="direction">Direction</Label>
            <Select value={direction} onValueChange={setDirection}>
              <SelectTrigger id="direction">
                <SelectValue placeholder="Any Direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LONG">Long</SelectItem>
                <SelectItem value="SHORT">Short</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="outcome">Outcome</Label>
            <Select value={outcome} onValueChange={setOutcome}>
              <SelectTrigger id="outcome">
                <SelectValue placeholder="Any Outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WIN">Win</SelectItem>
                <SelectItem value="LOSS">Loss</SelectItem>
                <SelectItem value="BREAKEVEN">Break Even</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pair">Trading Pair</Label>
            <Popover open={openTradePair} onOpenChange={setOpenTradePair}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openTradePair}
                  className={cn(
                    "w-full justify-between",
                    !pair && "text-muted-foreground"
                  )}
                >
                  {pair || "Any pair"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search trading pairs..." />
                  <CommandEmpty>
                    Press enter to use this as a filter
                  </CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value=""
                      onSelect={() => {
                        setPair("");
                        setOpenTradePair(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          pair === "" ? "opacity-100" : "opacity-0"
                        )}
                      />
                      Any pair
                    </CommandItem>
                    {COMMON_TRADING_PAIRS.map((tradePair) => (
                      <CommandItem
                        key={tradePair}
                        value={tradePair}
                        onSelect={(value) => {
                          setPair(value);
                          setOpenTradePair(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            pair === tradePair ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {tradePair}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange?.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={resetFilters}>
          <FilterX className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
        <Button onClick={applyFilters}>Apply Filters</Button>
      </CardFooter>
    </Card>
  );
}
