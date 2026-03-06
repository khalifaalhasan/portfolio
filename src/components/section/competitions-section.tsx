/* eslint-disable @next/next/no-img-element */
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Competition } from "@prisma/client";
import { Timeline, TimelineItem, TimelineConnectItem } from "@/components/timeline";
import { Icons } from "@/components/icons";
import { Trophy } from "lucide-react";

export default function CompetitionsSection({
  competitions,
  heading,
  badgeText,
  subHeading,
}: {
  competitions: Competition[];
  heading?: string;
  badgeText?: string;
  subHeading?: string;
}) {
  if (competitions.length === 0) return null;

  return (
    <section id="competitions" className="overflow-hidden">
      <div className="flex min-h-0 flex-col gap-y-8 w-full">
        <div className="flex flex-col gap-y-4 items-center justify-center">
          <div className="flex items-center w-full">
            <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
            <div className="border bg-primary z-10 rounded-xl px-4 py-1">
              <span className="text-background text-sm font-medium">
                {badgeText ?? "Competitions"}
              </span>
            </div>
            <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
          </div>
          <div className="flex flex-col gap-y-3 items-center justify-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              {heading ?? "Competition & Achievements"}
            </h2>
            {subHeading && (
              <p className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed text-balance text-center">
                {subHeading}
              </p>
            )}
          </div>
        </div>

        <Timeline>
          {competitions.map((competition) => (
            <TimelineItem
              key={competition.id}
              className="w-full flex items-start justify-between gap-10"
            >
              <TimelineConnectItem className="flex items-start justify-center">
                <div className="size-10 bg-card z-10 shrink-0 overflow-hidden p-1 border rounded-full shadow ring-2 ring-border flex-none flex items-center justify-center text-muted-foreground">
                  <Trophy className="size-5" />
                </div>
              </TimelineConnectItem>
              <div className="flex flex-1 flex-col justify-start gap-2 min-w-0">
                {competition.dateDisplay && (
                  <time className="text-xs text-muted-foreground">
                    {competition.dateDisplay}
                  </time>
                )}
                <h3 className="font-semibold leading-none">{competition.title}</h3>
                <p className="text-sm text-muted-foreground">{competition.organizer}</p>
                {competition.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed wrap-break-word">
                    {competition.description}
                  </p>
                )}
                <div className="mt-1 flex flex-row flex-wrap items-start gap-2">
                  {competition.websiteUrl && (
                    <Link href={competition.websiteUrl} target="_blank" rel="noopener noreferrer">
                      <Badge className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground">
                        <Icons.globe className="h-3 w-3" />
                        Website
                      </Badge>
                    </Link>
                  )}
                  {competition.repoUrl && (
                    <Link href={competition.repoUrl} target="_blank" rel="noopener noreferrer">
                      <Badge className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground">
                        <Icons.github className="h-3 w-3" />
                        Source
                      </Badge>
                    </Link>
                  )}
                </div>
              </div>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </section>
  );
}
