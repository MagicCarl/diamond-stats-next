# Project Status — Reminder Notes

_Last updated: 2026-06-28_

A snapshot of recent work and what's still on your plate.

---

## ✅ Done & live in production

### Security hardening
- **HSTS header** added in `src/proxy.ts` — live and verified on `www.baseballstatstracker.com`
  (`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`).
- **Rate limiting** code added (`src/lib/rate-limit.ts`) on 3 endpoints:
  - `analytics/events` (unauthenticated public write): 30/min per IP
  - `auth/verify`: 20/min per IP
  - `checkout`: 5/min per user
  - **Status: DORMANT by choice** — fail-open until Upstash is connected (see below). App works fine without it.

### Soro blog embed (landing page)
- Added `#soro-blog` container + loader via client component `src/components/SoroBlog.tsx`
  (injected client-side so the script actually executes — `next/script` only preloaded it).
- Allowlisted `app.trysoro.com` in CSP `script-src` and `connect-src` (`src/proxy.ts`).
- **Working** — renders Soro's empty-state until articles are published.

---

## ⏳ On my plate (open items)

### 1. Merge PR #1 → `main`  ← only real loose end
- Production runs the `security-hardening` branch (deployed via CLI), but `main` is behind.
- PR: https://github.com/MagicCarl/diamond-stats-next/pull/1
- Merge it whenever ready to bring `main` up to date.
  (If Vercel auto-deploys from `main`, merging triggers one more identical deploy — harmless.)

### 2. Publish blog articles in Soro (optional)
- Blog shows "Published articles may take up to 60 minutes to appear here" until you publish posts in app.trysoro.com.
- Published posts can take up to ~60 min to appear. No redeploy needed.

### 3. Upstash / rate limiting — SKIPPED for now (deliberate)
- To activate rate limiting later: provision a free Upstash Redis DB in Vercel
  (Project → Storage → Create Database → Upstash for Redis → connect to project),
  which auto-adds `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`, then redeploy.
- No rush — defense-in-depth, low urgency. Code is already in place; it's just a toggle.

---

## ⚠️ Things to know (no action needed)

- **Soro blog + privacy browsers:** DuckDuckGo, Brave strict mode, and aggressive ad/tracker
  blockers block the third-party Soro script, so those users won't see the blog. Inherent to the embed.
- **Soro blog + SEO:** articles are rendered client-side by JS from Soro's servers, so the blog
  content largely **won't help Google SEO**. Fine if the blog is just for visitors to read; revisit
  the approach if SEO ranking from blog content matters.
- **`gtag` "content blocker" console message:** harmless — it's your own browser's ad/privacy
  blocker blocking Google Analytics. Real visitors without blockers load it fine.

---

## Uncommitted local files (not in repo)
- `youtube-content-plan.md` — marketing/content plan (intentionally left out of git).
- `PROJECT_STATUS.md` — this file.
