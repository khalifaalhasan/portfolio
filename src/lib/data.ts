/**
 * lib/data.ts
 * Server-side data fetching layer — queries the first user in the DB.
 * Adjust getUserId() if you have multi-user logic.
 */
import prisma from "@/lib/prisma";

async function getFirstUserId(): Promise<string | null> {
  const user = await prisma.user.findFirst({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });
  return user?.id ?? null;
}

export async function getProfile() {
  const userId = await getFirstUserId();
  if (!userId) return null;
  return prisma.profile.findUnique({ where: { userId } });
}

export async function getSiteConfig() {
  const userId = await getFirstUserId();
  if (!userId) return null;
  return prisma.siteConfig.findUnique({ where: { userId } });
}

export async function getSocialLinks() {
  const userId = await getFirstUserId();
  if (!userId) return [];
  return prisma.socialLink.findMany({
    where: { userId, isActive: true },
    orderBy: { platform: "asc" },
  });
}

export async function getNavItems() {
  const userId = await getFirstUserId();
  if (!userId) return [];
  return prisma.navItem.findMany({
    where: { userId },
    orderBy: { orderIndex: "asc" },
  });
}

export async function getSections() {
  const userId = await getFirstUserId();
  if (!userId) return [];
  return prisma.section.findMany({
    where: { userId, isVisible: true },
    orderBy: { orderIndex: "asc" },
  });
}

export async function getProjects() {
  const userId = await getFirstUserId();
  if (!userId) return [];
  return prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getFeaturedProjects() {
  const userId = await getFirstUserId();
  if (!userId) return [];
  return prisma.project.findMany({
    where: { userId, isFeatured: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCompetitions() {
  const userId = await getFirstUserId();
  if (!userId) return [];
  return prisma.competition.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCareerJourneys() {
  const userId = await getFirstUserId();
  if (!userId) return [];
  return prisma.careerJourney.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getEducations() {
  const userId = await getFirstUserId();
  if (!userId) return [];
  return prisma.education.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
