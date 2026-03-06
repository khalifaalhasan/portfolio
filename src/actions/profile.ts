"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function upsertProfile(data: {
  name: string;
  initial: string;
  tagline: string;
  location?: string;
  locationLink?: string;
  description?: string;
  summary?: string;
  avatarUrl: string;
  resumeUrl?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const profile = await prisma.profile.upsert({
    where: { userId },
    update: data,
    create: {
      ...data,
      userId,
    },
  });

  revalidatePath("/dashboard/profile");
  revalidatePath("/");

  return { success: true, profile };
}
