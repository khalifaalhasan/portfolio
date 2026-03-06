"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { ThemePreference } from "@prisma/client";

export async function upsertSiteConfig(data: {
  themePreference: ThemePreference;
  seoTitle: string;
  seoDescription?: string;
  seoKeywords: string[];
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const siteConfig = await prisma.siteConfig.upsert({
    where: { userId },
    update: data,
    create: {
      ...data,
      userId,
    },
  });

  revalidatePath("/dashboard/site-config");
  revalidatePath("/");

  return { success: true, siteConfig };
}
