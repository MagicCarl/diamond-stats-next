# Future Work: Fully Automate PayPal Purchase Flow

Replace manual PayPal.me links with PayPal Smart Buttons so that purchases
automatically mark the user as paid and trigger the thank-you email — no
admin action required.

## Current State (as of 2026-04-20)

- Payment is a PayPal.me link (`https://www.paypal.com/paypalme/carlrandrews`) in 4 places:
  - `src/app/pricing/page.tsx`
  - `src/app/LandingClient.tsx`
  - `src/app/(app)/dashboard/page.tsx`
  - `src/app/(app)/games/new/page.tsx`
- Admin manually toggles `isPaid` flag in the admin panel.
- Thank-you email already fires on `Not Paid → Paid` transition via
  `src/lib/email.ts` (Resend).

## Goal

PayPal purchase → account auto-activates → thank-you email sent → user keeps
using the app with no 24-hour wait.

## Implementation Plan

### 1. PayPal Developer Account Setup (manual, in dashboard)

- At developer.paypal.com, create a REST API app (sandbox first, then live).
  - Capture **Client ID** and **Client Secret** for each environment.
- Create a webhook pointing to `https://baseballstatstracker.com/api/webhooks/paypal`
  - Subscribe to: `CHECKOUT.ORDER.APPROVED`, `PAYMENT.CAPTURE.COMPLETED`
  - Capture the **Webhook ID** (needed for signature verification).

### 2. Environment Variables (Vercel + .env)

- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` — public, used by the SDK on the client
- `PAYPAL_CLIENT_SECRET` — server only
- `PAYPAL_WEBHOOK_ID` — for signature verification
- `PAYPAL_ENV` — `sandbox` or `live`

### 3. Backend Routes (new)

- `POST /api/paypal/create-order`
  - Auth required.
  - Creates a $39 USD order via PayPal Orders API, returns order ID.
- `POST /api/paypal/capture-order`
  - Auth required. Body: `{ orderId }`.
  - Captures payment. On success:
    - Set `user.isPaid = true`.
    - Call existing `sendPaymentThankYouEmail()`.
    - Track analytics event.
- `POST /api/webhooks/paypal`
  - No auth; verifies PayPal webhook signature using `PAYPAL_WEBHOOK_ID`.
  - Fallback in case user closes tab before capture callback returns.
  - Idempotent — guard against double-marking already-paid users.

### 4. Frontend

- Install `@paypal/react-paypal-js`.
- Create `<PayPalCheckoutButton>` component (Smart Buttons in a
  `PayPalScriptProvider`).
- Replace the 4 PayPal.me anchor links with this component.
- Only render for signed-in, free users.
- On capture success, refresh `AuthProvider` user state so UI flips to "paid"
  immediately.

### 5. Existing Thank-You Email

- No new email work. The capture route calls `sendPaymentThankYouEmail()` from
  `src/lib/email.ts`.
- Admin toggle still only fires email on `false → true` transition, so no
  duplicate emails if admin later re-toggles.

### 6. Testing

- Use PayPal sandbox buyer accounts (create in developer.paypal.com).
- End-to-end test: sandbox purchase → verify `isPaid` flips → verify email
  arrives → verify webhook is also received.
- Flip `PAYPAL_ENV=live` only after sandbox is solid.

## Tradeoffs

- Admin "Mark Paid" button stays — still useful for comped accounts, refunds,
  and edge cases.
- Standard PayPal merchant fees (~3% + $0.49) apply to all purchases. Loses the
  "friends & family" fee-free option that PayPal.me allowed.
- UX upgrade: instant activation instead of up-to-24h wait.

## Setup Checklist (when we start)

1. Log in to developer.paypal.com, create sandbox app, capture Client ID + Secret.
2. Create webhook, capture Webhook ID.
3. Create a sandbox buyer account for testing.
4. Share the Client ID + Secret so env vars can be added to `.env` and Vercel.
5. Then implementation begins.
