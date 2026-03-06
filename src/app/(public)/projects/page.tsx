import BlurFadeText from "@/components/magicui/blur-fade-text";
import { getProjects } from "@/lib/data";
import prisma from "@/lib/prisma";
import ProjectsPageClient from "@/components/section/projects-page-client";

const BLUR_FADE_DELAY = 0.04;

export default async function ProjectsPage() {
  const allProjects = await getProjects();
  // Ensure we get categories since getProjects might not include them by default
  // Let's actually fetch them here.
  const projectsWithCategories = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { categories: true },
  });

  const allCategories = await prisma.projectCategory.findMany({
    orderBy: { name: "asc" },
  });

  // Filter categories to only include those that have at least one project assigned to them
  const activeCategories = allCategories.filter((category) => {
    return projectsWithCategories.some((project) =>
      project.categories.some((cat) => cat.id === category.id)
    );
  });

  return (
    <main className="min-h-dvh flex flex-col gap-10 relative pt-8 md:pt-8 lg:pt-8 mb-20 max-w-5xl mx-auto px-4 md:px-8">
      <section id="projects-header">
        <div className="flex flex-col gap-y-4 items-center justify-center text-center">
          <BlurFadeText
            delay={BLUR_FADE_DELAY}
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-balance"
            yOffset={8}
            text="My Projects"
          />
          <BlurFadeText
            className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-[600px] text-balance mx-auto"
            delay={BLUR_FADE_DELAY * 2}
            text="A collection of applications, tools, and creations I've built. Filter by category to see exactly what you're looking for."
          />
        </div>
      </section>

      <ProjectsPageClient 
        projects={projectsWithCategories} 
        categories={activeCategories} 
      />
    </main>
  );
}
