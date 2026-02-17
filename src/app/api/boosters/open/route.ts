import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { pickRarity } from "@/lib/utils";
import { XP_PER_BOOSTER, XP_PER_CARD_NEW } from "@/lib/constants";

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { boosterId } = await request.json();

  if (!boosterId) {
    return NextResponse.json(
      { error: "ID du booster requis" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // 1. Verify the user owns this booster and it's not opened
  const { data: booster } = await admin
    .from("user_boosters")
    .select("*, booster_type:booster_types(*)")
    .eq("id", boosterId)
    .eq("user_id", user.id)
    .is("opened_at", null)
    .single();

  if (!booster) {
    return NextResponse.json(
      { error: "Booster non trouvé ou déjà ouvert" },
      { status: 404 }
    );
  }

  const boosterType = booster.booster_type as {
    cards_count: number;
    drop_rates: Record<string, number>;
    name: string;
    faction_filter: string | null;
    guaranteed_rarity: string | null;
  };

  // 2. Pick random cards based on drop rates
  const dropRates = boosterType.drop_rates;
  const cardsCount = boosterType.cards_count;
  const drawnCards: Array<{ id: string; rarity: string; series_id: string | null; [key: string]: unknown }> = [];
  const guaranteedRarity = boosterType.guaranteed_rarity;
  let guaranteedSlotUsed = false;

  for (let i = 0; i < cardsCount; i++) {
    let rarity: string;

    // On the last card, guarantee minimum rarity if not yet met
    if (guaranteedRarity && !guaranteedSlotUsed && i === cardsCount - 1) {
      const rarityOrder = ["common", "uncommon", "rare", "epic", "legendary"];
      const minIndex = rarityOrder.indexOf(guaranteedRarity);
      const hasGuaranteed = drawnCards.some(
        (c) => rarityOrder.indexOf(c.rarity) >= minIndex
      );
      if (!hasGuaranteed) {
        rarity = guaranteedRarity;
        guaranteedSlotUsed = true;
      } else {
        rarity = pickRarity(dropRates);
      }
    } else {
      rarity = pickRarity(dropRates);
    }

    // Track if we've drawn a card meeting the guarantee
    if (guaranteedRarity && !guaranteedSlotUsed) {
      const rarityOrder = ["common", "uncommon", "rare", "epic", "legendary"];
      const minIndex = rarityOrder.indexOf(guaranteedRarity);
      if (rarityOrder.indexOf(rarity) >= minIndex) {
        guaranteedSlotUsed = true;
      }
    }

    // Build query with optional faction filter
    let query = admin.from("cards").select("*").eq("rarity", rarity);

    if (boosterType.faction_filter) {
      query = query.eq("faction", boosterType.faction_filter);
    }

    const { data: cards } = await query;

    if (cards && cards.length > 0) {
      const randomCard = cards[Math.floor(Math.random() * cards.length)];
      drawnCards.push(randomCard);
    }
  }

  // 3. Add cards to user collection and track new cards
  const newCards: string[] = [];
  let xpGained = XP_PER_BOOSTER;

  for (const card of drawnCards) {
    const { data: existing } = await admin
      .from("user_cards")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("card_id", card.id)
      .single();

    if (existing) {
      await admin
        .from("user_cards")
        .update({ quantity: existing.quantity + 1 })
        .eq("id", existing.id);
    } else {
      await admin.from("user_cards").insert({
        user_id: user.id,
        card_id: card.id,
        quantity: 1,
        obtained_from: `booster_${boosterType.name.toLowerCase().replace(/\s/g, "_")}`,
      });
      newCards.push(card.id);
      xpGained += XP_PER_CARD_NEW;
    }
  }

  // 4. Mark booster as opened
  await admin
    .from("user_boosters")
    .update({ opened_at: new Date().toISOString() })
    .eq("id", boosterId);

  // 5. Update series progress
  const seriesIds = [
    ...new Set(drawnCards.map((c) => c.series_id).filter(Boolean)),
  ];

  for (const seriesId of seriesIds) {
    // Count how many unique cards the user has from this series
    const { count } = await admin
      .from("user_cards")
      .select("card_id, cards!inner(series_id)", { count: "exact" })
      .eq("user_id", user.id)
      .eq("cards.series_id", seriesId!);

    const { data: series } = await admin
      .from("series")
      .select("total_cards")
      .eq("id", seriesId!)
      .single();

    const completed = (count ?? 0) >= (series?.total_cards ?? Infinity);

    await admin
      .from("user_series_progress")
      .upsert(
        {
          user_id: user.id,
          series_id: seriesId!,
          cards_collected: count ?? 0,
          completed,
          completed_at: completed ? new Date().toISOString() : null,
        },
        { onConflict: "user_id,series_id" }
      );
  }

  // 6. Update XP + talent points on level-up
  const { data: profile } = await admin
    .from("profiles")
    .select("xp, level, talent_points")
    .eq("id", user.id)
    .single();

  if (profile) {
    const newXp = profile.xp + xpGained;
    const newLevel = Math.floor(newXp / 100) + 1;
    const levelsGained = newLevel - profile.level;
    await admin
      .from("profiles")
      .update({
        xp: newXp,
        level: newLevel,
        talent_points: profile.talent_points + Math.max(0, levelsGained),
      })
      .eq("id", user.id);
  }

  // 7. Check achievements
  await checkAchievements(admin, user.id);

  return NextResponse.json({
    cards: drawnCards,
    newCards,
    boosterId,
  });
}

async function checkAchievements(
  admin: ReturnType<typeof createAdminClient>,
  userId: string
) {
  const { data: achievements } = await admin.from("achievements").select("*");
  if (!achievements) return;

  for (const achievement of achievements) {
    // Check if already unlocked
    const { data: existing } = await admin
      .from("user_achievements")
      .select("id")
      .eq("user_id", userId)
      .eq("achievement_id", achievement.id)
      .single();

    if (existing) continue;

    let met = false;

    switch (achievement.condition_type) {
      case "cards_collected": {
        const { count } = await admin
          .from("user_cards")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);
        met = (count ?? 0) >= achievement.condition_value;
        break;
      }
      case "boosters_opened": {
        const { count } = await admin
          .from("user_boosters")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .not("opened_at", "is", null);
        met = (count ?? 0) >= achievement.condition_value;
        break;
      }
      case "series_completed": {
        const { count } = await admin
          .from("user_series_progress")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("completed", true);
        met = (count ?? 0) >= achievement.condition_value;
        break;
      }
      case "rarity_collected": {
        const { count } = await admin
          .from("user_cards")
          .select("*, cards!inner(rarity)", { count: "exact", head: true })
          .eq("user_id", userId)
          .in("cards.rarity", ["epic", "legendary"]);
        met = (count ?? 0) >= achievement.condition_value;
        break;
      }
    }

    if (met) {
      await admin.from("user_achievements").insert({
        user_id: userId,
        achievement_id: achievement.id,
      });
    }
  }
}
