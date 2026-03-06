import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { Project } from "@prisma/client";
import { Icons } from "@/components/icons";

const BLUR_FADE_DELAY = 0.04;

export default function ProjectsSection({
  projects,
  heading,
  subHeading,
  badgeText,
}: {
  projects: Project[];
  heading?: string;
  subHeading?: string;
  badgeText?: string;
}) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section id="projects">
      <div className="flex min-h-0 flex-col gap-y-8">
        <div className="flex flex-col gap-y-4 items-center justify-center">
          <div className="flex items-center w-full">
            <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
            <div className="border bg-primary z-10 rounded-xl px-4 py-1">
              <span className="text-background text-xs sm:text-sm font-medium">
                {badgeText ?? "My Projects"}
              </span>
            </div>
            <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
          </div>
          <div className="flex flex-col gap-y-2 sm:gap-y-3 items-center justify-center">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl">
              {heading ?? "Check out my latest work"}
            </h2>
            {subHeading && (
              <p className="text-muted-foreground text-sm sm:text-base md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed text-balance text-center">
                {subHeading}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 max-w-[800px] mx-auto auto-rows-fr">
          {projects.map((project, id) => (
            <BlurFade
              key={project.id}
              delay={BLUR_FADE_DELAY * 12 + id * 0.05}
              className="h-full"
            >
              <ProjectCard
                href={project.demoUrl ?? undefined}
                key={project.id}
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
        </div>
      </div>
    </section>
  );
}
