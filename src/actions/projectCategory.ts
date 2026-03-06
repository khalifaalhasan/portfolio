"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getProjectCategories() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return prisma.projectCategory.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
  });
}

export async function createProjectCategory(name: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const category = await prisma.projectCategory.create({
    data: {
      name,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard/project-categories");
  return { success: true, category };
}

export async function updateProjectCategory(id: string, name: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const category = await prisma.projectCategory.update({
    where: { id, userId: session.user.id },
    data: { name },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard/project-categories");
  return { success: true, category };
}

export async function deleteProjectCategory(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await prisma.projectCategory.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard/project-categories");
  return { success: true };
}
