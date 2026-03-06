"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createSocialLink(data: {
  platform: string;
  url: string;
  iconKey: string;
  isActive: boolean;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const socialLink = await prisma.socialLink.create({
    data: { ...data, userId: session.user.id },
  });

  revalidatePath("/dashboard/social-links");
  revalidatePath("/");
  return { success: true, socialLink };
}

export async function updateSocialLink(
  id: string,
  data: {
    platform: string;
    url: string;
    iconKey: string;
    isActive: boolean;
  }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const socialLink = await prisma.socialLink.update({
    where: { id, userId: session.user.id },
    data,
  });

  revalidatePath("/dashboard/social-links");
  revalidatePath("/");
  return { success: true, socialLink };
}

export async function deleteSocialLink(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await prisma.socialLink.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/dashboard/social-links");
  revalidatePath("/");
  return { success: true };
}
