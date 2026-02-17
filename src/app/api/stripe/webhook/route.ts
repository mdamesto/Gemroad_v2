import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { user_id, booster_type_id, quantity } = session.metadata || {};

    if (!user_id || !booster_type_id) {
      return NextResponse.json(
        { error: "Missing metadata" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const qty = parseInt(quantity || "1", 10);

    // Create boosters for the user
    const boosters = Array.from({ length: qty }, () => ({
      user_id,
      booster_type_id,
    }));

    await admin.from("user_boosters").insert(boosters);

    // Log transaction
    await admin.from("transactions").insert({
      user_id,
      type: "stripe_payment",
      amount: session.amount_total || 0,
      description: `Achat Stripe: ${qty}x booster`,
      stripe_session_id: session.id,
    });
  }

  return NextResponse.json({ received: true });
}
