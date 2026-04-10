"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import ThemeToggle from "@/components/ui/ThemeToggle";

const features = [
  {
    icon: "\u26BE",
    title: "Live Game Scoring",
    description:
      "Score games in real-time from your phone at the field. Track every at-bat, stolen base, and pitching change.",
    imageLight: "/screenshots/live-scoring-light.svg",
    imageDark: "/screenshots/live-scoring.svg",
  },
  {
    icon: "\uD83D\uDCCA",
    title: "Season Stats",
    description:
      "Automatic calculation of AVG, OBP, SLG, OPS, and more. Filter stats by opponent, pitcher, and handedness.",
    imageLight: "/screenshots/season-stats-light.svg",
    imageDark: "/screenshots/season-stats.svg",
  },
  {
    icon: "\uD83C\uDFAF",
    title: "Spray Charts",
    description:
      "See where your players hit the ball. Per-game and season-long spray charts with color-coded hit types.",
    imageLight: "/screenshots/spray-chart-light.svg",
    imageDark: "/screenshots/spray-chart.svg",
  },
];

export default function LandingClient() {
  const { user } = useAuth();
  const [previewFeature, setPreviewFeature] = useState<string | null>(null);

  const activeFeature = features.find((f) => f.title === previewFeature);

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
          <ThemeToggle />
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-6xl tracking-normal leading-tight sm:text-7xl" style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 800 }}>
          <span className="block text-[#1A1A1A] dark:text-white">Every At-Bat.</span>
          <span className="block"><span className="text-[#E31837]">Every </span><span className="text-[#2563EB]">Game.</span></span>
          <span className="block"><span className="text-[#16A34A]">Every </span><span className="text-[#1A1A1A] dark:text-white">Season.</span></span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          The easiest way to score games live, track batting and pitching stats,
          and give your baseball/softball team the pro treatment &mdash; all from
          your phone/tablet.
        </p>
        <p className="mt-3 text-lg font-bold text-gray-900 dark:text-gray-100">
          One-time purchase. No subscriptions.
        </p>

        <div className="mt-20 grid gap-8 text-left sm:grid-cols-3">
          {features.map((feature) => (
            <button
              key={feature.title}
              onClick={() => setPreviewFeature(feature.title)}
              className="rounded-xl border border-gray-200 bg-white p-6 text-left transition-all hover:shadow-lg hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
            >
              <div className="mb-3 text-3xl">{feature.icon}</div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
              <span className="mt-3 inline-block text-sm font-medium text-blue-600 dark:text-blue-400">
                See example &rarr;
              </span>
            </button>
          ))}
        </div>

        <div className="mx-auto mt-20 max-w-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/baseballstatstracker_bannerAd.png?v=2"
            alt="Baseball Stats Tracker app showing live game scoring, batting stats, and spray charts for youth baseball and softball teams"
            className="mb-6 w-full rounded-lg shadow-2xl"
          />
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-2xl font-bold">Get All Features</h3>
            <div className="mt-4">
              <span className="text-4xl font-bold">$39</span>
              <span className="ml-1 text-gray-500 dark:text-gray-400">one-time</span>
            </div>
            <ul className="mt-6 space-y-2 text-left text-sm text-gray-600 dark:text-gray-400">
              <li>Unlimited teams &amp; seasons</li>
              <li>Live scoring with pitch tracking</li>
              <li>Real-time sync across devices</li>
              <li>Spray charts &amp; advanced stats</li>
              <li>Inning-by-inning box score</li>
              <li>Opponent roster auto-load</li>
              <li>Opponent batter tracking &amp; splits</li>
            </ul>
            <a
              href="https://www.paypal.com/paypalme/carlrandrews"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block w-full rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
            >
              Purchase Now
            </a>
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
            <h3 className="mb-4 text-xl font-bold">{activeFeature.title}</h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeFeature.imageLight}
              alt={activeFeature.title}
              className="w-full rounded-lg dark:hidden"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeFeature.imageDark}
              alt={activeFeature.title}
              className="hidden w-full rounded-lg dark:block"
            />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {activeFeature.description}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
