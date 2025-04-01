"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X, Upload, ZoomIn, ImageIcon } from "lucide-react";
import Image from "next/image";
import { storageHelper } from "@/lib/supabase";
import { Button } from "./button";
import { Dialog, DialogContent } from "./dialog";
import { useToast } from "./use-toast";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onImagesUploaded: (urls: string[]) => void;
  onImageRemoved: (url: string) => void;
  existingImages?: string[];
  maxImages?: number;
  className?: string;
}

export function ImageUploader({
  onImagesUploaded,
  onImageRemoved,
  existingImages = [],
  maxImages = 5,
  className,
}: ImageUploaderProps) {
  const [uploadingImages, setUploadingImages] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Check if we would exceed max images
      if (existingImages.length + acceptedFiles.length > maxImages) {
        toast({
          title: "Too many images",
          description: `You can only upload up to ${maxImages} images`,
          variant: "destructive",
        });
        return;
      }

      setUploadingImages(acceptedFiles);

      try {
        const uploadPromises = acceptedFiles.map((file) =>
          storageHelper.uploadImage(file, "trading-images")
        );
        const urls = await Promise.all(uploadPromises);
        onImagesUploaded(urls);
        toast({
          title: "Success",
          description: "Images uploaded successfully",
        });
      } catch (error) {
        toast({
          title: "Error uploading images",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive",
        });
      } finally {
        setUploadingImages([]);
      }
    },
    [existingImages.length, maxImages, onImagesUploaded, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <div className={cn("space-y-4", className)}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50",
          "relative"
        )}
      >
        <input {...getInputProps()} />
        <motion.div
          className="flex flex-col items-center justify-center gap-2 text-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <Upload className="w-10 h-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? "Drop your images here"
              : "Drag & drop images here, or click to select"}
          </p>
          <p className="text-xs text-muted-foreground/75">
            Maximum {maxImages} images, up to 5MB each
          </p>
        </motion.div>

        {/* Upload Progress Overlay */}
        <AnimatePresence>
          {uploadingImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg"
            >
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm">
                  Uploading {uploadingImages.length} image
                  {uploadingImages.length > 1 ? "s" : ""}...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Image Preview Grid */}
      {existingImages.length > 0 && (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          {existingImages.map((url, index) => (
            <motion.div
              key={url}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative aspect-square rounded-lg overflow-hidden group border border-muted"
            >
              <Image
                src={url}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => setPreviewImage(url)}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => onImageRemoved(url)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="absolute top-2 left-2 bg-black/50 text-white rounded px-2 py-1 text-xs">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
          {previewImage && (
            <div className="relative w-full h-full">
              <Image
                src={previewImage}
                alt="Preview"
                fill
                className="object-contain"
                sizes="80vw"
                priority
              />
              <Button
                size="icon"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => setPreviewImage(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
