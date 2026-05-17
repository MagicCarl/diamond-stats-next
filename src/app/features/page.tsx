import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Features - Baseball & Softball Stats App for Youth Teams",
  description:
    "Live game scoring, automatic batting stats (AVG, OBP, SLG, OPS), pitching stats, spray charts, box scores, and opponent tracking. The best baseball and softball stats app for Little League, travel ball, and high school teams.",
  keywords: [
    "baseball stats app features",
    "softball stats app features",
    "live baseball scoring app",
    "baseball spray chart app",
    "youth baseball stats tracker features",
    "baseball box score app",
    "pitching stats tracker app",
    "baseball OBP calculator",
    "baseball SLG calculator",
    "travel ball stats app",
  ],
  alternates: {
    canonical: "https://www.baseballstatstracker.com/features",
  },
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-gray-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.baseballstatstracker.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Features",
                item: "https://www.baseballstatstracker.com/features",
              },
            ],
          }),
        }}
      />
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="h-8 w-8">
            <circle cx="32" cy="32" r="30" fill="#f5f5f5" stroke="#cc0000" strokeWidth="2"/>
            <path d="M20 8 C22 14, 22 20, 20 26 C18 32, 18 38, 20 44 C22 50, 22 56, 20 56" fill="none" stroke="#cc0000" strokeWidth="2" strokeLinecap="round"/>
            <path d="M44 8 C42 14, 42 20, 44 26 C46 32, 46 38, 44 44 C42 50, 42 56, 44 56" fill="none" stroke="#cc0000" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-xl font-bold tracking-tight">Baseball Stats Tracker</span>
        </Link>
        <Link
          href="/signup"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Get Started
        </Link>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
          Everything You Need to Track Baseball &amp; Softball Stats
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Baseball Stats Tracker gives coaches and parents professional stat tracking tools at a fraction of
          the cost. One app handles live scoring, batting stats, pitching stats, spray charts, box scores,
          and opponent scouting — for both baseball and softball.
        </p>

        {/* Live Game Scoring */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Live Game Scoring from Your Phone
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Score baseball and softball games in real time from any phone, tablet, or computer. The live
            scoring interface is designed for speed — tap the at-bat result, adjust RBIs, and you&apos;re
            done. The app automatically tracks outs, advances innings, and updates the running score.
          </p>
          <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
            <li><strong>Real-time sync</strong> — Multiple devices stay in sync every 3 seconds. One person scores while coaches and parents follow along live.</li>
            <li><strong>Automatic inning tracking</strong> — Three outs automatically end the half-inning. No manual inning changes needed.</li>
            <li><strong>Full at-bat results</strong> — Singles, doubles, triples, home runs, walks, HBP, strikeouts, groundouts, flyouts, lineouts, popouts, fielder&apos;s choice, double plays, sacrifice flies, sacrifice bunts, errors, and catcher&apos;s interference.</li>
            <li><strong>Stolen bases &amp; caught stealing</strong> — Track baserunning stats on every plate appearance.</li>
            <li><strong>Undo support</strong> — Made a mistake? Undo the last at-bat instantly.</li>
          </ul>
        </section>

        {/* Batting Stats */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Automatic Batting Statistics
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Every stat is calculated automatically as you score. No formulas, no spreadsheets, no math.
            Just score the game and your stats are ready.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { stat: "AVG", name: "Batting Average" },
              { stat: "OBP", name: "On-Base Pct" },
              { stat: "SLG", name: "Slugging Pct" },
              { stat: "OPS", name: "OBP + Slugging" },
              { stat: "H", name: "Hits" },
              { stat: "2B", name: "Doubles" },
              { stat: "3B", name: "Triples" },
              { stat: "HR", name: "Home Runs" },
              { stat: "RBI", name: "Runs Batted In" },
              { stat: "BB", name: "Walks" },
              { stat: "K", name: "Strikeouts" },
              { stat: "SB", name: "Stolen Bases" },
            ].map((s) => (
              <div
                key={s.stat}
                className="rounded-lg border border-gray-200 bg-white p-3 text-center dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{s.stat}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{s.name}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Stats use standard MLB formulas. OBP = (H + BB + HBP + CI) / (AB + BB + HBP + SF + CI).
            Sacrifice flies and bunts are not counted as official at-bats. All calculations match what
            you see on MLB.com and ESPN.
          </p>
        </section>

        {/* Pitching Stats */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Pitching Stats &amp; Pitch Tracking
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Track your pitchers&apos; performance with detailed stats: innings pitched, outs recorded,
            hits allowed, runs, earned runs, strikeouts, walks, home runs allowed, pitch count, hit
            batters, and wild pitches. Use the pitch-by-pitch tracking tool to record individual
            pitch locations on a strike zone diagram.
          </p>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Pitch types include called strikes, swinging strikes, foul balls, balls, in play, and hit
            by pitch — each color-coded on the strike zone. Track pitch counts per at-bat and per game
            to manage your pitchers effectively.
          </p>
        </section>

        {/* Spray Charts */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Interactive Spray Charts
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Tap the baseball diamond during live scoring to record where each ball was hit. Over a
            season, spray charts reveal hitting patterns that help coaches make lineup decisions,
            adjust defensive positioning, and work on hitting weaknesses.
          </p>
          <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
            <li><strong>Per-game spray charts</strong> — See all hit locations from a single game.</li>
            <li><strong>Season spray charts</strong> — Cumulative data across all games, filterable by player.</li>
            <li><strong>Color-coded hit types</strong> — Singles (green), doubles (blue), triples (orange), home runs (red), outs (gray).</li>
          </ul>
        </section>

        {/* Box Scores */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Professional Box Scores
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Every game gets a professional inning-by-inning box score showing runs, hits, and errors
            — just like you see at a Major League ballpark. The box score includes complete batting
            stat lines for every player (AB, H, R, RBI, BB, K, SB, AVG) and a chronological
            play-by-play game log.
          </p>
        </section>

        {/* Advanced Stats Search */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Advanced Stats Search &amp; Splits
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Go beyond basic stats with powerful filtering. Search your team&apos;s stats by opponent,
            pitcher name, pitcher handedness (lefty vs. righty), and date range. Answer questions like:
          </p>
          <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
            <li>How does my team hit against left-handed pitching?</li>
            <li>What are our stats against a specific rival team?</li>
            <li>How has our batting average trended over the season?</li>
            <li>Who hits best against a particular pitcher?</li>
          </ul>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            This kind of splits analysis was previously only available to professional and college teams.
            Now your Little League or travel ball team can use the same data-driven approach.
          </p>
        </section>

        {/* Opponent Tracking */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Opponent Pitcher &amp; Batter Tracking
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Track opponent pitchers and batters throughout the game. Link every at-bat to the opposing
            pitcher for later splits analysis. When you face a repeat opponent, their entire roster
            loads automatically from the previous matchup — saving valuable setup time on game day.
          </p>
        </section>

        {/* Pricing */}
        <section className="mt-16 rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Simple, Fair Pricing
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            No monthly fees. No subscriptions. No per-team charges. No hidden costs.
          </p>
          <div className="mt-6">
            <span className="text-5xl font-bold text-gray-900 dark:text-white">$39</span>
            <span className="ml-2 text-gray-500 dark:text-gray-400">one-time</span>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Unlimited teams, seasons, and games — forever.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <Link
              href="/signup"
              className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700"
            >
              Get Started Free
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Create your account free. Purchase when ready to score games.
            </p>
          </div>
        </section>

        {/* Comparison */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Why Coaches Choose Baseball Stats Tracker
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 font-semibold text-gray-900 dark:text-white">Feature</th>
                  <th className="pb-3 font-semibold text-blue-600 dark:text-blue-400">Baseball Stats Tracker</th>
                  <th className="pb-3 font-semibold text-gray-500">Other Apps</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 dark:text-gray-400">
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3">Price</td>
                  <td className="py-3 font-medium text-gray-900 dark:text-white">$39 one-time</td>
                  <td className="py-3">$10-$30/month</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3">Live game scoring</td>
                  <td className="py-3 font-medium text-green-600">Included</td>
                  <td className="py-3">Included</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3">Spray charts</td>
                  <td className="py-3 font-medium text-green-600">Included</td>
                  <td className="py-3">Premium tier only</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3">Stat splits &amp; filters</td>
                  <td className="py-3 font-medium text-green-600">Included</td>
                  <td className="py-3">Premium tier only</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3">Multi-device sync</td>
                  <td className="py-3 font-medium text-green-600">Included</td>
                  <td className="py-3">Premium tier only</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3">Pitch tracking</td>
                  <td className="py-3 font-medium text-green-600">Included</td>
                  <td className="py-3">Premium tier only</td>
                </tr>
                <tr>
                  <td className="py-3">Annual cost (3 years)</td>
                  <td className="py-3 font-medium text-gray-900 dark:text-white">$39 total</td>
                  <td className="py-3">$360-$1,080</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 px-6 py-8 dark:border-gray-800">
        <div className="mx-auto max-w-4xl text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Baseball Stats Tracker. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-4">
            <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">Home</Link>
            <Link href="/features" className="hover:text-gray-700 dark:hover:text-gray-300">Features</Link>
            <Link href="/pricing" className="hover:text-gray-700 dark:hover:text-gray-300">Pricing</Link>
            <Link href="/login" className="hover:text-gray-700 dark:hover:text-gray-300">Sign In</Link>
            <Link href="/signup" className="hover:text-gray-700 dark:hover:text-gray-300">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
