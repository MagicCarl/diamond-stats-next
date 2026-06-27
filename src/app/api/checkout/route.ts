import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

// One-time price for lifetime access, in cents.
const PRICE_CENTS = 3900;

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  if (user.isPaid) {
    return NextResponse.json(
      { error: "You already have full access.", code: "ALREADY_PAID" },
      { status: 400 },
    );
  }

  const origin =
    req.headers.get("origin") || "https://www.baseballstatstracker.com";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: PRICE_CENTS,
          product_data: {
            name: "Baseball Stats Tracker — Lifetime Access",
            description:
              "One-time purchase. Unlimited games, teams, and seasons. No subscription, ever.",
          },
        },
      },
    ],
    // Tie the payment to this user so the webhook can flag the right account.
    customer_email: user.email,
    client_reference_id: user.id,
    metadata: { userId: user.id },
    success_url: `${origin}/dashboard?purchase=success`,
    cancel_url: `${origin}/pricing?purchase=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
