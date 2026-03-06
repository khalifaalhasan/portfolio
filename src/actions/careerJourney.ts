"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { CareerCategory } from "@prisma/client";

type CareerData = {
  category: CareerCategory;
  place: string;
  role: string;
  period: string;
  description?: string;
  location?: string;
  logoUrl?: string;
};

export async function createCareerJourney(data: CareerData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const career = await prisma.careerJourney.create({
    data: { ...data, userId: session.user.id },
  });

  revalidatePath("/dashboard/career");
  revalidatePath("/");
  return { success: true, career };
}

export async function updateCareerJourney(id: string, data: CareerData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const career = await prisma.careerJourney.update({
    where: { id, userId: session.user.id },
    data,
  });

  revalidatePath("/dashboard/career");
  revalidatePath("/");
  return { success: true, career };
}

export async function deleteCareerJourney(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await prisma.careerJourney.delete({ where: { id, userId: session.user.id } });

  revalidatePath("/dashboard/career");
  revalidatePath("/");
  return { success: true };
}
