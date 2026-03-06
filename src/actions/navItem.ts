"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { NavType } from "@prisma/client";

export async function createNavItem(data: {
  type: NavType;
  orderIndex: number;
  label: string;
  iconKey: string;
  targetValue?: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const navItem = await prisma.navItem.create({
    data: { ...data, userId: session.user.id },
  });

  revalidatePath("/dashboard/nav-items");
  revalidatePath("/");
  return { success: true, navItem };
}

export async function updateNavItem(
  id: string,
  data: {
    type: NavType;
    orderIndex: number;
    label: string;
    iconKey: string;
    targetValue?: string;
  }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const navItem = await prisma.navItem.update({
    where: { id, userId: session.user.id },
    data,
  });

  revalidatePath("/dashboard/nav-items");
  revalidatePath("/");
  return { success: true, navItem };
}

export async function deleteNavItem(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await prisma.navItem.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/dashboard/nav-items");
  revalidatePath("/");
  return { success: true };
}
