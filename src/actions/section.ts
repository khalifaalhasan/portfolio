"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { SectionSource, HeaderStyle } from "@prisma/client";

export async function createSection(data: {
  contentSource: SectionSource;
  orderIndex: number;
  isVisible: boolean;
  headerStyle: HeaderStyle;
  heading: string;
  subHeading?: string;
  badgeText?: string;
  description?: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const section = await prisma.section.create({
    data: { ...data, userId: session.user.id },
  });

  revalidatePath("/dashboard/sections");
  revalidatePath("/");
  return { success: true, section };
}

export async function updateSection(
  id: string,
  data: {
    contentSource: SectionSource;
    orderIndex: number;
    isVisible: boolean;
    headerStyle: HeaderStyle;
    heading: string;
    subHeading?: string;
    badgeText?: string;
    description?: string;
  }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const section = await prisma.section.update({
    where: { id, userId: session.user.id },
    data,
  });

  revalidatePath("/dashboard/sections");
  revalidatePath("/");
  return { success: true, section };
}

export async function deleteSection(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await prisma.section.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/dashboard/sections");
  revalidatePath("/");
  return { success: true };
}
