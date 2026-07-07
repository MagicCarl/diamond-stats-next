import Link from "next/link";
import { getTranslations } from "next-intl/server";

const guides = [
  { href: "/learn/gamechanger-vs-baseball-stats-tracker", label: "GameChanger vs BST" },
  { href: "/learn/gamechanger-alternatives", label: "GameChanger Alternatives" },
  { href: "/learn/gamechanger-pricing", label: "GameChanger Pricing" },
  { href: "/learn/best-baseball-stats-apps", label: "Best Baseball Stats Apps" },
  { href: "/learn/baseball-stats-explained", label: "Baseball Stats Explained" },
  { href: "/learn/how-to-keep-score-in-baseball", label: "How to Keep Score" },
  { href: "/learn/how-to-keep-score-in-softball", label: "Softball Scoring Guide" },
  { href: "/learn/baseball-spray-chart-guide", label: "Spray Chart Guide" },
  { href: "/free-baseball-scorecard", label: "Free Printable Scorecard" },
];

export default async function Footer() {
  const [tc, tf] = await Promise.all([
    getTranslations("marketing.common"),
    getTranslations("marketing.footer"),
  ]);

  const linkClass = "hover:text-gray-700 dark:hover:text-gray-300";

  return (
    <footer className="border-t border-gray-200 px-6 py-8 dark:border-gray-800">
      <div className="mx-auto max-w-4xl text-center text-sm text-gray-500 dark:text-gray-400">
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          <Link href="/" className={linkClass}>{tc("navHome")}</Link>
          <Link href="/features" className={linkClass}>{tc("navFeatures")}</Link>
          <Link href="/pricing" className={linkClass}>{tc("navPricing")}</Link>
          <Link href="/compare" className={linkClass}>{tc("navCompare")}</Link>
          <Link href="/login" className={linkClass}>{tc("navSignIn")}</Link>
          <Link href="/signup" className={linkClass}>{tc("navSignUp")}</Link>
          <Link href="/privacy" className={linkClass}>{tf("privacy")}</Link>
        </nav>
        <nav className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2">
          <Link href="/learn" className={`font-medium ${linkClass}`}>{tf("guides")}</Link>
          {guides.map((g) => (
            <Link key={g.href} href={g.href} className={linkClass}>
              {g.label}
            </Link>
          ))}
        </nav>
        <p className="mt-4">{tc("footerRights", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
