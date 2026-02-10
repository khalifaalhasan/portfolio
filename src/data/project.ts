import "server-only";
import prisma from "@/lib/prisma";
import { cache } from "react";

export const getProjects = cache(async (userId: string) => {
  try {
    return await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    return [];
  }
});

export const getProjectById = cache(async (id: string) => {
  try {
    return await prisma.project.findUnique({ where: { id } });
  } catch (error) {
    return null;
  }
});