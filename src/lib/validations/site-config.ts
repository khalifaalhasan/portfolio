// file: lib/validations/site-config.ts
import { z } from "zod";
import { ThemePreferenceEnum } from "./constants";

export const siteConfigSchema = z.object({
  theme_preference: ThemePreferenceEnum.default("system"),
  seo_title: z.string().min(5, { message: "SEO Title must be at least 5 characters." }),
  seo_description: z.string().max(160, { message: "SEO Description max 160 characters recommended." }).optional(),
  seo_keywords: z.array(z.string()).optional(), // Bisa array string
});

export type SiteConfigFormValues = z.infer<typeof siteConfigSchema>;