"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createProject(data: {
  title: string;
  slug: string;
  content?: string;
  techStack: string[];
  thumbnail: string;
  demoUrl?: string;
  repoUrl?: string;
  isFeatured: boolean;
  categoryIds?: string[];

}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const { categoryIds, ...projectData } = data;

  const project = await prisma.project.create({
    data: { 
      ...projectData, 
      userId: session.user.id,
      categories: categoryIds && categoryIds.length > 0 ? {
        connect: categoryIds.map(id => ({ id }))
      } : undefined
    },
    include: { categories: true },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath("/");
  return { success: true, project };
}

export async function updateProject(
  id: string,
  data: {
    title: string;
    slug: string;
    content?: string;
    techStack: string[];
    thumbnail: string;
    demoUrl?: string;
    repoUrl?: string;
    isFeatured: boolean;
    categoryIds?: string[];
  }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const { categoryIds, ...projectData } = data;

  const project = await prisma.project.update({
    where: { id, userId: session.user.id },
    data: {
      ...projectData,
      categories: categoryIds !== undefined ? {
        set: categoryIds.map(id => ({ id }))
      } : undefined
    },
    include: { categories: true },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath("/");
  return { success: true, project };
}

export async function deleteProject(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await prisma.project.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath("/");
  return { success: true };
}
