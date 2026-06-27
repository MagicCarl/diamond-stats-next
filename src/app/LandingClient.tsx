"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/AuthProvider";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import BuyButton from "@/components/ui/BuyButton";

const features = [
  {
    id: "live",
    icon: "⚾",
    imageLight: "/screenshots/live-scoring-light.svg",
    imageDark: "/screenshots/live-scoring.svg",
  },
  {
    id: "stats",
    icon: "📊",
    imageLight: "/screenshots/season-stats-light.svg",
    imageDark: "/screenshots/season-stats.svg",
  },
  {
    id: "spray",
    icon: "🎯",
    imageLight: "/screenshots/spray-chart-light.svg",
    imageDark: "/screenshots/spray-chart.svg",
  },
] as const;

const featureKeys: Record<string, { title: string; desc: string }> = {
  live: { title: "featureLiveTitle", desc: "featureLiveDesc" },
  stats: { title: "featureStatsTitle", desc: "featureStatsDesc" },
  spray: { title: "featureSprayTitle", desc: "featureSprayDesc" },
};

export default function LandingClient() {
  const { user } = useAuth();
  const t = useTranslations("marketing.landing");
  const [previewFeature, setPreviewFeature] = useState<string | null>(null);

  const activeFeature = features.find((f) => f.id === previewFeature);

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="h-8 w-8">
            <circle cx="32" cy="32" r="30" fill="#f5f5f5" stroke="#cc0000" strokeWidth="2"/>
            <path d="M20 8 C22 14, 22 20, 20 26 C18 32, 18 38, 20 44 C22 50, 22 56, 20 56" fill="none" stroke="#cc0000" strokeWidth="2" strokeLinecap="round"/>
            <path d="M44 8 C42 14, 42 20, 44 26 C46 32, 46 38, 44 44 C42 50, 42 56, 44 56" fill="none" stroke="#cc0000" strokeWidth="2" strokeLinecap="round"/>
            <line x1="20" y1="10" x2="17" y2="8" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="20" y1="15" x2="16" y2="14" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="20" y1="20" x2="16" y2="20" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="20" y1="26" x2="16" y2="27" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="19" y1="32" x2="15" y2="33" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="20" y1="38" x2="16" y2="38" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="20" y1="44" x2="16" y2="44" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="20" y1="50" x2="17" y2="52" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="44" y1="10" x2="47" y2="8" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="44" y1="15" x2="48" y2="14" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="44" y1="20" x2="48" y2="20" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="44" y1="26" x2="48" y2="27" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="45" y1="32" x2="49" y2="33" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="44" y1="38" x2="48" y2="38" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="44" y1="44" x2="48" y2="44" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="44" y1="50" x2="47" y2="52" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Mona Sans', sans-serif" }}>Baseball Stats Tracker</span>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher
            placeholder={t("selectLanguage")}
            className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          />
          <ThemeToggle />
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {t("dashboard")}
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {t("signIn")}
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-6xl tracking-normal leading-tight sm:text-7xl" style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 800 }}>
          <span className="block text-[#1A1A1A] dark:text-white">{t("heroLine1")}</span>
          <span className="block text-[#2563EB]">{t("heroLine2")}</span>
          <span className="block text-[#16A34A]">{t("heroLine3")}</span>
        </h1>
        <h2 className="mx-auto mt-6 max-w-3xl text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
          {t("subtitle")}
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-xl font-semibold text-gray-900 dark:text-gray-100">
          {t("hook1")}
          <br />
          {t("hook2")}
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          {t("hookBody")}
        </p>
        <div className="mt-8 flex flex-col items-center gap-2">
          <BuyButton className="rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white hover:bg-blue-700">
            {t("ctaPrimary")}
          </BuyButton>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {t("ctaSub")}
          </p>
        </div>
        <p className="mt-6 text-lg font-bold text-gray-900 dark:text-gray-100">
          {t("noSubs")}
        </p>

        <div className="mt-20 grid gap-8 text-left sm:grid-cols-3">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setPreviewFeature(feature.id)}
              className="rounded-xl border border-gray-200 bg-white p-6 text-left transition-all hover:shadow-lg hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
            >
              <div className="mb-3 text-3xl">{feature.icon}</div>
              <h3 className="text-lg font-semibold">{t(featureKeys[feature.id].title)}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {t(featureKeys[feature.id].desc)}
              </p>
              <span className="mt-3 inline-block text-sm font-medium text-blue-600 dark:text-blue-400">
                {t("seeExample")}
              </span>
            </button>
          ))}
        </div>

        <div className="mx-auto mt-20 max-w-md">
          <Image
            src="/baseballstatstracker_bannerAd.png"
            alt="Baseball Stats Tracker app showing live game scoring, batting stats, and spray charts for youth baseball and softball teams"
            width={1536}
            height={1024}
            sizes="(max-width: 768px) 100vw, 448px"
            className="mb-6 h-auto w-full rounded-lg shadow-2xl"
          />
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-2xl font-bold">{t("getAllFeatures")}</h3>
            <div className="mt-4">
              <span className="text-4xl font-bold">$39</span>
              <span className="ml-1 text-gray-500 dark:text-gray-400">{t("oneTime")}</span>
            </div>
            <ul className="mt-6 space-y-2 text-left text-sm text-gray-600 dark:text-gray-400">
              <li>{t("planUnlimited")}</li>
              <li>{t("planLiveScoring")}</li>
              <li>{t("planSync")}</li>
              <li>{t("planSpray")}</li>
              <li>{t("planBox")}</li>
              <li>{t("planRoster")}</li>
              <li>{t("planSplits")}</li>
            </ul>
            <BuyButton className="mt-6 inline-block w-full rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700">
              {t("purchaseNow")}
            </BuyButton>
          </div>
        </div>
      </main>

      {/* Feature preview modal */}
      {activeFeature && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPreviewFeature(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl bg-white p-6 dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewFeature(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="mb-4 text-xl font-bold">{t(featureKeys[activeFeature.id].title)}</h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeFeature.imageLight}
              alt={t(featureKeys[activeFeature.id].title)}
              className="w-full rounded-lg dark:hidden"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeFeature.imageDark}
              alt={t(featureKeys[activeFeature.id].title)}
              className="hidden w-full rounded-lg dark:block"
            />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {t(featureKeys[activeFeature.id].desc)}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
