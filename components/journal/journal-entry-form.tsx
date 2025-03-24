"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context"; // Add this import

import { JournalEntry } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription, // Make sure this is imported
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TradingPairSelector } from "@/components/journal/trading-pair-selector";

const formSchema = z.object({
  trade_date: z.date(),
  trade_pair: z.string().min(1, "Trading pair is required"),
  trade_direction: z.string().min(1, "Trading direction is required"),
  entry_price: z.coerce.number().positive("Entry price must be positive"),
  exit_price: z.coerce.number().positive("Exit price must be positive"),
  position_size: z.coerce.number().positive("Position size must be positive"),
  trade_outcome: z.string().min(1, "Outcome is required"),
  trade_duration: z.coerce.number().int().nonnegative().optional(),
  trade_setup: z.string().optional().nullable(),
  trade_notes: z.string().optional().nullable(),
  emotions: z.string().optional().nullable(),
  trade_mistakes: z.string().optional().nullable(),
  trade_lessons: z.string().optional().nullable(),
  strategy_id: z.coerce.number().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  risk_reward_ratio: z.coerce.number().optional().nullable(),
  net_pnl: z.coerce.number().optional().nullable(),
});

type FormData = z.infer<typeof formSchema>;

interface JournalEntryFormProps {
  entry?: JournalEntry;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  entry,
  onSubmit,
  onCancel,
}) => {
  const { user } = useAuth(); // Use the auth context to get the user
  const [loading, setLoading] = useState(false);
  const [strategies, setStrategies] = useState<{ id: number; name: string }[]>(
    []
  );
  const [openStrategy, setOpenStrategy] = useState(false);
  const [newStrategy, setNewStrategy] = useState("");
  const [isAddingStrategy, setIsAddingStrategy] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: entry
      ? {
          ...entry,
          trade_date: new Date(entry.trade_date),
          strategy_id: entry.strategy_id || undefined,
          tags: entry.tags || [],
        }
      : {
          trade_date: new Date(),
          trade_direction: "LONG",
          trade_outcome: "WIN",
          tags: [],
        },
  });

  useEffect(() => {
    async function fetchStrategies() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("strategies")
          .select("id, name")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching strategies:", error);
          return;
        }

        if (data) {
          setStrategies(data);
        }
      } catch (error) {
        console.error("Unexpected error fetching strategies:", error);
      }
    }
    fetchStrategies();
  }, [user]);

  const handleAddStrategy = async () => {
    if (!user || !newStrategy.trim()) {
      setIsAddingStrategy(false);
      setNewStrategy("");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("strategies")
      .insert({
        user_id: user.id,
        name: newStrategy,
        description: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id, name");
    setLoading(false);

    if (!error && data) {
      setStrategies([...strategies, data[0]]);
    }

    setIsAddingStrategy(false);
    setNewStrategy("");
  };

  const handleAddNewStrategyClick = () => {
    setOpenStrategy(false); // Close the dropdown
    setTimeout(() => setIsAddingStrategy(true), 0); // Open the dialog immediately after
  };

  useEffect(() => {
    const entryPriceValue = form.watch("entry_price");
    const exitPriceValue = form.watch("exit_price");
    const positionSizeValue = form.watch("position_size");
    const direction = form.watch("trade_direction");

    // Only proceed if all values are defined
    if (
      entryPriceValue !== undefined &&
      exitPriceValue !== undefined &&
      positionSizeValue !== undefined &&
      direction
    ) {
      const entryPrice = parseFloat(entryPriceValue?.toString() || "0");
      const exitPrice = parseFloat(exitPriceValue?.toString() || "0");
      const positionSize = parseFloat(positionSizeValue?.toString() || "0");

      if (entryPrice && exitPrice && positionSize) {
        let pnl = 0;

        if (direction === "LONG") {
          pnl = (exitPrice - entryPrice) * positionSize;
        } else if (direction === "SHORT") {
          pnl = (entryPrice - exitPrice) * positionSize;
        }

        form.setValue("net_pnl", pnl);

        if (pnl !== 0) {
          const risk = positionSize * 0.01;
          const reward = Math.abs(pnl);
          const ratio = reward / risk;
          form.setValue("risk_reward_ratio", parseFloat(ratio.toFixed(2)));
        }
      }
    }
  }, [
    form.watch("entry_price"),
    form.watch("exit_price"),
    form.watch("position_size"),
    form.watch("trade_direction"),
  ]);

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="analysis">Trade Analysis</TabsTrigger>
                <TabsTrigger value="reflection">Reflection</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="trade_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="trade_pair"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Trading Pair</FormLabel>
                        <FormControl>
                          <TradingPairSelector
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="trade_direction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Direction</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select direction" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="LONG">Long</SelectItem>
                            <SelectItem value="SHORT">Short</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="trade_outcome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Outcome</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select outcome" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="WIN">Win</SelectItem>
                            <SelectItem value="LOSS">Loss</SelectItem>
                            <SelectItem value="BREAKEVEN">
                              Break Even
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="strategy_id"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Strategy</FormLabel>
                        <Popover
                          open={openStrategy}
                          onOpenChange={setOpenStrategy}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openStrategy}
                                className={cn(
                                  "justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? (strategies &&
                                      strategies.find(
                                        (s) => s.id === field.value
                                      )?.name) ||
                                    "Unknown Strategy"
                                  : "Select strategy"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[300px] p-0"
                            align="start"
                          >
                            <Command>
                              <CommandInput placeholder="Search strategies..." />
                              <CommandEmpty>No strategy found.</CommandEmpty>
                              <CommandGroup>
                                {strategies && strategies.length > 0 ? (
                                  strategies.map((strategy) => (
                                    <CommandItem
                                      key={strategy.id}
                                      value={strategy.name}
                                      onSelect={() => {
                                        form.setValue(
                                          "strategy_id",
                                          strategy.id
                                        );
                                        setOpenStrategy(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === strategy.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {strategy.name}
                                    </CommandItem>
                                  ))
                                ) : (
                                  <CommandItem disabled>
                                    Loading strategies...
                                  </CommandItem>
                                )}
                              </CommandGroup>
                              <Dialog
                                open={isAddingStrategy}
                                onOpenChange={setIsAddingStrategy}
                              >
                                <DialogTrigger asChild>
                                  <CommandItem
                                    onSelect={handleAddNewStrategyClick}
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add new strategy
                                  </CommandItem>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Add New Strategy</DialogTitle>
                                  </DialogHeader>
                                  <div className="flex items-center space-x-2">
                                    <Input
                                      value={newStrategy}
                                      onChange={(e) =>
                                        setNewStrategy(e.target.value)
                                      }
                                      placeholder="Enter strategy name"
                                    />
                                    <Button
                                      onClick={handleAddStrategy}
                                      disabled={loading}
                                    >
                                      {loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        "Add"
                                      )}
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Select or create a strategy used for this trade
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="entry_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entry Price</FormLabel>
                        <FormControl>
                          <Input type="number" step="any" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="exit_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exit Price</FormLabel>
                        <FormControl>
                          <Input type="number" step="any" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="position_size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position Size</FormLabel>
                        <FormControl>
                          <Input type="number" step="any" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="trade_duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value || ""}
                            onChange={(event) =>
                              field.onChange(
                                event.target.value === ""
                                  ? undefined
                                  : event.target.valueAsNumber
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2 mt-6">
                  <FormField
                    control={form.control}
                    name="net_pnl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Net Profit/Loss</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            readOnly
                            className={cn(
                              (field.value ?? 0) > 0
                                ? "text-green-600 font-medium"
                                : (field.value ?? 0) < 0
                                ? "text-red-600 font-medium"
                                : ""
                            )}
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Calculated automatically based on entry/exit prices
                          and position size
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="risk_reward_ratio"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            readOnly
                            className="font-medium"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Calculated automatically based on trade performance
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4">
                <FormField
                  control={form.control}
                  name="trade_setup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trade Setup</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your trade setup"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="trade_notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trade Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any notes about the trade"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="reflection" className="space-y-4">
                <FormField
                  control={form.control}
                  name="emotions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emotions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="How did you feel during this trade?"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="trade_mistakes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mistakes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What mistakes did you make, if any?"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="trade_lessons"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lessons Learned</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What did you learn from this trade?"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {entry ? "Update Entry" : "Add Entry"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default JournalEntryForm;
