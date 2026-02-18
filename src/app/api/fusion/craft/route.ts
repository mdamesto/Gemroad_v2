import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { FUSION_COST, FUSION_TARGET } from "@/lib/constants";
import { updateMissionProgress } from "@/lib/missions";

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { cardId, rarity } = await request.json();

  if (!cardId || !rarity) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  const cost = FUSION_COST[rarity];
  const targetRarity = FUSION_TARGET[rarity];

  if (!cost || !targetRarity) {
    return NextResponse.json({ error: "Rareté non fusionnable" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Check user has enough duplicates of this card
  const { data: userCard } = await admin
    .from("user_cards")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("card_id", cardId)
    .eq("is_foil", false)
    .single();

  if (!userCard || userCard.quantity < cost) {
    return NextResponse.json(
      { error: `Pas assez de doublons (${userCard?.quantity ?? 0}/${cost})` },
      { status: 400 }
    );
  }

  // Deduct cards
  const newQuantity = userCard.quantity - cost;
  if (newQuantity <= 0) {
    await admin.from("user_cards").delete().eq("id", userCard.id);
  } else {
    await admin.from("user_cards").update({ quantity: newQuantity }).eq("id", userCard.id);
  }

  // Pick a random card of the target rarity
  const { data: targetCards } = await admin
    .from("cards")
    .select("*")
    .eq("rarity", targetRarity);

  if (!targetCards || targetCards.length === 0) {
    return NextResponse.json({ error: "Aucune carte cible trouvée" }, { status: 500 });
  }

  const resultCard = targetCards[Math.floor(Math.random() * targetCards.length)];

  // Add the new card to user collection
  const { data: existingResult } = await admin
    .from("user_cards")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("card_id", resultCard.id)
    .eq("is_foil", false)
    .single();

  if (existingResult) {
    await admin
      .from("user_cards")
      .update({ quantity: existingResult.quantity + 1 })
      .eq("id", existingResult.id);
  } else {
    await admin.from("user_cards").insert({
      user_id: user.id,
      card_id: resultCard.id,
      quantity: 1,
      is_foil: false,
      obtained_from: "fusion",
    });
  }

  // Update mission progress
  await updateMissionProgress(admin, user.id, "craft_fusion", 1);

  return NextResponse.json({
    resultCard,
    consumed: cost,
    sourceRarity: rarity,
    targetRarity,
  });
}
