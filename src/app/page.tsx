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

export default function LandingPage() {
  const { user } = useAuth();
  const [previewFeature, setPreviewFeature] = useState<string | null>(null);

  const activeFeature = features.find((f) => f.title === previewFeature);

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold">My Baseball Stats</h1>
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
        <h2 className="text-5xl font-bold tracking-tight">
          Track Your Team&apos;s
          <span className="text-blue-600"> Stats</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          The simplest way to track batting stats, view spray charts, and analyze
          player performance for your Little League or youth baseball team.
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

        <div className="mx-auto mt-20 max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
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
    </div>
  );
}
