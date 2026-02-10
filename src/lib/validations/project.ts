// file: lib/validations/project.ts
import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  // Slug optional di form validation karena di-generate system, tapi required di DB
  slug: z.string(),
  content: z.string().optional(), // Rich text HTML string
  tech_stack: z
    .array(z.string())
    .min(1, { message: "Select at least 1 technology." }),
  thumbnail: z
    .string()
    .url({ message: "Thumbnail must be a valid image URL." }),
  demo_url: z.string().url().optional().or(z.literal("")),
  repo_url: z.string().url().optional().or(z.literal("")),
  is_featured: z.boolean().default(false),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
