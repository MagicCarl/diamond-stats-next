# i18n Language Settings — Progress Checkpoint

**Last updated:** 2026-05-28
**Task:** Add multi-language support to Baseball Stats Tracker.

## Where we are

Brainstorming (superpowers) is **complete**. Design is approved and the spec is
committed: [2026-05-28-i18n-language-settings-design.md](./2026-05-28-i18n-language-settings-design.md).

Currently at the **user-review gate** — waiting for the user to review the
committed spec before invoking the `superpowers:writing-plans` skill to produce
the implementation plan. (No implementation code written yet.)

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
