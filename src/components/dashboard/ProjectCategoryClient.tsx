"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createProjectCategory, updateProjectCategory, deleteProjectCategory } from "@/actions/projectCategory";
import { useState } from "react";
import { Loader2, Plus, Edit2, Trash2, X } from "lucide-react";
import { ProjectCategory } from "@prisma/client";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export function ProjectCategoryClient({ initialData }: { initialData: ProjectCategory[] }) {
  const [categories, setCategories] = useState<ProjectCategory[]>(initialData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    form.reset({ name: "" });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (category: ProjectCategory) => {
    setEditingId(category.id);
    form.reset({ name: category.name });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteProjectCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      toast.success("Category deleted");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  async function onSubmit(data: CategoryFormValues) {
    setIsLoading(true);
    try {
      if (editingId) {
        const result = await updateProjectCategory(editingId, data.name);
        setCategories((prev) =>
          prev.map((cat) => (cat.id === editingId ? { ...cat, name: data.name } : cat))
        );
        toast.success("Category updated");
      } else {
        const result = await createProjectCategory(data.name);
        setCategories((prev) => [...prev, result.category]);
        toast.success("Category created");
      }
      setIsFormOpen(false);
    } catch (error) {
      toast.error("Failed to save category. Ensure name is unique.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Categories</h2>
        <Button onClick={handleOpenCreate} disabled={isFormOpen}>
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </Button>
      </div>

      {isFormOpen && (
        <div className="p-6 border rounded-xl bg-card relative max-w-md">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => setIsFormOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium mb-4">
            {editingId ? "Edit Category" : "Add Category"}
          </h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Web App" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end pt-2">
                <Button type="button" variant="outline" className="mr-2" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingId ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <div className="col-span-full p-8 text-center border rounded-xl bg-card text-muted-foreground">
            No categories found. Add your first one!
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="border rounded-xl bg-card p-4 flex justify-between items-center">
              <span className="font-semibold">{category.name}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleOpenEdit(category)}>
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(category.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
