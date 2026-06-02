# Possible Social Media Engagement

Plan for an admin-only "paste once, post everywhere" tool built into BaseballStatsTracker.

---

## Overview

**New tab on `/admin`** called "Post" with one form:

- Text body (with live char counter showing X's 280 limit)
- Optional image URL (X + Facebook)
- Optional video URL (TikTok)
- 3 checkboxes (X / Facebook / TikTok) — auto-checked based on what you filled in
- Submit → per-platform success/error shown inline

**New API route** `/api/admin/social/post` (admin-gated, fan-out in parallel, returns per-platform result)

---

## Library Modules

Three modules in `src/lib/social/`:

- `x.ts` — Twitter API v2, OAuth 1.0a User Context (via `twitter-api-v2` package — well-maintained, ~150KB)
- `facebook.ts` — Graph API, posts to a Page you admin (no package needed)
- `tiktok.ts` — Content Posting API, `PULL_FROM_URL` mode (no package needed)

---

## Environment Variables

Paste keys into Vercel + `.env.local`:

```
# X / Twitter (OAuth 1.0a — needs all four)
X_API_KEY=
X_API_SECRET=
X_ACCESS_TOKEN=
X_ACCESS_TOKEN_SECRET=

# Facebook Page (long-lived Page Access Token, not user token)
FACEBOOK_PAGE_ID=
FACEBOOK_PAGE_ACCESS_TOKEN=

# TikTok
TIKTOK_ACCESS_TOKEN=
```

---

## Caveats / Things to Know Up Front

1. **TikTok video URL must be on a domain you've verified** in the TikTok developer portal. Easy fix: verify `baseballstatstracker.com`, then host the video at e.g. `/videos/foo.mp4` in your `public/` folder.
2. **TikTok access tokens expire every 24 hours** — refresh tokens last 365 days. v1 will just use the access token; if you want auto-refresh later we add a small token store.
3. **Facebook**: posts to a Page (Business/Creator), not your personal timeline — Meta's API doesn't allow personal-timeline posts anymore.

---

## Platform API Capability Matrix

| Platform | API accepts | Notes |
|---|---|---|
| **X (Twitter)** | Text (≤280 chars) + optional image/video | OAuth 1.0a User Context simplest for single-user posting |
| **Facebook** | Long text + optional image | Page Access Token, not user token |
| **TikTok** | Video only (no text-only posts) | Caption + video file/URL required; domain verification needed for PULL_FROM_URL |

---

## Files to Create / Modify

- `src/lib/social/x.ts` (new)
- `src/lib/social/facebook.ts` (new)
- `src/lib/social/tiktok.ts` (new)
- `src/lib/social/types.ts` (new — shared types)
- `src/app/api/admin/social/post/route.ts` (new)
- `src/components/admin/SocialPostTab.tsx` (new)
- `src/app/(app)/admin/page.tsx` (modify — add tab)
- `.env.example` (modify — document new env vars)

---

## Status

Plan drafted, awaiting confirmation to build.
