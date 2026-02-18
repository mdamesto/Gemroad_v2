import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  NarrativeEventWithDetails,
  EventChoiceWithVotes,
  EventStatus,
} from "@/types/game";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = createAdminClient();
  const now = new Date().toISOString();

  // Fetch everything in parallel
  const [
    { data: events },
    { data: choices },
    { data: userParticipations },
    { data: allParticipations },
  ] = await Promise.all([
    admin.from("narrative_events").select("*").order("starts_at", { ascending: false }),
    admin.from("event_choices").select("*").order("sort_order"),
    user
      ? admin
          .from("event_participations")
          .select("*")
          .eq("user_id", user.id)
      : Promise.resolve({ data: [] as Record<string, unknown>[] }),
    admin.from("event_participations").select("event_id, choice_id"),
  ]);

  // Build enriched events
  const enrichedEvents: NarrativeEventWithDetails[] = (events || []).map(
    (event) => {
      // Determine status
      let status: EventStatus;
      if (event.starts_at > now) {
        status = "upcoming";
      } else if (event.ends_at < now) {
        status = "ended";
      } else {
        status = "active";
      }

      // Find choices for this event
      const eventChoices = (choices || []).filter(
        (c) => c.event_id === event.id
      );

      // Count votes per choice for this event
      const eventVotes = (allParticipations || []).filter(
        (p) => p.event_id === event.id
      );
      const totalVotes = eventVotes.length;

      // Find user's participation for this event
      const userParticipation =
        (userParticipations || []).find(
          (p) => p.event_id === event.id
        ) || null;

      // Build choices with vote data
      const enrichedChoices: EventChoiceWithVotes[] = eventChoices.map((c) => {
        const voteCount = eventVotes.filter(
          (p) => p.choice_id === c.id
        ).length;
        const votePercent =
          totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
        const isUserChoice = userParticipation
          ? userParticipation.choice_id === c.id
          : false;

        return {
          ...c,
          voteCount,
          votePercent,
          isUserChoice,
        };
      });

      return {
        ...event,
        status,
        choices: enrichedChoices,
        totalVotes,
        userParticipation: userParticipation as NarrativeEventWithDetails["userParticipation"],
      };
    }
  );

  return NextResponse.json({ events: enrichedEvents });
}
