# Stripe Go-Live Handoff (resume tonight)

**Goal:** Get Stripe checkout working and live in production tonight, replacing PayPal.

## Where we are right now

- **`main`** (LIVE at baseballstatstracker.com): new Variant B intro + coach video. **Still uses PayPal** — intentional, Stripe isn't merged yet.
- **`feat/stripe-checkout`** (pushed to GitHub, NOT live): the complete Stripe implementation. Tip commit `224b504`. Builds clean.
- **`feat/influencer-ref-tracking`**: unrelated in-progress work, untouched.

## What's already built on `feat/stripe-checkout`

- `src/app/api/checkout/route.ts` — creates a $39 one-time Stripe Checkout session, tied to the logged-in user (metadata.userId + client_reference_id).
- `src/app/api/webhooks/stripe/route.ts` — verifies signature, auto-sets `isPaid=true` on `checkout.session.completed`. **No more manual admin toggle.**
- `src/components/ui/BuyButton.tsx` — logged-in → Stripe checkout; logged-out → `/signup`.
- All 6 PayPal links replaced with `<BuyButton>` (hero, pricing card, final CTA, dashboard banner, games/new paywall, pricing page).
- Dashboard shows an optimistic success banner on `?purchase=success`.
- `success_url` = `/dashboard?purchase=success`, `cancel_url` = `/pricing?purchase=cancelled`.
- New copy added across all 5 locale files.

## Decisions already made

- Build + test in TEST mode first, then flip to live.
- Replace PayPal entirely (no fallback).
- Same Stripe account as the user's other app.

## Current Stripe/Vercel state

- Vercel **Production** env: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` — set 131 days ago, mode unknown (verify before going live).
- Vercel **Preview** env: added `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (both `sk_test`/`pk_test` from local `.env`). Webhook secret NOT yet set for preview.
- Local `.env`: Stripe keys are TEST mode (`sk_test`/`pk_test`).
- Preview deployed at: `https://diamond-stats-next-okckqkk2t-carl-andrews-projects-2878b08a.vercel.app`
  - **BLOCKER:** preview returns HTTP 302 — it's behind Vercel Deployment Protection, so Stripe's webhook can't reach it.

## NEXT STEPS — test mode (do these first)

1. **Unblock the webhook:** in Vercel → project `diamond-stats-next` → Settings → Deployment Protection, turn OFF Vercel Authentication for previews (re-enable after). *(Label may differ — confirm on screen.)*
2. **Create a Stripe TEST webhook:** Stripe Dashboard in **Test mode** → Developers → Webhooks → Add endpoint → URL = `<preview-url>/api/webhooks/stripe`, event = `checkout.session.completed`. Copy its signing secret (`whsec_...`).
3. **Add the test webhook secret to Vercel Preview env:** `STRIPE_WEBHOOK_SECRET` = the `whsec_` from step 2 (Preview scope). Then redeploy the preview (`vercel`).
4. **Test the purchase:** on the preview URL, log in as a non-paid user → click any Buy button → pay with test card `4242 4242 4242 4242`, any future expiry, any CVC/ZIP → confirm you land on `/dashboard?purchase=success` AND `isPaid` flipped (check the admin Users page or try creating a 2nd game).

## NEXT STEPS — go live (after test passes)

5. **Live keys:** add this app's account LIVE keys to Vercel **Production** env: `STRIPE_SECRET_KEY` (`sk_live_…`), `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (`pk_live_…`). Confirm they're the same account as the other app.
6. **Live webhook:** Stripe Dashboard in **Live mode** → create webhook → URL = `https://www.baseballstatstracker.com/api/webhooks/stripe`, event = `checkout.session.completed` → put its `whsec_` into Vercel **Production** `STRIPE_WEBHOOK_SECRET`.
7. **Merge + deploy:** merge `feat/stripe-checkout` → `main`, push, `vercel --prod`.
8. **Re-enable** Vercel Deployment Protection for previews (from step 1).
9. **Verify live:** do one real purchase (or Stripe live-mode test) and confirm `isPaid` flips automatically.

## Notes / gotchas

- Webhook route reads the RAW body (`req.text()`) for signature verification — don't change that.
- Buy requires login (so the webhook maps payment → account). Logged-out buyers go to `/signup` first.
- A leftover dev server may be running on `localhost:3300` (used to verify the video) — harmless.
- `dashboard-navigator` skill was loaded to guide the Vercel/Stripe console clicks — use it again, ask "what do you see" rather than assuming labels.
