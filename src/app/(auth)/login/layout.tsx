import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - Baseball & Softball Stats Tracker",
  description:
    "Sign in to My Baseball Stats to score games live, track batting and pitching stats, spray charts, and box scores for your youth baseball or softball team.",
  alternates: {
    canonical: "https://mybaseballstats.com/login",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
