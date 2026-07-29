import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  // Note: the `/?post=<slug>` → `/blog/<slug>` redirect lives in src/proxy.ts,
  // not here — `redirects()` appends the source query string to the destination.
};

export default withNextIntl(nextConfig);
