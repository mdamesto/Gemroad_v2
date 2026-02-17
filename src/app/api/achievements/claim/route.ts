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

  const { achievementId } = await request.json();

  if (!achievementId) {
    return NextResponse.json(
      { error: "ID de l'achievement requis" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // Check that the achievement is unlocked but not yet claimed
  const { data: userAchievement } = await admin
    .from("user_achievements")
    .select("*, achievement:achievements(*)")
    .eq("user_id", user.id)
    .eq("achievement_id", achievementId)
    .eq("claimed", false)
    .single();

  if (!userAchievement) {
    return NextResponse.json(
      { error: "Achievement non trouvé ou déjà réclamé" },
      { status: 404 }
    );
  }

  const achievement = userAchievement.achievement as {
    reward_gems: number;
    reward_xp: number;
  };

  // Claim: give rewards
  const { data: profile } = await admin
    .from("profiles")
    .select("gems_balance, xp")
    .eq("id", user.id)
    .single();

  if (profile) {
    const newXp = profile.xp + achievement.reward_xp;
    await admin
      .from("profiles")
      .update({
        gems_balance: profile.gems_balance + achievement.reward_gems,
        xp: newXp,
        level: Math.floor(newXp / 100) + 1,
      })
      .eq("id", user.id);
  }

  // Mark as claimed
  await admin
    .from("user_achievements")
    .update({ claimed: true })
    .eq("id", userAchievement.id);

  // Log transaction
  if (achievement.reward_gems > 0) {
    await admin.from("transactions").insert({
      user_id: user.id,
      type: "earn_gems",
      amount: achievement.reward_gems,
      description: `Récompense achievement: ${achievementId}`,
    });
  }

  return NextResponse.json({
    gems: achievement.reward_gems,
    xp: achievement.reward_xp,
  });
}
