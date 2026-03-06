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
import { upsertSiteConfig } from "@/actions/siteConfig";
import { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { SiteConfig, ThemePreference } from "@prisma/client";
import { cn } from "@/lib/utils";

const siteConfigSchema = z.object({
  themePreference: z.nativeEnum(ThemePreference),
  seoTitle: z.string().min(2, "SEO Title required"),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()),
});

type SiteConfigFormValues = z.infer<typeof siteConfigSchema>;

export function SiteConfigForm({ initialData }: { initialData: SiteConfig | null }) {
  const [isLoading, setIsLoading] = useState(false);
  const [keywordInput, setKeywordInput] = useState("");

  const form = useForm<SiteConfigFormValues>({
    resolver: zodResolver(siteConfigSchema),
    defaultValues: {
      themePreference: initialData?.themePreference || "system",
      seoTitle: initialData?.seoTitle || "",
      seoDescription: initialData?.seoDescription || "",
      seoKeywords: initialData?.seoKeywords || [],
    },
  });

  async function onSubmit(data: SiteConfigFormValues) {
    setIsLoading(true);
    try {
      await upsertSiteConfig(data);
      toast.success("Site configuration updated successfully");
    } catch (error) {
      toast.error("Failed to update site configuration");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddKeyword = () => {
    if (!keywordInput.trim()) return;
    const currentKeywords = form.getValues("seoKeywords");
    if (!currentKeywords.includes(keywordInput.trim())) {
      form.setValue("seoKeywords", [...currentKeywords, keywordInput.trim()]);
    }
    setKeywordInput("");
  };

  const handleRemoveKeyword = (index: number) => {
    const currentKeywords = form.getValues("seoKeywords");
    form.setValue(
      "seoKeywords",
      currentKeywords.filter((_, i) => i !== index)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <FormField
          control={form.control}
          name="themePreference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Theme Preference</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                >
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seoTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SEO Title</FormLabel>
              <FormControl>
                <Input placeholder="John Doe | Portfolio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seoDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SEO Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief description of this site for search engines..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seoKeywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SEO Keywords</FormLabel>
              <div className="flex space-x-2">
                <FormControl>
                  <Input
                    placeholder="react, developer, portfolio"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                  />
                </FormControl>
                <Button type="button" onClick={handleAddKeyword} variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value.map((keyword, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(index)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <FormDescription>Press Enter or click + to add a keyword</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Site Config
        </Button>
      </form>
    </Form>
  );
}
