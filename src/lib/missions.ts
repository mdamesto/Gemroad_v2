import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Update mission progress for a user when they perform an action.
 * Called from API routes (boosters/open, boosters/purchase, fusion/craft, fusion/recycle).
 */
export async function updateMissionProgress(
  admin: SupabaseClient,
  userId: string,
  conditionType: string,
  amount: number
) {
  // Find active user missions matching the condition type
  const { data: userMissions } = await admin
    .from("user_missions")
    .select("*, mission:missions(*)")
    .eq("user_id", userId)
    .eq("completed", false)
    .gt("expires_at", new Date().toISOString());

  if (!userMissions || userMissions.length === 0) return;

  for (const um of userMissions) {
    const mission = um.mission as { condition_type: string; condition_value: number } | null;
    if (!mission || mission.condition_type !== conditionType) continue;

    const newProgress = Math.min(um.progress + amount, mission.condition_value);
    const completed = newProgress >= mission.condition_value;

    await admin
      .from("user_missions")
      .update({ progress: newProgress, completed })
      .eq("id", um.id);
  }
}
