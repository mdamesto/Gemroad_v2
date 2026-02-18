"use client";

import styled, { keyframes } from "styled-components";
import Link from "next/link";
import { theme, alpha } from "@/lib/theme";
import { fadeInUp } from "@/lib/animations";
import { GlassCard } from "@/components/ui/glass-card";
import type { StoryArcWithChapters } from "@/types/game";

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

const Card = styled(GlassCard)`
  animation: ${fadeInUp} 0.4s ease-out;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 8px 24px rgba(var(--shadow-base), 0.35),
      0 0 30px ${alpha(theme.colors.primary, 0.1)};
  }
`;

const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`;

const ArcRegion = styled.div<{ $region?: string | null }>`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ $region }) => {
    switch ($region) {
      case "neon_ruins": return "#A78BFA";
      case "ash_desert": return "#F59E0B";
      case "toxic_ocean": return "#34D399";
      default: return theme.colors.primary;
    }
  }};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const NewBadge = styled.span`
  font-size: 0.65rem;
  padding: 2px 8px;
  border-radius: 12px;
  background: ${alpha(theme.colors.accent, 0.15)};
  color: ${theme.colors.accent};
  font-weight: 700;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const ArcTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 1.2rem;
  font-weight: 700;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;

const ArcDescription = styled.p`
  font-size: 0.85rem;
  color: ${theme.colors.textMuted};
  line-height: 1.5;
  margin-bottom: 16px;
  font-style: italic;
`;

const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ProgressLabel = styled.span`
  font-size: 0.78rem;
  color: ${theme.colors.textMuted};
`;

const ProgressValue = styled.span`
  font-size: 0.78rem;
  font-weight: 600;
  color: ${theme.colors.primary};
  font-family: ${theme.fonts.mono};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: ${theme.colors.bgHover};
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${(p) => p.$percent}%;
  background: linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent});
  border-radius: 2px;
  transition: width 0.5s ease-out;
`;

const REGION_LABELS: Record<string, string> = {
  neon_ruins: "Ruines de Néon",
  ash_desert: "Désert de Cendres",
  toxic_ocean: "Océan Toxique",
};

interface ArcCardProps {
  arc: StoryArcWithChapters;
  index: number;
}

export function ArcCard({ arc, index }: ArcCardProps) {
  const percent = arc.totalNodes > 0 ? Math.round((arc.completedNodes / arc.totalNodes) * 100) : 0;
  const regionLabel = arc.region ? REGION_LABELS[arc.region] || arc.region : "Multi-Faction";

  return (
    <CardLink href={`/chronicles/${arc.slug}`}>
      <Card style={{ animationDelay: `${index * 0.1}s` }}>
        <ArcRegion $region={arc.region}>
          {regionLabel}
          {arc.hasUnlockable && <NewBadge>Nouveau</NewBadge>}
        </ArcRegion>
        <ArcTitle>{arc.name}</ArcTitle>
        <ArcDescription>{arc.description}</ArcDescription>
        <ProgressRow>
          <ProgressLabel>{arc.completedNodes} / {arc.totalNodes} noeuds</ProgressLabel>
          <ProgressValue>{percent}%</ProgressValue>
        </ProgressRow>
        <ProgressBar>
          <ProgressFill $percent={percent} />
        </ProgressBar>
      </Card>
    </CardLink>
  );
}
