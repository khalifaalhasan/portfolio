import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getNavItems, getSocialLinks, getProfile } from "@/lib/data";
import { Icons } from "@/components/icons";
import { 
  HomeIcon, 
  NotebookIcon, 
  Github, 
  Linkedin, 
  Instagram, 
  Twitter, 
  Youtube, 
  Facebook, 
  Mail, 
  Globe,
  FileText
} from "lucide-react";

// Maps iconKey string → icon component (extend as needed)
const iconMap: Record<string, React.ElementType> = {
  "home": HomeIcon,
  "notebook": NotebookIcon,
  "github": Github,
  "linkedin": Linkedin,
  "instagram": Instagram,
  "twitter": Twitter,
  "youtube": Youtube,
  "facebook": Facebook,
  "email": Mail,
  "mail": Mail,
  "globe": Globe,
  // lucide keys
  "lucide-home": HomeIcon,
  "lucide-notebook": NotebookIcon,
  "lucide-github": Github,
  "lucide-linkedin": Linkedin,
  "lucide-instagram": Instagram,
  "lucide-twitter": Twitter,
  "lucide-youtube": Youtube,
  "lucide-facebook": Facebook,
  "lucide-mail": Mail,
  "lucide-globe": Globe,
};

function getIcon(iconKey: string): React.ElementType {
  return iconMap[iconKey.toLowerCase()] ?? HomeIcon;
}

export default async function Navbar() {
  const [navItems, socialLinks, profile] = await Promise.all([
    getNavItems(),
    getSocialLinks(),
    getProfile()
  ]);

  // Resolve href for each navItem
  const resolveHref = (type: string, targetValue: string | null): string => {
    if (type === "home") return "/";
    if (type === "section_link") return `#${targetValue ?? ""}`;
    return targetValue ?? "/";
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30">
      <Dock className="z-50 pointer-events-auto relative h-14 p-2 w-fit mx-auto flex gap-2 border bg-card/90 backdrop-blur-3xl shadow-[0_0_10px_3px] shadow-primary/5">
        {navItems.length === 0 ? (
          // Fallback to home if no nav items configured
          <Tooltip>
            <TooltipTrigger asChild>
              <a href="/">
                <DockIcon className="rounded-3xl cursor-pointer size-full bg-background p-0 text-muted-foreground hover:text-foreground hover:bg-muted backdrop-blur-3xl border border-border transition-colors">
                  <HomeIcon className="size-full rounded-sm overflow-hidden object-contain" />
                </DockIcon>
              </a>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8} className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm">
              <p>Home</p>
              <TooltipArrow className="fill-primary" />
            </TooltipContent>
          </Tooltip>
        ) : (
          navItems.map((item: { id: string; type: string; targetValue: string | null; iconKey: string; label: string }) => {
            const href = resolveHref(item.type, item.targetValue);
            const isExternal = item.type === "external_link";
            const IconComponent = getIcon(item.iconKey);
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <a
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                  >
                    <DockIcon className="rounded-3xl cursor-pointer size-full bg-background p-0 text-muted-foreground hover:text-foreground hover:bg-muted backdrop-blur-3xl border border-border transition-colors">
                      <IconComponent className="size-full rounded-sm overflow-hidden object-contain" />
                    </DockIcon>
                  </a>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={8} className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)]">
                  <p>{item.label}</p>
                  <TooltipArrow className="fill-primary" />
                </TooltipContent>
              </Tooltip>
            );
          })
        )}

        {profile?.resumeUrl && (
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <DockIcon className="rounded-3xl cursor-pointer size-full bg-background p-0 text-muted-foreground hover:text-foreground hover:bg-muted backdrop-blur-3xl border border-border transition-colors">
                  <FileText className="size-full rounded-sm overflow-hidden object-contain" />
                </DockIcon>
              </a>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8} className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)]">
              <p>Checkout My CV</p>
              <TooltipArrow className="fill-primary" />
            </TooltipContent>
          </Tooltip>
        )}

        {(socialLinks.length > 0 || profile?.resumeUrl) && (
          <Separator orientation="vertical" className="h-2/3 m-auto w-px bg-border" />
        )}

        {socialLinks.map((link: { id: string; url: string; platform: string; iconKey: string }) => {
          const IconComponent = getIcon(link.iconKey);
          const isExternal = link.url.startsWith("http");
          return (
            <Tooltip key={link.id}>
              <TooltipTrigger asChild>
                <a
                  href={link.url}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                >
                  <DockIcon className="rounded-3xl cursor-pointer size-full bg-background p-0 text-muted-foreground hover:text-foreground hover:bg-muted backdrop-blur-3xl border border-border transition-colors">
                    <IconComponent className="size-full rounded-sm overflow-hidden object-contain" />
                  </DockIcon>
                </a>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={8} className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)]">
                <p>{link.platform}</p>
                <TooltipArrow className="fill-primary" />
              </TooltipContent>
            </Tooltip>
          );
        })}

        <Separator orientation="vertical" className="h-2/3 m-auto w-px bg-border" />

        <Tooltip>
          <TooltipTrigger asChild>
            <DockIcon className="rounded-3xl cursor-pointer size-full bg-background p-0 text-muted-foreground hover:text-foreground hover:bg-muted backdrop-blur-3xl border border-border transition-colors">
              <ModeToggle className="size-full cursor-pointer" />
            </DockIcon>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={8} className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)]">
            <p>Theme</p>
            <TooltipArrow className="fill-primary" />
          </TooltipContent>
        </Tooltip>
      </Dock>
    </div>
  );
}
