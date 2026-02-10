import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { DATA } from "@/data/resume";

const BLUR_FADE_DELAY = 0.04;

export default function ProjectsSection() {
  return (
    <section id="projects">
      <div className="flex min-h-0 flex-col gap-y-8">
        <div className="flex flex-col gap-y-4 items-center justify-center">
          <div className="flex items-center w-full">
            <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
            <div className="border bg-primary z-10 rounded-xl px-4 py-1">
              {/* Menggunakan text-xs di mobile agar badge tidak terlalu mendominasi */}
              <span className="text-background text-xs sm:text-sm font-medium">
                My Projects
              </span>
            </div>
            <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
          </div>
          {/* Mengurangi gap vertikal judul di mobile */}
          <div className="flex flex-col gap-y-2 sm:gap-y-3 items-center justify-center">
            {/* Judul disesuaikan ke text-2xl untuk mobile agar proporsional */}
            <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl">
              Check out my latest work
            </h2>
            {/* Deskripsi disesuaikan ke text-sm untuk mobile */}
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed text-balance text-center">
              I&apos;ve worked on a variety of projects, from simple websites to
              complex web applications. Here are a few of my favorites.
            </p>
          </div>
        </div>

        {/* GRID UPDATE: grid-cols-2 (mobile), gap-2 (mobile) */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 max-w-[800px] mx-auto auto-rows-fr">
          {DATA.projects.map((project, id) => (
            <BlurFade
              key={project.title}
              delay={BLUR_FADE_DELAY * 12 + id * 0.05}
              className="h-full"
            >
              <ProjectCard
                href={project.href}
                key={project.title}
                title={project.title}
                description={project.description}
                dates={project.dates}
                tags={project.technologies}
                image={project.image}
                video={project.video}
                links={project.links}
              />
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
