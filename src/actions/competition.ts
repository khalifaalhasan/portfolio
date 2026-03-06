"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

type CompetitionData = {
  title: string;
  organizer: string;
  dateDisplay: string;
  description?: string;
  websiteUrl?: string;
  repoUrl?: string;
};

export async function createCompetition(data: CompetitionData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const competition = await prisma.competition.create({
    data: { ...data, userId: session.user.id },
  });

  revalidatePath("/dashboard/competitions");
  revalidatePath("/");
  return { success: true, competition };
}

export async function updateCompetition(id: string, data: CompetitionData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const competition = await prisma.competition.update({
    where: { id, userId: session.user.id },
    data,
  });

  revalidatePath("/dashboard/competitions");
  revalidatePath("/");
  return { success: true, competition };
}

export async function deleteCompetition(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await prisma.competition.delete({ where: { id, userId: session.user.id } });

  revalidatePath("/dashboard/competitions");
  revalidatePath("/");
  return { success: true };
}
