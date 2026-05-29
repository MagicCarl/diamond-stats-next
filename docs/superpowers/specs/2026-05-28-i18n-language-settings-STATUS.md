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

**Screen extraction COMPLETE (T15–T25, all committed).** Every English string
across the whole authenticated app + auth pages is now in `messages/en.json`
(493 keys, 10 top-level namespaces: common, nav, settings, dashboard, games,
teams, stats, instructions, auth, admin).

**T26 COMPLETE** — all 4 non-English catalogs translated (es/ja/ko/zh-Hant),
493 keys each, exact parity. Machine-translated; native review recommended.
**T27 COMPLETE** — parity test (`src/i18n/parity.test.ts`) + script
(`scripts/check-i18n-parity.mjs`, `npm run i18n:check`). 16 unit tests pass,
parity OK.

### PHASE 2 — MARKETING PAGE TRANSLATION (in progress, 2026-05-29)

User asked to translate ALL marketing pages into the 5 languages. Approach:
translate visible copy page-by-page, commit + deploy each; leave SEO
metadata/JSON-LD in English (search-engine layer, needs URL routing for real
SEO value which we don't have).

- ✅ **Landing page DONE + DEPLOYED** — `src/app/page.tsx` (server, getTranslations)
  + `src/app/LandingClient.tsx` (client, useTranslations), namespace
  `marketing.landing` (~95 keys) translated into all 5 locales. Parity OK, build
  OK, rendered in all 5 langs. Live at www.baseballstatstracker.com.
- ⏳ REMAINING marketing pages (each: extract → `marketing.<page>` namespace →
  refactor to getTranslations (server) → translate 4 langs → parity/build →
  deploy):
  - `src/app/features/page.tsx` (server, 317 lines, has metadata block — leave meta English)
  - `src/app/pricing/page.tsx` (server, 237 lines, metadata block)
  - `src/app/learn/gamechanger-alternatives/page.tsx` (server, 469 lines, metadata block)
  - `src/app/privacy/page.tsx` (server, 59 lines, metadata block)
- Recipe for these server pages: `const t = await getTranslations("marketing.<page>")`;
  rich text via `t.rich(key, tags)` with tag handlers defined in the component;
  insert translated namespace into each locale file BEFORE the `"admin": {` key
  (anchor used so far) to keep parity. Run `npm run i18n:check` + `npm run build`
  before deploy.

### DEPLOYED TO PRODUCTION (2026-05-29)

- Deployed via `vercel deploy --prod` (fresh prod build, prod env vars) — live at
  **www.baseballstatstracker.com**. GitHub `main` pushed/in sync.
- Added a **"Select Language" picker to the landing page** header (LandingClient,
  next to ThemeToggle) via a new `placeholder` mode on `LanguageSwitcher`.
- Preview-domain note: Google sign-in + saved-password autofill don't work on
  `*.vercel.app` preview URLs (Firebase authorized-domains + per-domain password
  managers). They work on the production domain. Auth code was verified
  unchanged by the i18n work (diff vs origin/main).
- ⚠️ STILL ENGLISH: the landing/marketing page **content** (`/`, `/features`,
  `/pricing`, `/learn/*`, `/privacy`) is NOT translated — only the picker was
  added. Full marketing-page translation is the deferred Phase 2 (large: SEO copy
  + JSON-LD metadata). Awaiting user decision.

**T28 COMPLETE — all gates passed. The i18n feature is DONE.**
- `npx vitest run` → 16 tests pass.
- `npm run i18n:check` → "i18n parity OK" (493 keys × 5 locales).
- `npm run build` → "Compiled successfully" (only the pre-existing lockfile
  workspace-root warning, unrelated to i18n).
- Locale rendering verified: fetched `/login` with `NEXT_LOCALE` set to each of
  en/es/ja/ko/zh-Hant — each rendered its translated title, zero "missing
  message" warnings in the dev log.

### Known pre-existing lint errors (NOT from this work, not blocking)

`npm run lint` reports 15 errors + 4 warnings, all pre-existing and unrelated to
i18n (Next 16 ships stricter react-hooks rules):
- `src/components/ui/ThemeToggle.tsx` — react-hooks/set-state-in-effect.
- `src/app/(app)/teams/[teamId]/stats/page.tsx` — react-hooks/static-components
  (the `SortHeader` component is defined inside the page component; predates this
  work).
- Warnings: a couple of unused imports (`PitchRecord`, `RESULT_LABELS`) and
  exhaustive-deps — minor, pre-existing.
Next 16's `next build` does NOT run ESLint, so these don't block the build/deploy.

### Remaining for the user (optional, out of scope)
- Native-speaker review of the 4 machine-translated catalogs before public
  reliance (baseball terminology especially).
- Reconcile Prisma migration-history drift (see below) so future
  `migrate deploy` runs cleanly.
- Could clean up the pre-existing lint errors separately.

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
