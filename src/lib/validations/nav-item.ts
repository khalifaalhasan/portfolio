// file: lib/validations/nav-item.ts
import { z } from "zod";
import { NavTypeEnum } from "./constants";

export const navItemSchema = z.object({
  order_index: z.coerce.number().int().min(1).max(6), // Max 6 slots
  type: NavTypeEnum,
  label: z.string().min(1).max(20, { message: "Label max 20 characters." }),
  icon_key: z.string().min(1, { message: "Icon is required." }),
  target_value: z.string().optional(), // URL or Section ID (Empty if type is home)
});

export type NavItemFormValues = z.infer<typeof navItemSchema>;