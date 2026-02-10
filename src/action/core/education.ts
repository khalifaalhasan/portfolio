"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { educationSchema } from "@/lib/validations/education";
import { createAuthAction } from "@/lib/safe-action"; // Import wrapper kita

// --- CREATE ---
export const addEducationAction = createAuthAction(
  educationSchema, // Schema validasi
  async (data, session) => {
    // Logic utama (session & data sudah aman)
    await prisma.education.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/resume");
    return { success: true, message: "Education successfully added" };
  },
);

// --- UPDATE ---
// Kita butuh schema baru yang menggabungkan data education + ID untuk update
const updateEducationSchema = educationSchema.extend({
  id: z.string(),
});

export const updateEducationAction = createAuthAction(
  updateEducationSchema,
  async (data, session) => {
    // Pisahkan ID dari sisa data
    const { id, ...values } = data;

    // Gunakan updateMany untuk keamanan (Cek ID dan UserID sekaligus)
    const result = await prisma.education.updateMany({
      where: {
        id: id,
        userId: session.user.id,
      },
      data: values,
    });

    if (result.count === 0) {
      return { error: "Data not found or not yours" };
    }

    revalidatePath("/dashboard/resume");
    return { success: true, message: "Education was successfully updated" };
  },
);

// --- DELETE ---
// Schema khusus delete (cuma butuh ID)
const deleteEducationSchema = z.object({
  id: z.string(),
});

export const deleteEducationAction = createAuthAction(
  deleteEducationSchema,
  async ({ id }, session) => {
    // Logic delete aman
    await prisma.education.deleteMany({
      where: {
        id,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/resume");
    return { success: true, message: "Education Deleted" };
  },
);
