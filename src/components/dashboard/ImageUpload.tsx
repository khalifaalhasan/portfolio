"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from "@/actions/upload";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  accept?: string;
}

export function ImageUpload({
  value,
  onChange,
  bucket = "portfolio",
  folder = "uploads",
  accept = "image/*",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File terlalu besar (Maks 5MB)");
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", bucket);
      formData.append("folder", folder);

      const result = await uploadFile(formData);

      if (!result.success || !result.url) {
        throw new Error(result.error || "Gagal mengunggah file");
      }

      onChange(result.url);
      toast.success("Berhasil mengunggah file");
      
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Gagal mengunggah file");
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="space-y-4 w-full">
      {value ? (
        <div className="relative rounded-lg border bg-muted/50 overflow-hidden flex items-center justify-center p-2 min-h-[120px]">
          {/* We use a standard img tag because next/image requires configured domains in next.config.js for external domains like Supabase */}
          <div className="relative w-full h-40">
           {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={value} 
              alt="Uploaded file" 
              className="object-contain w-full h-full rounded-md"
            />
          </div>
          <div className="absolute top-2 right-2 flex gap-2">
            <Button 
              type="button" 
              variant="destructive" 
              size="icon" 
              className="h-8 w-8 rounded-full shadow-sm"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer text-muted-foreground group min-h-[120px]"
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm font-medium">Mengunggah...</span>
            </div>
          ) : (
            <>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UploadCloud className="h-5 w-5 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  Klik untuk unggah file
                </p>
                <p className="text-xs mt-1">
                  Mendukung file gambar (Maks 5MB)
                </p>
              </div>
            </>
          )}
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept={accept}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}
