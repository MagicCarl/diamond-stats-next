import LandingClient from "./LandingClient";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-gray-950">
      <LandingClient />

      {/* SEO-rich content section — server-rendered, crawlable by search engines */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        {/* Why My Baseball Stats */}
        <div className="mt-16 rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            The Best Baseball &amp; Softball Stats App for Youth Teams
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            My Baseball Stats is the easiest way to track baseball and softball statistics for youth teams.
            Whether you coach Little League, travel ball, rec league, high school, or college — score every
            game live from your phone and get professional-quality stats automatically.
          </p>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            No more spreadsheets or paper scorebooks. Record at-bats in real time and the app calculates
            batting average (AVG), on-base percentage (OBP), slugging percentage (SLG), OPS, RBIs,
            stolen bases, and every stat that matters — instantly.
          </p>
        </div>

        {/* Feature Details */}
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Live Game Scoring</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Score baseball and softball games in real time from any phone or tablet. Track every at-bat,
              pitching change, stolen base, and run scored. The scoreboard updates automatically with outs,
              innings, and the running score. Multiple devices sync every 3 seconds — so coaches, parents,
              and fans can all follow along live.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Batting &amp; Pitching Stats</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Automatic stat calculations including games played, at-bats, hits, doubles, triples, home runs,
              RBIs, walks, strikeouts, stolen bases, batting average, OBP, SLG, and OPS. Pitching stats
              include innings pitched, hits allowed, runs, earned runs, strikeouts, walks, home runs,
              pitch count, and wild pitches.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Spray Charts</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Interactive spray charts show where each player hits the ball on a baseball diamond diagram.
              Color-coded by hit type — singles (green), doubles (blue), triples (orange), home runs (red),
              and outs (gray). View per-game charts or season-long cumulative data to identify hitting tendencies
              and improve coaching decisions.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Box Scores &amp; Game Logs</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Professional inning-by-inning box scores with runs, hits, and errors — just like you see on TV.
              Complete batting stat lines for every player, plus a chronological play-by-play game log showing
              every at-bat, result, and RBI throughout the game.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Stats Search</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Filter your stats by opponent, pitcher, pitcher handedness (lefty vs. righty), and date range.
              See how your players perform against specific teams, how they hit against left-handed pitching,
              or how their stats trend over time. Powerful splits analysis that was previously only available
              to pro teams.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Opponent Tracking</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Track opponent pitchers and batters throughout the game. When you face a repeat opponent, their
              roster loads automatically from the previous matchup — no re-entry needed. Build a scouting
              database over the course of a season.
            </p>
          </div>
        </div>

        {/* Who It's For */}
        <div className="mt-10 rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Built for Every Level of Baseball &amp; Softball
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Little League</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Perfect for Little League coaches and parents who want to track their players&apos; development
                without complicated scorekeeping software.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Travel Ball</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Travel baseball and softball teams need reliable stats for tournaments and showcases.
                Track multiple seasons and teams in one place.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">High School &amp; Rec League</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                High school coaches, rec league managers, and college clubs get pro-level stat tracking
                at a fraction of the cost of other scorekeeping apps.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                What stats does My Baseball Stats track?
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Batting stats include AVG, OBP, SLG, OPS, at-bats, hits, doubles, triples, home runs,
                RBIs, walks, strikeouts, stolen bases, caught stealing, sacrifice flies, and sacrifice bunts.
                Pitching stats include innings pitched, earned runs, strikeouts, walks, hits allowed,
                home runs allowed, pitch count, hit batters, and wild pitches.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Does it work for softball?
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Yes! My Baseball Stats works perfectly for both baseball and softball at any level.
                The scoring, stat formulas, and spray charts are the same for both sports.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                How much does it cost?
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                $39 one-time purchase. No monthly fees, no subscriptions, no in-app purchases.
                Pay once and use it forever with unlimited teams, seasons, and games.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Can multiple people follow a game live?
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Yes! One person scores the game at the field while coaches, parents, and fans follow
                along in real time from their own device. The live scoring page syncs every 3 seconds.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                What devices does it work on?
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                My Baseball Stats is a web app that works on any device with a browser — iPhone, Android,
                iPad, tablet, laptop, or desktop. No app store download required. Just open
                mybaseballstats.com and start scoring.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                How is this different from other baseball stats apps?
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Most baseball scorekeeping apps charge monthly subscriptions of $10-$30/month. My Baseball
                Stats is a flat $39 one-time purchase with no ongoing fees. You get live scoring, spray
                charts, advanced stat splits, opponent tracking, and real-time multi-device sync — features
                that typically cost $200+/year elsewhere.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Start Tracking Your Team&apos;s Stats Today
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Join coaches and parents who trust My Baseball Stats to score their games and track their
            players&apos; development. Works for baseball and softball at every level.
          </p>
          <a
            href="/signup"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700"
          >
            Get Started Free
          </a>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Create your account and explore the app. Purchase when you&apos;re ready to score games.
          </p>
        </div>
      </section>
    </div>
  );
}
