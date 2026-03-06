import { getProjectCategories } from "@/actions/projectCategory";
import { ProjectCategoryClient } from "@/components/dashboard/ProjectCategoryClient";

export default async function ProjectCategoriesPage() {
  const categories = await getProjectCategories();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Project Categories</h1>
      <p className="text-muted-foreground">
        Manage categories for your projects.
      </p>
      <ProjectCategoryClient initialData={categories} />
    </div>
  );
}
