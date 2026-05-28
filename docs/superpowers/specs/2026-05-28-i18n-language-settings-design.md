# i18n / Language Settings — Design

**Date:** 2026-05-28
**Status:** Approved (design)
**Author:** Carl Andrews (with Claude)

## Goal

Baseball is played worldwide. Add multi-language support so users can use the
app in their own language. This phase delivers the i18n **engine** plus full
translation of the **authenticated app UI** into the five highest-value baseball
locales. Marketing/landing pages are a deliberate later phase.

## Scope

**In scope**

- The i18n engine (next-intl, no URL-based routing).
- Full translation of all authenticated `(app)` screens:
  - `dashboard`
  - `games/new`, `games/[gameId]/live`, `games/[gameId]/box`, `games/[gameId]/spray-chart`
  - `teams/[teamId]`, `teams/[teamId]/stats`, `teams/[teamId]/spray-chart`
  - `stats/search`
  - `instructions`
  - `settings`
  - `admin`
- `NavBar` and shared UI components with built-in user-facing text.
- Login and signup pages (`(auth)/login`, `(auth)/signup`).
- A `User.language` preference persisted to the database.
- A language switcher in the NavBar and a real Settings page.

**Out of scope (later phase)**

- Marketing/SEO pages: `/` (landing), `/features`, `/pricing`, `/learn/*`,
  `/privacy`. These need URL-based locale routing for SEO and are handled
  separately.
- Translating the SEO metadata / JSON-LD in the root layout.
- Moving the theme control into Settings (the page will leave room for it).
- RTL languages (none of the chosen locales are RTL).

## Locales

| Locale code | Language | Baseball market |
|-------------|----------|-----------------|
| `en` (default) | English | USA / international |
| `es` | Spanish | Dominican Republic, Venezuela, Cuba, Mexico, Puerto Rico, Panama |
| `ja` | Japanese | Japan (NPB, high school) |
| `ko` | Korean | South Korea (KBO) |
| `zh-Hant` | Chinese (Traditional) | Taiwan (CPBL) |

## Architecture

### Library

Use **next-intl** in its "without i18n routing" mode (no `/es/` URL prefix in
this phase). It fits the Next.js 16 App Router, works in both server and client
components, provides ICU message formatting (plurals, interpolation), and
locale-aware number/date formatting. A future marketing phase can layer URL
routing on top without rewriting the translation layer.

> Use the latest `next-intl` release and consult the official next-intl App
> Router docs during implementation for exact API shapes.

### Files

```
next.config.ts            # wrapped with createNextIntlPlugin
src/i18n/
  config.ts               # SUPPORTED_LOCALES, DEFAULT_LOCALE, Locale type, locale display names
  request.ts              # getRequestConfig: resolve locale + load messages
messages/
  en.json                 # source catalog (authoritative key set)
  es.json
  ja.json
  ko.json
  zh-Hant.json
```

### Locale resolution

Resolved once per request in `src/i18n/request.ts`, in this order:

1. `NEXT_LOCALE` cookie (set when the user picks a language, and mirrored from
   the DB on login).
2. `Accept-Language` request header (best match against supported locales).
3. `en` (default).

The root layout (`src/app/layout.tsx`) calls `getLocale()` / `getMessages()`,
sets `<html lang={locale}>`, and wraps the tree in `NextIntlClientProvider` so
the mostly-client-component app can use `useTranslations()`. Server components
use `getTranslations()`.

### Message catalog structure

Namespaced by area so keys stay organized and screens can be translated
independently:

```json
{
  "common": { "save": "Save", "cancel": "Cancel", "delete": "Delete", "...": "..." },
  "nav": { "dashboard": "Dashboard", "statsSearch": "Stats Search", "...": "..." },
  "dashboard": { "...": "..." },
  "games": { "...": "..." },
  "auth": { "...": "..." }
}
```

## Data model & persistence

### Schema change

Add to the `User` model (mirrors the existing `theme` field pattern):

```prisma
language String @default("en") @map("language")
```

A Prisma migration adds the column with default `"en"` (backfills existing rows).

### API changes

- **`POST /api/auth/verify`** — include `language` in the returned user payload.
  On verify, mirror the DB `language` into the `NEXT_LOCALE` cookie so SSR is
  correct on the next navigation without a per-request DB read.
- **`PATCH /api/user/language`** (new) — body `{ language }`, validated against
  `SUPPORTED_LOCALES` with zod. Authenticated via `getAuthUser(req)`. Updates
  `User.language` and sets the `NEXT_LOCALE` cookie. Returns the saved value.

### Client wiring

`AuthProvider` exposes `language` (from the verify payload) and a
`setLanguage(locale)` helper that calls `PATCH /api/user/language` and then
refreshes so the new locale takes effect (`router.refresh()`).

### Cookie

- Name: `NEXT_LOCALE` (next-intl convention).
- Set server-side (HTTP cookie) by the verify and language-update routes.
- Long-lived (e.g. 1 year), `SameSite=Lax`, `Path=/`.

## UI

### Language switcher

`src/components/ui/LanguageSwitcher.tsx`, built on the existing `Select`
component. Lists languages by their **native display name** (English, Español,
日本語, 한국어, 繁體中文). On change, calls `setLanguage()`.

Placed in `NavBar` next to `ThemeToggle`, in both the desktop bar and the mobile
menu, so it is reachable from every authenticated screen.

For the **login/signup pages** (pre-auth, no account yet), the switcher writes
the `NEXT_LOCALE` cookie directly (no DB call) so the choice persists into
signup and is mirrored to the account on first login.

### Settings page

Replace the dead redirect in `src/app/(app)/settings/page.tsx` with a real page
that hosts a "Language" preference section using the same switcher. Structured so
a "Theme" section can be added later without rework.

## Baseball-specific conventions

- **Stat abbreviations stay in English/Latin** — `AVG`, `OBP`, `SLG`, `OPS`,
  `ERA`, `K`, `BB`, `HR`, `RBI`, `IP`, `SB`, etc. These are internationally
  standard in baseball, including NPB / KBO / CPBL scorekeeping. We translate the
  **full-word labels and tooltips** (e.g. "Batting Average"), not the
  abbreviations themselves. Abbreviations live as fixed strings, not translation
  keys.
- **Rate stats keep baseball formatting** — batting average / OBP / SLG render as
  `.345` regardless of locale (a baseball convention, not a locale decimal
  choice).
- **Other numbers and dates** use next-intl's locale-aware formatter
  (`useFormatter`) where appropriate.

## Error handling

- **Missing translation key** — `getMessageFallback` returns the English string
  for that key and logs a warning in development. The UI never shows a raw key.
- **Missing / invalid locale cookie** — falls through to `Accept-Language`, then
  `en`.
- **Invalid `PATCH /api/user/language` value** — 400 via zod validation; cookie
  and DB unchanged.

## Testing

- **Key-parity check** — a script/test asserting every locale file
  (`es/ja/ko/zh-Hant`) contains exactly the same key set as `en.json`. Fails CI
  on a missing or extra key. This is the primary guard against partial
  translations.
- **Locale-resolution unit tests** — cookie wins over header; header best-match;
  default to `en`; invalid values ignored.
- **`PATCH /api/user/language`** — rejects unsupported locales, persists valid
  ones, sets the cookie.
- **Manual walkthrough** — switch to each language and visually confirm every
  in-scope screen, including the live-scoring flow and admin.
- **Build & lint** — `npm run build` and `npm run lint` pass.

## Translation quality

The `es`, `ja`, `ko`, and `zh-Hant` catalogs are AI-generated in this phase.
**Native-speaker review is recommended** before relying on them publicly,
especially for baseball-specific terminology. The key-parity check guarantees
completeness, not nuance.

## Work order

1. **Engine** — install/configure next-intl, `src/i18n/config.ts` +
   `request.ts`, wrap `next.config` and root layout, add `User.language`
   migration, cookie plumbing in verify + new `PATCH` route, `AuthProvider`
   support.
2. **Extract English** — screen by screen, move hardcoded strings into
   `messages/en.json` and refactor components to `useTranslations()` /
   `getTranslations()`.
3. **Translate** — generate `es/ja/ko/zh-Hant` catalogs from `en.json`.
4. **Switcher + Settings** — `LanguageSwitcher`, NavBar placement, real Settings
   page.
5. **Verify** — key-parity check, unit tests, build/lint, manual pass.

## Open questions / future

- Marketing-page i18n with URL routing and translated SEO metadata (next phase).
- Optional: detect browser language on first signup and pre-select it.
- Optional: move Theme into the new Settings page.
