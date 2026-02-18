"use client";

import { use, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import { LoadingState } from "@/components/ui/skeleton-loader";
import { useWorldMap } from "@/hooks/use-world-map";
import { useToastStore } from "@/stores/toast-store";
import { theme, alpha } from "@/lib/theme";
import { fadeInUp } from "@/lib/animations";
import { REGION_LABELS, REGION_COLORS, REGION_DESCRIPTIONS, REGION_FACTIONS, FACTION_LABELS, FACTION_COLORS } from "@/lib/constants";
import type { RegionConst, FactionConst } from "@/lib/constants";
import type { ExplorationMissionWithStatus } from "@/types/game";

const Page = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 16px;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 0;
  color: ${theme.colors.textMuted};
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: color 0.2s;
  margin-bottom: 8px;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    color: ${theme.colors.text};
  }
`;

const HeaderMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
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

const ProgressSummary = styled.div<{ $color: string }>`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ $color }) => $color};
`;

const MissionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
`;

const MissionCard = styled(GlassCard)<{ $delay: number; $completed: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  animation: ${fadeInUp} 0.4s ease both;
  animation-delay: ${({ $delay }) => $delay}ms;
  opacity: ${({ $completed }) => ($completed ? 0.7 : 1)};
`;

const MissionIcon = styled.span`
  font-size: 1.6rem;
  flex-shrink: 0;
  margin-top: 2px;
`;

const MissionBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const MissionTitle = styled.h4`
  margin: 0 0 4px 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${theme.colors.text};
`;

const MissionDesc = styled.p`
  margin: 0 0 8px 0;
  font-size: 0.82rem;
  color: ${theme.colors.textMuted};
  line-height: 1.4;
`;

const MissionProgressRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const MiniProgressBar = styled.div`
  flex: 1;
  height: 5px;
  border-radius: 3px;
  background: ${alpha(theme.colors.text, 0.08)};
  overflow: hidden;
`;

const MiniProgressFill = styled.div<{ $percent: number; $color: string }>`
  height: 100%;
  width: ${({ $percent }) => Math.min($percent, 100)}%;
  border-radius: 3px;
  background: ${({ $color }) => $color};
  transition: width 0.4s ease;
`;

const MiniProgressLabel = styled.span`
  font-size: 0.75rem;
  color: ${theme.colors.textMuted};
  white-space: nowrap;
`;

const RewardsRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const RewardBadge = styled.span`
  font-size: 0.78rem;
  font-weight: 500;
  color: ${theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 3px;
`;

const MissionRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
`;

const CompletedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  font-size: 0.78rem;
  font-weight: 600;
  border-radius: 20px;
  background: ${alpha("#22C55E", 0.12)};
  color: #22C55E;
  border: 1px solid ${alpha("#22C55E", 0.2)};
`;

const LockedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  font-size: 0.78rem;
  font-weight: 500;
  border-radius: 20px;
  background: ${alpha(theme.colors.textMuted, 0.08)};
  color: ${theme.colors.textMuted};
`;

function hasProgressBar(conditionType: string): boolean {
  return ["collect_faction_cards", "open_faction_boosters", "discover_region_codex", "collect_all_faction_rarity"].includes(conditionType);
}

function MissionItem({
  mission,
  index,
  regionColor,
  onComplete,
}: {
  mission: ExplorationMissionWithStatus;
  index: number;
  regionColor: string;
  onComplete: (id: string) => void;
}) {
  const [claiming, setClaiming] = useState(false);
  const showProgress = hasProgressBar(mission.condition_type);
  const percent = showProgress && mission.condition_value > 0
    ? Math.round((mission.current_progress / mission.condition_value) * 100)
    : 0;

  const handleClaim = async () => {
    setClaiming(true);
    onComplete(mission.id);
  };

  return (
    <MissionCard $delay={index * 60} $completed={mission.completed} $padding="16px">
      <MissionIcon>{mission.icon}</MissionIcon>
      <MissionBody>
        <MissionTitle>{mission.title}</MissionTitle>
        <MissionDesc>{mission.description}</MissionDesc>
        {showProgress && !mission.completed && (
          <MissionProgressRow>
            <MiniProgressBar>
              <MiniProgressFill $percent={percent} $color={regionColor} />
            </MiniProgressBar>
            <MiniProgressLabel>
              {mission.current_progress}/{mission.condition_value}
            </MiniProgressLabel>
          </MissionProgressRow>
        )}
        <RewardsRow>
          <RewardBadge>{mission.reward_gems} 💎</RewardBadge>
          <RewardBadge>{mission.reward_xp} XP</RewardBadge>
        </RewardsRow>
      </MissionBody>
      <MissionRight>
        {mission.completed ? (
          <CompletedBadge>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Complétée
          </CompletedBadge>
        ) : mission.eligible ? (
          <GlowButton onClick={handleClaim} disabled={claiming}>
            {claiming ? "..." : "Valider"}
          </GlowButton>
        ) : (
          <LockedBadge>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Verrouillée
          </LockedBadge>
        )}
      </MissionRight>
    </MissionCard>
  );
}

export default function RegionDetailPage({
  params,
}: {
  params: Promise<{ regionSlug: string }>;
}) {
  const { regionSlug } = use(params);
  const { regions, loading, completeMission } = useWorldMap();
  const addToast = useToastStore((s) => s.addToast);

  if (loading) return <LoadingState text="Chargement de la région..." />;

  const region = regions.find((r) => r.slug === regionSlug);

  if (!region) {
    return (
      <Page>
        <BackLink href="/world-map">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Carte du Monde
        </BackLink>
        <PageHeader title="Région introuvable" />
      </Page>
    );
  }

  const label = REGION_LABELS[region.slug as RegionConst];
  const color = REGION_COLORS[region.slug as RegionConst];
  const description = REGION_DESCRIPTIONS[region.slug as RegionConst];
  const factions = REGION_FACTIONS[region.slug as RegionConst] || [];

  const handleComplete = async (missionId: string) => {
    const result = await completeMission(missionId);
    if (result) {
      addToast(`Mission validée ! +${result.gems}💎 +${result.xp}XP`, "success");
    } else {
      addToast("Impossible de valider la mission", "error");
    }
  };

  return (
    <Page>
      <BackLink href="/world-map">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Carte du Monde
      </BackLink>

      <PageHeader title={label} subtitle={description}>
        <HeaderMeta>
          {factions.map((f) => (
            <FactionBadge key={f} $color={FACTION_COLORS[f as FactionConst]}>
              {FACTION_LABELS[f as FactionConst]}
            </FactionBadge>
          ))}
          <ProgressSummary $color={color}>
            {region.completedCount}/{region.totalCount} missions
          </ProgressSummary>
        </HeaderMeta>
      </PageHeader>

      <MissionList>
        {region.missions.map((mission, i) => (
          <MissionItem
            key={mission.id}
            mission={mission}
            index={i}
            regionColor={color}
            onComplete={handleComplete}
          />
        ))}
      </MissionList>
    </Page>
  );
}
