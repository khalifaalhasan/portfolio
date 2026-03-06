import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { CareerJourneyClient } from "@/components/dashboard/CareerJourneyClient";

export default async function CareerPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const careers = await prisma.careerJourney.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Career Journey</h1>
        <p className="text-muted-foreground">
          Kelola pengalaman kerja dan keterlibatan organisasimu.
        </p>
      </div>
      <CareerJourneyClient initialData={careers} />
    </div>
  );
}
