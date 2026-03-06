"use client";

import { useState } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { Project, ProjectCategory } from "@prisma/client";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

type ProjectWithCategories = Project & { categories: ProjectCategory[] };

const BLUR_FADE_DELAY = 0.04;

export default function ProjectsPageClient({
  projects,
  categories,
}: {
  projects: ProjectWithCategories[];
  categories: ProjectCategory[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProjects = selectedCategory
    ? projects.filter((project) =>
        project.categories.some((cat) => cat.id === selectedCategory)
      )
    : projects;

  return (
    <section className="flex flex-col gap-8 w-full">
      {/* Category Filter Pills */}
      {categories.length > 0 && (
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                selectedCategory === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground hover:bg-muted"
              )}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground hover:bg-muted"
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
        </BlurFade>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 auto-rows-fr">
        {filteredProjects.map((project, id) => (
          <BlurFade
            key={project.id}
            delay={BLUR_FADE_DELAY * 4 + id * 0.05}
            className="h-full"
          >
            <ProjectCard
              href={project.demoUrl ?? undefined}
              title={project.title}
              description={project.content ?? ""}
              dates={new Date(project.createdAt).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "short",
              })}
              tags={project.techStack}
              image={project.thumbnail}
              video=""
              links={[
                ...(project.demoUrl
                  ? [{ type: "Website", href: project.demoUrl, icon: <Icons.globe className="size-3" /> }]
                  : []),
                ...(project.repoUrl
                  ? [{ type: "Source", href: project.repoUrl, icon: <Icons.github className="size-3" /> }]
                  : []),
              ]}
            />
          </BlurFade>
        ))}
        {filteredProjects.length === 0 && (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            No projects found for the selected category.
          </div>
        )}
      </div>
    </section>
  );
}
