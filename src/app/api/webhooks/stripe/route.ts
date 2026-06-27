import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Stripe signature verification needs the raw, unparsed request body.
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("[stripe webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // A completed, paid one-time checkout grants lifetime access.
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid") {
      const userId =
        session.metadata?.userId || session.client_reference_id || null;
      if (userId) {
        try {
          await prisma.user.update({
            where: { id: userId },
            data: { isPaid: true },
          });
          console.log(`[stripe webhook] marked user ${userId} as paid`);
        } catch (err) {
          // Don't 500 back to Stripe for a missing/duplicate user — log it.
          console.error(`[stripe webhook] could not mark ${userId} paid:`, err);
        }
      } else {
        console.error("[stripe webhook] no userId on completed session", session.id);
      }
    }
  }

  return NextResponse.json({ received: true });
}
