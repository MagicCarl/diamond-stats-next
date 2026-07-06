import type { Metadata } from "next";
import WatchClient from "./WatchClient";

export const metadata: Metadata = {
  title: "Live Game | Baseball Stats Tracker",
  description: "Follow this baseball game live — score, box score, and play-by-play.",
  robots: { index: false },
};

export default async function WatchPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <WatchClient token={token} />;
}
