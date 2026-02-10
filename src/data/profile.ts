import "server-only"; // Pastikan ini hanya jalan di server
import prisma from "@/lib/prisma";
import { cache } from "react";

// Cache deduping: aman dipanggil berkali-kali di layout/page
export const getProfile = cache(async (userId: string) => {
  try {
    return await prisma.profile.findUnique({
      where: { userId },
    });
  } catch (error) {
    console.error("DB Error:", error);
    return null;
  }
});