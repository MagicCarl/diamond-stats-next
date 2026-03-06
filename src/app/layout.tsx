import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const monaSans = localFont({
  src: "../../public/fonts/MonaSans.woff2",
  variable: "--font-mona-sans",
  weight: "200 900",
});

export const metadata: Metadata = {
  title: {
    default:
      "My Baseball Stats - Youth Baseball & Softball Stats Tracker App",
    template: "%s | My Baseball Stats",
  },
  description:
    "Score youth baseball and softball games live from your phone. Automatic batting stats (AVG, OBP, SLG, OPS), pitching stats, spray charts, and box scores for Little League, travel ball, rec league, and high school teams. One-time $39 purchase — no subscriptions ever.",
  keywords: [
    "baseball stats app",
    "softball stats app",
    "youth baseball stats tracker",
    "youth softball stats tracker",
    "Little League stats app",
    "travel ball stats tracker",
    "baseball scorekeeping app",
    "softball scorekeeping app",
    "live game scoring baseball",
    "baseball spray chart app",
    "youth baseball box score",
    "pitching stats tracker",
    "baseball stats app for coaches",
    "softball stats app for coaches",
    "baseball stats app for parents",
    "high school baseball stats",
    "rec league baseball stats",
    "batting average calculator",
    "OBP calculator baseball",
    "baseball score keeper app",
    "softball score keeper app",
    "baseball stat tracker iPhone",
    "baseball stat tracker Android",
    "little league scorekeeping",
    "travel baseball stats app",
    "youth sports stats tracker",
    "baseball lineup app",
    "baseball game tracker",
    "softball game tracker",
    "best baseball stats app",
    "best softball stats app",
  ],
  authors: [{ name: "My Baseball Stats" }],
  creator: "My Baseball Stats",
  publisher: "My Baseball Stats",
  metadataBase: new URL("https://mybaseballstats.com"),
  category: "Sports",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mybaseballstats.com",
    siteName: "My Baseball Stats",
    title: "My Baseball Stats - Youth Baseball & Softball Stats Tracker",
    description:
      "Score baseball and softball games live from your phone. Automatic batting stats, pitching stats, spray charts, and box scores for youth teams. $39 one-time — no subscription.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "My Baseball Stats - Live scoring, spray charts, and box scores for youth baseball and softball",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Baseball Stats - Youth Baseball & Softball Stats Tracker",
    description:
      "Score baseball and softball games live from your phone. Batting stats, spray charts, and box scores for youth teams. $39 one-time.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://mybaseballstats.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-R20F8VGXY5"
          strategy="beforeInteractive"
        />
        <Script id="ga-config" strategy="beforeInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-R20F8VGXY5');`}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "My Baseball Stats",
                applicationCategory: "SportsApplication",
                operatingSystem: "Web, iOS, Android",
                url: "https://mybaseballstats.com",
                description:
                  "Score youth baseball and softball games live from your phone. Automatic batting stats, pitching stats, spray charts, and box scores for Little League, travel ball, and high school teams.",
                offers: {
                  "@type": "Offer",
                  price: "39.00",
                  priceCurrency: "USD",
                  availability: "https://schema.org/InStock",
                  priceValidUntil: "2027-12-31",
                },
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: "4.8",
                  ratingCount: "50",
                  bestRating: "5",
                  worstRating: "1",
                },
                featureList: [
                  "Live game scoring from your phone",
                  "Automatic batting stats (AVG, OBP, SLG, OPS)",
                  "Pitching stats tracking (IP, ERA, K, BB)",
                  "Interactive spray charts",
                  "Professional inning-by-inning box scores",
                  "Season stats and team records",
                  "Opponent pitcher and batter tracking",
                  "Real-time sync across multiple devices",
                  "Works for baseball and softball",
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "My Baseball Stats",
                url: "https://mybaseballstats.com",
                potentialAction: {
                  "@type": "SearchAction",
                  target: "https://mybaseballstats.com/?q={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "My Baseball Stats",
                url: "https://mybaseballstats.com",
                logo: "https://mybaseballstats.com/icon.svg",
                sameAs: [],
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "What stats does My Baseball Stats track?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "My Baseball Stats automatically calculates batting average (AVG), on-base percentage (OBP), slugging percentage (SLG), OPS, RBI, stolen bases, strikeouts, walks, doubles, triples, home runs, and more. It also tracks pitching stats including innings pitched, earned runs, strikeouts, walks, and pitch counts.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Does it work for softball too?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes! My Baseball Stats works perfectly for both baseball and softball. The scoring system, stat calculations, and spray charts work identically for both sports at any level — Little League, travel ball, rec league, high school, or college.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How much does My Baseball Stats cost?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "My Baseball Stats is a one-time purchase of $39. There are no monthly fees, no subscriptions, and no hidden charges. You pay once and get unlimited access to all features forever.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Can I score games live from my phone?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes! My Baseball Stats is designed for live scoring at the field. Score every at-bat in real-time from your phone or tablet. The app syncs across devices every 3 seconds, so coaches and parents can follow along live from their own devices.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What are spray charts?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Spray charts show where each player hits the ball on a baseball diamond diagram. Tap the field during live scoring to record hit locations. Over a season, spray charts reveal hitting tendencies and help coaches make better lineup decisions. Hits are color-coded by type: singles (green), doubles (blue), triples (orange), home runs (red), and outs (gray).",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What levels of baseball and softball does it support?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "My Baseball Stats supports all levels: Little League, travel ball, recreational leagues, high school, and college. You can create unlimited teams and seasons to track stats across multiple levels and age groups.",
                    },
                  },
                ],
              },
            ]),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${monaSans.variable} antialiased bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100`}
      >
        <GoogleAnalytics />
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
