/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Markdown from "react-markdown";
import ContactSection from "@/components/section/contact-section";
import CompetitionsSection from "@/components/section/competitions-section";
import ProjectsSection from "@/components/section/projects-section";
import WorkSection from "@/components/section/work-section";
import { ArrowUpRight, FileText } from "lucide-react";
import {
  getProfile,
  getSocialLinks,
  getSections,
  getProjects,
  getCompetitions,
  getCareerJourneys,
  getEducations,
} from "@/lib/data";
import { SectionSource } from "@prisma/client";

const BLUR_FADE_DELAY = 0.04;

export default async function Page() {
  const [profile, socialLinks, sections, projects, competitions, careers, educations] =
    await Promise.all([
      getProfile(),
      getSocialLinks(),
      getSections(),
      getProjects(),
      getCompetitions(),
      getCareerJourneys(),
      getEducations(),
    ]);

  // Determine which section types are active/visible
  const visibleSources = new Set(sections.map((s) => s.contentSource));

  // Helper to find section config by source
  const getSection = (source: SectionSource) =>
    sections.find((s) => s.contentSource === source);

  return (
    <main className="min-h-dvh flex flex-col gap-14 relative">
      {/* ─── HERO ─── */}
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-2 gap-y-6 flex flex-col md:flex-row justify-between">
            <div className="gap-2 flex flex-col order-2 md:order-1">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-3xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl"
                yOffset={8}
                text={`Hi, I'm ${profile?.name.split(" ")[0] ?? "there"} 👋`}
              />
              <BlurFadeText
                className="text-muted-foreground max-w-[600px] md:text-lg lg:text-xl"
                delay={BLUR_FADE_DELAY}
                text={profile?.tagline ?? "Welcome to my portfolio."}
              />
            </div>
            <BlurFade delay={BLUR_FADE_DELAY} className="order-1 md:order-2">
              <Avatar className="size-24 md:size-32 border rounded-full shadow-lg ring-4 ring-muted">
                <AvatarImage alt={profile?.name ?? ""} src={profile?.avatarUrl ?? ""} />
                <AvatarFallback>{profile?.initial ?? "?"}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* ─── ABOUT / SUMMARY ─── */}
      {profile?.summary && (
        <section id="about">
          <div className="flex min-h-0 flex-col gap-y-4">
            <BlurFade delay={BLUR_FADE_DELAY * 3}>
              <h2 className="text-xl font-bold">About</h2>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 4}>
              <div className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
                <Markdown>{profile.summary}</Markdown>
              </div>
            </BlurFade>
          </div>
        </section>
      )}

      {/* ─── WORK / CAREER ─── */}
      {visibleSources.has("career") && careers.filter((c) => c.category === "work").length > 0 && (
        <section id="work">
          <div className="flex min-h-0 flex-col gap-y-6">
            <BlurFade delay={BLUR_FADE_DELAY * 5}>
              <h2 className="text-xl font-bold">
                {getSection("career")?.heading ?? "Work Experience"}
              </h2>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 6}>
              <WorkSection careers={careers} />
            </BlurFade>
          </div>
        </section>
      )}

      {/* ─── EDUCATION ─── */}
      {visibleSources.has("education") && educations.length > 0 && (
        <section id="education">
          <div className="flex min-h-0 flex-col gap-y-6">
            <BlurFade delay={BLUR_FADE_DELAY * 7}>
              <h2 className="text-xl font-bold">
                {getSection("education")?.heading ?? "Education"}
              </h2>
            </BlurFade>
            <div className="flex flex-col gap-8">
              {educations.map((education, index) => (
                <BlurFade
                  key={education.id}
                  delay={BLUR_FADE_DELAY * 8 + index * 0.05}
                >
                  <div className="flex items-center gap-x-3 justify-between group">
                    <div className="flex items-center gap-x-3 flex-1 min-w-0">
                      {education.logoUrl ? (
                        <img 
                          src={education.logoUrl} 
                          alt={education.institution} 
                          className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border overflow-hidden object-contain flex-none bg-white" 
                        />
                      ) : (
                        <div className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border bg-muted flex-none" />
                      )}
                      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                        <div className="font-semibold leading-none flex items-center gap-2">
                          {education.institution}
                        </div>
                        <div className="font-sans text-sm text-muted-foreground">
                          {education.degree}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground text-right flex-none">
                      <span>{education.period}</span>
                    </div>
                  </div>
                  {education.description && (
                    <p className="ml-13 text-xs sm:text-sm text-muted-foreground mt-2">
                      {education.description}
                    </p>
                  )}
                </BlurFade>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── PROJECTS ─── */}
      {visibleSources.has("projects") && projects.length > 0 && (
        <section id="projects">
          <BlurFade delay={BLUR_FADE_DELAY * 11}>
            <ProjectsSection
              projects={projects.filter(p => p.isFeatured).slice(0, 4)}
              heading={getSection("projects")?.heading}
              subHeading={getSection("projects")?.subHeading ?? undefined}
              badgeText={getSection("projects")?.badgeText ?? undefined}
            />
          </BlurFade>
          {projects.length > 4 && (
            <BlurFade delay={BLUR_FADE_DELAY * 12}>
              <div className="flex justify-center mt-12 mb-4">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-sm"
                >
                  Check Detail
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </BlurFade>
          )}
        </section>
      )}

      {/* ─── COMPETITIONS ─── */}
      {visibleSources.has("competitions") && competitions.length > 0 && (
        <section id="competitions">
          <BlurFade delay={BLUR_FADE_DELAY * 13}>
            <CompetitionsSection
              competitions={competitions}
              heading={getSection("competitions")?.heading}
              subHeading={getSection("competitions")?.subHeading ?? undefined}
              badgeText={getSection("competitions")?.badgeText ?? undefined}
            />
          </BlurFade>
        </section>
      )}

      {/* ─── CONTACT ─── */}
      <section id="contact">
        <BlurFade delay={BLUR_FADE_DELAY * 16}>
          <ContactSection socialLinks={socialLinks} />
        </BlurFade>
      </section>
    </main>
  );
}
