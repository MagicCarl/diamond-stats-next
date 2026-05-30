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

// Country flags shown alongside language names in the switcher.
// Spanish → Spain (conventional choice for the language; baseball Spanish
// is widely spoken across LatAm too).
// Traditional Chinese → Taiwan (CPBL is the primary Traditional Chinese
// baseball market).
export const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
  ja: "🇯🇵",
  ko: "🇰🇷",
  "zh-Hant": "🇹🇼",
};

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" &&
    (SUPPORTED_LOCALES as readonly string[]).includes(value)
  );
}
