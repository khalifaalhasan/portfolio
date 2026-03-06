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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createSection, updateSection, deleteSection } from "@/actions/section";
import { useState } from "react";
import { Loader2, Plus, Edit2, Trash2, X, ArrowUp, ArrowDown } from "lucide-react";
import { Section, SectionSource, HeaderStyle } from "@prisma/client";

const sectionSchema = z.object({
  contentSource: z.nativeEnum(SectionSource),
  orderIndex: z.coerce.number().int().min(0, "Must be a positive number"),
  isVisible: z.boolean().default(true),
  headerStyle: z.nativeEnum(HeaderStyle),
  heading: z.string().min(1, "Heading is required"),
  subHeading: z.string().optional(),
  badgeText: z.string().optional(),
  description: z.string().optional(),

  
});

type SectionFormValues = {
  contentSource: SectionSource;
  orderIndex: number;
  isVisible: boolean;
  headerStyle: HeaderStyle;
  heading: string;
  subHeading?: string;
  badgeText?: string;
  description?: string;
};

export function SectionClient({ initialData }: { initialData: Section[] }) {
  const [sections, setSections] = useState<Section[]>(initialData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema) as any,
    defaultValues: {
      contentSource: "projects",
      orderIndex: sections.length,
      isVisible: true,
      headerStyle: "simple_left",
      heading: "",
      subHeading: "",
      badgeText: "",
      description: "",
    },
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    form.reset({
      contentSource: "projects",
      orderIndex: sections.length,
      isVisible: true,
      headerStyle: "simple_left",
      heading: "",
      subHeading: "",
      badgeText: "",
      description: "",
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (section: Section) => {
    setEditingId(section.id);
    form.reset({
      contentSource: section.contentSource,
      orderIndex: section.orderIndex,
      isVisible: section.isVisible,
      headerStyle: section.headerStyle,
      heading: section.heading,
      subHeading: section.subHeading || "",
      badgeText: section.badgeText || "",
      description: section.description || "",
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return;
    
    try {
      await deleteSection(id);
      setSections((prev) => prev.filter((s) => s.id !== id));
      toast.success("Section deleted");
    } catch (error) {
      toast.error("Failed to delete section");
      console.error(error);
    }
  };

  async function onSubmit(data: SectionFormValues) {
    setIsLoading(true);
    try {
      if (editingId) {
        const result = await updateSection(editingId, data);
        setSections((prev) =>
          prev.map((s) => (s.id === editingId ? { ...s, ...result.section } : s)).sort((a,b) => a.orderIndex - b.orderIndex)
        );
        toast.success("Section updated");
      } else {
        const result = await createSection(data);
        setSections((prev) => [...prev, result.section as Section].sort((a,b) => a.orderIndex - b.orderIndex));
        toast.success("Section created");
      }
      setIsFormOpen(false);
    } catch (error) {
      toast.error("Failed to save section");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;

    const newSections = [...sections];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap orderIndex values
    const tempOrder = newSections[index].orderIndex;
    newSections[index].orderIndex = newSections[swapIndex].orderIndex;
    newSections[swapIndex].orderIndex = tempOrder;

    // Optimistically update UI
    const sorted = newSections.sort((a, b) => a.orderIndex - b.orderIndex);
    setSections(sorted);

    // Persist to DB
    try {
      const updatePayload = (section: Section): SectionFormValues => ({
        contentSource: section.contentSource,
        orderIndex: section.orderIndex,
        isVisible: section.isVisible,
        headerStyle: section.headerStyle,
        heading: section.heading,
        subHeading: section.subHeading ?? undefined,
        badgeText: section.badgeText ?? undefined,
        description: section.description ?? undefined,
      });

      await Promise.all([
        updateSection(sorted[index].id, updatePayload(sorted[index])),
        updateSection(sorted[swapIndex].id, updatePayload(sorted[swapIndex]))
      ]);
    } catch (error) {
      toast.error("Failed to update order");
      // Revert on failure (simplified)
      setSections(initialData); 
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Page Sections</h2>
        <Button onClick={handleOpenCreate} disabled={isFormOpen}>
          <Plus className="h-4 w-4 mr-2" /> Add Section
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
            {editingId ? "Edit Section" : "Add Section"}
          </h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="contentSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Source</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          {Object.keys(SectionSource).map(source => (
                            <option key={source} value={source}>{source}</option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="headerStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Header Style</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="simple_left">Simple Left</option>
                          <option value="center_badge">Center Badge</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="heading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heading</FormLabel>
                      <FormControl>
                        <Input placeholder="Featured Projects" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subHeading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub Heading (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="A collection of my work" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                 <FormField
                  control={form.control}
                  name="badgeText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Badge Text (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Portfolio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="orderIndex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Section description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isVisible"
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
                    <FormLabel className="font-normal">Visible on site</FormLabel>
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

      <div className="rounded-md border">
        {sections.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No sections found. Add your first one!
          </div>
        ) : (
          <ul className="divide-y">
            {sections.map((section, index) => (
              <li key={section.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex flex-col gap-1 items-center bg-secondary rounded p-1">
                    <button 
                      onClick={() => handleMove(index, 'up')} 
                      disabled={index === 0}
                      className="text-muted-foreground disabled:opacity-30 hover:text-foreground"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <span className="text-xs font-medium">{section.orderIndex}</span>
                    <button 
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === sections.length - 1} 
                      className="text-muted-foreground disabled:opacity-30 hover:text-foreground"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{section.heading}</p>
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider bg-primary/10 text-primary">
                        {section.contentSource}
                      </span>
                      {!section.isVisible && (
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider bg-muted text-muted-foreground mt-0">Hidden</span>
                      )}
                    </div>
                    {section.subHeading && (
                      <p className="text-sm text-muted-foreground mt-1">{section.subHeading}</p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        Style: {section.headerStyle}
                      </span>
                      {section.badgeText && (
                         <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          Badge: {section.badgeText}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="icon" onClick={() => handleOpenEdit(section)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(section.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
