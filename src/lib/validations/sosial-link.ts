// file: lib/validations/social-link.ts
import { z } from "zod";

export const socialLinkSchema = z.object({
  platform: z.string().min(1, { message: "Platform name is required." }),
  url: z.string().url({ message: "Must be a valid URL." }),
  icon_key: z.string().min(1, { message: "Icon key is required." }), // String identifier for Icon component
  is_active: z.boolean().default(true),
});

export type SocialLinkFormValues = z.infer<typeof socialLinkSchema>;