import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, X, Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

interface JournalScreenshotUploadProps {
  journalId: number;
  onUploadComplete: (imageUrl: string, description: string) => void;
}

export const JournalScreenshotUpload: React.FC<
  JournalScreenshotUploadProps
> = ({ journalId, onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleUpload = async () => {
    if (!file || !journalId) return;

    setIsUploading(true);
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      // Create unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("journal-screenshots")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("journal-screenshots")
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;

      // Save screenshot info in the database
      const { error: dbError } = await supabase
        .from("journal_screenshots")
        .insert({
          journal_id: journalId,
          image_url: imageUrl,
          description,
        });

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Screenshot uploaded",
        description: "Your screenshot has been added to the journal entry",
      });

      // Reset form
      setFile(null);
      setPreview(null);
      setDescription("");

      // Notify parent component
      onUploadComplete(imageUrl, description);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload screenshot",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Add Screenshot</h3>
            {preview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove screenshot</span>
              </Button>
            )}
          </div>

          {!preview ? (
            <div className="grid w-full items-center gap-4">
              <Label htmlFor="screenshot" className="text-sm font-medium">
                Upload Chart or Screenshot
              </Label>
              <div className="flex items-center gap-4">
                <div className="grid flex-1 gap-2">
                  <Input
                    id="screenshot"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="h-10"
                  />
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG or GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative aspect-video overflow-hidden rounded-md border">
              <Image
                src={preview}
                alt="Screenshot preview"
                fill
                className="object-cover"
              />
            </div>
          )}

          {file && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Add a description for this screenshot..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="resize-none"
                  rows={2}
                />
              </div>

              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Screenshot
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
