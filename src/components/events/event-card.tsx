"use client";

import styled from "styled-components";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import { theme, alpha } from "@/lib/theme";
import { fadeInUp } from "@/lib/animations";
import { FACTION_COLORS, FACTION_LABELS } from "@/lib/constants";
import type { FactionConst } from "@/lib/constants";
import type { NarrativeEventWithDetails, EventChoiceWithVotes } from "@/types/game";

const Card = styled(GlassCard)<{ $index: number }>`
  animation: ${fadeInUp} 0.5s ease-out both;
  animation-delay: ${({ $index }) => $index * 0.1}s;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: ${theme.radii.full};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${({ $status }) =>
    $status === "active"
      ? alpha("#34D399", 0.15)
      : $status === "upcoming"
        ? alpha("#60A5FA", 0.15)
        : "var(--white-alpha-006)"};
  color: ${({ $status }) =>
    $status === "active"
      ? "#34D399"
      : $status === "upcoming"
        ? "#60A5FA"
        : theme.colors.textMuted};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const Title = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 1.15rem;
  color: ${theme.colors.text};
  margin: 0;
`;

const Description = styled.p`
  color: ${theme.colors.textMuted};
  font-size: 0.88rem;
  line-height: 1.5;
  margin: 0 0 8px;
`;

const NarrativeText = styled.p`
  color: ${theme.colors.textMuted};
  font-size: 0.84rem;
  line-height: 1.6;
  font-style: italic;
  margin: 0 0 20px;
  padding: 12px 16px;
  border-left: 2px solid ${alpha(theme.colors.primary, 0.3)};
  background: var(--white-alpha-004);
  border-radius: 0 ${theme.radii.md} ${theme.radii.md} 0;
`;

const DateRange = styled.p`
  font-size: 0.78rem;
  color: ${theme.colors.textMuted};
  margin: 0 0 16px;
`;

const Rewards = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  font-size: 0.82rem;
`;

const RewardTag = styled.span`
  padding: 4px 10px;
  border-radius: ${theme.radii.full};
  background: var(--white-alpha-006);
  color: ${theme.colors.text};
  font-weight: 500;
`;

const ChoicesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ChoiceRow = styled.div<{ $color: string; $isUserChoice: boolean }>`
  position: relative;
  padding: 14px 16px;
  border-radius: ${theme.radii.lg};
  background: ${({ $isUserChoice, $color }) =>
    $isUserChoice ? alpha($color, 0.08) : "var(--white-alpha-004)"};
  border: 1px solid ${({ $isUserChoice, $color }) =>
    $isUserChoice ? alpha($color, 0.3) : "transparent"};
  overflow: hidden;
  transition: all 0.2s;
`;

const ChoiceInfo = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const ChoiceLeft = styled.div`
  flex: 1;
`;

const ChoiceLabel = styled.p`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${theme.colors.text};
  margin: 0 0 2px;
`;

const ChoiceDesc = styled.p`
  font-size: 0.8rem;
  color: ${theme.colors.textMuted};
  margin: 0;
`;

const FactionTag = styled.span<{ $color: string }>`
  font-size: 0.72rem;
  font-weight: 600;
  color: ${({ $color }) => $color};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const VoteBar = styled.div<{ $percent: number; $color: string }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background: ${({ $color }) => alpha($color, 0.06)};
  transition: width 0.5s ease;
`;

const VoteCount = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${theme.colors.text};
  white-space: nowrap;
`;

const WinnerBadge = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  color: #FBBF24;
  background: ${alpha("#FBBF24", 0.12)};
  padding: 2px 8px;
  border-radius: ${theme.radii.full};
  margin-left: 8px;
`;

const ClaimRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 16px;
  gap: 12px;
`;

interface EventCardProps {
  event: NarrativeEventWithDetails;
  index: number;
  onVote: (eventId: string, choiceId: string) => void;
  onClaim: (eventId: string) => void;
  votingId: string | null;
  claimingId: string | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getChoiceColor(choice: EventChoiceWithVotes): string {
  if (choice.faction && FACTION_COLORS[choice.faction as FactionConst]) {
    return FACTION_COLORS[choice.faction as FactionConst];
  }
  return theme.colors.primary;
}

export function EventCard({
  event,
  index,
  onVote,
  onClaim,
  votingId,
  claimingId,
}: EventCardProps) {
  const statusLabels = {
    active: "En cours",
    upcoming: "A venir",
    ended: "Terminé",
  };

  const hasVoted = event.userParticipation !== null;
  const canClaim =
    event.status === "ended" &&
    hasVoted &&
    !event.userParticipation?.reward_claimed;

  return (
    <Card $index={index}>
      <Header>
        <Title>{event.title}</Title>
        <StatusBadge $status={event.status}>{statusLabels[event.status]}</StatusBadge>
      </Header>

      <Description>{event.description}</Description>

      <NarrativeText>{event.narrative_text}</NarrativeText>

      <DateRange>
        Du {formatDate(event.starts_at)} au {formatDate(event.ends_at)}
      </DateRange>

      <Rewards>
        <RewardTag>{event.reward_gems} gemmes</RewardTag>
        <RewardTag>{event.reward_xp} XP</RewardTag>
      </Rewards>

      <ChoicesContainer>
        {event.choices.map((choice) => {
          const color = getChoiceColor(choice);
          const isWinner = event.winning_choice_id === choice.id;
          const showVotes = hasVoted || event.status === "ended";

          return (
            <ChoiceRow
              key={choice.id}
              $color={color}
              $isUserChoice={choice.isUserChoice}
            >
              {showVotes && (
                <VoteBar $percent={choice.votePercent} $color={color} />
              )}
              <ChoiceInfo>
                <ChoiceLeft>
                  {choice.faction && (
                    <FactionTag $color={color}>
                      {FACTION_LABELS[choice.faction as FactionConst]}
                    </FactionTag>
                  )}
                  <ChoiceLabel>
                    {choice.label}
                    {isWinner && <WinnerBadge>Gagnant</WinnerBadge>}
                  </ChoiceLabel>
                  <ChoiceDesc>{choice.description}</ChoiceDesc>
                </ChoiceLeft>

                {showVotes ? (
                  <VoteCount>
                    {choice.votePercent}% ({choice.voteCount})
                  </VoteCount>
                ) : event.status === "active" && !hasVoted ? (
                  <GlowButton
                    $size="sm"
                    $variant="primary"
                    onClick={() => onVote(event.id, choice.id)}
                    loading={votingId === choice.id}
                    disabled={!!votingId}
                  >
                    Voter
                  </GlowButton>
                ) : null}
              </ChoiceInfo>
            </ChoiceRow>
          );
        })}
      </ChoicesContainer>

      {canClaim && (
        <ClaimRow>
          <GlowButton
            $size="sm"
            $variant="success"
            onClick={() => onClaim(event.id)}
            loading={claimingId === event.id}
          >
            Réclamer la récompense
          </GlowButton>
        </ClaimRow>
      )}
    </Card>
  );
}
