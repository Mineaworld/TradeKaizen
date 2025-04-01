"use client";

import NextImage, { ImageProps as NextImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";

interface ImageProps extends NextImageProps {
  fallback?: React.ReactNode;
}

export function Image({
  className,
  fallback,
  alt,
  onError,
  ...props
}: ImageProps) {
  const [error, setError] = useState(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setError(true);
    if (onError) onError(e);
  };

  if (error && fallback) {
    return <>{fallback}</>;
  }

  if (error) {
    return (
      <div
        className={cn("flex items-center justify-center bg-muted", className)}
      >
        <div className="flex flex-col items-center justify-center text-muted-foreground p-4">
          <ImageOff className="h-10 w-10 mb-2" />
          <p className="text-xs">{alt || "Image failed to load"}</p>
        </div>
      </div>
    );
  }

  return (
    <NextImage
      className={className}
      alt={alt || ""}
      onError={handleError}
      {...props}
    />
  );
}
