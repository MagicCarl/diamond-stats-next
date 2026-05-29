export const SUPPORTED_LOCALES = ["en", "es", "ja", "ko", "zh-Hant"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  es: "Español",
  ja: "日本語",
  ko: "한국어",
  "zh-Hant": "繁體中文",
};

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" &&
    (SUPPORTED_LOCALES as readonly string[]).includes(value)
  );
}
