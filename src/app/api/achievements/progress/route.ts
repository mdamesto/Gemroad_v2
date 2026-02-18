import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Gather all stats in parallel
  const [
    { count: cardsCollected },
    { count: boostersOpened },
    { count: seriesCompleted },
    { data: profile },
    { count: rareCards },
    { count: legendaryCards },
    { count: totalDuplicates },
    { count: achievementsUnlocked },
    { data: lastReward },
    { data: gemsTransactions },
  ] = await Promise.all([
    admin
      .from("user_cards")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    admin
      .from("user_boosters")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .not("opened_at", "is", null),
    admin
      .from("user_series_progress")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("completed", true),
    admin
      .from("profiles")
      .select("level")
      .eq("id", user.id)
      .single(),
    admin
      .from("user_cards")
      .select("*, cards!inner(rarity)", { count: "exact", head: true })
      .eq("user_id", user.id)
      .in("cards.rarity", ["rare", "epic", "legendary"]),
    admin
      .from("user_cards")
      .select("*, cards!inner(rarity)", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("cards.rarity", "legendary"),
    admin
      .from("user_cards")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gt("quantity", 1),
    admin
      .from("user_achievements")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    admin
      .from("daily_rewards")
      .select("day_streak")
      .eq("user_id", user.id)
      .order("claimed_at", { ascending: false })
      .limit(1),
    admin
      .from("transactions")
      .select("amount")
      .eq("user_id", user.id)
      .eq("type", "earn_gems"),
  ]);

  const gemsEarned = (gemsTransactions || []).reduce(
    (sum: number, t: { amount: number }) => sum + Math.abs(t.amount),
    0
  );

  const loginStreak = lastReward?.[0]?.day_streak ?? 0;

  const progress: Record<string, number> = {
    cards_collected: cardsCollected ?? 0,
    boosters_opened: boostersOpened ?? 0,
    series_completed: seriesCompleted ?? 0,
    level_reached: profile?.level ?? 1,
    rare_cards: rareCards ?? 0,
    legendary_cards: legendaryCards ?? 0,
    total_duplicates: totalDuplicates ?? 0,
    achievements_unlocked: achievementsUnlocked ?? 0,
    login_streak: loginStreak,
    gems_earned: gemsEarned,
  };

  return NextResponse.json({ progress });
}
