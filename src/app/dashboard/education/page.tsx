import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { EducationClient } from "@/components/dashboard/EducationClient";

export default async function EducationPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const educations = await prisma.education.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Education</h1>
        <p className="text-muted-foreground">
          Kelola riwayat pendidikan kamu.
        </p>
      </div>
      <EducationClient initialData={educations} />
    </div>
  );
}
