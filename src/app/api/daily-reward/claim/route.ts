import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DAILY_REWARD_BASE, DAILY_REWARD_STREAK_BONUS, DAILY_REWARD_MAX_STREAK } from "@/lib/constants";

export async function POST() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Get last daily reward
  const { data: lastReward } = await admin
    .from("daily_rewards")
    .select("*")
    .eq("user_id", user.id)
    .order("claimed_at", { ascending: false })
    .limit(1);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let currentStreak = 0;

  if (lastReward && lastReward.length > 0) {
    const lastClaimed = new Date(lastReward[0].claimed_at);
    const lastClaimedDay = new Date(lastClaimed.getFullYear(), lastClaimed.getMonth(), lastClaimed.getDate());

    // Already claimed today
    if (lastClaimedDay.getTime() === todayStart.getTime()) {
      return NextResponse.json({ error: "Déjà réclamé aujourd'hui" }, { status: 400 });
    }

    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    if (lastClaimedDay.getTime() === yesterdayStart.getTime()) {
      currentStreak = lastReward[0].day_streak;
    }
  }

  // Calculate new streak and reward
  const newStreak = currentStreak >= DAILY_REWARD_MAX_STREAK ? 1 : currentStreak + 1;
  const gemsEarned = DAILY_REWARD_BASE + (newStreak - 1) * DAILY_REWARD_STREAK_BONUS;

  // Insert daily reward log
  await admin.from("daily_rewards").insert({
    user_id: user.id,
    day_streak: newStreak,
    gems_earned: gemsEarned,
  });

  // Update user gems balance
  const { data: profile } = await admin
    .from("profiles")
    .select("gems_balance")
    .eq("id", user.id)
    .single();

  if (profile) {
    await admin
      .from("profiles")
      .update({ gems_balance: profile.gems_balance + gemsEarned })
      .eq("id", user.id);
  }

  // Log transaction
  await admin.from("transactions").insert({
    user_id: user.id,
    type: "earn_gems",
    amount: gemsEarned,
    description: `Récompense quotidienne (jour ${newStreak})`,
  });

  return NextResponse.json({
    streak: newStreak,
    gemsEarned,
    totalBalance: (profile?.gems_balance ?? 0) + gemsEarned,
  });
}
