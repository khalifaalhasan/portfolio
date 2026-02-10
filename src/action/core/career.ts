"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { careerJourneySchema } from "@/lib/validations/career"; // Pastikan path schema career benar
import { createAuthAction } from "@/lib/safe-action";

// --- CREATE ---
export const addCareerAction = createAuthAction(
  careerJourneySchema,
  async (data, session) => {
    // Logic utama create
    await prisma.careerJourney.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/resume");
    return { success: true, message: "Career journey successfully added" };
  },
);

// --- UPDATE ---
// Extend schema untuk butuh ID saat update
const updateCareerJourneySchema = careerJourneySchema.extend({
  id: z.string(),
});

export const updateCareerAction = createAuthAction(
  updateCareerJourneySchema,
  async (data, session) => {
    // Pisahkan ID dari values
    const { id, ...values } = data;

    // Gunakan updateMany untuk keamanan (Cek ID & UserID sekaligus)
    const result = await prisma.careerJourney.updateMany({
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
    return { success: true, message: "Career journey successfully updated" };
  },
);

// --- DELETE ---
// Schema khusus delete
const deleteCareerJourneySchema = z.object({
  id: z.string(),
});

export const deleteCareerAction = createAuthAction(
  deleteCareerJourneySchema,
  async ({ id }, session) => {
    // Logic delete aman
    await prisma.careerJourney.deleteMany({
      where: {
        id,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/resume");
    return { success: true, message: "Career journey deleted" };
  },
);