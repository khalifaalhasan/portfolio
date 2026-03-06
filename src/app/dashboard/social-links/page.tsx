import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { SocialLinkClient } from "@/components/dashboard/SocialLinkClient";

export default async function SocialLinksPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const socialLinks = await prisma.socialLink.findMany({
    where: { userId: session.user.id },
    orderBy: { platform: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Social Links</h1>
        <p className="text-muted-foreground">
          Manage your social media profiles and external links.
        </p>
      </div>

      <SocialLinkClient initialData={socialLinks} />
    </div>
  );
}
