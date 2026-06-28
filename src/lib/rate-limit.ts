import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

/**
 * Distributed rate limiting backed by Upstash Redis.
 *
 * On Vercel's serverless platform each request may hit a fresh isolate, so an
 * in-memory counter is useless — state must live in a shared store. Upstash is
 * a serverless-friendly Redis accessed over HTTP.
 *
 * Configure via env vars (set automatically by the Vercel Upstash integration):
 *   - UPSTASH_REDIS_REST_URL
 *   - UPSTASH_REDIS_REST_TOKEN
 *
 * If those are absent (e.g. local dev without Upstash), rate limiting is
 * skipped (fail-open) so development isn't blocked. In production you should
 * always have them set.
 */
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

if (!redis && process.env.NODE_ENV === "production") {
  // Surface a loud warning rather than silently shipping with no protection.
  console.warn(
    "[rate-limit] Upstash env vars missing in production — rate limiting is DISABLED.",
  );
}

// Reuse limiter instances across invocations so their sliding windows share
// the same Redis keys (one limiter per named bucket).
const limiters = new Map<string, Ratelimit>();

function getLimiter(name: string, limit: number, window: Duration): Ratelimit | null {
  if (!redis) return null;
  let limiter = limiters.get(name);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, window),
      prefix: `rl:${name}`,
      analytics: false,
    });
    limiters.set(name, limiter);
  }
  return limiter;
}

/** Best-effort client IP from Vercel-set proxy headers. */
export function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "127.0.0.1";
}

export interface RateLimitOptions {
  /** Bucket name — groups requests that share a budget (e.g. "auth"). */
  name: string;
  /** Max requests allowed per window. */
  limit: number;
  /** Window duration, e.g. "60 s", "1 m", "1 h". */
  window: Duration;
  /** Identity to limit on. Defaults to client IP. Pass a user id to scope per-account. */
  identifier?: string;
}

/**
 * Enforces a rate limit for the request. Returns a ready-to-send 429 response
 * when the caller is over the limit, or `null` when the request may proceed.
 *
 * Usage:
 *   const limited = await enforceRateLimit(req, { name: "auth", limit: 10, window: "1 m" });
 *   if (limited) return limited;
 */
export async function enforceRateLimit(
  req: NextRequest,
  opts: RateLimitOptions,
): Promise<NextResponse | null> {
  const limiter = getLimiter(opts.name, opts.limit, opts.window);
  if (!limiter) return null; // not configured → fail open

  const id = opts.identifier ?? getClientIp(req);
  const { success, limit, remaining, reset } = await limiter.limit(
    `${opts.name}:${id}`,
  );
  if (success) return null;

  const retryAfter = Math.max(0, Math.ceil((reset - Date.now()) / 1000));
  return NextResponse.json(
    { error: "Too many requests. Please slow down and try again shortly." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": String(remaining),
      },
    },
  );
}
