// file: lib/validations/career.ts
import { z } from "zod";
import { CareerCategoryEnum } from "./constants";

export const careerJourneySchema = z.object({
  category: CareerCategoryEnum,
  place: z.string().min(1, { message: "Company/Organization name is required." }),
  role: z.string().min(1, { message: "Role is required." }),
  period: z.string().min(1, { message: "Period is required." }),
  description: z.string().optional(), // Rich Text allowed
  location: z.string().optional(),
  logo_url: z.string().url().optional().or(z.literal("")),
});

export type CareerJourneyFormValues = z.infer<typeof careerJourneySchema>;