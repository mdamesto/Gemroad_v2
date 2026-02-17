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

  const { talentId } = await request.json();

  if (!talentId) {
    return NextResponse.json(
      { error: "ID du talent requis" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // 1. Get talent details
  const { data: talent } = await admin
    .from("talents")
    .select("*")
    .eq("id", talentId)
    .single();

  if (!talent) {
    return NextResponse.json(
      { error: "Talent non trouvé" },
      { status: 404 }
    );
  }

  // 2. Check not already unlocked
  const { data: existing } = await admin
    .from("user_talents")
    .select("id")
    .eq("user_id", user.id)
    .eq("talent_id", talentId)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "Talent déjà débloqué" },
      { status: 400 }
    );
  }

  // 3. Check prerequisite
  if (talent.prerequisite_talent_id) {
    const { data: prereq } = await admin
      .from("user_talents")
      .select("id")
      .eq("user_id", user.id)
      .eq("talent_id", talent.prerequisite_talent_id)
      .single();

    if (!prereq) {
      return NextResponse.json(
        { error: "Prérequis non débloqué" },
        { status: 400 }
      );
    }
  }

  // 4. Check talent points
  const { data: profile } = await admin
    .from("profiles")
    .select("talent_points")
    .eq("id", user.id)
    .single();

  if (!profile || profile.talent_points < talent.cost) {
    return NextResponse.json(
      { error: "Points de talent insuffisants" },
      { status: 400 }
    );
  }

  // 5. Deduct points and unlock
  await admin
    .from("profiles")
    .update({ talent_points: profile.talent_points - talent.cost })
    .eq("id", user.id);

  await admin.from("user_talents").insert({
    user_id: user.id,
    talent_id: talentId,
  });

  return NextResponse.json({
    talent_points_remaining: profile.talent_points - talent.cost,
    talent,
  });
}
