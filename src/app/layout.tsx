import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "My Baseball Stats - Youth Baseball Stats Tracker",
    template: "%s | My Baseball Stats",
  },
  description:
    "Score youth baseball games live from your phone. Automatic batting stats (AVG, OBP, SLG, OPS), pitching stats, spray charts, and box scores for Little League, travel ball, and high school teams. $39 one-time.",
  keywords: [
    "youth baseball stats",
    "baseball stats tracker",
    "Little League stats app",
    "travel ball stats",
    "baseball scorekeeping app",
    "live game scoring",
    "baseball spray chart",
    "youth baseball box score",
    "pitching stats tracker",
    "baseball stats app for coaches",
  ],
  authors: [{ name: "My Baseball Stats" }],
  creator: "My Baseball Stats",
  metadataBase: new URL("https://mybaseballstats.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mybaseballstats.com",
    siteName: "My Baseball Stats",
    title: "My Baseball Stats - Youth Baseball Stats Tracker",
    description:
      "Score games live from your phone. Automatic batting stats, pitching stats, spray charts, and box scores for youth baseball teams. $39 one-time — no subscription.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "My Baseball Stats - Live scoring, spray charts, and box scores for youth baseball",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Baseball Stats - Youth Baseball Stats Tracker",
    description:
      "Score games live from your phone. Automatic batting stats, spray charts, and box scores for youth baseball. $39 one-time.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "My Baseball Stats",
              applicationCategory: "SportsApplication",
              operatingSystem: "Web",
              url: "https://mybaseballstats.com",
              description:
                "Score youth baseball games live from your phone. Automatic batting stats, pitching stats, spray charts, and box scores for Little League, travel ball, and high school teams.",
              offers: {
                "@type": "Offer",
                price: "39.00",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
              },
              featureList: [
                "Live game scoring",
                "Automatic batting stats (AVG, OBP, SLG, OPS)",
                "Pitching stats tracking",
                "Spray charts",
                "Professional box scores",
                "Season stats and records",
                "Opponent tracking",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100`}
      >
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
