import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { CompetitionClient } from "@/components/dashboard/CompetitionClient";

export default async function CompetitionsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const competitions = await prisma.competition.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Competitions</h1>
        <p className="text-muted-foreground">
          Kelola data kompetisi, hackathon, dan pencapaian kamu.
        </p>
      </div>
      <CompetitionClient initialData={competitions} />
    </div>
  );
}
