import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { NavItemClient } from "@/components/dashboard/NavItemClient";

export default async function NavItemsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const items = await prisma.navItem.findMany({
    where: { userId: session.user.id },
    orderBy: { orderIndex: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Navigation</h1>
        <p className="text-muted-foreground">
          Manage the navigation links displayed in your portfolio header.
        </p>
      </div>

      <NavItemClient initialData={items} />
    </div>
  );
}
