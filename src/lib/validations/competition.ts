// file: lib/validations/competition.ts
import { z } from "zod";

export const competitionSchema = z.object({
  title: z.string().min(1, { message: "Event name is required." }),
  organizer: z.string().min(1, { message: "Organizer is required." }),
  dateDisplay: z
    .string()
    .min(1, { message: "Date is required (e.g. Nov 2023)." }),
  description: z.string().optional(),
  website_url: z.string().url().optional().or(z.literal("")),
  repo_url: z.string().url().optional().or(z.literal("")), // Optional for non-dev
});

export type CompetitionFormValues = z.infer<typeof competitionSchema>;
