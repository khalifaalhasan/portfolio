"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createProject, updateProject, deleteProject } from "@/actions/project";
import { useState } from "react";
import { Loader2, Plus, Edit2, Trash2, X } from "lucide-react";
import { Project, ProjectCategory } from "@prisma/client";
import { ImageUpload } from "./ImageUpload";
import { Checkbox } from "@/components/ui/checkbox";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Lowercase alphanumeric and dashes only"),
  content: z.string().optional(),
  techStack: z.array(z.string()),
  categoryIds: z.array(z.string()),
  thumbnail: z.string().min(1, "Thumbnail URL is required").url(),
  demoUrl: z.string().url().optional().or(z.literal("")),
  repoUrl: z.string().url().optional().or(z.literal("")),
  isFeatured: z.boolean(),
});

export type ProjectWithCategories = Project & { categories: ProjectCategory[] };

type ProjectFormValues = z.infer<typeof projectSchema>;

export function ProjectClient({ 
  initialData, 
  categories 
}: { 
  initialData: ProjectWithCategories[],
  categories: ProjectCategory[]
}) {
  const [projects, setProjects] = useState<ProjectWithCategories[]>(initialData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [techInput, setTechInput] = useState("");

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      techStack: [],
      categoryIds: [],
      thumbnail: "",
      demoUrl: "",
      repoUrl: "",
      isFeatured: false,
    },
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    form.reset({
      title: "",
      slug: "",
      content: "",
      techStack: [],
      categoryIds: [],
      thumbnail: "",
      demoUrl: "",
      repoUrl: "",
      isFeatured: false,
    });
    setTechInput("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (project: ProjectWithCategories) => {
    setEditingId(project.id);
    form.reset({
      title: project.title,
      slug: project.slug,
      content: project.content || "",
      techStack: project.techStack,
      categoryIds: project.categories ? project.categories.map((c) => c.id) : [],
      thumbnail: project.thumbnail,
      demoUrl: project.demoUrl || "",
      repoUrl: project.repoUrl || "",
      isFeatured: project.isFeatured,
    });
    setTechInput("");
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project deleted");
    } catch (error) {
      toast.error("Failed to delete project");
      console.error(error);
    }
  };

  async function onSubmit(data: ProjectFormValues) {
    setIsLoading(true);
    try {
      if (editingId) {
        const result = await updateProject(editingId, data);
        setProjects((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, ...result.project } as ProjectWithCategories : p))
        );
        toast.success("Project updated");
      } else {
        const result = await createProject(data);
        setProjects((prev) => [result.project as ProjectWithCategories, ...prev]);
        toast.success("Project created");
      }
      setIsFormOpen(false);
    } catch (error) {
      toast.error("Failed to save project. Ensure slug is unique.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddTech = () => {
    if (!techInput.trim()) return;
    const currentList = form.getValues("techStack");
    if (!currentList.includes(techInput.trim())) {
      form.setValue("techStack", [...currentList, techInput.trim()]);
    }
    setTechInput("");
  };

  const handleRemoveTech = (index: number) => {
    const currentList = form.getValues("techStack");
    form.setValue(
      "techStack",
      currentList.filter((_, i) => i !== index)
    );
  };

  // Convert title to slug
  const generateSlug = () => {
    const title = form.getValues("title");
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      form.setValue("slug", slug, { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Projects</h2>
        <Button onClick={handleOpenCreate} disabled={isFormOpen}>
          <Plus className="h-4 w-4 mr-2" /> Add Project
        </Button>
      </div>

      {isFormOpen && (
        <div className="p-6 border rounded-xl bg-card relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => setIsFormOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium mb-4">
            {editingId ? "Edit Project" : "Add Project"}
          </h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Awesome Project" {...field} onBlur={(e) => {
                          field.onBlur();
                          if (!editingId && !form.getValues("slug")) generateSlug();
                        }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex justify-between items-center">
                        Slug (URL friendly)
                        <Button type="button" variant="link" className="h-auto p-0 text-xs" onClick={generateSlug}>
                          Generate from title
                        </Button>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="awesome-project" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail Image</FormLabel>
                    <FormControl>
                      <ImageUpload 
                        value={field.value} 
                        onChange={field.onChange} 
                        folder="projects"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="demoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Demo URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="repoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repository URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="techStack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tech Stack</FormLabel>
                    <div className="flex space-x-2">
                      <FormControl>
                        <Input
                          placeholder="Next.js, Tailwind..."
                          value={techInput}
                          onChange={(e) => setTechInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTech();
                            }
                          }}
                        />
                      </FormControl>
                      <Button type="button" onClick={handleAddTech} variant="outline" size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((tech, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => handleRemoveTech(index)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryIds"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Categories</FormLabel>
                      <FormDescription>
                        Select the categories that apply to this project.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                      {categories.length === 0 && (
                        <p className="text-sm text-muted-foreground">No categories found. Create some in the Project Categories tab.</p>
                      )}
                      {categories.map((category) => (
                        <FormField
                          key={category.id}
                          control={form.control}
                          name="categoryIds"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={category.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(category.id)}
                                    onCheckedChange={(checked: boolean | "indeterminate") => {
                                      return checked
                                        ? field.onChange([...field.value, category.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== category.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {category.name}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Content / Description (Rich Text/Markdown supported in DB)</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[120px]" placeholder="Built this project to solve..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Featured Project (Show prominently)</FormLabel>
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
        {projects.length === 0 ? (
          <div className="col-span-full p-8 text-center border rounded-xl bg-card text-muted-foreground">
            No projects found. Add your first one!
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="border rounded-xl bg-card overflow-hidden flex flex-col">
              <div 
                className="h-32 bg-muted bg-cover bg-center" 
                style={{ backgroundImage: `url(${project.thumbnail})` }}
              />
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold line-clamp-1">{project.title}</h3>
                  {project.isFeatured && (
                    <span className="shrink-0 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider bg-primary/10 text-primary">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-3 font-mono line-clamp-1">/{project.slug}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.techStack.slice(0, 3).map((tech, i) => (
                     <span key={i} className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                     <span className="text-[10px] text-muted-foreground px-1.5 py-0.5">
                      +{project.techStack.length - 3} more
                    </span>
                  )}
                </div>
                
                {project.categories && project.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.categories.map((cat) => (
                      <span key={cat.id} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                        {cat.name}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="mt-auto flex justify-between items-center pt-4 border-t">
                  <div className="text-xs text-muted-foreground">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleOpenEdit(project)}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(project.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
