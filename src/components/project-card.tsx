/* eslint-disable @next/next/no-img-element */
"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Markdown from "react-markdown";

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return <div className="w-full h-full bg-muted" />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
      onError={() => setImageError(true)}
    />
  );
}

interface Props {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags: readonly string[];
  link?: string;
  image?: string;
  video?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
}

export function ProjectCard({
  title,
  href,
  description,
  dates,
  tags,
  link,
  image,
  video,
  links,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col h-full border border-border rounded-xl overflow-hidden hover:ring-2 cursor-pointer hover:ring-muted transition-all duration-200",
        className,
      )}
    >
      <div className="relative shrink-0 overflow-hidden">
        <Link
          href={href || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full relative overflow-hidden border-b border-border"
        >
          {video ? (
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : image ? (
            <ProjectImage src={image} alt={title} />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}
        </Link>

        {/* Floating Links: Adjusted padding/gap for mobile */}
        {links && links.length > 0 && (
          <div className="absolute top-2 right-2 flex flex-wrap gap-1 sm:gap-2">
            {links.map((link, idx) => (
              <Link
                href={link.href}
                key={idx}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Badge
                  className="flex items-center gap-1 text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 bg-black text-white hover:bg-black/90"
                  variant="default"
                >
                  {/* Icon size adjusted */}
                  <span className="*:size-3 sm:*:size-4">{link.icon}</span>
                  <span className="hidden sm:inline">{link.type}</span>{" "}
                  {/* Optional: Hide text on very small screens if needed */}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Content Padding: Reduced from p-6 to p-3 on mobile */}
      <div className="p-3 sm:p-6 flex flex-col gap-2 sm:gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5 sm:gap-1">
            {/* Title size adjusted */}
            <h3 className="font-semibold text-sm sm:text-base tracking-tight leading-tight">
              {title}
            </h3>
            {/* Date size adjusted */}
            <time className="text-[10px] sm:text-xs text-muted-foreground">
              {dates}
            </time>
          </div>
          <Link
            href={href || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            aria-label={`Open ${title}`}
          >
            <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden />
          </Link>
        </div>

        {/* Description: Added line-clamp to prevent uneven heights */}
        <div className="text-[10px] sm:text-xs flex-1 prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert line-clamp-3 sm:line-clamp-none">
          <Markdown>{description}</Markdown>
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-1">
            {tags.map((tag) => (
              <Badge
                key={tag}
                // Tag sizes adjusted
                className="text-[9px] sm:text-[11px] font-medium border border-border px-1 py-0 sm:px-2 sm:h-6 w-fit"
                variant="outline"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
