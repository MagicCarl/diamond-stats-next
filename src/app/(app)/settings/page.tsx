"use client";

import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import Card from "@/components/ui/Card";

export default function SettingsPage() {
  const t = useTranslations("settings");
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {t("title")}
      </h1>
      <Card>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("language")}
          </label>
          <LanguageSwitcher className="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("languageHelp")}
          </p>
        </div>
      </Card>
    </div>
  );
}
