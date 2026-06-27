# Refunds & Stripe Payments — How It Works (and how to repeat it)

This documents the Stripe payment system we set up for BaseballStatsTracker, how
to issue a refund, and how to rebuild this from scratch on another app.

---

## TL;DR — How to refund a customer

1. Stripe Dashboard → make sure you're in **Live mode** (toggle near your account
   name "Diamond-Stats", or top-right).
2. Left sidebar → **Transactions** (or **Payments**).
3. Click the customer's **$39 "Succeeded"** payment.
4. Click **Refund** (top-right, or behind the **"⋯"** menu) → refund the full amount.

**What happens automatically:** Stripe sends a `charge.refunded` event to our
webhook, which **soft-deletes that user** (sets `deletedAt` + `isPaid = false`).
They lose all access immediately. To undo: set `deletedAt = null`, `isPaid = true`
on that user in the database.

> Note: the **~$1.43 Stripe processing fee is NOT returned** on refunds. The
> customer gets the full $39 back; you eat the fee.

---

## What we built tonight

Replaced the old PayPal.me link with real **Stripe Checkout** ($39 one-time, no
subscription). Three behaviors:

| Event | Result |
|---|---|
| Customer pays $39 | Webhook (`checkout.session.completed`) sets `isPaid = true` automatically — **no more manual admin toggling** |
| Customer is refunded | Webhook (`charge.refunded`) soft-deletes the user — access revoked |
| Logged-out visitor clicks "Buy" | Sent to `/signup` first (a payment must map to an account) |

### The code (all on `main`)

- `src/app/api/checkout/route.ts` — creates the $39 Checkout session. Stamps the
  user's id into both the session metadata AND `payment_intent_data.metadata` (the
  latter is what lets refunds map back to the user).
- `src/app/api/webhooks/stripe/route.ts` — verifies Stripe's signature (using the
  raw request body), then:
  - `checkout.session.completed` → `isPaid = true`
  - `charge.refunded` → soft-delete (revoke access)
- `src/components/ui/BuyButton.tsx` — the buy button. Logged-in → Stripe checkout;
  logged-out → `/signup`. Shows an error if checkout fails.
- `src/lib/stripe.ts` — the Stripe client.

### Stripe account / config

- **Account:** Diamond-Stats (`acct_1T10WHQZtRnZO4tM`) — shared with another app; fine.
- **Webhook endpoint:** `https://www.baseballstatstracker.com/api/webhooks/stripe`
  - Name in Stripe: `energetic-glow`
  - Subscribed events: `checkout.session.completed`, `charge.refunded`
- **Vercel env vars (Production):**
  - `STRIPE_SECRET_KEY` = `sk_live_…`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_…`
  - `STRIPE_WEBHOOK_SECRET` = `whsec_…` (the signing secret of the webhook above)

---

## How to repeat this from scratch (new app)

### 1. Code (already exists here — copy these files to a new project)
- `lib/stripe.ts`, `api/checkout/route.ts`, `api/webhooks/stripe/route.ts`,
  `components/ui/BuyButton.tsx`. Install the `stripe` npm package.

### 2. Stripe Dashboard (Live mode)
- **Developers → API keys** (or the Workbench → "API keys"): copy the
  **Publishable key** (`pk_live_…`) and **Secret key** (`sk_live_…`).
- **Developers → Webhooks → Add destination/endpoint:**
  - Scope: **Your account**
  - Destination type: **Webhook endpoint**
  - URL: `https://YOURDOMAIN.com/api/webhooks/stripe`
  - Events: **`checkout.session.completed`** AND **`charge.refunded`**
  - After creating, copy the **Signing secret** (`whsec_…`).

### 3. Vercel env vars (Production)
Set these three (the CLI is finicky — see Gotchas):
```
vercel env add STRIPE_SECRET_KEY production --value "sk_live_…" --sensitive
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production --value "pk_live_…"
vercel env add STRIPE_WEBHOOK_SECRET production --value "whsec_…" --sensitive
```

### 4. Deploy
`git push` + `vercel --prod`. **Env-var changes only take effect on a NEW
deploy** — always redeploy after changing keys.

### 5. Verify (the real test)
- Buy once from a fresh, non-paid account with a real card → confirm access is
  granted (`isPaid` flips).
- Refund it in Stripe → confirm access is revoked.
- Refund yourself to get the money back (minus the fee).

---

## Gotchas we hit (so you don't again)

- **`vercel env add` needs `--value` (not stdin) for agents/scripts.** Piping a
  value silently stored an EMPTY string. Use `--value "..."`.
- **Sensitive vars read back EMPTY on `vercel env pull`.** That's expected (they're
  write-only). It doesn't mean the value is missing. To verify a value, temporarily
  add it `--no-sensitive`, pull, check, then re-add `--sensitive`.
- **Env changes require a redeploy.** Our first deploy looked broken because it was
  built before the live key was set. Redeploying fixed it.
- **Buy requires login** (so the webhook knows whose access to grant). That's by design.
- **Refunds don't return the Stripe fee** (~$1.43 on $39).
- **Refund mapping** only works because checkout stamps `payment_intent_data.metadata.userId`.
  Purchases made before that code existed can't auto-revoke — handle those manually
  (soft-delete the user in the DB).

---

## Manually revoke / restore a user (DB)

Soft-delete (revoke): set `deletedAt = now()`, `isPaid = false`.
Restore: set `deletedAt = null`, `isPaid = true`.
(`getAuthUser` blocks any user with `deletedAt` set.)
