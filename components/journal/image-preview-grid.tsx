"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ZoomIn, ImageIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { SortableImageItem } from "./sortable-image-item";
import { cn } from "@/lib/utils";

interface ImagePreviewGridProps {
  images: Array<{ id: string; url: string }>;
  onReorder: (newOrder: Array<{ id: string; url: string }>) => void;
  onRemove: (id: string) => void;
  className?: string;
}

export function ImagePreviewGrid({
  images,
  onReorder,
  onRemove,
  className,
}: ImagePreviewGridProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((item) => item.id === active.id);
      const newIndex = images.findIndex((item) => item.id === over.id);

      const newOrder = [...images];
      const [movedItem] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, movedItem);

      onReorder(newOrder);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {images.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Chart Images</h4>
            <p className="text-xs text-muted-foreground">
              Drag to reorder • Click to preview
            </p>
          </div>

          <DndContext onDragEnd={handleDragEnd}>
            <SortableContext items={images.map((img) => img.id)}>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {images.map((image, index) => (
                  <SortableImageItem
                    key={image.id}
                    index={index}
                    {...image}
                    onPreview={() => setPreviewUrl(image.url)}
                    onRemove={() => onRemove(image.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
            <DialogContent className="max-w-5xl p-0">
              <div className="relative aspect-[16/9]">
                {previewUrl && (
                  <Image
                    src={previewUrl}
                    alt="Chart preview"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 80vw"
                  />
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => setPreviewUrl(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
