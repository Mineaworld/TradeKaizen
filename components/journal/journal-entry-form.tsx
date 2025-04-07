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
  PlusCircle,
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
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import TradeMetricsForm from "./trade-metrics-form";
import { ImageUploader } from "@/components/ui/image-uploader";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import type { Strategy as StrategyType } from "@/types/strategy";
import { Database } from "@/types/supabase";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

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

// Add form validation schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  entry_date: z.date(),
  trade_direction: z.enum(["LONG", "SHORT"], {
    required_error: "Please select a trade direction",
  }),
  entry_price: z.string().min(1, "Entry price is required"),
  exit_price: z.string().min(1, "Exit price is required"),
  position_size: z.string().min(1, "Position size is required"),
  summary: z.string().min(1, "Summary is required"),
  lessons_learned: z.string().optional(),
  strategy_id: z.string().min(1, "Please select a strategy"),
  trading_pair: z.string().min(1, "Please select a trading pair"),
  chart_images: z.array(z.string()).optional(),
  trade_screenshot: z.array(z.string()).optional(),
  stop_loss: z.string().optional(),
  take_profit: z.string().optional(),
  risk_reward_ratio: z.string().optional(),
  risk_per_trade: z.string().optional(),
  commission_fees: z.string().optional(),
  slippage: z.string().optional(),
  trade_quality_score: z.string().optional(),
  market_conditions: z.string().optional(),
  trade_timeframe: z.string().optional(),
  trade_execution_rating: z.string().optional(),
  trade_management_notes: z.string().optional(),
  trade_exit_reason: z.string().optional(),
});

// Define Strategy type if not already defined
interface Strategy {
  id: number;
  name: string;
}

// Define the type for the strategy response
type StrategyResponse = Database["public"]["Tables"]["strategies"]["Row"];

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
  const [tradingPairs, setTradingPairs] = useState<string[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isStrategyModalOpen, setStrategyModalOpen] = useState(false);
  const [isTradingPairModalOpen, setTradingPairModalOpen] = useState(false);
  const [newStrategyName, setNewStrategyName] = useState("");
  const [newTradingPair, setNewTradingPair] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      entry_date: defaultValues?.entry_date
        ? new Date(defaultValues.entry_date)
        : new Date(),
      trade_direction: defaultValues?.trade_direction || "",
      entry_price: defaultValues?.entry_price?.toString() || "",
      exit_price: defaultValues?.exit_price?.toString() || "",
      position_size: defaultValues?.position_size?.toString() || "",
      summary: defaultValues?.summary || "",
      lessons_learned: defaultValues?.lessons_learned || "",
      strategy_id: defaultValues?.strategy_id?.toString() || "",
      trading_pair: defaultValues?.trading_pair || "",
      chart_images: defaultValues?.chart_images || [],
      trade_screenshot: defaultValues?.trade_screenshot || [],
      stop_loss: defaultValues?.stop_loss?.toString() || "",
      take_profit: defaultValues?.take_profit?.toString() || "",
      risk_reward_ratio: defaultValues?.risk_reward_ratio?.toString() || "",
      risk_per_trade: defaultValues?.risk_per_trade?.toString() || "",
      commission_fees: defaultValues?.commission_fees?.toString() || "",
      slippage: defaultValues?.slippage?.toString() || "",
      trade_quality_score: defaultValues?.trade_quality_score?.toString() || "",
      market_conditions: defaultValues?.market_conditions || "",
      trade_timeframe: defaultValues?.trade_timeframe || "",
      trade_execution_rating:
        defaultValues?.trade_execution_rating?.toString() || "",
      trade_management_notes: defaultValues?.trade_management_notes || "",
      trade_exit_reason: defaultValues?.trade_exit_reason || "",
    },
  });

  // Fetch strategies from context or API
  useEffect(() => {
    async function fetchStrategies() {
      const { data, error } = await supabase
        .from("strategies")
        .select("id, name");

      if (!error && data) {
        setStrategies(data);
      }
    }
    fetchStrategies();
  }, []);

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
        const currentImages = form.getValues("chart_images") || [];
        form.setValue("chart_images", [...currentImages, previewUrl]);

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
          .getValues("chart_images")
          .map((url: string) => (url === previewUrl ? publicUrl : url));
        form.setValue("chart_images", updatedImages);
      } catch (error) {
        console.error("Error uploading file:", error);
        // Show error toast or notification here
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
        form.setValue("chart_images", imageUrls);

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
      form.setValue("chart_images", newImageUrls);
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
    onSubmit(data);
  };

  // Add click handler for the upload area
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImagesUploaded = (urls: string[]) => {
    const currentImages = form.getValues("trade_screenshot") || [];
    form.setValue("trade_screenshot", [...currentImages, ...urls]);
  };

  const handleImageRemoved = (url: string) => {
    const currentImages = form.getValues("trade_screenshot") || [];
    form.setValue(
      "trade_screenshot",
      currentImages.filter((img: string) => img !== url)
    );
  };

  // Function to handle creating a new strategy
  const handleCreateStrategy = async () => {
    try {
      const { data, error } = await supabase
        .from("strategies")
        .insert([{ name: newStrategyName }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        // Update strategies list with properly typed data
        setStrategies((prev) => [...prev, { id: data.id, name: data.name }]);

        // Close modal and reset state
        setStrategyModalOpen(false);
        setNewStrategyName("");
      }
    } catch (error) {
      console.error("Error creating strategy:", error);
      toast({
        title: "Error",
        description: "Failed to create strategy. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to handle creating a new trading pair
  const handleCreateTradingPair = async () => {
    try {
      const { data, error } = await supabase
        .from("custom_trading_pairs")
        .insert([{ pair_name: newTradingPair }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        // Update trading pairs list
        setTradingPairs((prev) => [...prev, data.pair_name]);

        // Close modal and reset state
        setTradingPairModalOpen(false);
        setNewTradingPair("");

        toast({
          title: "Success",
          description: "Trading pair created successfully.",
        });
      }
    } catch (error) {
      console.error("Error creating trading pair:", error);
      toast({
        title: "Error",
        description: "Failed to create trading pair. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <FormRoot {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Entry title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Entry Date */}
          <FormField
            control={form.control}
            name="entry_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
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

          {/* Strategy Selection */}
          <FormField
            control={form.control}
            name="strategy_id"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Strategy</FormLabel>
                <Select
                  onValueChange={(value) => {
                    if (value === "create-new") {
                      setStrategyModalOpen(true);
                      return;
                    }
                    field.onChange(value);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a strategy" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {strategies.length === 0 ? (
                      <div className="p-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full mt-2" />
                        <Skeleton className="h-5 w-full mt-2" />
                      </div>
                    ) : (
                      <>
                        {strategies.map((strategy) => (
                          <SelectItem
                            key={strategy.id}
                            value={strategy.id.toString()}
                          >
                            {strategy.name}
                          </SelectItem>
                        ))}
                        <Separator className="my-2" />
                        <button
                          className="w-full flex items-center gap-2 p-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground relative cursor-default select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                          onClick={(e) => {
                            e.preventDefault();
                            setStrategyModalOpen(true);
                          }}
                        >
                          <PlusCircle className="h-4 w-4" />
                          Create New Strategy
                        </button>
                      </>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Trade Direction */}
          <FormField
            control={form.control}
            name="trade_direction"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Trade Direction</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select direction">
                        {field.value === "LONG" && (
                          <div className="flex items-center gap-2">
                            <ArrowUp className="w-4 h-4 text-green-500" />
                            Long
                          </div>
                        )}
                        {field.value === "SHORT" && (
                          <div className="flex items-center gap-2">
                            <ArrowDown className="w-4 h-4 text-red-500" />
                            Short
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="LONG">
                      <div className="flex items-center gap-2">
                        <ArrowUp className="w-4 h-4 text-green-500" />
                        Long
                      </div>
                    </SelectItem>
                    <SelectItem value="SHORT">
                      <div className="flex items-center gap-2">
                        <ArrowDown className="w-4 h-4 text-red-500" />
                        Short
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Entry Price */}
          <FormField
            control={form.control}
            name="entry_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entry Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Entry price"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Exit Price */}
          <FormField
            control={form.control}
            name="exit_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exit Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Exit price"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Position Size */}
          <FormField
            control={form.control}
            name="position_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position Size</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Position size"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Trading Pair Selection */}
          <FormField
            control={form.control}
            name="trading_pair"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Trading Pair</FormLabel>
                <Select
                  onValueChange={(value) => {
                    if (value === "create-new") {
                      setTradingPairModalOpen(true);
                      return;
                    }
                    field.onChange(value);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select trading pair" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tradingPairs.length === 0 ? (
                      <div className="p-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full mt-2" />
                      </div>
                    ) : (
                      <>
                        {tradingPairs.map((pair) => (
                          <SelectItem key={pair} value={pair}>
                            {pair}
                          </SelectItem>
                        ))}
                        <Separator className="my-2" />
                        <button
                          className="w-full flex items-center gap-2 p-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground relative cursor-default select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                          onClick={(e) => {
                            e.preventDefault();
                            setTradingPairModalOpen(true);
                          }}
                        >
                          <PlusCircle className="h-4 w-4" />
                          Create New Trading Pair
                        </button>
                      </>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Replace old image upload with new ImageUploader */}
        <FormField
          control={form.control}
          name="trade_screenshot"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chart Screenshots</FormLabel>
              <FormControl>
                <ImageUploader
                  existingImages={field.value || []}
                  onImagesUploaded={handleImagesUploaded}
                  onImageRemoved={handleImageRemoved}
                  maxImages={5}
                  className="mt-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Trade Summary */}
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your trade and thoughts"
                  className="h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Lessons Learned */}
        <FormField
          control={form.control}
          name="lessons_learned"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lessons Learned</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What did you learn from this trade?"
                  className="h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Add Trade Metrics Form */}
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-6">Trade Metrics</h2>
          <TradeMetricsForm />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Entry"
            )}
          </Button>
        </div>
      </form>

      {/* Strategy Creation Modal */}
      <Dialog open={isStrategyModalOpen} onOpenChange={setStrategyModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Create New Strategy</DialogTitle>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Strategy Name</Label>
              <Input
                id="name"
                placeholder="Enter strategy name"
                value={newStrategyName}
                onChange={(e) => setNewStrategyName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setStrategyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateStrategy}
              disabled={!newStrategyName.trim()}
            >
              Create Strategy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Trading Pair Creation Modal */}
      <Dialog
        open={isTradingPairModalOpen}
        onOpenChange={setTradingPairModalOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Create New Trading Pair</DialogTitle>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="pair">Trading Pair</Label>
              <Input
                id="pair"
                placeholder="e.g., BTC/USD"
                value={newTradingPair}
                onChange={(e) => setNewTradingPair(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setTradingPairModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateTradingPair}
              disabled={!newTradingPair.trim()}
            >
              Create Trading Pair
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormRoot>
  );
}
