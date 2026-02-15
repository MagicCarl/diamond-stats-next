"use client";

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold">Diamond Stats</h1>
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

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href={user ? "/dashboard" : "/signup"}
            className="rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
          >
            Get Started Free
          </Link>
        </div>

        <div className="mt-20 grid gap-8 text-left sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-3 text-3xl">&#9918;</div>
            <h3 className="text-lg font-semibold">Live Game Scoring</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Score games in real-time from your phone at the field. Track every
              at-bat, stolen base, and pitching change.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-3 text-3xl">&#128202;</div>
            <h3 className="text-lg font-semibold">Season Stats</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Automatic calculation of AVG, OBP, SLG, OPS, and more. Filter
              stats by opponent, pitcher, and handedness.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-3 text-3xl">&#127919;</div>
            <h3 className="text-lg font-semibold">Spray Charts</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              See where your players hit the ball. Per-game and season-long
              spray charts with color-coded hit types.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
