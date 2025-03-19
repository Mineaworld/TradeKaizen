import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";

interface JournalScreenshotUploaderProps {
  journalId?: number;
  onUploadComplete: (screenshot: {
    id: number;
    image_url: string;
    description: string | null;
  }) => void;
}

export const JournalScreenshotUploader: React.FC<
  JournalScreenshotUploaderProps
> = ({ journalId, onUploadComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    setSelectedFile(file);
  };

  const clearSelection = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setDescription("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadScreenshot = async () => {
    if (!user || !selectedFile || !journalId) {
      toast({
        title: "Error",
        description: "Cannot upload screenshot at this time",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Generate unique filename
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Math.random()
        .toString(36)
        .substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("journal-screenshots")
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from("journal-screenshots")
        .getPublicUrl(filePath);

      if (!publicUrlData.publicUrl) throw new Error("Failed to get public URL");

      // Insert record into journal_screenshots table
      const { data: screenshotData, error: dbError } = await supabase
        .from("journal_screenshots")
        .insert({
          journal_id: journalId,
          image_url: publicUrlData.publicUrl,
          description: description || null,
        })
        .select("*")
        .single();

      if (dbError) throw dbError;

      toast({
        title: "Upload successful",
        description: "Screenshot has been added to your journal",
      });

      // Notify parent component
      onUploadComplete(screenshotData);
      clearSelection();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload screenshot",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-background">
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="screenshot">Add Screenshot</Label>
        <div className="flex items-center gap-2 mt-1.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex-1"
          >
            <Upload className="mr-2 h-4 w-4" />
            Select Image
          </Button>
          <Input
            ref={fileInputRef}
            id="screenshot"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="default"
            onClick={uploadScreenshot}
            disabled={!selectedFile || uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>

      {previewUrl && (
        <div className="relative">
          <div className="relative aspect-video w-full overflow-hidden rounded-md border">
            <Image
              src={previewUrl}
              alt="Screenshot preview"
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={clearSelection}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear selection</span>
          </Button>
        </div>
      )}

      {selectedFile && (
        <Textarea
          placeholder="Add a description for this screenshot (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={uploading}
        />
      )}
    </div>
  );
};
