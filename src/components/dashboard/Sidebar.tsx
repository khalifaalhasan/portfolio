"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UserCircle,
  Settings,
  Link as LinkIcon,
  Layers,
  MenuSquare,
  FolderDot,
  Trophy,
  Briefcase,
  GraduationCap,
  LogOut,
  Tags,
} from "lucide-react";
import { signOut } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
  { href: "/dashboard/site-config", label: "Site Config", icon: Settings },
  { href: "/dashboard/social-links", label: "Social Links", icon: LinkIcon },
  { href: "/dashboard/sections", label: "Sections", icon: Layers },
  { href: "/dashboard/nav-items", label: "Nav Items", icon: MenuSquare },
  { href: "/dashboard/projects", label: "Projects", icon: FolderDot },
  { href: "/dashboard/project-categories", label: "Project Categories", icon: Tags },
  { href: "/dashboard/competitions", label: "Competitions", icon: Trophy },
  { href: "/dashboard/career", label: "Career", icon: Briefcase },
  { href: "/dashboard/education", label: "Education", icon: GraduationCap },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  return (
    <aside className="w-64 border-r bg-background flex flex-col h-screen sticky top-0 overflow-y-auto hidden md:flex">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold tracking-tight">Admin Panel</h2>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
