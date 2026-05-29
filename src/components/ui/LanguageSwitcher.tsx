"use client";

import { useAuth } from "@/providers/AuthProvider";
import { SUPPORTED_LOCALES, LOCALE_NAMES } from "@/i18n/config";

export default function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage } = useAuth();

  return (
    <select
      aria-label="Language"
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className={
        className ??
        "rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
      }
    >
      {SUPPORTED_LOCALES.map((loc) => (
        <option key={loc} value={loc}>
          {LOCALE_NAMES[loc]}
        </option>
      ))}
    </select>
  );
}
