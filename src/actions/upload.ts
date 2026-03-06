"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

export async function uploadFile(formData: FormData) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session) {
      throw new Error("Unauthorized");
    }

    const file = formData.get("file") as File;
    const bucket = formData.get("bucket") as string || "portfolio";
    const folder = formData.get("folder") as string || "uploads";

    if (!file) {
      throw new Error("No file provided");
    }

    // Convert file to buffer for Supabase API on the server
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(`Supabase upload error: ${error.message}`);
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { success: true, url: publicUrlData.publicUrl };
  } catch (error: any) {
    console.error("Upload error:", error);
    return { success: false, error: error.message || "Failed to upload file" };
  }
}
