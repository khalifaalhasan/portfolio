"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { projectSchema } from "@/lib/validations/project"; // Schema Anda

type ProjectValues = z.infer<typeof projectSchema>;

// --- CREATE ---
export async function createProjectAction(values: ProjectValues) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const validated = projectSchema.safeParse(values);
  if (!validated.success) return { error: "Validasi gagal" };

  try {
    await prisma.project.create({
      data: {
        ...validated.data,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/projects");
    return { success: true, message: "Project created" };
  } catch (error) {
    // Handle error unique constraint slug
    return { error: "Gagal membuat project. Pastikan Slug unik." };
  }
}

// --- UPDATE ---
export async function updateProjectAction(id: string, values: ProjectValues) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const validated = projectSchema.safeParse(values);
  if (!validated.success) return { error: "Validasi gagal" };

  try {
    // Cek kepemilikan dulu
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) {
      return { error: "Forbidden" };
    }

    await prisma.project.update({
      where: { id },
      data: validated.data,
    });

    revalidatePath("/dashboard/projects");
    return { success: true, message: "Project updated" };
  } catch (error) {
    return { error: "Gagal update project" };
  }
}

// --- DELETE ---
export async function deleteProjectAction(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new Error("Unauthorized");

  try {
    await prisma.project.deleteMany({
      where: {
        id,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/project");
    return { succes: true, message: "Project Deleted" };
  } catch (error) {
    return { error: "Gagal menghapus data" };
  }
}
