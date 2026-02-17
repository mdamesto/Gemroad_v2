import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { boosterTypeId, quantity = 1 } = await request.json();

  // Get booster type
  const { data: boosterType } = await supabase
    .from("booster_types")
    .select("*")
    .eq("id", boosterTypeId)
    .single();

  if (!boosterType || !boosterType.price_cents) {
    return NextResponse.json(
      { error: "Ce booster ne peut pas être acheté avec de l'argent réel" },
      { status: 400 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: boosterType.name,
            description: boosterType.description || undefined,
          },
          unit_amount: boosterType.price_cents,
        },
        quantity,
      },
    ],
    mode: "payment",
    success_url: `${appUrl}/boosters?success=true`,
    cancel_url: `${appUrl}/shop?canceled=true`,
    metadata: {
      user_id: user.id,
      booster_type_id: boosterTypeId,
      quantity: quantity.toString(),
    },
  });

  return NextResponse.json({ url: session.url });
}
