// file: lib/validations/profile.ts
import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  initial: z.string().max(3, { message: "Initials max 3 characters." }),
  tagline: z.string().min(1, { message: "Tagline is required." }),
  location: z.string().optional(),
  location_link: z
    .string()
    .url({ message: "Must be a valid URL." })
    .optional()
    .or(z.literal("")),
  description: z.string().optional(), // Short intro
  summary: z.string().optional(), // Long summary (Rich Text)
  avatarUrl: z.string().url({ message: "Avatar must be a valid image URL." }),
  resume_url: z
    .string()
    .url({ message: "Resume must be a valid URL." })
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email({ message: "Invalid email address." })
    .optional()
    .or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
