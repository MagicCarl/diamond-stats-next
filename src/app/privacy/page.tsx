import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Privacy Policy | Baseball Stats Tracker",
  description:
    "Privacy policy for BaseballStatsTracker.com — the baseball and softball stats tracker app for youth, Little League, and travel ball teams.",
};

export default async function PrivacyPolicyPage() {
  const t = await getTranslations("marketing.privacy");

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-gray-950">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          &larr; {t("backHome")}
        </Link>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          {t("subtitle")}
        </p>
        <div className="mt-8 space-y-6 text-gray-700 dark:text-gray-300">
          <p>{t("intro")}</p>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("battingH2")}
            </h2>
            <p className="mt-2">{t("battingP")}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("levelsH2")}
            </h2>
            <p className="mt-2">{t("levelsP")}</p>
          </div>
          <p>{t("storage")}</p>
        </div>
      </section>
    </div>
  );
}
