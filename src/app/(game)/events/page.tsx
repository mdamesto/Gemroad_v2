"use client";

import { useState } from "react";
import styled from "styled-components";

import { LoadingState } from "@/components/ui/skeleton-loader";
import { useEvents } from "@/hooks/use-events";
import { EventCard } from "@/components/events/event-card";
import { useToastStore } from "@/stores/toast-store";
import { formatGems } from "@/lib/utils";
import { theme } from "@/lib/theme";

const Page = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 16px;
`;

const Section = styled.section`
  margin-top: 32px;
`;

const SectionTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: 1.15rem;
  color: ${theme.colors.text};
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${theme.gradients.separator};
  }
`;

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const EmptyText = styled.p`
  color: ${theme.colors.textMuted};
  font-size: 0.9rem;
  font-style: italic;
  text-align: center;
  padding: 20px;
`;

export default function EventsPage() {
  const { events, loading, vote, claimReward } = useEvents();
  const addToast = useToastStore((s) => s.addToast);
  const [votingId, setVotingId] = useState<string | null>(null);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const activeEvents = events.filter((e) => e.status === "active");
  const upcomingEvents = events.filter((e) => e.status === "upcoming");
  const endedEvents = events.filter((e) => e.status === "ended");

  const handleVote = async (eventId: string, choiceId: string) => {
    setVotingId(choiceId);
    const success = await vote(eventId, choiceId);
    if (success) {
      addToast("Vote enregistré !", "success");
    } else {
      addToast("Erreur lors du vote", "error");
    }
    setVotingId(null);
  };

  const handleClaim = async (eventId: string) => {
    setClaimingId(eventId);
    const result = await claimReward(eventId);
    if (result) {
      const msg = result.isWinningChoice
        ? `+${formatGems(result.gems)} gemmes (bonus gagnant !), +${result.xp} XP`
        : `+${formatGems(result.gems)} gemmes, +${result.xp} XP`;
      addToast(msg, "success");
    } else {
      addToast("Erreur lors de la réclamation", "error");
    }
    setClaimingId(null);
  };

  if (loading) return <LoadingState text="Chargement des événements..." />;

  return (
    <Page>
      <Section>
        <SectionTitle>En Cours</SectionTitle>
        {activeEvents.length > 0 ? (
          <EventList>
            {activeEvents.map((event, i) => (
              <EventCard
                key={event.id}
                event={event}
                index={i}
                onVote={handleVote}
                onClaim={handleClaim}
                votingId={votingId}
                claimingId={claimingId}
              />
            ))}
          </EventList>
        ) : (
          <EmptyText>Aucun événement en cours pour le moment.</EmptyText>
        )}
      </Section>

      {upcomingEvents.length > 0 && (
        <Section>
          <SectionTitle>A Venir</SectionTitle>
          <EventList>
            {upcomingEvents.map((event, i) => (
              <EventCard
                key={event.id}
                event={event}
                index={i}
                onVote={handleVote}
                onClaim={handleClaim}
                votingId={votingId}
                claimingId={claimingId}
              />
            ))}
          </EventList>
        </Section>
      )}

      {endedEvents.length > 0 && (
        <Section>
          <SectionTitle>Terminés</SectionTitle>
          <EventList>
            {endedEvents.map((event, i) => (
              <EventCard
                key={event.id}
                event={event}
                index={i}
                onVote={handleVote}
                onClaim={handleClaim}
                votingId={votingId}
                claimingId={claimingId}
              />
            ))}
          </EventList>
        </Section>
      )}
    </Page>
  );
}
