import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DAILY_REWARD_BASE, DAILY_REWARD_STREAK_BONUS, DAILY_REWARD_MAX_STREAK } from "@/lib/constants";

export async function GET() {
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

  let canClaim = true;
  let currentStreak = 0;

  if (lastReward && lastReward.length > 0) {
    const lastClaimed = new Date(lastReward[0].claimed_at);
    const lastClaimedDay = new Date(lastClaimed.getFullYear(), lastClaimed.getMonth(), lastClaimed.getDate());

    // Already claimed today
    if (lastClaimedDay.getTime() === todayStart.getTime()) {
      canClaim = false;
      currentStreak = lastReward[0].day_streak;
    } else {
      const yesterdayStart = new Date(todayStart);
      yesterdayStart.setDate(yesterdayStart.getDate() - 1);

      // Streak continues if last claim was yesterday
      if (lastClaimedDay.getTime() === yesterdayStart.getTime()) {
        currentStreak = lastReward[0].day_streak;
      } else {
        // Streak broken, reset
        currentStreak = 0;
      }
    }
  }

  // Calculate next reward
  const nextStreak = Math.min(currentStreak + 1, DAILY_REWARD_MAX_STREAK);
  const nextReward = DAILY_REWARD_BASE + (nextStreak - 1) * DAILY_REWARD_STREAK_BONUS;

  // Calculate countdown to next day (midnight UTC)
  const tomorrow = new Date(todayStart);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const msUntilReset = tomorrow.getTime() - now.getTime();

  // Build 7-day reward schedule
  const schedule = Array.from({ length: DAILY_REWARD_MAX_STREAK }, (_, i) => ({
    day: i + 1,
    gems: DAILY_REWARD_BASE + i * DAILY_REWARD_STREAK_BONUS,
    claimed: i < currentStreak && !canClaim ? true : i < currentStreak,
    current: canClaim ? i === currentStreak : i === currentStreak - 1,
  }));

  return NextResponse.json({
    canClaim,
    currentStreak,
    nextStreak: canClaim ? nextStreak : currentStreak,
    nextReward: canClaim ? nextReward : 0,
    msUntilReset,
    schedule,
  });
}
