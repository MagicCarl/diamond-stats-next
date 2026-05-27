import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Baseball Stats Tracker",
  description:
    "Privacy policy for BaseballStatsTracker.com — the baseball and softball stats tracker app for youth, Little League, and travel ball teams.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-gray-950">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          &larr; Back to home
        </Link>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          BaseballStatsTracker.com &mdash; The Baseball &amp; Softball Stats Tracker App for Youth,
          Little League, and Travel Ball Teams
        </p>
        <div className="mt-8 space-y-6 text-gray-700 dark:text-gray-300">
          <p>
            Score baseball and softball games in real time from any phone or tablet. Multiple devices
            sync every 3 seconds &mdash; so coaches, parents, and fans can all follow along live.
          </p>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Batting &amp; Pitching Stats
            </h2>
            <p className="mt-2">
              AVG, OBP, SLG, OPS, RBIs, stolen bases, plus full pitching: IP, ERA, K, BB, HR, pitch
              count, wild pitches. Calculated automatically as you score.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Built for Every Level of Baseball &amp; Softball and Little League
            </h2>
            <p className="mt-2">
              Track your player&rsquo;s development without complicated scorekeeping software.
              Reliable stats for tournaments and showcases. Multiple seasons and teams in one place.
              Pro-level stat tracking at a fraction of the cost of other scorekeeping apps.
            </p>
          </div>
          <p>
            The App stores your baseball game data privately. It is saved by you using your login
            name on your device.
          </p>
        </div>
      </section>
    </div>
  );
}
