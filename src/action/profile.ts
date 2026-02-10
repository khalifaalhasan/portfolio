"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth/auth"; // Better Auth
import { headers } from "next/headers";
import { profileSchema } from "@/lib/validations/profile"; // Schema Anda

// Kita terima Values langsung (cocok buat React Hook Form)
type ProfileValues = z.infer<typeof profileSchema>;

export async function updateProfileAction(values: ProfileValues) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  // 1. Validasi ulang di server (Safety Net)
  const validated = profileSchema.safeParse(values);
  if (!validated.success) {
    return { error: "Invalid data", details: validated.error.flatten() };
  }

  try {
    // 2. Eksekusi DB (Upsert)
    await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: validated.data,
      create: {
        ...validated.data,
        userId: session.user.id,
      },
    });

    // 3. Revalidate
    revalidatePath("/dashboard/profile");
    revalidatePath("/"); // Update halaman public juga
    
    return { success: true, message: "Profil berhasil diperbarui" };
  } catch (error) {
    console.error("Update Profile Error:", error);
    return { error: "Gagal menyimpan data ke database" };
  }
}