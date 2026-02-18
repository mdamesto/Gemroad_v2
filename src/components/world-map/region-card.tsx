"use client";

import styled from "styled-components";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { theme, alpha } from "@/lib/theme";
import { fadeInUp } from "@/lib/animations";
import { REGION_LABELS, REGION_COLORS, REGION_DESCRIPTIONS, REGION_FACTIONS, FACTION_LABELS, FACTION_COLORS } from "@/lib/constants";
import type { RegionData } from "@/types/game";
import type { RegionConst, FactionConst } from "@/lib/constants";

const CardLink = styled(Link)<{ $delay: number }>`
  text-decoration: none;
  display: block;
  animation: ${fadeInUp} 0.5s ease both;
  animation-delay: ${({ $delay }) => $delay}ms;
`;

const Card = styled(GlassCard)<{ $glowColor: string }>`
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ $glowColor }) => $glowColor};
    box-shadow: 0 0 12px ${({ $glowColor }) => alpha($glowColor, 0.4)};
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 0 30px ${({ $glowColor }) => alpha($glowColor, 0.12)};
  }
`;

const RegionName = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 1.3rem;
  color: ${theme.colors.text};
  margin: 0 0 6px 0;
`;

const RegionDescription = styled.p`
  font-size: 0.85rem;
  color: ${theme.colors.textMuted};
  line-height: 1.5;
  margin: 0 0 16px 0;
`;

const FactionBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
`;

const FactionBadge = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 20px;
  background: ${({ $color }) => alpha($color, 0.12)};
  color: ${({ $color }) => $color};
  border: 1px solid ${({ $color }) => alpha($color, 0.2)};
`;

const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ProgressLabel = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.textMuted};
`;

const ProgressCount = styled.span<{ $color: string }>`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ $color }) => $color};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: ${alpha(theme.colors.text, 0.08)};
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percent: number; $color: string }>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  border-radius: 3px;
  background: ${({ $color }) => $color};
  box-shadow: 0 0 8px ${({ $color }) => alpha($color, 0.4)};
  transition: width 0.6s ease;
`;

interface RegionCardProps {
  region: RegionData;
  index: number;
}

export function RegionCard({ region, index }: RegionCardProps) {
  const label = REGION_LABELS[region.slug as RegionConst];
  const color = REGION_COLORS[region.slug as RegionConst];
  const description = REGION_DESCRIPTIONS[region.slug as RegionConst];
  const factions = REGION_FACTIONS[region.slug as RegionConst] || [];
  const percent = region.totalCount > 0 ? Math.round((region.completedCount / region.totalCount) * 100) : 0;

  return (
    <CardLink href={`/world-map/${region.slug}`} $delay={index * 100}>
      <Card $glowColor={color} $padding="24px">
        <RegionName>{label}</RegionName>
        <RegionDescription>{description}</RegionDescription>

        <FactionBadges>
          {factions.map((f) => (
            <FactionBadge key={f} $color={FACTION_COLORS[f as FactionConst]}>
              {FACTION_LABELS[f as FactionConst]}
            </FactionBadge>
          ))}
        </FactionBadges>

        <ProgressRow>
          <ProgressLabel>Progression</ProgressLabel>
          <ProgressCount $color={color}>
            {region.completedCount}/{region.totalCount} ({percent}%)
          </ProgressCount>
        </ProgressRow>
        <ProgressBar>
          <ProgressFill $percent={percent} $color={color} />
        </ProgressBar>
      </Card>
    </CardLink>
  );
}
