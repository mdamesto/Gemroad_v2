import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { RECYCLE_GEM_VALUES } from "@/lib/constants";
import { updateMissionProgress } from "@/lib/missions";

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { cardId, amount } = await request.json();

  if (!cardId || !amount || amount < 1) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Get user card with card details
  const { data: userCard } = await admin
    .from("user_cards")
    .select("id, quantity, card_id, is_foil")
    .eq("user_id", user.id)
    .eq("id", cardId)
    .single();

  if (!userCard || userCard.quantity < amount) {
    return NextResponse.json({ error: "Pas assez de cartes" }, { status: 400 });
  }

  // Get card rarity for gem value
  const { data: card } = await admin
    .from("cards")
    .select("rarity, name")
    .eq("id", userCard.card_id)
    .single();

  if (!card) {
    return NextResponse.json({ error: "Carte non trouvée" }, { status: 404 });
  }

  const gemValue = RECYCLE_GEM_VALUES[card.rarity] || 5;
  const totalGems = gemValue * amount;

  // Remove cards
  const newQuantity = userCard.quantity - amount;
  if (newQuantity <= 0) {
    await admin.from("user_cards").delete().eq("id", userCard.id);
  } else {
    await admin.from("user_cards").update({ quantity: newQuantity }).eq("id", userCard.id);
  }

  // Add gems to user
  const { data: profile } = await admin
    .from("profiles")
    .select("gems_balance")
    .eq("id", user.id)
    .single();

  if (profile) {
    await admin
      .from("profiles")
      .update({ gems_balance: profile.gems_balance + totalGems })
      .eq("id", user.id);
  }

  // Log transaction
  await admin.from("transactions").insert({
    user_id: user.id,
    type: "earn_gems",
    amount: totalGems,
    description: `Recyclage de ${amount}x ${card.name}`,
  });

  // Update mission progress
  await updateMissionProgress(admin, user.id, "recycle_cards", amount);

  return NextResponse.json({
    gemsEarned: totalGems,
    recycled: amount,
    cardName: card.name,
    totalBalance: (profile?.gems_balance ?? 0) + totalGems,
  });
}
