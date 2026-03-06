import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { SiteConfigForm } from "@/components/dashboard/SiteConfigForm";

export default async function SiteConfigPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const siteConfig = await prisma.siteConfig.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Site Configuration</h1>
        <p className="text-muted-foreground">
          Manage your global site settings and SEO metadata.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <SiteConfigForm initialData={siteConfig} />
      </div>
    </div>
  );
}
