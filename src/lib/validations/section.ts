// file: lib/validations/section.ts
import { z } from "zod";
import { SectionSourceEnum, HeaderStyleEnum } from "./constants";

export const sectionSchema = z.object({
  content_source: SectionSourceEnum,
  order_index: z.coerce.number().int().min(0), // Coerce memastikan input string jadi number
  is_visible: z.boolean().default(true),
  
  // Header Config
  heading: z.string().min(1, { message: "Section heading is required." }),
  sub_heading: z.string().optional(),
  badge_text: z.string().optional(), // Wajib diisi logic frontend jika layout card/timeline
  description: z.string().optional(),
  
  // Auto-filled by logic, but good to validate just in case
  header_style: HeaderStyleEnum.optional(), 
});

export type SectionFormValues = z.infer<typeof sectionSchema>;