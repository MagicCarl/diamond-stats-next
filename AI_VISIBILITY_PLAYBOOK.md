# AI Visibility Playbook — Getting Named by ChatGPT, Claude & Perplexity

_Created 2026-07-02 after the BeFound AI report. This is the step-by-step plan for the
off-site work that actually moves the needle. Work top to bottom; each step says how
long it takes and what it does._

---

## First: what the BeFound report got wrong

Their $29/mo "Foundation" tier sells: llms.txt, meta description, Open Graph, schema
markup, and an AI-crawler allowlist. **Your site already has every one of those**
(verified live on 2026-07-02):

- ✅ `SoftwareApplication`, `Organization`, `WebSite`, and `FAQPage` JSON-LD
- ✅ llms.txt (returns 200)
- ✅ robots.txt allows all AI crawlers (GPTBot, ClaudeBot, PerplexityBot)
- ✅ Meta description, Open Graph, Twitter cards, canonical, sitemap
- ✅ Comparison content: `/compare`, `/learn/gamechanger-alternatives`,
  `/learn/gamechanger-pricing`, `/learn/best-baseball-stats-apps`

**Do not pay for Foundation.** The one legitimate point in their report is off-site
entity signals — third-party sites that vouch you exist. That's this playbook, and
it's all free.

Also set expectations: GameChanger, TeamSnap, and SportsEngine get named because
they have years of Reddit threads, reviews, and press baked into AI training data.
No tool changes that in a month. Your winnable lane is the **"no subscription /
one-time purchase"** niche — every step below aims at it.

---

## Step 1 — LinkedIn Company Page (~15 min, free)

_(Originally Crunchbase, but Crunchbase now gates company submissions behind a
paid plan — checked 2026-07-02. A LinkedIn page serves the same "this company
is real" role for AI engines and is free.)_

1. Log in to **linkedin.com** with a personal account (free to create).
2. Go to **linkedin.com/company/setup/new** (or the "For Business" grid icon →
   **Create a Company Page**).
3. Fill every field — blank fields are missed signals:
   - **Name:** Baseball Stats Tracker
   - **Website:** https://www.baseballstatstracker.com
   - **Industry:** Software Development
   - **Description:** reuse the "About" copy from `marketing-ai-listings.md` § 2
   - **Logo:** use `public/logo.png` from this repo
4. Copy the page URL (linkedin.com/company/…) — it goes into the website's
   `sameAs` list in Step 3.

## Step 2 — Wikidata entry (~20 min)

Wikidata is the structured-data backbone AI knowledge graphs are built from.
This part of the BeFound report was correct.

1. Create a free account at **wikidata.org**.
2. Left sidebar (or menu) → **Create a new Item**.
   - **Label:** Baseball Stats Tracker
   - **Description:** web application for live scoring and statistics tracking in youth baseball and softball
3. On the new item, use **+ add statement** to add, one at a time:
   - **instance of (P31):** web application
   - **official website (P856):** https://www.baseballstatstracker.com
   - **country of origin (P495):** United States of America
   - **inception (P571):** your launch year
   - (skip "developer" — it only accepts existing Wikidata items as values)
4. Keep it strictly factual — no marketing language. Wikidata editors delete
   puffery, and a deleted item is worse than none.
5. Copy the item URL (looks like wikidata.org/wiki/Q…) for Step 3.

## Step 3 — Keep the `sameAs` list growing (5 min each time)

Done today: the Organization schema in
[src/app/layout.tsx](src/app/layout.tsx) now has a `sameAs` array (search the file
for `sameAs`). It currently lists only the verified YouTube channel.

Each time a profile from this playbook goes live, add its URL to that array —
or just paste the links into a Claude session and ask it to add them. Wanted there:

- [x] YouTube — https://www.youtube.com/@mauicarlandrews
- [x] X/Twitter — https://x.com/mauicarlandrews
- [x] Facebook — https://www.facebook.com/profile.php?id=61588582352146
- [x] Instagram — https://www.instagram.com/mauicarl/
- [ ] Threads profile URL
- [x] LinkedIn — https://www.linkedin.com/company/baseball-stats-tracker (Crunchbase skipped — paid; page description still to save, see Step 1 note)
- [x] Wikidata — https://www.wikidata.org/wiki/Q140411691 (created 2026-07-02 with statements)

## Step 4 — Directory + review listings (copy already written)

Open **[marketing-ai-listings.md](marketing-ai-listings.md)** — it has copy-paste
ready listings, in priority order:

1. **AlternativeTo.net** (§ 1) — biggest lever for "GameChanger alternative" queries.
2. **Capterra / GetApp / Software Advice** (§ 2) — one vendor account covers all three.
3. **Product Hunt** (§ 3) — one-day launch, permanent listing.

## Step 5 — Real user reviews (ongoing)

Ratings on Capterra/Trustpilot are third-party proof AI engines cite, and 3+ real
testimonials unlock the `aggregateRating` stars work already scoped in
[WHATS_STILL_OPEN.md](WHATS_STILL_OPEN.md).

1. Email recent buyers (Stripe dashboard → Customers) a short ask:
   _"Would you leave an honest review on Capterra? Takes 2 minutes and helps a
   small app compete with the subscription giants."_ Link directly to your
   Capterra review page once Step 4.2 is live.
2. Never incentivize or fabricate — FTC rules, and platforms detect it.

## Step 6 — Reddit presence (30 min/week)

Reddit is disproportionately weighted in AI answers. The **Reddit Kit** in
[marketing-ai-listings.md](marketing-ai-listings.md) (bottom half) has ground
rules and comment templates. Summary: be a helpful parent/coach in **r/Homeplate**,
always disclose you built the app, comments before posts, never post in r/baseball.

## Step 7 — Listicle outreach (1–2 emails/week)

When AI answers "best baseball stats apps," it cites listicle articles. Getting
into even two or three of them changes what gets retrieved.
[blogger-outreach.md](blogger-outreach.md) has targets and email templates —
prioritize any article that already ranks for "best baseball scorekeeping app."

---

## How to measure progress (monthly, ~10 min)

On the 1st of each month, ask ChatGPT, Perplexity, and Claude (fresh chats, no
history):

1. "What's the best baseball stats app with no subscription?"
2. "GameChanger alternatives for youth baseball?"
3. "What is Baseball Stats Tracker?"  ← this one should improve first

Log the answers in a note. Question 3 turning accurate means the entity signals
landed; questions 1–2 naming you means the niche strategy is working. Expect
movement in **months, not weeks** — AI answer indexes refresh slowly.

## Timeline expectations

| When | What's realistic |
|------|------------------|
| Weeks 1–4 | Listings live; Perplexity (live web search) starts finding the comparison pages |
| Months 2–4 | "What is Baseball Stats Tracker?" answered accurately; named in some "no subscription" queries |
| Months 6+ | Cited alongside big names in niche queries — if reviews + Reddit stayed active |
