import React, { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Maximize2, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface Screenshot {
  id: number;
  image_url: string;
  description: string | null;
}

interface JournalScreenshotsProps {
  journalId: number;
  screenshots: Screenshot[];
  onDelete: (screenshotId: number) => void;
}

export const JournalScreenshots: React.FC<JournalScreenshotsProps> = ({
  journalId,
  screenshots,
  onDelete,
}) => {
  const { toast } = useToast();
  const [selectedScreenshot, setSelectedScreenshot] =
    useState<Screenshot | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const handleDelete = async (screenshot: Screenshot) => {
    try {
      setIsDeleting(screenshot.id);

      // Delete from database
      const { error } = await supabase
        .from("journal_screenshots")
        .delete()
        .eq("id", screenshot.id);

      if (error) throw error;

      // Delete from storage if URL contains the bucket name
      // This is a simplified approach, in production you'd need more robust file path extraction
      if (screenshot.image_url.includes("journal-screenshots")) {
        const pathParts = screenshot.image_url.split(
          "/storage/v1/object/public/journal-screenshots/"
        );
        if (pathParts.length > 1) {
          const filePath = pathParts[1];
          await supabase.storage.from("journal-screenshots").remove([filePath]);
        }
      }

      toast({
        title: "Screenshot deleted",
        description: "The screenshot has been removed",
      });

      onDelete(screenshot.id);
    } catch (error: any) {
      console.error("Delete error:", error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete screenshot",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
      setSelectedScreenshot(null);
    }
  };

  if (screenshots.length === 0) {
    return null;
  }

  return (
    <div className="my-6">
      <h3 className="text-lg font-medium mb-3">Screenshots</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {screenshots.map((screenshot) => (
          <Card key={screenshot.id} className="overflow-hidden">
            <div className="p-0">
              <div className="relative aspect-video">
                <Image
                  src={screenshot.image_url}
                  alt={screenshot.description || "Journal screenshot"}
                  fill
                  className="object-cover"
                />

                <div className="absolute top-2 right-2 flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                        onClick={() => setSelectedScreenshot(screenshot)}
                      >
                        <Maximize2 className="h-4 w-4" />
                        <span className="sr-only">View full size</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>
                          {selectedScreenshot?.description || "Screenshot"}
                        </DialogTitle>
                        <DialogClose className="absolute right-4 top-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                          </Button>
                        </DialogClose>
                      </DialogHeader>
                      {selectedScreenshot && (
                        <div className="relative w-full aspect-[4/3]">
                          <Image
                            src={selectedScreenshot.image_url}
                            alt={
                              selectedScreenshot.description ||
                              "Journal screenshot"
                            }
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8 rounded-full bg-red-500/80 backdrop-blur-sm"
                    disabled={isDeleting === screenshot.id}
                    onClick={() => handleDelete(screenshot)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete screenshot</span>
                  </Button>
                </div>
              </div>
            </div>
            {screenshot.description && (
              <CardContent className="p-3">
                <p className="text-sm text-muted-foreground truncate">
                  {screenshot.description}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
