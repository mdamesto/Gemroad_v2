"use client";

import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useMissions } from "@/hooks/use-missions";
import { GlowButton } from "@/components/ui/glow-button";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/skeleton-loader";
import { useToastStore } from "@/stores/toast-store";
import { theme, alpha } from "@/lib/theme";
import { formatGems } from "@/lib/utils";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px 40px;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Countdown = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${theme.colors.textMuted};
  font-family: ${theme.fonts.mono};
`;

const MissionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MissionCard = styled(GlassCard)<{ $completed: boolean; $claimed: boolean }>`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  animation: ${fadeIn} 0.3s ease-out;
  opacity: ${(p) => (p.$claimed ? 0.6 : 1)};
`;

const MissionIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${alpha(theme.colors.primary, 0.08)};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
`;

const MissionInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const MissionName = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${theme.colors.text};
  margin-bottom: 4px;
`;

const MissionDesc = styled.div`
  font-size: 0.8rem;
  color: ${theme.colors.textMuted};
  margin-bottom: 8px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${theme.colors.bgHover};
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percent: number; $completed: boolean }>`
  height: 100%;
  width: ${(p) => p.$percent}%;
  background: ${(p) =>
    p.$completed
      ? theme.colors.success
      : `linear-gradient(90deg, ${theme.colors.primary}, ${alpha(theme.colors.primary, 0.56)})`};
  border-radius: 3px;
  transition: width 0.5s ease-out;
`;

const ProgressLabel = styled.div`
  font-size: 0.75rem;
  color: ${theme.colors.textMuted};
  margin-top: 3px;
`;

const RewardArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
`;

const RewardRow = styled.div`
  display: flex;
  gap: 8px;
  font-size: 0.78rem;
  font-weight: 600;
`;

const GemReward = styled.span`
  color: ${theme.colors.accent};
`;

const XpReward = styled.span`
  color: ${theme.colors.primary};
`;

const CONDITION_ICONS: Record<string, string> = {
  open_boosters: "📦",
  collect_cards: "🃏",
  purchase_boosters: "🛒",
  recycle_cards: "♻️",
  craft_fusion: "🔮",
};

function formatCountdown(expiresAt: string): string {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return "Expiré";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (h >= 24) {
    const d = Math.floor(h / 24);
    return `${d}j ${h % 24}h`;
  }
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

export default function MissionsPage() {
  const { dailyMissions, weeklyMissions, loading, claimMission } = useMissions();
  const addToast = useToastStore((s) => s.addToast);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [, setTick] = useState(0);

  // Refresh countdown every minute
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleClaim = async (missionId: string) => {
    setClaimingId(missionId);
    const result = await claimMission(missionId);
    if (result) {
      addToast(`+${formatGems(result.gems)} gemmes, +${result.xp} XP`, "success");
    }
    setClaimingId(null);
  };

  if (loading) return <LoadingState text="Chargement des missions..." />;

  const renderMission = (m: typeof dailyMissions[0]) => {
    const pct = Math.min(100, Math.round((m.progress / m.condition_value) * 100));
    const icon = CONDITION_ICONS[m.condition_type] || "📋";

    return (
      <MissionCard key={m.id} $completed={m.completed} $claimed={m.claimed}>
        <MissionIcon>{icon}</MissionIcon>
        <MissionInfo>
          <MissionName>{m.name}</MissionName>
          <MissionDesc>{m.description}</MissionDesc>
          <ProgressBar>
            <ProgressFill $percent={pct} $completed={m.completed} />
          </ProgressBar>
          <ProgressLabel>
            {m.progress} / {m.condition_value}
            {m.completed && !m.claimed && " — Complétée !"}
            {m.claimed && " — Réclamée ✓"}
          </ProgressLabel>
        </MissionInfo>
        <RewardArea>
          <RewardRow>
            {m.reward_gems > 0 && <GemReward>◆ {formatGems(m.reward_gems)}</GemReward>}
            {m.reward_xp > 0 && <XpReward>⚡ {m.reward_xp} XP</XpReward>}
          </RewardRow>
          {m.completed && !m.claimed && (
            <GlowButton
              $size="sm"
              $variant="success"
              onClick={() => handleClaim(m.id)}
              loading={claimingId === m.id}
              disabled={!!claimingId}
            >
              Réclamer
            </GlowButton>
          )}
        </RewardArea>
      </MissionCard>
    );
  };

  const dailyExpiry = dailyMissions[0]?.expires_at;
  const weeklyExpiry = weeklyMissions[0]?.expires_at;

  return (
    <Page>
      <PageHeader
        title="Missions"
        subtitle="Accomplis des missions quotidiennes et hebdomadaires pour gagner des récompenses"
      />

      <Section>
        <SectionHeader>
          <SectionTitle>
            📅 Missions du Jour
          </SectionTitle>
          {dailyExpiry && <Countdown>Expire dans {formatCountdown(dailyExpiry)}</Countdown>}
        </SectionHeader>
        <MissionList>
          {dailyMissions.length === 0 ? (
            <div style={{ color: theme.colors.textMuted, padding: 20, textAlign: "center" }}>
              Aucune mission quotidienne active.
            </div>
          ) : (
            dailyMissions.map(renderMission)
          )}
        </MissionList>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>
            📆 Missions de la Semaine
          </SectionTitle>
          {weeklyExpiry && <Countdown>Expire dans {formatCountdown(weeklyExpiry)}</Countdown>}
        </SectionHeader>
        <MissionList>
          {weeklyMissions.length === 0 ? (
            <div style={{ color: theme.colors.textMuted, padding: 20, textAlign: "center" }}>
              Aucune mission hebdomadaire active.
            </div>
          ) : (
            weeklyMissions.map(renderMission)
          )}
        </MissionList>
      </Section>
    </Page>
  );
}
