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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
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
import { supabase } from "@/lib/supabase";
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
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const form = useForm({
    defaultValues: {
      title: defaultValues?.title || "",
      entry_date: defaultValues?.entry_date
        ? new Date(defaultValues.entry_date)
        : new Date(),
      trade_direction: defaultValues?.trade_direction || "",
      entry_price: defaultValues?.entry_price || "",
      exit_price: defaultValues?.exit_price || "",
      position_size: defaultValues?.position_size || "",
      summary: defaultValues?.summary || "",
      lessons_learned: defaultValues?.lessons_learned || "",
      strategy_id: defaultValues?.strategy_id || "",
      trading_pair: defaultValues?.trading_pair || "",
      chart_images: defaultValues?.chart_images || [],
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

  // Handle image upload
  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;

    setIsUploading(true);
    const newImages: typeof uploadedImages = [];

    for (const file of acceptedFiles) {
      try {
        // Create temporary preview URL for immediate display
        const previewUrl = URL.createObjectURL(file);
        const imageId = Math.random().toString(36).substring(7);

        newImages.push({
          url: previewUrl,
          file,
          id: imageId,
        });

        // Start the actual upload in the background
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${imageId}.${fileExt}`;
        const filePath = `journal-images/${fileName}`;

        // Add to form values immediately with temporary URL
        const currentImages = form.getValues("chart_images") || [];
        form.setValue("chart_images", [...currentImages, previewUrl]);

        // Upload to Supabase in the background
        const { error: uploadError, data } = await supabase.storage
          .from("trading-images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("trading-images").getPublicUrl(filePath);

        // Update with permanent URL once upload completes
        setUploadedImages((prev) =>
          prev.map((img) =>
            img.url === previewUrl ? { ...img, url: publicUrl } : img
          )
        );

        // Update form value with permanent URL
        const updatedImages = form
          .getValues("chart_images")
          .map((url: string) => (url === previewUrl ? publicUrl : url));
        form.setValue("chart_images", updatedImages);
      } catch (error) {
        console.error("Error uploading file:", error);
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

  // Handle image removal
  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    const currentImages = form.getValues("chart_images") || [];
    form.setValue(
      "chart_images",
      currentImages.filter(
        (_: unknown, index: number) => index !== indexToRemove
      )
    );
  };

  // Handle form submission
  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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

          {/* Strategy - With proper error handling */}
          <FormField
            control={form.control}
            name="strategy_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Strategy</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a strategy" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isStrategiesLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading strategies...
                      </SelectItem>
                    ) : Array.isArray(strategies) && strategies.length > 0 ? (
                      strategies.map((strategy) => (
                        <SelectItem key={strategy.id} value={strategy.id}>
                          {strategy.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No strategies available
                      </SelectItem>
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
              <FormItem>
                <FormLabel>Trade Direction</FormLabel>
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
              <FormItem>
                <FormLabel>Trading Pair</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trading pair" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tradingPairs.map((pair) => (
                      <SelectItem key={pair} value={pair}>
                        {pair}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Enhanced Image Upload Section */}
          <div className="space-y-4">
            <FormLabel>Chart Images</FormLabel>
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                isDragActive ? "border-primary bg-primary/5" : "border-muted",
                "hover:border-primary hover:bg-primary/5"
              )}
            >
              <input {...getInputProps()} ref={fileInputRef} />
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Uploading images...
                  </p>
                </div>
              ) : (
                <>
                  <ImageIcon className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">
                    Drag & drop chart images here
                  </p>
                  <p className="text-xs text-muted-foreground">
                    or click to select files (PNG, JPG, GIF)
                  </p>
                </>
              )}
            </div>

            {/* Reorderable Image Preview Grid */}
            {uploadedImages.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium">Uploaded Images</h4>
                  <p className="text-xs text-muted-foreground">
                    Drag to reorder • Click to preview
                  </p>
                </div>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToParentElement]}
                >
                  <SortableContext
                    items={uploadedImages.map((img) => img.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                      {uploadedImages.map((image, index) => (
                        <SortableImageItem
                          key={image.id}
                          id={image.id}
                          url={image.url}
                          index={index}
                          onRemove={handleRemoveImage}
                          onPreview={(url) => setPreviewImage(url)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}

            {/* Image Preview Dialog */}
            <Dialog
              open={!!previewImage}
              onOpenChange={() => setPreviewImage(null)}
            >
              <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] p-0 overflow-hidden">
                {previewImage && (
                  <div className="relative w-full h-[80vh]">
                    <Image
                      src={previewImage}
                      alt="Chart preview"
                      fill
                      className="object-contain"
                      sizes="90vw"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => setPreviewImage(null)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

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
            {isSubmitting ? "Saving..." : "Save Entry"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
