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
import { createSocialLink, updateSocialLink, deleteSocialLink } from "@/actions/socialLink";
import { useState } from "react";
import { Loader2, Plus, Edit2, Trash2, X } from "lucide-react";
import { SocialLink } from "@prisma/client";

const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform name is required"),
  url: z.string().url("Must be a valid URL"),
  iconKey: z.string().min(1, "Icon key is required (e.g. lucide-github)"),
  isActive: z.boolean().default(true),
});

type SocialLinkFormValues = {
  platform: string;
  url: string;
  iconKey: string;
  isActive: boolean;
};

export function SocialLinkClient({ initialData }: { initialData: SocialLink[] }) {
  const [links, setLinks] = useState<SocialLink[]>(initialData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const form = useForm<SocialLinkFormValues>({
    resolver: zodResolver(socialLinkSchema) as any,
    defaultValues: {
      platform: "",
      url: "",
      iconKey: "",
      isActive: true,
    },
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    form.reset({ platform: "", url: "", iconKey: "", isActive: true });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (link: SocialLink) => {
    setEditingId(link.id);
    form.reset({
      platform: link.platform,
      url: link.url,
      iconKey: link.iconKey,
      isActive: link.isActive,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;
    
    try {
      await deleteSocialLink(id);
      setLinks((prev) => prev.filter((l) => l.id !== id));
      toast.success("Social link deleted");
    } catch (error) {
      toast.error("Failed to delete link");
      console.error(error);
    }
  };

  async function onSubmit(data: SocialLinkFormValues) {
    setIsLoading(true);
    try {
      if (editingId) {
        const result = await updateSocialLink(editingId, data);
        setLinks((prev) =>
          prev.map((l) => (l.id === editingId ? { ...l, ...result.socialLink } : l))
        );
        toast.success("Social link updated");
      } else {
        const result = await createSocialLink(data);
        setLinks((prev) => [...prev, result.socialLink as SocialLink]);
        toast.success("Social link created");
      }
      setIsFormOpen(false);
    } catch (error) {
      toast.error("Failed to save social link");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Links</h2>
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
            {editingId ? "Edit Social Link" : "Add Social Link"}
          </h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform Name</FormLabel>
                      <FormControl>
                        <Input placeholder="GitHub, LinkedIn..." {...field} />
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
                      <FormLabel>Icon</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="" disabled>Select an icon</option>
                          <option value="github">Github</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="instagram">Instagram</option>
                          <option value="twitter">Twitter / X</option>
                          <option value="youtube">YouTube</option>
                          <option value="facebook">Facebook</option>
                          <option value="mail">Email</option>
                          <option value="globe">Website / Globe</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
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
                    <FormLabel className="font-normal">Active (Visible on site)</FormLabel>
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
        {links.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No social links found. Add your first one!
          </div>
        ) : (
          <ul className="divide-y">
            {links.map((link) => (
              <li key={link.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{link.platform}</p>
                    {!link.isActive && (
                      <span className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground">Hidden</span>
                    )}
                  </div>
                  <a href={link.url} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:underline">
                    {link.url}
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">Icon: {link.iconKey}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleOpenEdit(link)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(link.id)}>
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
