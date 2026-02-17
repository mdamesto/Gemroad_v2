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

  const { seriesId } = await request.json();

  if (!seriesId) {
    return NextResponse.json(
      { error: "ID de la série requis" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // Check that the series is completed and reward not claimed
  const { data: progress } = await admin
    .from("user_series_progress")
    .select("*, series:series(*)")
    .eq("user_id", user.id)
    .eq("series_id", seriesId)
    .eq("completed", true)
    .eq("reward_claimed", false)
    .single();

  if (!progress) {
    return NextResponse.json(
      { error: "Série non complétée ou récompense déjà réclamée" },
      { status: 404 }
    );
  }

  // Mark reward as claimed
  await admin
    .from("user_series_progress")
    .update({ reward_claimed: true })
    .eq("id", progress.id);

  // Give bonus gems for completing a series
  const SERIES_COMPLETION_BONUS = 1000;

  const { data: profile } = await admin
    .from("profiles")
    .select("gems_balance")
    .eq("id", user.id)
    .single();

  if (profile) {
    await admin
      .from("profiles")
      .update({
        gems_balance: profile.gems_balance + SERIES_COMPLETION_BONUS,
      })
      .eq("id", user.id);
  }

  await admin.from("transactions").insert({
    user_id: user.id,
    type: "earn_gems",
    amount: SERIES_COMPLETION_BONUS,
    description: `Série complétée: ${seriesId}`,
  });

  const series = progress.series as { reward_type: string; reward_desc: string | null };

  return NextResponse.json({
    reward_type: series.reward_type,
    reward_desc: series.reward_desc,
    bonus_gems: SERIES_COMPLETION_BONUS,
  });
}
