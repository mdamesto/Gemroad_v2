import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { missionId } = await request.json();

  if (!missionId) {
    return NextResponse.json({ error: "ID de mission requis" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Get user mission
  const { data: userMission } = await admin
    .from("user_missions")
    .select("*, mission:missions(*)")
    .eq("id", missionId)
    .eq("user_id", user.id)
    .single();

  if (!userMission) {
    return NextResponse.json({ error: "Mission non trouvée" }, { status: 404 });
  }

  if (!userMission.completed) {
    return NextResponse.json({ error: "Mission non complétée" }, { status: 400 });
  }

  if (userMission.claimed) {
    return NextResponse.json({ error: "Récompense déjà réclamée" }, { status: 400 });
  }

  const mission = userMission.mission as { reward_gems: number; reward_xp: number; name: string };

  // Mark as claimed
  await admin
    .from("user_missions")
    .update({ claimed: true })
    .eq("id", missionId);

  // Award gems
  if (mission.reward_gems > 0) {
    const { data: profile } = await admin
      .from("profiles")
      .select("gems_balance, xp, level, talent_points")
      .eq("id", user.id)
      .single();

    if (profile) {
      const newXp = profile.xp + (mission.reward_xp || 0);
      const newLevel = Math.floor(newXp / 100) + 1;
      const levelsGained = newLevel - profile.level;

      await admin
        .from("profiles")
        .update({
          gems_balance: profile.gems_balance + mission.reward_gems,
          xp: newXp,
          level: newLevel,
          talent_points: profile.talent_points + Math.max(0, levelsGained),
        })
        .eq("id", user.id);
    }

    // Log transaction
    await admin.from("transactions").insert({
      user_id: user.id,
      type: "earn_gems",
      amount: mission.reward_gems,
      description: `Mission : ${mission.name}`,
    });
  }

  return NextResponse.json({
    gems: mission.reward_gems,
    xp: mission.reward_xp,
  });
}
