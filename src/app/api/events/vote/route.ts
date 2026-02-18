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

  const { eventId, choiceId } = await request.json();

  if (!eventId || !choiceId) {
    return NextResponse.json(
      { error: "eventId et choiceId requis" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const now = new Date().toISOString();

  // Fetch the event and verify it's active
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

  if (event.starts_at > now) {
    return NextResponse.json(
      { error: "Cet événement n'a pas encore commencé" },
      { status: 400 }
    );
  }

  if (event.ends_at < now) {
    return NextResponse.json(
      { error: "Cet événement est terminé" },
      { status: 400 }
    );
  }

  // Verify the choice belongs to this event
  const { data: choice } = await admin
    .from("event_choices")
    .select("*")
    .eq("id", choiceId)
    .eq("event_id", eventId)
    .single();

  if (!choice) {
    return NextResponse.json(
      { error: "Choix invalide pour cet événement" },
      { status: 400 }
    );
  }

  // Check user hasn't already voted for this event
  const { data: existing } = await admin
    .from("event_participations")
    .select("id")
    .eq("user_id", user.id)
    .eq("event_id", eventId)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "Vous avez déjà voté pour cet événement" },
      { status: 400 }
    );
  }

  // Insert participation
  const { error } = await admin.from("event_participations").insert({
    user_id: user.id,
    event_id: eventId,
    choice_id: choiceId,
  });

  if (error) {
    return NextResponse.json(
      { error: "Erreur lors du vote" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
