import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  // Fetch some summary data
  const [projectsCount, profile] = await Promise.all([
    prisma.project.count({ where: { userId: session.user.id } }),
    prisma.profile.findUnique({ where: { userId: session.user.id } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          Welcome back to your portfolio dashboard, {session.user.name}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Projects</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{projectsCount}</div>
          </div>
        </div>
        
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Profile Status</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{profile ? "Configured" : "Incomplete"}</div>
          </div>
        </div>
      </div>
      
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
        <p className="text-muted-foreground mb-4">
          Use the sidebar on the left to manage the different sections of your portfolio.
          Start by completing your Profile and Site Config, then add Projects and Experiences.
        </p>
      </div>
    </div>
  );
}
