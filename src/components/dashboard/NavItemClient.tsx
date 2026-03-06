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
import { createNavItem, updateNavItem, deleteNavItem } from "@/actions/navItem";
import { useState } from "react";
import { Loader2, Plus, Edit2, Trash2, X, ArrowUp, ArrowDown } from "lucide-react";
import { NavItem, NavType } from "@prisma/client";

const navItemSchema = z.object({
  type: z.nativeEnum(NavType),
  orderIndex: z.number().int().min(0),
  label: z.string().min(1, "Label is required").max(20, "Max 20 characters"),
  iconKey: z.string().min(1, "Icon key is required"),
  targetValue: z.string().optional(),
});

type NavItemFormValues = z.infer<typeof navItemSchema>;

export function NavItemClient({ initialData }: { initialData: NavItem[] }) {
  const [navItems, setNavItems] = useState<NavItem[]>(initialData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const form = useForm<NavItemFormValues>({
    resolver: zodResolver(navItemSchema),
    defaultValues: {
      type: "home",
      orderIndex: navItems.length,
      label: "",
      iconKey: "",
      targetValue: "",
    },
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    form.reset({
      type: "home",
      orderIndex: navItems.length,
      label: "",
      iconKey: "",
      targetValue: "",
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: NavItem) => {
    setEditingId(item.id);
    form.reset({
      type: item.type,
      orderIndex: item.orderIndex,
      label: item.label,
      iconKey: item.iconKey,
      targetValue: item.targetValue || "",
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this navigation item?")) return;
    
    try {
      await deleteNavItem(id);
      setNavItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Nav item deleted");
    } catch (error) {
      toast.error("Failed to delete nav item");
      console.error(error);
    }
  };

  async function onSubmit(data: NavItemFormValues) {
    setIsLoading(true);
    try {
      if (editingId) {
        const result = await updateNavItem(editingId, data);
        setNavItems((prev) =>
          prev.map((i) => (i.id === editingId ? { ...i, ...result.navItem } : i)).sort((a,b) => a.orderIndex - b.orderIndex)
        );
        toast.success("Nav item updated");
      } else {
        const result = await createNavItem(data);
        setNavItems((prev) => [...prev, result.navItem as NavItem].sort((a,b) => a.orderIndex - b.orderIndex));
        toast.success("Nav item created");
      }
      setIsFormOpen(false);
    } catch (error) {
      toast.error("Failed to save nav item");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === navItems.length - 1) return;

    const newItems = [...navItems];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    const tempOrder = newItems[index].orderIndex;
    newItems[index].orderIndex = newItems[swapIndex].orderIndex;
    newItems[swapIndex].orderIndex = tempOrder;

    const sorted = newItems.sort((a, b) => a.orderIndex - b.orderIndex);
    setNavItems(sorted);

    try {
      await Promise.all([
        updateNavItem(sorted[index].id, { ...sorted[index], targetValue: sorted[index].targetValue ?? undefined }),
        updateNavItem(sorted[swapIndex].id, { ...sorted[swapIndex], targetValue: sorted[swapIndex].targetValue ?? undefined })
      ]);
    } catch (error) {
      toast.error("Failed to update order");
      setNavItems(initialData); 
    }
  };

  const watchType = form.watch("type");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Navigation Menu</h2>
        <Button onClick={handleOpenCreate} disabled={isFormOpen}>
          <Plus className="h-4 w-4 mr-2" /> Add Link
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
            {editingId ? "Edit Navigation Link" : "Add Navigation Link"}
          </h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input placeholder="Home, About..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="iconKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon Key</FormLabel>
                      <FormControl>
                        <Input placeholder="lucide-home..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link Type</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          {Object.keys(NavType).map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
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

              {watchType !== "home" && (
                <FormField
                  control={form.control}
                  name="targetValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Value (URL or Section ID)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://... or #about" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

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
        {navItems.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No navigation items found.
          </div>
        ) : (
          <ul className="divide-y">
            {navItems.map((item, index) => (
              <li key={item.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/50 transition-colors">
                 <div className="flex items-start gap-4 flex-1">
                  <div className="flex flex-col gap-1 items-center bg-secondary rounded p-1">
                    <button 
                      onClick={() => handleMove(index, 'up')} 
                      disabled={index === 0}
                      className="text-muted-foreground disabled:opacity-30 hover:text-foreground"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <span className="text-xs font-medium">{item.orderIndex}</span>
                    <button 
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === navItems.length - 1} 
                      className="text-muted-foreground disabled:opacity-30 hover:text-foreground"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{item.label}</p>
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider bg-primary/10 text-primary">
                        {item.type}
                      </span>
                    </div>
                    {item.targetValue && (
                      <p className="text-sm text-muted-foreground mt-1 text-blue-500 hover:underline">{item.targetValue}</p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        Icon: {item.iconKey}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="icon" onClick={() => handleOpenEdit(item)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)}>
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
