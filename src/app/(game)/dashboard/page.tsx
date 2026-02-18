"use client";

import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { useCurrency } from "@/hooks/use-currency";
import { useDailyReward } from "@/hooks/use-daily-reward";
import { useMissions } from "@/hooks/use-missions";
import { createClient } from "@/lib/supabase/client";
import { GlowButton } from "@/components/ui/glow-button";

import { GlassCard } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/skeleton-loader";
import { useToastStore } from "@/stores/toast-store";
import { theme, alpha } from "@/lib/theme";
import { formatGems, calculateLevel, xpToNextLevel } from "@/lib/utils";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px 40px;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const StatCard = styled(GlassCard)`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  animation: ${fadeInUp} 0.4s ease-out;
`;

const StatIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  color: ${theme.colors.text};
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${theme.colors.textMuted};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SectionCard = styled(GlassCard)`
  padding: 24px;
  animation: ${fadeInUp} 0.4s ease-out;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${theme.colors.text};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: ${theme.colors.textMuted};
  padding: 8px 0;
  border-bottom: 1px solid var(--white-alpha-004);

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.span`
  font-size: 1rem;
`;

const ActivityText = styled.span`
  flex: 1;
  color: ${theme.colors.text};
`;

const ActivityTime = styled.span`
  font-size: 0.75rem;
  color: ${theme.colors.textMuted};
`;

const ObjectiveList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ObjectiveItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ObjectiveIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${alpha(theme.colors.primary, 0.08)};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
`;

const ObjectiveInfo = styled.div`
  flex: 1;
`;

const ObjectiveName = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${theme.colors.text};
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 5px;
  background: ${theme.colors.bgHover};
  border-radius: 3px;
  overflow: hidden;
  margin-top: 4px;
`;

const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${(p) => p.$percent}%;
  background: ${theme.gradients.primary};
  border-radius: 3px;
  transition: width 0.5s ease;
`;

const ProgressText = styled.span`
  font-size: 0.75rem;
  color: ${theme.colors.textMuted};
`;

const QuickActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const QuickAction = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  background: ${theme.colors.bgCard};
  text-decoration: none;
  transition: all 0.2s;
  border: 1px solid transparent;

  &:hover {
    background: ${theme.colors.bgHover};
    border-color: ${alpha(theme.colors.primary, 0.15)};
  }
`;

const ActionIcon = styled.span`
  font-size: 1.2rem;
`;

const ActionText = styled.div`
  flex: 1;
`;

const ActionTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${theme.colors.text};
`;

const ActionSub = styled.div`
  font-size: 0.78rem;
  color: ${theme.colors.textMuted};
`;

const NotifDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${theme.colors.danger};
  flex-shrink: 0;
`;

interface DashboardData {
  collectionPercent: number;
  totalCards: number;
  ownedCards: number;
  recentActivity: Array<{
    icon: string;
    text: string;
    time: string;
  }>;
  closestAchievements: Array<{
    name: string;
    icon: string;
    current: number;
    target: number;
  }>;
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days}j`;
}

export default function DashboardPage() {
  const { user, profile, loading: userLoading } = useUser();
  const { balance } = useCurrency(user?.id);
  const { canClaim, currentStreak, claim: claimDaily, claiming: claimingDaily } = useDailyReward();
  const { dailyMissions, weeklyMissions } = useMissions();
  const addToast = useToastStore((s) => s.addToast);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchDashboard() {
      const supabase = createClient();

      const [
        { data: allCards },
        { data: userCards },
        { data: transactions },
        progressRes,
      ] = await Promise.all([
        supabase.from("cards").select("id"),
        supabase.from("user_cards").select("card_id").eq("user_id", user!.id),
        supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false })
          .limit(10),
        fetch("/api/achievements/progress").then((r) => r.ok ? r.json() : null).catch(() => null),
      ]);

      const totalCards = allCards?.length || 0;
      const ownedCards = new Set((userCards || []).map((c: { card_id: string }) => c.card_id)).size;
      const collectionPercent = totalCards > 0 ? Math.round((ownedCards / totalCards) * 100) : 0;

      // Recent activity from transactions
      const recentActivity = (transactions || []).slice(0, 6).map((t: { type: string; description: string | null; created_at: string; amount: number }) => ({
        icon: t.type === "earn_gems" ? "💎" : t.type === "spend_gems" ? "🛒" : "📦",
        text: t.description || `${t.amount > 0 ? "+" : ""}${t.amount} gemmes`,
        time: relativeTime(t.created_at),
      }));

      // Get achievements for closest objectives
      const { data: allAchievements } = await supabase.from("achievements").select("*").order("condition_value");
      const { data: userAchievements } = await supabase
        .from("user_achievements")
        .select("achievement_id")
        .eq("user_id", user!.id);

      const unlockedIds = new Set((userAchievements || []).map((a: { achievement_id: string }) => a.achievement_id));
      const progress = progressRes?.progress || {};

      const ICONS: Record<string, string> = {
        cards_collected: "🃏",
        series_completed: "📚",
        boosters_opened: "📦",
        level_reached: "⭐",
        gems_earned: "💎",
        login_streak: "🔥",
        rare_cards: "✨",
        legendary_cards: "👑",
        total_duplicates: "🔄",
        achievements_unlocked: "🏆",
      };

      const closestAchievements = (allAchievements || [])
        .filter((a: { id: string }) => !unlockedIds.has(a.id))
        .map((a: { name: string; condition_type: string; condition_value: number }) => {
          const current = progress[a.condition_type] ?? 0;
          return {
            name: a.name,
            icon: ICONS[a.condition_type] || "🏅",
            current,
            target: a.condition_value,
            percent: Math.min(100, Math.round((current / a.condition_value) * 100)),
          };
        })
        .sort((a: { percent: number }, b: { percent: number }) => b.percent - a.percent)
        .slice(0, 3);

      setData({
        collectionPercent,
        totalCards,
        ownedCards,
        recentActivity,
        closestAchievements,
      });
      setLoading(false);
    }

    fetchDashboard();
  }, [user]);

  const handleClaimDaily = async () => {
    const result = await claimDaily();
    if (result) {
      addToast(`+${formatGems(result.gemsEarned)} gemmes quotidiennes !`, "success");
    }
  };

  if (userLoading || loading) return <LoadingState text="Chargement du tableau de bord..." />;
  if (!user || !profile) return <LoadingState text="Connectez-vous pour accéder au tableau de bord." />;

  const unclaimedMissions = [...dailyMissions, ...weeklyMissions].filter(
    (m) => m.completed && !m.claimed
  ).length;

  return (
    <Page>
      <StatsRow>
        <StatCard>
          <StatIcon style={{ background: alpha(theme.colors.accent, 0.08) }}>💎</StatIcon>
          <StatInfo>
            <StatValue style={{ color: theme.colors.accent }}>{formatGems(balance)}</StatValue>
            <StatLabel>Gemmes</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon style={{ background: alpha(theme.colors.primary, 0.08) }}>⭐</StatIcon>
          <StatInfo>
            <StatValue>Niv. {profile.level}</StatValue>
            <StatLabel>{xpToNextLevel(profile.xp)} XP pour le prochain</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon style={{ background: alpha(theme.colors.success, 0.08) }}>🃏</StatIcon>
          <StatInfo>
            <StatValue>{data?.collectionPercent ?? 0}%</StatValue>
            <StatLabel>{data?.ownedCards ?? 0} / {data?.totalCards ?? 0} cartes</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon style={{ background: alpha("#FBBF24", 0.08) }}>🔥</StatIcon>
          <StatInfo>
            <StatValue>{currentStreak}</StatValue>
            <StatLabel>Jours consécutifs</StatLabel>
          </StatInfo>
        </StatCard>
      </StatsRow>

      <Grid>
        {/* Quick Actions */}
        <SectionCard>
          <SectionTitle>⚡ Actions rapides</SectionTitle>
          <QuickActions>
            {canClaim && (
              <div style={{ marginBottom: 8 }}>
                <GlowButton
                  $variant="accent"
                  $size="md"
                  $fullWidth
                  onClick={handleClaimDaily}
                  loading={claimingDaily}
                >
                  🎁 Réclamer la récompense quotidienne
                </GlowButton>
              </div>
            )}
            <QuickAction href="/boosters">
              <ActionIcon>📦</ActionIcon>
              <ActionText>
                <ActionTitle>Ouvrir des Boosters</ActionTitle>
                <ActionSub>Découvre de nouvelles cartes</ActionSub>
              </ActionText>
            </QuickAction>
            <QuickAction href="/missions">
              <ActionIcon>📋</ActionIcon>
              <ActionText>
                <ActionTitle>Missions</ActionTitle>
                <ActionSub>
                  {unclaimedMissions > 0 ? `${unclaimedMissions} récompense(s) à réclamer` : "Voir tes missions actives"}
                </ActionSub>
              </ActionText>
              {unclaimedMissions > 0 && <NotifDot />}
            </QuickAction>
            <QuickAction href="/fusion">
              <ActionIcon>🔮</ActionIcon>
              <ActionText>
                <ActionTitle>Fusion & Recyclage</ActionTitle>
                <ActionSub>Transforme tes doublons</ActionSub>
              </ActionText>
            </QuickAction>
          </QuickActions>
        </SectionCard>

        {/* Closest Achievements */}
        <SectionCard>
          <SectionTitle>🎯 Prochains objectifs</SectionTitle>
          <ObjectiveList>
            {data?.closestAchievements.map((a, i) => (
              <ObjectiveItem key={i}>
                <ObjectiveIcon>{a.icon}</ObjectiveIcon>
                <ObjectiveInfo>
                  <ObjectiveName>{a.name}</ObjectiveName>
                  <ProgressTrack>
                    <ProgressFill $percent={Math.min(100, Math.round((a.current / a.target) * 100))} />
                  </ProgressTrack>
                </ObjectiveInfo>
                <ProgressText>
                  {a.current}/{a.target}
                </ProgressText>
              </ObjectiveItem>
            ))}
            {(!data?.closestAchievements || data.closestAchievements.length === 0) && (
              <div style={{ color: theme.colors.textMuted, fontSize: "0.85rem" }}>
                Tous les achievements sont débloqués !
              </div>
            )}
          </ObjectiveList>
        </SectionCard>

        {/* Recent Activity */}
        <SectionCard style={{ gridColumn: "1 / -1" }}>
          <SectionTitle>📊 Activité récente</SectionTitle>
          <ActivityList>
            {data?.recentActivity.map((a, i) => (
              <ActivityItem key={i}>
                <ActivityIcon>{a.icon}</ActivityIcon>
                <ActivityText>{a.text}</ActivityText>
                <ActivityTime>{a.time}</ActivityTime>
              </ActivityItem>
            ))}
            {(!data?.recentActivity || data.recentActivity.length === 0) && (
              <div style={{ color: theme.colors.textMuted, fontSize: "0.85rem", padding: "12px 0" }}>
                Aucune activité récente. Ouvre un booster pour commencer !
              </div>
            )}
          </ActivityList>
        </SectionCard>
      </Grid>
    </Page>
  );
}
