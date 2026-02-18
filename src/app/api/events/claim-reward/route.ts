import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { EVENT_PARTICIPATION_REWARD_BONUS } from "@/lib/constants";

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { eventId } = await request.json();

  if (!eventId) {
    return NextResponse.json(
      { error: "eventId requis" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const now = new Date().toISOString();

  // Fetch the event and verify it has ended
  const { data: event } = await admin
    .from("narrative_events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (!event) {
    return NextResponse.json(
      { error: "Événement non trouvé" },
      { status: 404 }
    );
  }

  if (event.ends_at >= now) {
    return NextResponse.json(
      { error: "Cet événement n'est pas encore terminé" },
      { status: 400 }
    );
  }

  // Fetch user's participation
  const { data: participation } = await admin
    .from("event_participations")
    .select("*")
    .eq("user_id", user.id)
    .eq("event_id", eventId)
    .single();

  if (!participation) {
    return NextResponse.json(
      { error: "Vous n'avez pas participé à cet événement" },
      { status: 400 }
    );
  }

  if (participation.reward_claimed) {
    return NextResponse.json(
      { error: "Récompense déjà réclamée" },
      { status: 400 }
    );
  }

  // Calculate reward
  const isWinningChoice =
    event.winning_choice_id !== null &&
    event.winning_choice_id === participation.choice_id;

  const baseGems = event.reward_gems || 0;
  const bonusGems = isWinningChoice ? EVENT_PARTICIPATION_REWARD_BONUS : 0;
  const totalGems = baseGems + bonusGems;
  const rewardXp = event.reward_xp || 0;

  // Update profile: increment gems and xp
  const { data: profile } = await admin
    .from("profiles")
    .select("gems_balance, xp")
    .eq("id", user.id)
    .single();

  await admin
    .from("profiles")
    .update({
      gems_balance: (profile?.gems_balance || 0) + totalGems,
      xp: (profile?.xp || 0) + rewardXp,
    })
    .eq("id", user.id);

  // Mark participation as reward claimed
  await admin
    .from("event_participations")
    .update({ reward_claimed: true })
    .eq("id", participation.id);

  return NextResponse.json({
    gems: totalGems,
    xp: rewardXp,
    isWinningChoice,
  });
}
