import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { ZoomIn, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableImageItemProps {
  id: string;
  url: string;
  index: number;
  onPreview: () => void;
  onRemove: () => void;
}

export function SortableImageItem({
  id,
  url,
  index,
  onPreview,
  onRemove,
}: SortableImageItemProps) {
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
  };

  // Simplify to direct event handlers without refs
  const handlePreviewClick = () => {
    onPreview();
  };

  const handleRemoveClick = () => {
    onRemove();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative aspect-[4/3] rounded-lg overflow-hidden border",
        isDragging ? "border-primary" : "border-muted",
        "hover:border-primary transition-all duration-200"
      )}
      {...attributes}
    >
      {/* Drag handle */}
      <div
        {...listeners}
        className="absolute top-0 left-0 right-0 h-6 cursor-grab active:cursor-grabbing z-20"
      />

      {/* Image container */}
      <div className="relative h-full w-full">
        <Image
          src={url}
          alt={`Chart ${index + 1}`}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onClick={handlePreviewClick}
        />

        {/* Button overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3 z-10">
          {/* Preview button - explicitly separated from the image click handler */}
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              handlePreviewClick();
            }}
            className="shadow-md hover:scale-105 transition-transform bg-white text-black hover:bg-white/90"
          >
            <ZoomIn className="h-4 w-4 mr-1" />
            View
          </Button>

          {/* Delete button - explicitly separated */}
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveClick();
            }}
            className="shadow-md hover:scale-105 transition-transform"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      {/* Number badge */}
      <div className="absolute top-2 left-2 bg-black/70 text-white rounded-full px-3 py-1 text-xs font-medium z-30">
        {index + 1}
      </div>
    </div>
  );
}
