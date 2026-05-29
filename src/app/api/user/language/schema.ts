import { z } from "zod";
import { SUPPORTED_LOCALES } from "@/i18n/config";

export const languageSchema = z.object({
  language: z.enum(SUPPORTED_LOCALES),
});
