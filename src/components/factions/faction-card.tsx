"use client";

import styled from "styled-components";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { theme, alpha } from "@/lib/theme";
import { fadeInUp } from "@/lib/animations";
import { FactionWithStats } from "@/types/game";
import { FACTION_TO_SLUG } from "@/lib/constants";
import type { FactionConst } from "@/lib/constants";

const CardLink = styled(Link)<{ $index: number }>`
  text-decoration: none;
  animation: ${fadeInUp} 0.5s ease-out both;
  animation-delay: ${({ $index }) => $index * 0.1}s;
`;

const Card = styled(GlassCard)<{ $color: string }>`
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 3px solid ${({ $color }) => $color};

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 8px 24px rgba(var(--shadow-base), 0.35),
      0 0 20px ${({ $color }) => alpha($color, 0.15)};
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const FactionName = styled.h3<{ $color: string }>`
  font-family: ${theme.fonts.heading};
  font-size: 1.2rem;
  color: ${({ $color }) => $color};
  margin: 0;
`;

const CompletionBadge = styled.span<{ $percent: number }>`
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: ${theme.radii.full};
  background: ${({ $percent }) =>
    $percent >= 100
      ? alpha("#34D399", 0.15)
      : $percent > 0
        ? "var(--white-alpha-006)"
        : "var(--white-alpha-004)"};
  color: ${({ $percent }) =>
    $percent >= 100 ? "#34D399" : theme.colors.textMuted};
`;

const Description = styled.p`
  color: ${theme.colors.textMuted};
  font-size: 0.88rem;
  line-height: 1.5;
  margin: 0 0 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.82rem;
  color: ${theme.colors.textMuted};
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StatValue = styled.span`
  color: ${theme.colors.text};
  font-weight: 600;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background: var(--white-alpha-006);
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percent: number; $color: string }>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background: ${({ $color }) => $color};
  border-radius: 2px;
  transition: width 0.5s ease;
`;

interface FactionCardProps {
  faction: FactionWithStats;
  index: number;
}

export function FactionCard({ faction, index }: FactionCardProps) {
  const slug = FACTION_TO_SLUG[faction.slug as FactionConst];

  return (
    <CardLink href={`/factions/${slug}`} $index={index}>
      <Card $color={faction.color} $interactive>
        <Header>
          <FactionName $color={faction.color}>{faction.name}</FactionName>
          <CompletionBadge $percent={faction.completionPercent}>
            {faction.completionPercent}%
          </CompletionBadge>
        </Header>

        <Description>{faction.description}</Description>

        <StatsRow>
          <Stat>
            <StatValue>{faction.ownedCards}</StatValue>/{faction.totalCards} cartes
          </Stat>
          <ProgressBar>
            <ProgressFill
              $percent={faction.completionPercent}
              $color={faction.color}
            />
          </ProgressBar>
        </StatsRow>
      </Card>
    </CardLink>
  );
}
