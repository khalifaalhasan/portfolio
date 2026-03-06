import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { SectionClient } from "@/components/dashboard/SectionClient";

export default async function SectionsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const sections = await prisma.section.findMany({
    where: { userId: session.user.id },
    orderBy: { orderIndex: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sections</h1>
        <p className="text-muted-foreground">
          Manage the layout and visibility of different segments on your homepage.
        </p>
      </div>

      <SectionClient initialData={sections} />
    </div>
  );
}
