"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import {
  CalendarIcon,
  Upload,
  X,
  ZoomIn,
  ArrowUp,
  ArrowDown,
  Loader2,
  ImageIcon,
  ChevronDown,
  Plus,
  BarChart2,
  Trash2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form as FormRoot } from "@/components/ui/form"; // Add this import
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useStrategies } from "@/contexts/strategy-context";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { supabase, storageHelper } from "@/lib/supabase";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { useAccounts, TradingAccount } from "../../app/hooks/useAccounts";
import { ALL_TRADING_PAIRS } from "@/lib/constants";
import { useAuth } from "@/contexts/auth-context";
import * as SelectPrimitive from "@radix-ui/react-select";
import { useToast } from "@/components/ui/use-toast";

interface JournalEntryFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  defaultValues?: any;
}

interface ImageItemProps {
  url: string;
  index: number;
  onRemove: (index: number) => void;
  onPreview: (url: string) => void;
  id: string;
}

const SortableImageItem = ({
  url,
  index,
  onRemove,
  onPreview,
  id,
}: ImageItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
    position: "relative" as "relative",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative rounded-lg overflow-hidden group border border-muted hover:border-primary"
      {...attributes}
    >
      <div className="h-48 relative cursor-grab" {...listeners}>
        <Image
          src={url}
          alt={`Chart ${index + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onPreview(url)}
            className="bg-background rounded-full p-2 mx-1 hover:bg-muted"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="bg-background text-destructive rounded-full p-2 mx-1 hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="absolute top-2 left-2 bg-background/80 rounded px-2 py-1 text-xs">
        {index + 1}
      </div>
    </div>
  );
};

const SESSION_OPTIONS = [
  { value: "Asian", label: "Asian Session" },
  { value: "London", label: "London Session" },
  { value: "New York", label: "New York Session" },
];
const OUTCOME_OPTIONS = [
  { value: "WIN", label: "Profit" },
  { value: "LOSS", label: "Loss" },
  { value: "BREAKEVEN", label: "Breakeven" },
];

const DEFAULT_PAIRS = [
  "NQ", "XAU", "EUR/USD", "BTC/USD", "SPX", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "USD/CHF", "NZD/USD"
];

export default function JournalEntryForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
  defaultValues,
}: JournalEntryFormProps) {
  const [uploadedImages, setUploadedImages] = useState<
    Array<{ url: string; file: File; id: string }>
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const [tradingPairs, setTradingPairs] = useState<string[]>([
    "NQ", "XAU", "EUR/USD", "BTC/USD", "SPX", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "USD/CHF", "NZD/USD"
  ]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [emotions, setEmotions] = useState<string[]>(["Excited", "Anxious", "Confident", "Fearful", "Frustrated", "Calm"]);
  const [customPairInput, setCustomPairInput] = useState("");
  const [isAddingPair, setIsAddingPair] = useState(false);
  const [pairSearch, setPairSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const form = useForm({
    defaultValues: {
      trade_date: defaultValues?.trade_date
        ? new Date(defaultValues.trade_date)
        : new Date(),
      trade_direction: defaultValues?.trade_direction || "",
      entry_price: defaultValues?.entry_price || "",
      exit_price: defaultValues?.exit_price || "",
      position_size: defaultValues?.position_size || "",
      trade_notes: defaultValues?.trade_notes || "",
      trade_lessons: defaultValues?.trade_lessons || "",
      strategy_id: defaultValues?.strategy_id || "",
      trade_pair: defaultValues?.trade_pair || "",
      photos: defaultValues?.photos || [],
      account_id: defaultValues?.account_id || "",
      session: defaultValues?.session || "",
      commission_fees: defaultValues?.commission_fees || "",
      risk_reward_ratio: defaultValues?.risk_reward_ratio || "",
      gross_pnl: defaultValues?.gross_pnl || "",
      trade_outcome: defaultValues?.trade_outcome || "",
      emotions: defaultValues?.emotions || "",
      emotion_reason: defaultValues?.emotion_reason || "",
      net_pnl: defaultValues?.net_pnl || "",
    },
  });

  // Get strategies from context - with proper error handling
  const { strategies = [], isLoading: isStrategiesLoading } = useStrategies();

  // Debug log to help identify issues
  useEffect(() => {
    console.log(
      "Strategies loaded:",
      strategies,
      "isArray:",
      Array.isArray(strategies),
      "length:",
      strategies?.length
    );
  }, [strategies]);

  // Fetch trading pairs
  useEffect(() => {
    async function fetchTradingPairs() {
      const { data: pairs, error } = await supabase
        .from("custom_trading_pairs")
        .select("pair_name")
        .order("pair_name");

      if (!error && pairs) {
        setTradingPairs(pairs.map((p) => p.pair_name));
      }
    }
    fetchTradingPairs();
  }, []);

  // Fetch custom pairs for the user
  useEffect(() => {
    const fetchCustomPairs = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("custom_trading_pairs")
        .select("pair")
        .eq("user_id", user.id);
      if (!error && data) {
        const customPairs = data.map((item: any) => item.pair).filter(Boolean);
        setTradingPairs((prev) => Array.from(new Set([...prev, ...customPairs])));
      }
    };
    fetchCustomPairs();
  }, [user]);

  // Handle image upload with improved error handling
  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;

    setIsUploading(true);
    const newImages: typeof uploadedImages = [];

    for (const file of acceptedFiles) {
      try {
        // Create temporary preview URL for immediate display
        const previewUrl = URL.createObjectURL(file);
        const imageId = Math.random().toString(36).substring(7);

        // Add to state with temporary URL for immediate feedback
        newImages.push({
          url: previewUrl,
          file,
          id: imageId,
        });

        // Add to form values immediately with temporary URL
        const currentImages = form.getValues("photos") || [];
        form.setValue("photos", [...currentImages, previewUrl]);

        // Use the storage helper to upload in background
        const publicUrl = await storageHelper.uploadImage(
          file,
          "journal-images"
        );

        // Update with permanent URL once upload completes
        setUploadedImages((prev) =>
          prev.map((img) =>
            img.id === imageId ? { ...img, url: publicUrl } : img
          )
        );

        // Update form value with permanent URL
        const updatedImages = form
          .getValues("photos")
          .map((url: string) => (url === previewUrl ? publicUrl : url));
        form.setValue("photos", updatedImages);
        toast({
          title: "Image uploaded",
          description: "Image uploaded successfully.",
        });
      } catch (error) {
        console.error("Error uploading file:", error);
        toast({
          title: "Image upload failed",
          description: error instanceof Error ? error.message : String(error),
          variant: "destructive",
        });
      }
    }

    // Immediately add temporary images to state
    setUploadedImages((prev) => [...prev, ...newImages]);
    setIsUploading(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
  });

  // Handle drag end for reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setUploadedImages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);

        // Also update the form values to maintain the same order
        const imageUrls = newOrder.map((item) => item.url);
        form.setValue("photos", imageUrls);

        return newOrder;
      });
    }
  };

  // Updated image removal handler - simplify and make more robust
  const handleRemoveImage = (indexToRemove: number) => {
    // Log for debugging
    console.log("Removing image at index:", indexToRemove);

    if (indexToRemove >= 0 && indexToRemove < uploadedImages.length) {
      // Create a direct copy without the removed image
      const newImages = [...uploadedImages];
      newImages.splice(indexToRemove, 1);

      // Update state
      setUploadedImages(newImages);

      // Update form data with the new image URLs
      const newImageUrls = newImages.map((img) => img.url);
      form.setValue("photos", newImageUrls);
    }
  };

  // Updated preview handler - make it more direct
  const handlePreviewImage = (url: string) => {
    console.log("Previewing image:", url);
    // Directly set the state without timeout
    setPreviewImage(url);
  };

  // Handle form submission
  const handleSubmit = (data: any) => {
    // Convert empty string integer fields to null
    const integerFields = [
      'trade_duration',
      'strategy_id',
      'trade_quality_score',
      'trade_execution_rating',
    ];
    integerFields.forEach((field) => {
      if (data[field] === "") {
        data[field] = null;
      }
    });
    // Calculate net PnL if possible
    let netPnl = 0;
    // If user provided gross_pnl, use it for net_pnl calculation
    if (data.gross_pnl !== "" && !isNaN(Number(data.gross_pnl))) {
      const gross = parseFloat(data.gross_pnl);
      const commission = data.commission_fees !== "" && !isNaN(Number(data.commission_fees)) ? parseFloat(data.commission_fees) : 0;
      netPnl = gross - commission;
    } else if (data.exit_price && data.entry_price && data.position_size && data.trade_direction) {
      netPnl = (parseFloat(data.exit_price) - parseFloat(data.entry_price)) * parseFloat(data.position_size) * (data.trade_direction === "LONG" ? 1 : -1);
    }
    data.net_pnl = netPnl;
    onSubmit(data);
  };

  // Add click handler for the upload area
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Fetch emotions
  useEffect(() => {
    async function fetchEmotions() {
      try {
        const { data, error } = await supabase.from("emotions").select("name");
        if (!error && data) {
          setEmotions(data.map((e: any) => e.name));
        }
      } catch (e) { /* fallback to static */ }
    }
    fetchEmotions();
  }, []);

  // Fetch accounts for dropdown
  const { accounts, loading: accountsLoading, error: accountsError } = useAccounts();

  // Live Net PnL calculation
  useEffect(() => {
    const gross = form.watch("gross_pnl");
    const commission = form.watch("commission_fees");
    const entry = form.watch("entry_price");
    const exit = form.watch("exit_price");
    const size = form.watch("position_size");
    const direction = form.watch("trade_direction");

    let netPnl = 0;
    if (gross !== "" && !isNaN(Number(gross))) {
      netPnl = parseFloat(gross) - (commission !== "" && !isNaN(Number(commission)) ? parseFloat(commission) : 0);
    } else if (exit && entry && size && direction) {
      netPnl = (parseFloat(exit) - parseFloat(entry)) * parseFloat(size) * (direction === "LONG" ? 1 : -1);
      if (commission !== "" && !isNaN(Number(commission))) {
        netPnl -= parseFloat(commission);
      }
    }
    // Only update if value actually changed to avoid infinite loop
    if (form.getValues("net_pnl") !== netPnl) {
      form.setValue("net_pnl", netPnl);
    }
  }, [form.watch("gross_pnl"), form.watch("commission_fees"), form.watch("entry_price"), form.watch("exit_price"), form.watch("position_size"), form.watch("trade_direction")]);

  // Add custom pair handler
  const handleAddCustomPair = async () => {
    if (!user || !customPairInput.trim()) return;
    const newPair = customPairInput.trim().toUpperCase();
    if (!tradingPairs.includes(newPair)) {
      setTradingPairs((prev) => [...prev, newPair]);
      setIsAddingPair(false);
      setCustomPairInput("");
      // Save to DB
      await supabase.from("custom_trading_pairs").insert({ pair: newPair, user_id: user.id });
    }
  };

  // Helper to check if custom pair already exists (case-insensitive)
  const customPairExists = tradingPairs.some(
    (pair) => pair.toLowerCase() === customPairInput.trim().toLowerCase()
  );

  // Remove all images handler
  const handleRemoveAllImages = () => {
    setUploadedImages([]);
    form.setValue("photos", []);
  };

  // After upload, always sync uploadedImages with the permanent URLs in form.photos
  useEffect(() => {
    // Only update if the form's photos field has changed
    const photos = form.watch("photos") || [];
    // If the number of uploadedImages doesn't match, or any url is different, update
    if (
      photos.length !== uploadedImages.length ||
      photos.some((url: string, i: number) => uploadedImages[i]?.url !== url)
    ) {
      setUploadedImages(
        photos.map((url: string, i: number) => ({
          url,
          file: undefined, // We don't need the file after upload
          id: `uploaded-${i}-${url}`,
        }))
      );
    }
  }, [form.watch("photos")]);

  return (
    <FormRoot {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={
          `relative bg-background rounded-xl shadow-xl p-6 max-h-[80vh] w-full flex flex-col gap-6 ` +
          (dropdownOpen ? 'overflow-hidden' : 'overflow-y-auto')
        }
      >
        <h2 className="text-2xl font-bold mb-2 text-center">
          {defaultValues && defaultValues.id ? "Edit Journal Entry" : "New Journal Entry"}
        </h2>
        {/* Trade Details Section */}
        <h3 className="text-lg font-semibold mt-2 mb-1">Trade Details</h3>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Date (40%) */}
          <div className="md:w-2/5 w-full">
          <FormField
            control={form.control}
            name="trade_date"
              rules={{ required: "Date is required" }}
            render={({ field }) => (
                <FormItem>
                  <FormLabel>Date <span className="text-red-500">*</span></FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                          variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                          {field.value ? format(field.value, "yyyy-MM-dd") : "Pick a date"}
                          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                    <PopoverContent className="max-h-[90vh] overflow-y-auto flex flex-col justify-center items-center">
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
          </div>
          {/* Entry Price (30%) */}
          <div className="md:w-3/10 w-full">
            <FormField
              control={form.control}
              name="entry_price"
              rules={{ required: "Entry price is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entry Price <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Entry price" type="number" step="any" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Exit Price (30%) */}
          <div className="md:w-3/10 w-full">
            <FormField
              control={form.control}
              name="exit_price"
              rules={{ required: "Exit price is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exit Price <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Exit price" type="number" step="any" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* Position Size and Trading Pair row (as before) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Position Size */}
          <FormField
            control={form.control}
            name="position_size"
            rules={{ required: "Position size is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position Size <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Position size" type="number" step="any" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Trading Pair */}
          <FormField
            control={form.control}
            name="trade_pair"
            rules={{ required: "Trading pair is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trading Pair <span className="text-red-500">*</span></FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  open={dropdownOpen}
                  onOpenChange={setDropdownOpen}
                >
                  <FormControl>
                    <SelectTrigger className="w-full border rounded-md flex items-center justify-between px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none appearance-none">
                      <SelectValue placeholder="Select trading pair" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent
                    className="shadow-xl border rounded-lg max-h-72 overflow-y-auto w-[var(--radix-select-trigger-width)] mt-1 bg-white"
                    position="popper"
                    side="bottom"
                    align="start"
                    style={{ minWidth: 0 }}
                  >
                    <div className="max-h-72 overflow-y-auto">
                      {/* Sticky header */}
                      <div className="sticky top-0 z-30 bg-white border-b px-3 py-2 text-xs font-semibold text-muted-foreground select-none">
                        Trading Pairs
                      </div>
                      {/* Search bar */}
                      <div className="p-2 border-b">
                        <input
                          type="text"
                          value={pairSearch}
                          onChange={e => setPairSearch(e.target.value)}
                          placeholder="Search pairs..."
                          className="w-full px-2 py-1 border rounded text-xs"
                          autoFocus
                        />
                      </div>
                      {/* List of pairs */}
                      {tradingPairs.filter(pair => pair.toLowerCase().includes(pairSearch.toLowerCase())).map((pair) => {
                        const isCustom = !DEFAULT_PAIRS.includes(pair);
                        return (
                          <SelectItem
                            key={pair}
                            value={pair}
                            className="group flex items-center gap-2 px-4 py-2 rounded cursor-pointer focus:bg-accent focus:text-accent-foreground transition-colors duration-150 hover:bg-accent/60 relative"
                          >
                            <BarChart2 className="w-4 h-4 text-muted-foreground" />
                            <span className="flex-1 text-left">{pair}</span>
                            {/* Checkmark absolutely right-aligned */}
                            <SelectPrimitive.ItemIndicator>
                              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Check className="h-4 w-4 text-primary" />
                              </span>
                            </SelectPrimitive.ItemIndicator>
                            {/* Trash icon for custom pairs, only on hover */}
                            {isCustom && (
                              <button
                                type="button"
                                tabIndex={-1}
                                className="absolute right-9 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 text-destructive"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  setTradingPairs((prev) => prev.filter((p) => p !== pair));
                                  await supabase.from("custom_trading_pairs").delete().eq("pair", pair).eq("user_id", user?.id);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </SelectItem>
                        );
                      })}
                      {/* Divider and Add custom pair action */}
                      <div className="border-t px-3 py-2 flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={customPairInput}
                            onChange={e => setCustomPairInput(e.target.value)}
                            placeholder="Add custom pair"
                            className="flex-1 px-2 py-1 border rounded text-xs"
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomPair(); } }}
                          />
                          <button
                            type="button"
                            className="flex items-center gap-1 text-xs px-2 py-1 bg-primary text-white rounded shadow hover:bg-primary/90 transition"
                            onClick={handleAddCustomPair}
                            disabled={!customPairInput.trim() || customPairExists}
                          >
                            <Plus className="w-4 h-4" /> Add
                          </button>
                        </div>
                        {customPairInput.trim() && customPairExists && (
                          <span className="text-xs text-muted-foreground mt-1">Pair already exists.</span>
                        )}
                      </div>
                    </div>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Trade Meta Section */}
        <h3 className="text-lg font-semibold mt-4 mb-1">Trade Meta</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Show error if present */}
          {accountsError && (
            <div className="mb-2 text-red-600 text-sm font-medium col-span-2">
              {accountsError}
            </div>
          )}
          {/* Account */}
          <FormField
            control={form.control}
            name="account_id"
            rules={{ required: "Account is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={accountsLoading || accounts.length === 0}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={accountsLoading ? "Loading accounts..." : accounts.length === 0 ? "No trading accounts found" : "Select account"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* Only render account options if not loading and not empty */}
                    {(!accountsLoading && accounts.length > 0) && (
                      accounts.map((acc: TradingAccount) => (
                        <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Session */}
          <FormField
            control={form.control}
            name="session"
            rules={{ required: "Session is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Session <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select session" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SESSION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Commission */}
          <FormField
            control={form.control}
            name="commission_fees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commission</FormLabel>
                <FormControl>
                  <Input placeholder="Commission fees" type="number" step="any" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Gross PnL */}
          <FormField
            control={form.control}
            name="gross_pnl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gross PnL</FormLabel>
                <FormControl>
                  <Input placeholder="Gross PnL (optional, overrides auto-calc)" type="number" step="any" {...field} />
                </FormControl>
                <FormMessage />
                <div className="text-xs text-muted-foreground">If you enter a value here, Net PnL will be calculated as Gross PnL minus Commission.</div>
              </FormItem>
            )}
          />
          {/* RR */}
          <FormField
            control={form.control}
            name="risk_reward_ratio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Risk/Reward Ratio</FormLabel>
                <FormControl>
                  <Input placeholder="R/R" type="number" step="any" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Net PnL (calculated) */}
          <FormField
            control={form.control}
            name="net_pnl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Net PnL</FormLabel>
                <FormControl>
                  <Input placeholder="Net PnL (auto)" type="number" step="any" {...field} readOnly />
                </FormControl>
                <FormMessage />
                <div className="text-xs text-muted-foreground">Net PnL is calculated automatically from Gross PnL and Commission, or from entry/exit/size/direction if Gross PnL is not provided.</div>
              </FormItem>
            )}
          />
          {/* Outcome */}
          <FormField
            control={form.control}
            name="trade_outcome"
            rules={{ required: "Outcome is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Outcome <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select outcome" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {OUTCOME_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Psychology Section */}
        <h3 className="text-lg font-semibold mt-4 mb-1">Psychology</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Emotion */}
          <FormField
            control={form.control}
            name="emotions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emotion</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select emotion" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {emotions.map((em) => (
                      <SelectItem key={em} value={em}>{em}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
          )}
          />
          {/* Emotion Reason */}
          <FormField
            control={form.control}
            name="emotion_reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emotion Reason</FormLabel>
                <FormControl>
                  <Input placeholder="Reason for emotion" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
            </div>
        {/* Notes Section */}
        <h3 className="text-lg font-semibold mt-4 mb-1">Notes</h3>
        <div className="grid grid-cols-1 gap-4">
          {/* Notes/summary */}
        <FormField
          control={form.control}
          name="trade_notes"
          render={({ field }) => (
            <FormItem>
                <FormLabel>Notes / Summary</FormLabel>
              <FormControl>
                  <Textarea placeholder="Add notes or summary about this trade..." rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Lessons Learned */}
        <FormField
          control={form.control}
          name="trade_lessons"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lessons Learned</FormLabel>
              <FormControl>
                  <Textarea placeholder="What did you learn from this trade?" rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        {/* Photos Section */}
        <h3 className="text-lg font-semibold mt-4 mb-1">Photos (max 3)</h3>
        <div className="flex flex-col gap-2">
          <div {...getRootProps()} className={cn(
            "border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer relative",
            isDragActive ? "border-primary bg-muted" : "border-muted"
          )}>
            <input {...getInputProps()} accept="image/*" multiple disabled={uploadedImages.length >= 3} />
            <ImageIcon className="w-8 h-8 mb-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {uploadedImages.length < 3 ? "Drag & drop or click to upload (max 3)" : "Maximum 3 images allowed"}
            </span>
            {isUploading && (
              <div className="absolute inset-0 bg-background/70 flex items-center justify-center z-10">
                <Loader2 className="animate-spin w-8 h-8 text-primary" />
              </div>
            )}
          </div>
          {/* Preview grid */}
          <div className="flex gap-2 mt-2">
            {uploadedImages.slice(0, 3).map((img, idx) => (
              <SortableImageItem
                key={img.id}
                url={img.url}
                index={idx}
                onRemove={() => handleRemoveImage(idx)}
                onPreview={handlePreviewImage}
                id={img.id}
              />
            ))}
          </div>
          {uploadedImages.length > 0 && (
            <Button
              type="button"
              variant="outline"
              className="mt-2 self-end"
              onClick={handleRemoveAllImages}
              size="sm"
            >
              Remove All Images
            </Button>
          )}
        </div>
        {/* Save/Cancel Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting || isUploading}>
            Cancel
          </Button>
          <Button type="submit" variant="default" disabled={isSubmitting || isUploading}>
            {isSubmitting || isUploading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </FormRoot>
  );
}
