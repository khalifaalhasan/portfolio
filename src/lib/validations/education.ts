// file: lib/validations/education.ts
import { z } from "zod";

export const educationSchema = z.object({
  institution: z.string().min(1, { message: "Institution name is required." }),
  degree: z.string().min(1, { message: "Degree/Field of study is required." }),
  period: z.string().min(1, { message: "Period is required." }),
  description: z.string().optional(),
});

export type EducationFormValues = z.infer<typeof educationSchema>;