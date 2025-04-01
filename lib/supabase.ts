import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a custom client for browser usage with proper content security
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storageKey: "tradekaizen-auth-storage-key",
  },
  global: {
    headers: {
      "x-client-info": `TradeKaizen/${
        process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"
      }`,
    },
  },
});

// Helper function to optimize image before upload
async function optimizeImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      // Max dimensions
      const MAX_WIDTH = 2000;
      const MAX_HEIGHT = 2000;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > height) {
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = Math.round((width * MAX_HEIGHT) / height);
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Use better quality settings
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob"));
          }
        },
        "image/jpeg",
        0.85 // Adjust quality (0.85 is a good balance)
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

// Export storage helper specifically for images
export const storageHelper = {
  async uploadImage(
    file: File,
    folder: string = "journal-images"
  ): Promise<string> {
    try {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        throw new Error("File must be an image");
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size must be less than 5MB");
      }

      // Generate a unique file path
      const fileExt = "jpg"; // We'll convert everything to JPG
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Optimize image
      const optimizedImage = await optimizeImage(file);

      // Upload the optimized file
      const { error: uploadError, data } = await supabase.storage
        .from("trading-images")
        .upload(filePath, optimizedImage, {
          cacheControl: "31536000", // 1 year cache
          contentType: "image/jpeg",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(
          uploadError.message || "An error occurred while uploading the image"
        );
      }

      // Get public URL - fixed error handling
      const {
        data: { publicUrl },
      } = supabase.storage.from("trading-images").getPublicUrl(filePath);

      if (!publicUrl) {
        throw new Error("Failed to get public URL for uploaded image");
      }

      return publicUrl;
    } catch (error) {
      console.error("Error in uploadImage:", error);
      throw error instanceof Error
        ? error
        : new Error("An unknown error occurred while uploading the image");
    }
  },

  async deleteImage(url: string): Promise<void> {
    try {
      // Extract the path from the URL
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");
      const bucket = pathParts[pathParts.length - 3];
      const filePath = pathParts.slice(-2).join("/");

      if (bucket !== "trading-images") {
        throw new Error("Invalid bucket in image URL");
      }

      const { error } = await supabase.storage
        .from("trading-images")
        .remove([filePath]);

      if (error) {
        console.error("Delete error:", error);
        throw new Error(
          error.message || "An error occurred while deleting the image"
        );
      }
    } catch (error) {
      console.error("Error in deleteImage:", error);
      throw error instanceof Error
        ? error
        : new Error("An unknown error occurred while deleting the image");
    }
  },
};
