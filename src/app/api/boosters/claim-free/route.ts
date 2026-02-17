import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { FREE_DAILY_BOOSTERS } from "@/lib/constants";

export async function POST() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Count today's free claims (UTC day)
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const { count } = await admin
    .from("user_boosters")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("obtained_from", "daily_free")
    .gte("purchased_at", todayStart.toISOString());

  const claimed = count ?? 0;

  if (claimed >= FREE_DAILY_BOOSTERS) {
    return NextResponse.json(
      {
        error: "Limite atteinte pour aujourd'hui",
        freeRemaining: 0,
      },
      { status: 429 }
    );
  }

  // Find the cheapest active booster type (starter)
  const { data: boosterType } = await admin
    .from("booster_types")
    .select("*")
    .eq("is_active", true)
    .order("price_gems", { ascending: true })
    .limit(1)
    .single();

  if (!boosterType) {
    return NextResponse.json(
      { error: "Aucun type de booster disponible" },
      { status: 500 }
    );
  }

  // Create free booster (no gem deduction)
  const { data: booster, error } = await admin
    .from("user_boosters")
    .insert({
      user_id: user.id,
      booster_type_id: boosterType.id,
      obtained_from: "daily_free",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création du booster" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    booster,
    boosterType,
    freeRemaining: FREE_DAILY_BOOSTERS - claimed - 1,
  });
}

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const admin = createAdminClient();

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const { count } = await admin
    .from("user_boosters")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("obtained_from", "daily_free")
    .gte("purchased_at", todayStart.toISOString());

  return NextResponse.json({
    freeRemaining: FREE_DAILY_BOOSTERS - (count ?? 0),
  });
}
