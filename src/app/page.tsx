import Link from "next/link";
import LandingClient from "./LandingClient";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-gray-950">
      <LandingClient />

      {/* ============================================================
          SECTION 1 — EMOTION (The Story)
          ============================================================ */}
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-4">
        <div className="rounded-xl border border-gray-200 bg-white p-8 sm:p-10 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            Why I built this
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            I was the dad in the bleachers with a Sharpie and a clipboard.
          </h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            <p>
              I was trying to keep score one-handed while answering &ldquo;Daddy, did you see that?&rdquo; between
              innings. I&rsquo;d come home with smudged paper, no spray chart, no OBP, and no clue how my son
              was actually trending.
            </p>
            <p>
              I tried the &ldquo;pro&rdquo; apps. $19/month. $30/month. Built for college coaches with three monitors
              and an assistant. My wife took one look and said, <em>&ldquo;You&rsquo;re not going to use that.&rdquo;</em>
            </p>
            <p>She was right.</p>
            <p>
              So I built the thing I actually wanted: tap-to-score from the bleachers, automatic stats the
              second the inning ends, spray charts that show you <em>exactly</em> where your kid is putting the
              ball, and a live link grandma can open from her couch in Florida.
            </p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              One price. $39. Forever.
            </p>
            <p>Because the kids playing right now? They&rsquo;re only 11 once.</p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2 — LOGIC (The Offer + Proof)
          ============================================================ */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            Here&rsquo;s exactly what you get
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            $39. Once. Not per month. Once.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Built for the bleachers, not the press box. Big buttons. One thumb. Sun-readable.
          </p>
        </div>

        {/* What you get vs. what it replaces */}
        <div className="mt-10 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-gray-700 sm:border-b sm:border-r dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              What you get
            </div>
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              What it replaces
            </div>

            {[
              ["Live game scoring from your phone", "Paper scorebook + a pen that died in the 3rd"],
              ["Auto-calculated AVG / OBP / SLG / OPS", "A spreadsheet you’ll never update"],
              ["Pitching stats: IP, ERA, K, BB, pitch count", "“I think he threw about 60?”"],
              ["Spray charts (per game + season)", "Guessing where to position fielders"],
              ["Splits vs. lefties, righties, specific opponents", "A coach’s gut feeling"],
              ["Live link grandparents can follow from anywhere", "“Text me when he bats”"],
              ["Unlimited teams, seasons, players, games", "Apps that charge per roster"],
            ].map(([get, replaces], i) => (
              <div key={i} className="contents">
                <div className="border-t border-gray-200 px-6 py-4 text-gray-900 sm:border-r dark:border-gray-700 dark:text-gray-100">
                  &#10003;&nbsp; {get}
                </div>
                <div className="border-t border-gray-200 px-6 py-4 text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  {replaces}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The math */}
        <div className="mt-10 rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">The math, if you&rsquo;re a numbers person:</h3>
          <ul className="mt-4 space-y-3 text-gray-700 dark:text-gray-300">
            <li>
              <span className="font-semibold">Other stat app #1:</span> ~$15/month &rarr; <span className="text-red-600 dark:text-red-400">$180/year</span>
            </li>
            <li>
              <span className="font-semibold">Other stat app #2:</span> ~$10/month &rarr; <span className="text-red-600 dark:text-red-400">$120/year</span>
            </li>
            <li>
              <span className="font-semibold">Baseball Stats Tracker:</span> <span className="text-green-600 dark:text-green-400">$39. One time. Done.</span>
            </li>
          </ul>
          <p className="mt-5 text-gray-700 dark:text-gray-300">
            By the end of one season, you&rsquo;ve already saved enough for new cleats. By the end of three, you&rsquo;ve
            saved enough for a bat your kid will actually be excited about.
          </p>
        </div>

        {/* SEO content preserved — features & FAQ folded into logic section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            The Best Baseball &amp; Softball Stats App for Youth Teams
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Whether you coach Little League, travel ball, rec league, high school, or college &mdash; score
            every game live from your phone and get professional-quality statistics automatically.
            No spreadsheets. No paper scorebooks. Record at-bats in real time and the app calculates
            batting average (AVG), on-base percentage (OBP), slugging percentage (SLG), OPS, RBIs,
            stolen bases, and every stat that matters &mdash; instantly. See the full{" "}
            <Link href="/features" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
              feature list
            </Link>{" "}
            or jump straight to{" "}
            <Link href="/pricing" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
              pricing
            </Link>
            .
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Live Game Scoring</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Score baseball and softball games in real time from any phone or tablet. Multiple devices sync
              every 3 seconds &mdash; so coaches, parents, and fans can all follow along live.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Batting &amp; Pitching Stats</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              AVG, OBP, SLG, OPS, RBIs, stolen bases, plus full pitching: IP, ERA, K, BB, HR, pitch count,
              wild pitches. Calculated automatically as you score.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Spray Charts</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              See where each player hits the ball. Color-coded by hit type. Per-game and season-long views
              reveal exactly where your hitters live.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Splits</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Filter by opponent, pitcher, pitcher handedness, and date range. See how your players hit
              against lefties, righties, or that one team you always face in the playoffs.
            </p>
          </div>
        </div>

        {/* Who it's for */}
        <div className="mt-12 rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Built for Every Level of Baseball &amp; Softball
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Little League</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Track your player&rsquo;s development without complicated scorekeeping software.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Travel Ball</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Reliable stats for tournaments and showcases. Multiple seasons and teams in one place.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">High School &amp; Rec</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Pro-level stat tracking at a fraction of the cost of other scorekeeping apps.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ — SEO + logic objections */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                What stats does Baseball Stats Tracker track?
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Batting: AVG, OBP, SLG, OPS, AB, H, 2B, 3B, HR, RBI, BB, K, SB, CS, SF, SAC. Pitching: IP, ER,
                K, BB, H, HR allowed, pitch count, HBP, wild pitches.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Does it work for softball?</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Yes. Works perfectly for both baseball and softball at any level.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">How much does it cost?</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                $39 one-time. No monthly fees, no subscriptions, no in-app purchases. Pay once, use it forever
                with unlimited teams, seasons, and games.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Can multiple people follow a game live?</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Yes. One person scores at the field while coaches, parents, and fans follow in real time from
                their own device. Syncs every 3 seconds.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">What devices does it work on?</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Any device with a browser &mdash; iPhone, Android, iPad, laptop, desktop. No app store download.
                Just open baseballstatstracker.com.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                How is this different from other baseball stats apps?
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Most charge $10&ndash;$30/month. Baseball Stats Tracker is a flat $39 one-time purchase. You get
                live scoring, spray charts, advanced splits, opponent tracking, and real-time multi-device
                sync &mdash; features that typically cost $200+/year elsewhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3 — URGENCY (The Close)
          ============================================================ */}
      <section className="bg-gradient-to-b from-transparent to-blue-50 px-6 pb-24 pt-8 dark:to-gray-900">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border-2 border-blue-600 bg-white p-8 sm:p-12 dark:border-blue-500 dark:bg-gray-800">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
              The season is happening with or without the stats
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Every weekend you wait, another game disappears.
            </h2>
            <ul className="mt-6 space-y-3 text-lg text-gray-700 dark:text-gray-300">
              <li>&mdash; Another double down the line your kid will forget.</li>
              <li>&mdash; Another strike-three-looking moment that could&rsquo;ve taught him something.</li>
              <li>
                &mdash; Another season where, when the high school coach asks <em>&ldquo;What&rsquo;s his OBP against
                lefties?&rdquo;</em> &mdash; you have to shrug.
              </li>
            </ul>
            <p className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
              Your kid is putting in the reps. The least you can do is keep the receipts.
            </p>

            <div className="mt-8 rounded-xl bg-gray-50 p-6 dark:bg-gray-900">
              <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                  One-time purchase
                </p>
                <div className="mt-2">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">$39</span>
                  <span className="ml-2 text-gray-500 dark:text-gray-400">forever</span>
                </div>
              </div>
              <ul className="mt-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>&#10003;&nbsp; Score your first game tonight</li>
                <li>&#10003;&nbsp; Nothing to cancel &mdash; you just own it</li>
                <li>&#10003;&nbsp; 30-day money-back guarantee. Email me. I&rsquo;ll refund you personally.</li>
              </ul>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3">
              <a
                href="https://www.paypal.com/paypalme/carlrandrews"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-lg bg-blue-600 px-8 py-4 text-center text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700 sm:w-auto"
              >
                Get Instant Access &mdash; $39
              </a>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                No subscription. No upsells. No &ldquo;Pro tier.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
