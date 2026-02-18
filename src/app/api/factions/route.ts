import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { FactionWithStats } from "@/types/game";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = createAdminClient();

  // Fetch everything in parallel
  const [
    { data: factions },
    { data: cards },
    { data: userCards },
    { data: talentTrees },
  ] = await Promise.all([
    admin.from("factions").select("*").order("sort_order"),
    admin.from("cards").select("*"),
    user
      ? admin.from("user_cards").select("card_id").eq("user_id", user.id)
      : Promise.resolve({ data: [] as { card_id: string }[] }),
    admin.from("talent_trees").select("*"),
  ]);

  if (!factions) {
    return NextResponse.json({ factions: [] });
  }

  const ownedCardIds = new Set((userCards || []).map((uc) => uc.card_id));

  const factionsWithStats: FactionWithStats[] = factions.map((faction) => {
    const factionCards = (cards || []).filter((c) => c.faction === faction.slug);
    const totalCards = factionCards.length;
    const ownedCards = factionCards.filter((c) => ownedCardIds.has(c.id)).length;
    const completionPercent =
      totalCards > 0 ? Math.round((ownedCards / totalCards) * 100) : 0;
    const talentTree = (talentTrees || []).find(
      (tt) => tt.faction === faction.slug
    );

    return {
      ...faction,
      totalCards,
      ownedCards,
      completionPercent,
      talentTreeName: talentTree?.name || null,
    };
  });

  return NextResponse.json({ factions: factionsWithStats });
}
