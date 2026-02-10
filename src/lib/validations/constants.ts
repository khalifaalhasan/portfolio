// file: lib/validations/constants.ts
import { z } from "zod";

export const ThemePreferenceEnum = z.enum(["system", "dark", "light"]);
export const SectionSourceEnum = z.enum(["projects", "competitions", "career", "education"]);
export const HeaderStyleEnum = z.enum(["center_badge", "simple_left"]);
export const NavTypeEnum = z.enum(["home", "section_link", "social_link", "external_link"]);
export const CareerCategoryEnum = z.enum(["work", "organization"]);