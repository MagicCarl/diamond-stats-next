# i18n Language Settings — Progress Checkpoint

**Last updated:** 2026-05-28
**Task:** Add multi-language support to Baseball Stats Tracker.

## Where we are

Brainstorming + planning (superpowers) **complete**. Both committed:

- Spec: [2026-05-28-i18n-language-settings-design.md](./2026-05-28-i18n-language-settings-design.md)
- Plan: [../plans/2026-05-28-i18n-language-settings.md](../plans/2026-05-28-i18n-language-settings.md)

The plan has **28 tasks** in 4 phases (engine T1–14, screen extraction T15–25,
translations T26, verification T27–28). Tasks 1–13 have full code; screen tasks
follow the "Translation Recipe" in Task 14.

**Progress:** Tasks 1–14 complete and committed — the **entire engine is
done**. next-intl boots, `<html lang>` renders, `User.language` persists to DB
+ `NEXT_LOCALE` cookie, `PATCH /api/user/language` works, AuthProvider exposes
`language`/`setLanguage`, LanguageSwitcher is in the NavBar (desktop + mobile),
and the Settings page is real. Dev server verified: `/` and `/settings` both
HTTP 200. 12 unit tests passing.

**Screen extraction progress (as of 2026-05-28 EOD):**

DONE & committed: nav, settings, dashboard (T15), new game (T16), live scoring
(T17 — the big 1500-line one), box score (T18), game spray chart (T19), team
detail (T20). Each is its own commit (`feat(i18n): translate <screen>`).

REMAINING screens — pick up at **T21**:
- T21 team stats — `src/app/(app)/teams/[teamId]/stats/page.tsx` — ns `teams.stats`
- T22 team spray chart — `src/app/(app)/teams/[teamId]/spray-chart/page.tsx` — ns `teams.sprayChart`
- T23 stats search — `src/app/(app)/stats/search/page.tsx` — ns `stats.search`
- T24 instructions — `src/app/(app)/instructions/page.tsx` — ns `instructions`
- T25 admin + shared UI + auth — admin page (ns `admin`), AnalyticsTab, UsersTab,
  Modal (close aria-label), Spinner (aria), login (ns `auth.login`), signup
  (ns `auth.signup`); add LanguageSwitcher to login + signup pages.
- T26 translate `messages/{es,ja,ko,zh-Hant}.json` from `en.json` (still English copies).
- T27 add parity check (`src/i18n/parity.test.ts` + `scripts/check-i18n-parity.mjs` + `i18n:check` npm script).
- T28 full verify: `npm test`, `npm run i18n:check`, `npm run lint`, `npm run build`, manual pass per locale.

**Per-screen recipe (what I do each time):** read the page → add an `en.json`
namespace (stat abbrevs stay literal; `RESULT_*`/`LEVELS`/`POSITIONS` from
constants stay literal) → refactor to `useTranslations("ns")` (+ `tc` for
`common`) → `for l in es ja ko zh-Hant; do cp messages/en.json messages/$l.json; done`
→ `npx tsc --noEmit` → commit. ICU plural/param via `t("k",{count})`; rich text
via `t.rich`.

Convention reminders: stat abbreviations (AVG/OBP/ERA/K/BB/HR/RBI/SB/CS/IP)
stay literal; only full-word labels/tooltips get keys. `RESULT_LABELS` /
`RESULT_FULL_NAMES` / `LEVELS` live in `src/lib/constants.ts` and are left
untranslated this pass (data-layer concern). Plural/param strings use ICU via
`t("key", { count })`; rich text uses `t.rich`.

Note: `messages/{es,ja,ko,zh-Hant}.json` are currently English copies of
`en.json` (placeholders) — real translation happens in Task 26.

### Test/verify commands

- `npx vitest run` — unit tests
- `npm run i18n:check` — (added in T27) key parity
- `npm run build` — production build

### ⚠️ Database migration drift (important)

Running `prisma migrate dev` for Task 8 revealed **schema drift**: the live
Supabase DB is *ahead* of the migration history on disk
(`prisma/migrations/` is missing `analytics_events`, `users.deleted_at`,
`users.is_admin`, `users.is_paid` — these exist in prod but have no migration
file). `migrate dev` wanted to **reset/drop all data**, which we did NOT do.

Instead, the `language` column was added **surgically and non-destructively**:
`ALTER TABLE users ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'en'`
(verified present, default `'en'`, NOT NULL). No migration file was created.

Pre-existing follow-up for the user (out of scope for i18n): the migration
history should be reconciled with production (e.g. baseline the existing schema
with `prisma migrate resolve`) so future `migrate deploy` works cleanly.

## Decisions locked in (from brainstorming Q&A)

- **Rollout:** Engine + full authenticated app UI translated **now** (not a
  vertical slice).
- **Scope:** Authenticated `(app)` screens + NavBar + shared UI components +
  login/signup pages. Marketing/landing/SEO pages are a later phase.
- **Locales (5):** English (default), Spanish (`es`), Japanese (`ja`),
  Korean (`ko`), Chinese Traditional (`zh-Hant`).
- **Engine:** next-intl, "without i18n routing" mode (no `/es/` URL prefix yet).
- **Persistence:** `User.language` field in DB, mirrored to a `NEXT_LOCALE`
  cookie for SSR. Switcher in NavBar (desktop + mobile) AND a real Settings page
  (currently a dead redirect to dashboard).
- **Baseball conventions:** stat abbreviations (AVG, OBP, ERA, K, BB, HR, RBI…)
  stay English/Latin; only full-word labels/tooltips are translated. Rate stats
  render as `.345` regardless of locale.
- **Translations:** AI-generated for the 4 non-English locales; native review
  recommended (flagged to user).

## Key codebase facts discovered

- App is almost entirely client components (`"use client"`) → resolve locale on
  server in root layout, provide via `NextIntlClientProvider`.
- No i18n library currently installed (the `locale` grep hits are date
  formatting only).
- `User` model already has a `theme String @default("dark")` field — mirror that
  pattern for `language`.
- `src/app/(app)/settings/page.tsx` is a dead redirect to `/dashboard` → becomes
  the real Settings page.
- `AuthProvider` fetches `POST /api/auth/verify` and exposes `appUser`
  (isPaid, isAdmin) → extend with `language` + a `setLanguage()` helper.
- `ThemeToggle` lives in `NavBar` (desktop + mobile) → put `LanguageSwitcher`
  next to it.
- Root layout `src/app/layout.tsx` has lots of SEO metadata + JSON-LD (out of
  scope to translate this phase).

## Next step

Invoke `superpowers:writing-plans` to create the implementation plan from the
approved spec. Then implement in the spec's "Work order" sequence:
1. Engine + config + `User.language` migration + cookie plumbing
2. Extract English strings → `messages/en.json`, refactor to `useTranslations()`
3. Generate `es/ja/ko/zh-Hant` catalogs
4. LanguageSwitcher + real Settings page + verify/`PATCH` endpoint wiring
5. Verify (key-parity check, unit tests, build/lint, manual pass)
