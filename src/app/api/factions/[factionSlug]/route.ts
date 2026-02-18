import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { SLUG_TO_FACTION, FactionSlug } from "@/lib/constants";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ factionSlug: string }> }
) {
  const { factionSlug } = await params;

  const factionKey = SLUG_TO_FACTION[factionSlug as FactionSlug];
  if (!factionKey) {
    return NextResponse.json({ error: "Faction non trouvée" }, { status: 404 });
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = createAdminClient();

  // Fetch everything in parallel
  const [
    { data: faction },
    { data: cards },
    { data: userCards },
    { data: talentTree },
    { data: storyArcs },
  ] = await Promise.all([
    admin.from("factions").select("*").eq("slug", factionKey).single(),
    admin.from("cards").select("*").eq("faction", factionKey),
    user
      ? admin.from("user_cards").select("card_id, quantity").eq("user_id", user.id)
      : Promise.resolve({ data: [] as { card_id: string; quantity: number }[] }),
    admin
      .from("talent_trees")
      .select("*, talents(*)")
      .eq("faction", factionKey)
      .single(),
    admin.from("story_arcs").select("*").eq("faction", factionKey),
  ]);

  if (!faction) {
    return NextResponse.json({ error: "Faction non trouvée" }, { status: 404 });
  }

  // Build user card lookup
  const userCardMap = new Map<string, number>();
  for (const uc of userCards || []) {
    userCardMap.set(uc.card_id, uc.quantity);
  }

  // Enrich cards with ownership info
  const enrichedCards = (cards || []).map((card) => ({
    ...card,
    owned: userCardMap.has(card.id),
    quantity: userCardMap.get(card.id) || 0,
  }));

  // Notable cards: epic or legendary with lore
  const notableCards = enrichedCards.filter(
    (c) => (c.rarity === "epic" || c.rarity === "legendary") && c.lore
  );

  // Stats
  const totalCards = enrichedCards.length;
  const ownedCards = enrichedCards.filter((c) => c.owned).length;
  const completionPercent =
    totalCards > 0 ? Math.round((ownedCards / totalCards) * 100) : 0;

  return NextResponse.json({
    faction,
    cards: enrichedCards,
    notableCards,
    talentTree: talentTree || null,
    storyArcs: storyArcs || [],
    stats: {
      totalCards,
      ownedCards,
      completionPercent,
    },
  });
}
