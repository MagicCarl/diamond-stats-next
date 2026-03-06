import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing - $39 One-Time Baseball & Softball Stats App",
  description:
    "My Baseball Stats costs $39 one-time with no monthly fees or subscriptions. Unlimited teams, seasons, and games. Live scoring, spray charts, batting stats, pitching stats, and box scores for youth baseball and softball.",
  keywords: [
    "baseball stats app price",
    "cheap baseball stats app",
    "affordable baseball scorekeeping app",
    "baseball stats app no subscription",
    "one time purchase baseball app",
    "best value baseball stats tracker",
    "softball stats app pricing",
  ],
  alternates: {
    canonical: "https://mybaseballstats.com/pricing",
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-gray-950">
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="h-8 w-8">
            <circle cx="32" cy="32" r="30" fill="#f5f5f5" stroke="#cc0000" strokeWidth="2"/>
            <path d="M20 8 C22 14, 22 20, 20 26 C18 32, 18 38, 20 44 C22 50, 22 56, 20 56" fill="none" stroke="#cc0000" strokeWidth="2" strokeLinecap="round"/>
            <path d="M44 8 C42 14, 42 20, 44 26 C46 32, 46 38, 44 44 C42 50, 42 56, 44 56" fill="none" stroke="#cc0000" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-xl font-bold tracking-tight">MyBaseballStats</span>
        </Link>
        <Link
          href="/signup"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Get Started
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-center text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
          One Price. Everything Included.
        </h1>
        <p className="mt-4 text-center text-lg text-gray-600 dark:text-gray-400">
          No monthly fees. No per-team charges. No feature gates. Pay once, use forever.
        </p>

        {/* Pricing Card */}
        <div className="mx-auto mt-12 max-w-md rounded-2xl border-2 border-blue-600 bg-white p-8 text-center shadow-lg dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400">All Features</h2>
          <div className="mt-4">
            <span className="text-6xl font-bold text-gray-900 dark:text-white">$39</span>
            <span className="ml-2 text-xl text-gray-500 dark:text-gray-400">one-time</span>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Lifetime access — no recurring charges
          </p>

          <ul className="mt-8 space-y-3 text-left text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-500">&#10003;</span>
              <span>Unlimited teams &amp; seasons</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-500">&#10003;</span>
              <span>Unlimited games</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-500">&#10003;</span>
              <span>Live game scoring from any device</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-500">&#10003;</span>
              <span>Automatic batting stats (AVG, OBP, SLG, OPS, and more)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-500">&#10003;</span>
              <span>Pitching stats &amp; pitch-by-pitch tracking</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-500">&#10003;</span>
              <span>Interactive spray charts (per-game &amp; season)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-500">&#10003;</span>
              <span>Professional inning-by-inning box scores</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-500">&#10003;</span>
              <span>Advanced stats search &amp; splits</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-500">&#10003;</span>
              <span>Opponent pitcher &amp; batter tracking</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-500">&#10003;</span>
              <span>Real-time multi-device sync</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-500">&#10003;</span>
              <span>Works for baseball &amp; softball</span>
            </li>
          </ul>

          <a
            href="https://www.paypal.com/paypalme/carlrandrews"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block w-full rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
          >
            Purchase Now — $39
          </a>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Secure payment via PayPal. Your account is activated within 24 hours of purchase.
          </p>
        </div>

        {/* Value comparison */}
        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
            How My Baseball Stats Compares
          </h2>
          <p className="mt-3 text-center text-gray-600 dark:text-gray-400">
            Most baseball stats apps charge $10-$30 per month. Over a single season, that&apos;s $60-$180.
            Over three years, you&apos;d spend $360-$1,080. My Baseball Stats is just $39 total — forever.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">1 Season</h3>
              <div className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">$39</div>
              <p className="mt-1 text-sm text-gray-500">vs. $60-$180 elsewhere</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">2 Seasons</h3>
              <div className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">$39</div>
              <p className="mt-1 text-sm text-gray-500">vs. $120-$360 elsewhere</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">5+ Seasons</h3>
              <div className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">Still $39</div>
              <p className="mt-1 text-sm text-gray-500">vs. $600-$1,800 elsewhere</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pricing FAQ</h2>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Is there a free trial?</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                You can create a free account and explore the app. You&apos;ll be able to set up teams,
                add players, and view the interface. Creating and scoring games requires the $39 purchase.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Are there any hidden fees?</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                No. $39 is the complete price. No monthly fees, no per-team charges, no feature
                upgrades, no in-app purchases. Every feature is included.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Can I track multiple teams?</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Yes. Your purchase includes unlimited teams, seasons, and games. Coach three teams across
                two age groups? No problem — one account covers everything.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">How do I pay?</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Payment is processed securely through PayPal. After payment, your account is activated
                within 24 hours (usually much faster). No credit card information is stored on our servers.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/signup"
            className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700"
          >
            Create Free Account
          </Link>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Explore the app free. Purchase when you&apos;re ready.
          </p>
        </div>
      </main>

      <footer className="border-t border-gray-200 px-6 py-8 dark:border-gray-800">
        <div className="mx-auto max-w-4xl text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} My Baseball Stats. All rights reserved.</p>
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
