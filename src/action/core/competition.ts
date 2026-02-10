"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { competitionSchema } from "@/lib/validations/competition";
import { createAuthAction } from "@/lib/safe-action";
import z from "zod";

// create compe
export const addCompetitionAction = createAuthAction(
  competitionSchema,
  async (data, session) => {
    await prisma.competition.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/resume");
    return { success: true, message: "Competition successfully added" };
  },
);

const updateCompetitionSchema = competitionSchema.extend({
  id: z.string(),
});

export const updateCompetitionAction = createAuthAction(
  updateCompetitionSchema,
  async (data, session) => {
    const { id, ...values } = data;

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
    return { success: true, message: "Competition was successfully updated" };
  },
);

const deleteCompetitionSchema = z.object({
    id: z.string(),
})

export const deleteCompetitionAction = createAuthAction(
    deleteCompetitionSchema,
    async ({ id }, session) => {
        await prisma.competition.deleteMany({
            where: {
                id,
                userId: session.user.id,
            }
        })

        revalidatePath("/dashboard/resume");
        return {success: true, message: "Competition Deleted"}
    }
)