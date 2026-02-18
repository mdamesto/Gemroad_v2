import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { MISSION_TEMPLATES } from "@/lib/constants";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date();

  // Get user's active missions
  const { data: userMissions } = await admin
    .from("user_missions")
    .select("*, mission:missions(*)")
    .eq("user_id", user.id)
    .gt("expires_at", now.toISOString());

  const activeMissions = userMissions || [];

  // Check if we need to assign new daily missions
  const dailyMissions = activeMissions.filter(
    (um) => (um.mission as { frequency: string } | null)?.frequency === "daily"
  );
  const weeklyMissions = activeMissions.filter(
    (um) => (um.mission as { frequency: string } | null)?.frequency === "weekly"
  );

  let needsRefresh = false;

  // Assign daily missions if none active (3 daily missions)
  if (dailyMissions.length === 0) {
    const templates = MISSION_TEMPLATES.daily;
    const shuffled = [...templates].sort(() => Math.random() - 0.5).slice(0, 3);

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    for (const t of shuffled) {
      // Ensure mission template exists in DB
      const { data: existing } = await admin
        .from("missions")
        .select("id")
        .eq("name", t.name)
        .eq("frequency", "daily")
        .eq("condition_type", t.condition_type)
        .eq("condition_value", t.condition_value)
        .single();

      let missionId: string;

      if (existing) {
        missionId = existing.id;
      } else {
        const { data: created } = await admin
          .from("missions")
          .insert({
            name: t.name,
            description: t.description.replace("{value}", String(t.condition_value)),
            condition_type: t.condition_type,
            condition_value: t.condition_value,
            reward_gems: t.reward_gems,
            reward_xp: t.reward_xp,
            frequency: "daily",
          })
          .select("id")
          .single();

        if (!created) continue;
        missionId = created.id;
      }

      await admin.from("user_missions").insert({
        user_id: user.id,
        mission_id: missionId,
        progress: 0,
        completed: false,
        claimed: false,
        expires_at: tomorrow.toISOString(),
      });
    }
    needsRefresh = true;
  }

  // Assign weekly missions if none active (2 weekly missions)
  if (weeklyMissions.length === 0) {
    const templates = MISSION_TEMPLATES.weekly;
    const shuffled = [...templates].sort(() => Math.random() - 0.5).slice(0, 2);

    // Next Monday midnight
    const nextMonday = new Date(now);
    nextMonday.setDate(nextMonday.getDate() + (7 - nextMonday.getDay() + 1) % 7 || 7);
    nextMonday.setHours(0, 0, 0, 0);

    for (const t of shuffled) {
      const { data: existing } = await admin
        .from("missions")
        .select("id")
        .eq("name", t.name)
        .eq("frequency", "weekly")
        .eq("condition_type", t.condition_type)
        .eq("condition_value", t.condition_value)
        .single();

      let missionId: string;

      if (existing) {
        missionId = existing.id;
      } else {
        const { data: created } = await admin
          .from("missions")
          .insert({
            name: t.name,
            description: t.description.replace("{value}", String(t.condition_value)),
            condition_type: t.condition_type,
            condition_value: t.condition_value,
            reward_gems: t.reward_gems,
            reward_xp: t.reward_xp,
            frequency: "weekly",
          })
          .select("id")
          .single();

        if (!created) continue;
        missionId = created.id;
      }

      await admin.from("user_missions").insert({
        user_id: user.id,
        mission_id: missionId,
        progress: 0,
        completed: false,
        claimed: false,
        expires_at: nextMonday.toISOString(),
      });
    }
    needsRefresh = true;
  }

  // Refetch if we assigned new missions
  if (needsRefresh) {
    const { data: refreshed } = await admin
      .from("user_missions")
      .select("*, mission:missions(*)")
      .eq("user_id", user.id)
      .gt("expires_at", now.toISOString());

    const missions = (refreshed || []).map((um) => {
      const mission = um.mission as Record<string, unknown>;
      return {
        id: um.id,
        mission_id: um.mission_id,
        name: mission?.name,
        description: mission?.description,
        condition_type: mission?.condition_type,
        condition_value: mission?.condition_value,
        reward_gems: mission?.reward_gems ?? 0,
        reward_xp: mission?.reward_xp ?? 0,
        frequency: mission?.frequency,
        progress: um.progress,
        completed: um.completed,
        claimed: um.claimed,
        expires_at: um.expires_at,
      };
    });

    return NextResponse.json({ missions });
  }

  const missions = activeMissions.map((um) => {
    const mission = um.mission as Record<string, unknown>;
    return {
      id: um.id,
      mission_id: um.mission_id,
      name: mission?.name,
      description: mission?.description,
      condition_type: mission?.condition_type,
      condition_value: mission?.condition_value,
      reward_gems: mission?.reward_gems ?? 0,
      reward_xp: mission?.reward_xp ?? 0,
      frequency: mission?.frequency,
      progress: um.progress,
      completed: um.completed,
      claimed: um.claimed,
      expires_at: um.expires_at,
    };
  });

  return NextResponse.json({ missions });
}
