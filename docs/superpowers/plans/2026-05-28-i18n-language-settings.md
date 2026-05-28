# i18n / Language Settings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add multi-language support (English, Spanish, Japanese, Korean, Traditional Chinese) to the authenticated app UI, with the user's choice persisted to the database.

**Architecture:** next-intl in "no URL routing" mode. Locale is resolved once per request on the server (cookie → Accept-Language → English) and provided to the mostly-client-component tree via `NextIntlClientProvider`. The choice is stored on `User.language` and mirrored to a `NEXT_LOCALE` cookie for SSR.

**Tech Stack:** Next.js 16 (App Router), TypeScript, next-intl, Prisma/PostgreSQL, vitest (new, for unit tests).

**Reference spec:** `docs/superpowers/specs/2026-05-28-i18n-language-settings-design.md`

---

## Notes for the implementer

- **Locales:** `en` (default), `es`, `ja`, `ko`, `zh-Hant`.
- **Consult the official next-intl App Router docs** for exact API shapes if a call signature differs from what's shown — the library version may have moved.
- **Stat abbreviations** (AVG, OBP, SLG, OPS, ERA, K, BB, HR, RBI, IP, SB…) are NOT translated — leave them as literal strings. Only translate full-word labels/tooltips. Rate stats stay formatted as `.345`.
- **Commit after every task.** Run `npm run lint` before each commit.
- Tasks 1–13 build the engine and are fully specified. Tasks 14–26 (string extraction) follow the **Translation Recipe** in Task 14 — a mechanical, file-by-file process where the exact strings come from reading each screen.

---

## Phase 1 — Engine

### Task 1: Install next-intl + vitest

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install runtime + dev deps**

```bash
npm install next-intl
npm install -D vitest
```

- [ ] **Step 2: Add a test script**

In `package.json` `"scripts"`, add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Verify install**

Run: `npx next-intl --version || echo "installed as dep"` then `npx vitest --version`
Expected: vitest prints a version number.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add next-intl and vitest"
```

---

### Task 2: Locale config

**Files:**
- Create: `src/i18n/config.ts`
- Test: `src/i18n/config.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/i18n/config.test.ts
import { describe, it, expect } from "vitest";
import { isLocale, SUPPORTED_LOCALES, DEFAULT_LOCALE, LOCALE_NAMES } from "./config";

describe("locale config", () => {
  it("includes the five supported locales", () => {
    expect(SUPPORTED_LOCALES).toEqual(["en", "es", "ja", "ko", "zh-Hant"]);
  });
  it("defaults to English", () => {
    expect(DEFAULT_LOCALE).toBe("en");
  });
  it("has a native display name for every locale", () => {
    for (const l of SUPPORTED_LOCALES) {
      expect(LOCALE_NAMES[l]).toBeTruthy();
    }
  });
  it("isLocale accepts supported, rejects others", () => {
    expect(isLocale("es")).toBe(true);
    expect(isLocale("zh-Hant")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
    expect(isLocale(123)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/i18n/config.test.ts`
Expected: FAIL — cannot find module `./config`.

- [ ] **Step 3: Write the implementation**

```ts
// src/i18n/config.ts
export const SUPPORTED_LOCALES = ["en", "es", "ja", "ko", "zh-Hant"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  es: "Español",
  ja: "日本語",
  ko: "한국어",
  "zh-Hant": "繁體中文",
};

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" &&
    (SUPPORTED_LOCALES as readonly string[]).includes(value)
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/i18n/config.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/i18n/config.ts src/i18n/config.test.ts
git commit -m "feat: add i18n locale config"
```

---

### Task 3: Accept-Language detection helper

**Files:**
- Create: `src/i18n/detect.ts`
- Test: `src/i18n/detect.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/i18n/detect.test.ts
import { describe, it, expect } from "vitest";
import { pickLocaleFromAcceptLanguage } from "./detect";

describe("pickLocaleFromAcceptLanguage", () => {
  it("matches an exact supported locale", () => {
    expect(pickLocaleFromAcceptLanguage("es-MX,es;q=0.9")).toBe("es");
  });
  it("matches Traditional Chinese", () => {
    expect(pickLocaleFromAcceptLanguage("zh-Hant-TW,zh;q=0.8")).toBe("zh-Hant");
  });
  it("falls back to default when nothing matches", () => {
    expect(pickLocaleFromAcceptLanguage("fr-FR,de;q=0.7")).toBe("en");
  });
  it("falls back to default on empty header", () => {
    expect(pickLocaleFromAcceptLanguage("")).toBe("en");
  });
  it("respects quality-value ordering", () => {
    expect(pickLocaleFromAcceptLanguage("ko;q=0.4,ja;q=0.9")).toBe("ja");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/i18n/detect.test.ts`
Expected: FAIL — cannot find module `./detect`.

- [ ] **Step 3: Write the implementation**

```ts
// src/i18n/detect.ts
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type Locale } from "./config";

export function pickLocaleFromAcceptLanguage(header: string): Locale {
  if (!header) return DEFAULT_LOCALE;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? parseFloat(qParam.split("=")[1]) : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isNaN(q) ? 0 : q };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    // Traditional Chinese: any zh-hant* tag
    if (tag.startsWith("zh-hant")) return "zh-Hant";
    const base = tag.split("-")[0];
    const match = (SUPPORTED_LOCALES as readonly string[]).find(
      (l) => l === tag || l.split("-")[0] === base
    );
    if (match && match !== "zh-Hant") return match as Locale;
  }
  return DEFAULT_LOCALE;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/i18n/detect.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/i18n/detect.ts src/i18n/detect.test.ts
git commit -m "feat: add Accept-Language locale detection"
```

---

### Task 4: Seed message catalogs

**Files:**
- Create: `messages/en.json`, `messages/es.json`, `messages/ja.json`, `messages/ko.json`, `messages/zh-Hant.json`

- [ ] **Step 1: Create `messages/en.json` with an initial common namespace**

```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "close": "Close",
    "loading": "Loading…",
    "confirm": "Confirm",
    "back": "Back"
  }
}
```

- [ ] **Step 2: Copy the same content to the other four files**

Create `messages/es.json`, `messages/ja.json`, `messages/ko.json`, `messages/zh-Hant.json` with the EXACT same JSON content as `en.json` for now (they'll be translated in Task 25). This keeps imports valid and key sets identical.

- [ ] **Step 3: Commit**

```bash
git add messages/
git commit -m "feat: seed i18n message catalogs"
```

---

### Task 5: next-intl request config

**Files:**
- Create: `src/i18n/request.ts`

- [ ] **Step 1: Write the request config**

```ts
// src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale } from "./config";
import { pickLocaleFromAcceptLanguage } from "./detect";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;

  let locale: string;
  if (isLocale(cookieLocale)) {
    locale = cookieLocale;
  } else {
    const accept = (await headers()).get("accept-language") ?? "";
    locale = pickLocaleFromAcceptLanguage(accept);
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    getMessageFallback({ key, namespace }) {
      // Fall back visibly-but-safely; English catalog is the source of truth.
      const full = [namespace, key].filter(Boolean).join(".");
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[i18n] missing message: ${full} (locale=${locale})`);
      }
      return full;
    },
    onError() {
      // Swallow missing-message errors in production; handled by fallback above.
    },
  };
});
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors from `src/i18n/request.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/i18n/request.ts
git commit -m "feat: add next-intl request config with cookie/header resolution"
```

---

### Task 6: Wire the next-intl plugin

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Read the current config**

Open `next.config.ts` and note the exported config object name.

- [ ] **Step 2: Wrap it with the next-intl plugin**

At the top of the file add:

```ts
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
```

Change the default export from `export default nextConfig;` to:

```ts
export default withNextIntl(nextConfig);
```

(Use the actual config variable name if it differs from `nextConfig`.)

- [ ] **Step 3: Verify the dev server boots**

Run: `npm run dev` (then stop it)
Expected: server starts with no next-intl config error.

- [ ] **Step 4: Commit**

```bash
git add next.config.ts
git commit -m "feat: wire next-intl plugin into next config"
```

---

### Task 7: Provide messages in the root layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Add imports**

```ts
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
```

- [ ] **Step 2: Make the layout resolve locale + messages**

Change the function signature to async and resolve locale/messages at the top:

```tsx
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();
```

- [ ] **Step 3: Use the locale on `<html>` and wrap the providers**

- Change `<html lang="en" suppressHydrationWarning>` to `<html lang={locale} suppressHydrationWarning>`.
- Wrap the existing `<ThemeProvider>…</ThemeProvider>` subtree with the provider:

```tsx
<NextIntlClientProvider locale={locale} messages={messages}>
  <ThemeProvider>
    <AuthProvider>{children}</AuthProvider>
  </ThemeProvider>
</NextIntlClientProvider>
```

- [ ] **Step 4: Verify**

Run: `npm run dev`, load `/`, confirm the page renders and `<html lang>` reflects the locale (default `en`). Stop the server.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: provide locale and messages from root layout"
```

---

### Task 8: Add `language` to the User model

**Files:**
- Modify: `prisma/schema.prisma`
- Create: migration under `prisma/migrations/`

- [ ] **Step 1: Add the field**

In the `User` model, after the `theme` line, add:

```prisma
  language    String   @default("en") @map("language")
```

- [ ] **Step 2: Create + apply the migration**

Run: `npx prisma migrate dev --name add_user_language`
Expected: migration created and applied; `language` column added with default `'en'`. (Migrations use `DIRECT_URL`.)

- [ ] **Step 3: Regenerate the client**

Run: `npx prisma generate`
Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat: add language preference column to User"
```

---

### Task 9: Return + mirror language on auth verify

**Files:**
- Modify: `src/lib/auth.ts` (add `language` to `AuthUser`)
- Modify: `src/app/api/auth/verify/route.ts`

- [ ] **Step 1: Extend the `AuthUser` interface**

In `src/lib/auth.ts`, add to the `AuthUser` interface (after `theme: string;`):

```ts
  language: string;
```

(No other change needed — `getAuthUser` already returns the full Prisma user, which now includes `language`.)

- [ ] **Step 2: Return `language` and set the cookie in the verify route**

In `src/app/api/auth/verify/route.ts`, replace the final `return NextResponse.json({...})` block with:

```ts
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        isPaid: user.isPaid,
        isAdmin: user.isAdmin,
        language: user.language,
      },
    });

    response.cookies.set("NEXT_LOCALE", user.language, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });

    return response;
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/auth.ts src/app/api/auth/verify/route.ts
git commit -m "feat: return and mirror user language on auth verify"
```

---

### Task 10: Language update endpoint

**Files:**
- Create: `src/app/api/user/language/route.ts`
- Test: `src/app/api/user/language/route.test.ts`

- [ ] **Step 1: Write the failing test (validation logic)**

```ts
// src/app/api/user/language/route.test.ts
import { describe, it, expect } from "vitest";
import { languageSchema } from "./schema";

describe("languageSchema", () => {
  it("accepts supported locales", () => {
    expect(languageSchema.safeParse({ language: "ja" }).success).toBe(true);
  });
  it("rejects unsupported locales", () => {
    expect(languageSchema.safeParse({ language: "fr" }).success).toBe(false);
  });
  it("rejects missing language", () => {
    expect(languageSchema.safeParse({}).success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/api/user/language/route.test.ts`
Expected: FAIL — cannot find module `./schema`.

- [ ] **Step 3: Create the schema**

```ts
// src/app/api/user/language/schema.ts
import { z } from "zod";
import { SUPPORTED_LOCALES } from "@/i18n/config";

export const languageSchema = z.object({
  language: z.enum(SUPPORTED_LOCALES),
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/api/user/language/route.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Create the route handler**

```ts
// src/app/api/user/language/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { languageSchema } from "./schema";

export async function PATCH(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const body = await req.json().catch(() => null);
  const parsed = languageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }

  const { language } = parsed.data;
  await prisma.user.update({
    where: { id: user.id },
    data: { language },
  });

  const response = NextResponse.json({ language });
  response.cookies.set("NEXT_LOCALE", language, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}
```

- [ ] **Step 6: Typecheck + commit**

Run: `npx tsc --noEmit` (expected: clean)

```bash
git add src/app/api/user/language
git commit -m "feat: add PATCH /api/user/language endpoint"
```

---

### Task 11: Expose language + setLanguage from AuthProvider

**Files:**
- Modify: `src/providers/AuthProvider.tsx`

- [ ] **Step 1: Add imports + extend types**

Add `useRouter` import:

```ts
import { useRouter } from "next/navigation";
```

Extend `AppUser`:

```ts
interface AppUser {
  isPaid: boolean;
  isAdmin: boolean;
  language: string;
}
```

Extend `AuthContextType` (and the default context value):

```ts
  language: string;
  setLanguage: (locale: string) => Promise<void>;
```

Default context additions: `language: "en"`, `setLanguage: async () => {}`.

- [ ] **Step 2: Track language state and populate it on verify**

Inside `AuthProvider`, add `const router = useRouter();` and `const [language, setLanguageState] = useState("en");`.

In the verify success block, where `setAppUser({...})` is called, include language and seed state:

```ts
            setAppUser({
              isPaid: data.user.isPaid ?? false,
              isAdmin: data.user.isAdmin ?? false,
              language: data.user.language ?? "en",
            });
            setLanguageState(data.user.language ?? "en");
```

- [ ] **Step 3: Implement `setLanguage` (handles logged-in and pre-auth)**

```ts
  const setLanguage = async (locale: string) => {
    setLanguageState(locale);
    const current = auth.currentUser;
    if (current) {
      const idToken = await current.getIdToken();
      await fetch("/api/user/language", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ language: locale }),
      }).catch(() => {});
    } else {
      // Pre-auth (login/signup): persist via cookie so SSR picks it up.
      document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    }
    router.refresh();
  };
```

- [ ] **Step 4: Add to the context value**

```tsx
    <AuthContext.Provider
      value={{ user, appUser, loading, token, logout, language, setLanguage }}
    >
```

- [ ] **Step 5: Typecheck + commit**

Run: `npx tsc --noEmit` (expected: clean)

```bash
git add src/providers/AuthProvider.tsx
git commit -m "feat: expose language and setLanguage from AuthProvider"
```

---

### Task 12: LanguageSwitcher component

**Files:**
- Create: `src/components/ui/LanguageSwitcher.tsx`

- [ ] **Step 1: Implement the component**

```tsx
// src/components/ui/LanguageSwitcher.tsx
"use client";

import { useAuth } from "@/providers/AuthProvider";
import { SUPPORTED_LOCALES, LOCALE_NAMES } from "@/i18n/config";

export default function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage } = useAuth();

  return (
    <select
      aria-label="Language"
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className={
        className ??
        "rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
      }
    >
      {SUPPORTED_LOCALES.map((loc) => (
        <option key={loc} value={loc}>
          {LOCALE_NAMES[loc]}
        </option>
      ))}
    </select>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit` (expected: clean)

```bash
git add src/components/ui/LanguageSwitcher.tsx
git commit -m "feat: add LanguageSwitcher component"
```

---

### Task 13: Place LanguageSwitcher in the NavBar

**Files:**
- Modify: `src/components/layout/NavBar.tsx`

- [ ] **Step 1: Import it**

```ts
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
```

- [ ] **Step 2: Add to the desktop controls**

In the right-side controls `div` (the one containing `<ThemeToggle />`), add `<LanguageSwitcher />` immediately before `<ThemeToggle />`.

- [ ] **Step 3: Add to the mobile menu**

In the mobile menu block, add a `LanguageSwitcher` near the Sign Out button:

```tsx
          <div className="px-3 py-2">
            <LanguageSwitcher className="w-full rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300" />
          </div>
```

- [ ] **Step 4: Verify**

Run: `npm run dev`, log in, confirm the switcher appears on desktop and mobile and changing it triggers a refresh. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/NavBar.tsx
git commit -m "feat: add language switcher to navbar"
```

---

### Task 14: Real Settings page + Translation Recipe

**Files:**
- Modify: `src/app/(app)/settings/page.tsx`

This task replaces the dead redirect and ALSO establishes the **Translation Recipe** used by all remaining screen tasks.

#### Translation Recipe (used in Tasks 15–24)

For each screen/component:

1. **Read the file** and list every user-facing English string (visible text, button labels, placeholders, `aria-label`s, toast/error messages, empty states). Skip stat abbreviations (AVG, OBP, ERA, K, BB, HR, RBI, IP, SB, …) and dynamic data.
2. **Add keys** under the screen's namespace in `messages/en.json` (e.g. `dashboard.title`). Reuse `common.*` for shared words (Save/Cancel/Delete/etc.).
3. **In a client component:** add `import { useTranslations } from "next-intl";` and `const t = useTranslations("namespace");`, then replace each literal with `{t("key")}`. For interpolation use `t("key", { count })` and ICU in the catalog (`"{count} hits"` / plural form).
4. **In a server component:** use `import { getTranslations } from "next-intl/server";` and `const t = await getTranslations("namespace");`.
5. **Mirror the new keys** into `es/ja/ko/zh-Hant` JSON with the English value as a placeholder (real translation happens in Task 25). This keeps key sets identical at every commit so the parity check (Task 26) stays green.
6. **Run** `npx tsc --noEmit` and `npm run dev`, view the screen, confirm no missing-key warnings.
7. **Commit** with message `feat(i18n): translate <screen>`.

**Worked example — NavBar nav links** (already in code):

`messages/en.json` add:

```json
  "nav": {
    "dashboard": "Dashboard",
    "statsSearch": "Stats Search",
    "instructions": "Instructions",
    "admin": "Admin",
    "signOut": "Sign Out"
  }
```

In `NavBar.tsx`: `const t = useTranslations("nav");` then build links with `label: t("dashboard")`, etc., and replace the `Sign Out` / `Admin` literals with `{t("signOut")}` / `{t("admin")}`.

#### Settings page steps

- [ ] **Step 1: Add the `settings` namespace to `en.json` (+ mirror to other 4 files)**

```json
  "settings": {
    "title": "Settings",
    "language": "Language",
    "languageHelp": "Choose the language for the app interface."
  }
```

- [ ] **Step 2: Replace the redirect page with a real settings page**

```tsx
// src/app/(app)/settings/page.tsx
"use client";

import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import Card from "@/components/ui/Card";

export default function SettingsPage() {
  const t = useTranslations("settings");
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {t("title")}
      </h1>
      <Card>
        <div className="space-y-2 p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("language")}
          </label>
          <LanguageSwitcher className="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("languageHelp")}
          </p>
        </div>
      </Card>
    </div>
  );
}
```

> Check `src/components/ui/Card.tsx` for its actual export/props; adjust the import and usage to match (default vs named export, whether it wraps children directly).

- [ ] **Step 3: Apply the NavBar nav-link translation from the worked example above.**

- [ ] **Step 4: Typecheck + dev check + commit**

Run: `npx tsc --noEmit`, then `npm run dev` and visit `/settings`.

```bash
git add "src/app/(app)/settings/page.tsx" src/components/layout/NavBar.tsx messages/
git commit -m "feat(i18n): real settings page + translate navbar"
```

---

## Phase 2 — Screen string extraction (apply the Recipe)

Each task below = apply the Translation Recipe to one screen. Namespaces given. Read each file for the exact strings.

- [ ] **Task 15: Dashboard** — `src/app/(app)/dashboard/page.tsx` — namespace `dashboard`. Commit `feat(i18n): translate dashboard`.
- [ ] **Task 16: New game** — `src/app/(app)/games/new/page.tsx` — namespace `games.new`. Commit `feat(i18n): translate new game`.
- [ ] **Task 17: Live scoring** — `src/app/(app)/games/[gameId]/live/page.tsx` — namespace `games.live`. Largest screen; watch for pluralized counts (use ICU). Commit `feat(i18n): translate live scoring`.
- [ ] **Task 18: Box score** — `src/app/(app)/games/[gameId]/box/page.tsx` — namespace `games.box`. Keep stat-column abbreviations literal. Commit `feat(i18n): translate box score`.
- [ ] **Task 19: Game spray chart** — `src/app/(app)/games/[gameId]/spray-chart/page.tsx` — namespace `games.sprayChart`. Commit `feat(i18n): translate game spray chart`.
- [ ] **Task 20: Team detail** — `src/app/(app)/teams/[teamId]/page.tsx` — namespace `teams.detail`. Commit `feat(i18n): translate team detail`.
- [ ] **Task 21: Team stats** — `src/app/(app)/teams/[teamId]/stats/page.tsx` — namespace `teams.stats`. Stat abbreviations literal. Commit `feat(i18n): translate team stats`.
- [ ] **Task 22: Team spray chart** — `src/app/(app)/teams/[teamId]/spray-chart/page.tsx` — namespace `teams.sprayChart`. Commit `feat(i18n): translate team spray chart`.
- [ ] **Task 23: Stats search** — `src/app/(app)/stats/search/page.tsx` — namespace `stats.search`. Commit `feat(i18n): translate stats search`.
- [ ] **Task 24: Instructions** — `src/app/(app)/instructions/page.tsx` — namespace `instructions`. Long-form copy; one key per paragraph/heading. Commit `feat(i18n): translate instructions`.
- [ ] **Task 25: Admin + shared UI + auth pages** — files: `src/app/(app)/admin/page.tsx` (namespace `admin`), `src/components/admin/AnalyticsTab.tsx`, `src/components/admin/UsersTab.tsx`, `src/components/ui/Modal.tsx` (close button `aria-label`), `src/components/ui/Spinner.tsx` (aria), `src/app/(auth)/login/page.tsx` (namespace `auth.login`), `src/app/(auth)/signup/page.tsx` (namespace `auth.signup`). Add a `LanguageSwitcher` to the login + signup pages so pre-auth users can choose. Commit `feat(i18n): translate admin, shared UI, and auth pages`.

> The pitch-chart `StrikeZone` and `spray-chart/SprayChartDiamond` are graphical; translate only any text labels they render (often none). Check and skip if purely visual.

---

## Phase 3 — Translations

### Task 26: Generate the four non-English catalogs

**Files:**
- Modify: `messages/es.json`, `messages/ja.json`, `messages/ko.json`, `messages/zh-Hant.json`

- [ ] **Step 1: Translate every value** in each file from the English source, preserving keys, ICU placeholders (`{count}`), and leaving stat abbreviations untouched. Use natural baseball terminology per locale.
- [ ] **Step 2: Validate JSON** — Run: `node -e "['es','ja','ko','zh-Hant'].forEach(l=>JSON.parse(require('fs').readFileSync('messages/'+l+'.json')))"` — Expected: no error.
- [ ] **Step 3: Commit** — `git add messages/ && git commit -m "feat(i18n): translate catalogs (es, ja, ko, zh-Hant)"`

> Flag to the user: these are machine translations; native-speaker review is recommended before public reliance, especially baseball terms.

---

## Phase 4 — Verification

### Task 27: Key-parity check

**Files:**
- Create: `scripts/check-i18n-parity.mjs`
- Test: `src/i18n/parity.test.ts`

- [ ] **Step 1: Write the parity test**

```ts
// src/i18n/parity.test.ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { SUPPORTED_LOCALES } from "./config";

function flatten(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    return v && typeof v === "object"
      ? flatten(v as Record<string, unknown>, key)
      : [key];
  });
}

const keysFor = (l: string) =>
  flatten(JSON.parse(readFileSync(`messages/${l}.json`, "utf8"))).sort();

describe("i18n key parity", () => {
  const en = keysFor("en");
  for (const locale of SUPPORTED_LOCALES.filter((l) => l !== "en")) {
    it(`${locale} has exactly the same keys as en`, () => {
      expect(keysFor(locale)).toEqual(en);
    });
  }
});
```

- [ ] **Step 2: Run it**

Run: `npx vitest run src/i18n/parity.test.ts`
Expected: PASS (4 tests). If it fails, it lists the mismatched keys — fix the offending catalog.

- [ ] **Step 3: Add a standalone script (for CI/manual use)**

```js
// scripts/check-i18n-parity.mjs
import { readFileSync } from "node:fs";

const LOCALES = ["en", "es", "ja", "ko", "zh-Hant"];
const flatten = (o, p = "") =>
  Object.entries(o).flatMap(([k, v]) => {
    const key = p ? `${p}.${k}` : k;
    return v && typeof v === "object" ? flatten(v, key) : [key];
  });
const keys = (l) =>
  new Set(flatten(JSON.parse(readFileSync(`messages/${l}.json`, "utf8"))));

const en = keys("en");
let ok = true;
for (const l of LOCALES.filter((x) => x !== "en")) {
  const k = keys(l);
  const missing = [...en].filter((x) => !k.has(x));
  const extra = [...k].filter((x) => !en.has(x));
  if (missing.length || extra.length) {
    ok = false;
    console.error(`\n${l}:`);
    if (missing.length) console.error("  missing:", missing.join(", "));
    if (extra.length) console.error("  extra:", extra.join(", "));
  }
}
console.log(ok ? "i18n parity OK" : "i18n parity FAILED");
process.exit(ok ? 0 : 1);
```

Add to `package.json` scripts: `"i18n:check": "node scripts/check-i18n-parity.mjs"`.

- [ ] **Step 4: Commit**

```bash
git add scripts/check-i18n-parity.mjs src/i18n/parity.test.ts package.json
git commit -m "test: add i18n key-parity check"
```

---

### Task 28: Full verification pass

- [ ] **Step 1: Run all unit tests** — `npm test` — Expected: all pass.
- [ ] **Step 2: Parity script** — `npm run i18n:check` — Expected: `i18n parity OK`.
- [ ] **Step 3: Lint** — `npm run lint` — Expected: clean.
- [ ] **Step 4: Build** — `npm run build` — Expected: succeeds.
- [ ] **Step 5: Manual pass** — `npm run dev`; for each locale (en/es/ja/ko/zh-Hant) switch via the NavBar and walk dashboard → new game → live scoring → box score → spray chart → teams → stats search → instructions → settings → admin. Confirm no raw keys and no console missing-key warnings.
- [ ] **Step 6: Final commit** (if any fixes) — `git commit -am "fix(i18n): verification pass cleanups"`.

---

## Self-Review (completed during planning)

- **Spec coverage:** engine (T1–7), DB/persistence (T8–11), switcher+settings (T12–14), full app-screen translation incl. auth pages (T15–25), translations (T26), key-parity + tests + build + manual (T27–28). All spec sections mapped.
- **Placeholders:** engine code is complete; screen tasks intentionally use the documented Translation Recipe because exact per-file strings are discovered by reading each screen — this is a deliberate, documented procedure, not a vague reference.
- **Type consistency:** `Locale`, `SUPPORTED_LOCALES`, `isLocale`, `pickLocaleFromAcceptLanguage`, `languageSchema`, `setLanguage`, `language` used consistently across tasks.
