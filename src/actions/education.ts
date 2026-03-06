"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

type EducationData = {
  institution: string;
  degree: string;
  period: string;
  description?: string;
  logoUrl?: string;
};

export async function createEducation(data: EducationData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const education = await prisma.education.create({
    data: { ...data, userId: session.user.id },
  });

  revalidatePath("/dashboard/education");
  revalidatePath("/");
  return { success: true, education };
}

export async function updateEducation(id: string, data: EducationData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const education = await prisma.education.update({
    where: { id, userId: session.user.id },
    data,
  });

  revalidatePath("/dashboard/education");
  revalidatePath("/");
  return { success: true, education };
}

export async function deleteEducation(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await prisma.education.delete({ where: { id, userId: session.user.id } });

  revalidatePath("/dashboard/education");
  revalidatePath("/");
  return { success: true };
}
