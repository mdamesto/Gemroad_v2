"use client";

import { useEffect, useState, useMemo } from "react";
import styled, { keyframes, css } from "styled-components";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { GlowButton } from "@/components/ui/glow-button";

import { GlassCard } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/skeleton-loader";
import { useToastStore } from "@/stores/toast-store";
import { theme, alpha } from "@/lib/theme";
import { formatGems } from "@/lib/utils";
import type { Achievement } from "@/types/game";
import type { AchievementWithStatus } from "@/types/game";

// ─── Types ────────────────────────────────────────────────────────
type FilterType = "all" | "unlocked" | "locked";

// ─── Achievement Icons by condition_type ──────────────────────────
const ACHIEVEMENT_ICONS: Record<string, string> = {
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

function getAchievementIcon(conditionType: string): string {
  return ACHIEVEMENT_ICONS[conditionType] || "🏅";
}

// ─── Animations ───────────────────────────────────────────────────
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const claimBurst = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const spinIn = keyframes`
  from { transform: rotate(-10deg) scale(0.8); opacity: 0; }
  to { transform: rotate(0deg) scale(1); opacity: 1; }
`;

// ─── Page Layout ──────────────────────────────────────────────────
const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 40px;
`;

// ─── Stats Bar ────────────────────────────────────────────────────
const StatsBar = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 28px;
  flex-wrap: wrap;
`;

const StatCard = styled(GlassCard)`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 180px;
  padding: 16px 24px;
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const StatInfo = styled.div``;

const StatValue = styled.div`
  font-size: 1.3rem;
  font-weight: 800;
  color: ${theme.colors.text};
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${theme.colors.textMuted};
`;

const OverallProgress = styled(GlassCard)`
  flex: 1;
  min-width: 280px;
  padding: 16px 24px;
`;

const OverallLabel = styled.div`
  font-size: 0.8rem;
  color: ${theme.colors.textMuted};
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
`;

const OverallTrack = styled.div`
  width: 100%;
  height: 10px;
  background: ${theme.colors.bgHover};
  border-radius: 5px;
  overflow: hidden;
`;

const OverallFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${(p) => p.$percent}%;
  background: linear-gradient(90deg, ${theme.colors.success}, ${alpha(theme.colors.success, 0.7)});
  border-radius: 5px;
  transition: width 0.5s ease-out;
`;

// ─── Filtres ──────────────────────────────────────────────────────
const FilterBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 28px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 8px 18px;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  border: none;
  background: ${(p) => (p.$active ? alpha(theme.colors.primary, 0.12) : "transparent")};
  color: ${(p) => (p.$active ? theme.colors.primary : theme.colors.textMuted)};
  box-shadow: ${(p) => (p.$active ? `0 0 10px ${alpha(theme.colors.primary, 0.12)}` : "none")};

  &:hover {
    background: ${alpha(theme.colors.primary, 0.06)};
    color: ${theme.colors.text};
    transform: translateY(-1px);
  }
`;

const FilterCount = styled.span`
  margin-left: 6px;
  font-size: 0.75rem;
  opacity: 0.7;
`;

// ─── Grid ─────────────────────────────────────────────────────────
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${theme.colors.textMuted};
  font-size: 0.95rem;
  grid-column: 1 / -1;
`;

// ─── Achievement Card ─────────────────────────────────────────────
const Card = styled.div<{ $unlocked: boolean; $justClaimed: boolean }>`
  position: relative;
  background: ${theme.colors.bgCard};
  border: none;
  border-radius: 20px;
  box-shadow:
    0 2px 8px rgba(var(--shadow-base), 0.3),
    0 8px 24px rgba(var(--shadow-base), 0.2)
    ${(p) => (p.$unlocked ? `, 0 0 15px ${alpha(theme.colors.success, 0.08)}` : "")};
  padding: 20px;
  transition: all 0.3s;
  animation: ${fadeIn} 0.3s ease-out;

  ${(p) =>
    p.$unlocked &&
    css`
    box-shadow:
      0 2px 8px rgba(var(--shadow-base), 0.3),
      0 8px 24px rgba(var(--shadow-base), 0.2),
      0 0 15px ${alpha(theme.colors.success, 0.12)};
  `}

  ${(p) =>
    p.$justClaimed &&
    css`
    animation: ${claimBurst} 0.4s ease-out;
  `}

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 4px 12px rgba(var(--shadow-base), 0.4),
      0 12px 32px rgba(var(--shadow-base), 0.25)
      ${(p) => (p.$unlocked ? `, 0 0 25px ${alpha(theme.colors.success, 0.12)}` : "")};
  }
`;

const CardInner = styled.div`
  position: relative;
  z-index: 1;
`;

const UnlockedShimmer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  border-radius: 14px 14px 0 0;
  background: linear-gradient(90deg, transparent, ${theme.colors.success}, ${alpha(theme.colors.success, 0.7)}, ${theme.colors.success}, transparent);
`;

const CardHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 12px;
`;

const IconContainer = styled.div<{ $unlocked: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${(p) => (p.$unlocked ? alpha(theme.colors.success, 0.08) : theme.colors.bgHover)};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
  transition: all 0.3s;

  ${(p) =>
    p.$unlocked &&
    css`
    animation: ${spinIn} 0.5s ease-out;
  `}
`;

const CardTitleArea = styled.div`
  flex: 1;
  min-width: 0;
`;

const CardName = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 2px;
  color: ${theme.colors.text};
`;

const CardCondition = styled.div`
  font-size: 0.78rem;
  color: ${theme.colors.textMuted};
  font-style: italic;
`;

const BadgeArea = styled.div`
  flex-shrink: 0;
`;

const StatusBadge = styled.span<{ $status: "locked" | "unlocked" | "claimed" }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 9999px;

  ${(p) =>
    p.$status === "claimed"
      ? css`
        background: ${alpha(theme.colors.success, 0.12)};
        color: ${theme.colors.success};
        border: none;
        box-shadow: 0 0 8px ${alpha(theme.colors.success, 0.08)};
      `
      : p.$status === "unlocked"
        ? css`
        background: ${alpha(theme.colors.accent, 0.12)};
        color: ${theme.colors.accent};
        border: none;
        box-shadow: 0 0 8px ${alpha(theme.colors.accent, 0.08)};
      `
        : css`
        background: ${theme.colors.bgHover};
        color: ${theme.colors.textMuted};
        border: none;
      `}
`;

const CardDescription = styled.p`
  color: ${theme.colors.textMuted};
  font-size: 0.85rem;
  margin-bottom: 14px;
  line-height: 1.5;
`;

// ─── Progress Bar (for locked achievements) ───────────────────────
const ProgressSection = styled.div`
  margin-bottom: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--white-alpha-004);
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 6px;
  background: ${theme.colors.bgHover};
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
`;

const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${(p) => p.$percent}%;
  background: linear-gradient(90deg, ${theme.colors.primary}, ${alpha(theme.colors.primary, 0.56)});
  border-radius: 3px;
  transition: width 0.5s ease-out;
`;

const ProgressLabel = styled.div`
  font-size: 0.78rem;
  color: ${theme.colors.textMuted};
  display: flex;
  justify-content: space-between;
`;

// ─── Rewards Row ──────────────────────────────────────────────────
const RewardsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--white-alpha-004);
`;

const RewardTags = styled.div`
  display: flex;
  gap: 10px;
`;

const RewardTag = styled.div<{ $type: "gems" | "xp" }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;

  ${(p) =>
    p.$type === "gems"
      ? css`
        background: ${alpha(theme.colors.accent, 0.08)};
        color: ${theme.colors.accent};
        border: none;
        box-shadow: 0 0 6px ${alpha(theme.colors.accent, 0.06)};
      `
      : css`
        background: ${alpha(theme.colors.primary, 0.08)};
        color: ${theme.colors.primary};
        border: none;
        box-shadow: 0 0 6px ${alpha(theme.colors.primary, 0.06)};
      `}
`;

const RewardIcon = styled.span`
  font-size: 0.85rem;
`;

// ─── Claim Success Animation ──────────────────────────────────────
const ClaimSuccessOverlay = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 14px;
  background: ${alpha(theme.colors.success, 0.06)};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ClaimSuccessText = styled.div`
  background: ${theme.colors.bgCard};
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  text-align: center;
  box-shadow: 0 0 20px ${alpha(theme.colors.success, 0.12)};
`;

const ClaimSuccessTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${theme.colors.success};
  margin-bottom: 4px;
`;

const ClaimSuccessRewards = styled.div`
  font-size: 0.8rem;
  color: ${theme.colors.textMuted};
`;

// ─── Tooltip ──────────────────────────────────────────────────────
const TooltipWrapper = styled.div`
  position: relative;

  &:hover > div:last-child {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: ${theme.colors.bgHover};
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(var(--shadow-base), 0.3);
  padding: 10px 14px;
  font-size: 0.78rem;
  color: ${theme.colors.text};
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s;
  z-index: 10;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: ${theme.colors.bgHover};
  }
`;

// (LoadingState imported from skeleton-loader)

// ─── Condition type labels ────────────────────────────────────────
const CONDITION_LABELS: Record<string, string> = {
  cards_collected: "cartes collectées",
  series_completed: "séries complétées",
  boosters_opened: "boosters ouverts",
  level_reached: "niveau atteint",
  gems_earned: "gemmes gagnées",
  login_streak: "jours consécutifs",
  rare_cards: "cartes rares obtenues",
  legendary_cards: "cartes légendaires obtenues",
  total_duplicates: "doublons obtenus",
  achievements_unlocked: "achievements débloqués",
};

function getConditionLabel(conditionType: string): string {
  return CONDITION_LABELS[conditionType] || conditionType;
}

const StarIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────
export default function AchievementsPage() {
  const { user, loading: userLoading } = useUser();
  const addToast = useToastStore((s) => s.addToast);
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [justClaimedIds, setJustClaimedIds] = useState<Set<string>>(new Set());
  const [claimResults, setClaimResults] = useState<
    Record<string, { gems: number; xp: number }>
  >({});
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const [{ data: allAchievements }, progressRes] = await Promise.all([
        supabase.from("achievements").select("*").order("condition_value"),
        fetch("/api/achievements/progress").then((r) => r.ok ? r.json() : null),
      ]);

      if (!allAchievements) {
        setLoading(false);
        return;
      }

      if (progressRes?.progress) {
        setProgressMap(progressRes.progress);
      }

      let userAchievements: Array<{
        achievement_id: string;
        claimed: boolean;
        unlocked_at: string;
      }> = [];

      if (user) {
        const { data } = await supabase
          .from("user_achievements")
          .select("*")
          .eq("user_id", user.id);
        userAchievements = data || [];
      }

      const merged: AchievementWithStatus[] = (allAchievements as Achievement[]).map(
        (a: Achievement) => {
          const ua = userAchievements.find(
            (u) => u.achievement_id === a.id
          );
          return {
            ...a,
            unlocked: !!ua,
            claimed: ua?.claimed ?? false,
            unlocked_at: ua?.unlocked_at,
          };
        }
      );

      setAchievements(merged);
      setLoading(false);
    }

    if (!userLoading) fetchData();
  }, [user, userLoading]);

  // ─── Claim handler with animation ──────────────────────────────
  const handleClaim = async (achievementId: string) => {
    setClaimingId(achievementId);

    const res = await fetch("/api/achievements/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ achievementId }),
    });

    if (res.ok) {
      const result = await res.json();

      // Mark as claimed
      setAchievements((prev) =>
        prev.map((a) =>
          a.id === achievementId ? { ...a, claimed: true } : a
        )
      );

      // Show claim animation
      setJustClaimedIds((prev) => new Set(prev).add(achievementId));
      setClaimResults((prev) => ({
        ...prev,
        [achievementId]: { gems: result.gems, xp: result.xp },
      }));

      addToast(`Récompense réclamée : +${result.gems} gems, +${result.xp} XP`, "success");

      // Remove animation after delay
      setTimeout(() => {
        setJustClaimedIds((prev) => {
          const next = new Set(prev);
          next.delete(achievementId);
          return next;
        });
        setClaimResults((prev) => {
          const next = { ...prev };
          delete next[achievementId];
          return next;
        });
      }, 2500);
    }

    setClaimingId(null);
  };

  // ─── Filter & counts ───────────────────────────────────────────
  const counts = useMemo(() => {
    const c = { all: achievements.length, unlocked: 0, locked: 0 };
    for (const a of achievements) {
      if (a.unlocked) c.unlocked++;
      else c.locked++;
    }
    return c;
  }, [achievements]);

  const filtered = useMemo(() => {
    if (filter === "all") return achievements;
    if (filter === "unlocked") return achievements.filter((a) => a.unlocked);
    return achievements.filter((a) => !a.unlocked);
  }, [achievements, filter]);

  // Sort: claimable first, then unlocked (claimed), then locked
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const order = (ach: AchievementWithStatus) => {
        if (ach.unlocked && !ach.claimed) return 0; // claimable first
        if (ach.unlocked && ach.claimed) return 2; // claimed last of unlocked
        return 1; // locked in between
      };
      return order(a) - order(b);
    });
  }, [filtered]);

  // ─── Stats ──────────────────────────────────────────────────────
  const totalGems = achievements
    .filter((a) => a.claimed)
    .reduce((sum, a) => sum + a.reward_gems, 0);
  const totalXp = achievements
    .filter((a) => a.claimed)
    .reduce((sum, a) => sum + a.reward_xp, 0);
  const overallPercent =
    achievements.length > 0
      ? (counts.unlocked / achievements.length) * 100
      : 0;

  // ─── Render ─────────────────────────────────────────────────────
  if (loading) return <LoadingState text="Chargement des achievements..." />;

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "Tous" },
    { key: "unlocked", label: "Débloqués" },
    { key: "locked", label: "Verrouillés" },
  ];

  return (
    <Page>
      {/* Stats */}
      <StatsBar>
        <StatCard>
          <StatIcon>🏆</StatIcon>
          <StatInfo>
            <StatValue>
              {counts.unlocked}/{achievements.length}
            </StatValue>
            <StatLabel>Débloqués</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon>◆</StatIcon>
          <StatInfo>
            <StatValue style={{ color: theme.colors.accent }}>
              {formatGems(totalGems)}
            </StatValue>
            <StatLabel>Gemmes récoltées</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon>⚡</StatIcon>
          <StatInfo>
            <StatValue style={{ color: theme.colors.primary }}>{totalXp}</StatValue>
            <StatLabel>XP récoltée</StatLabel>
          </StatInfo>
        </StatCard>

        <OverallProgress>
          <OverallLabel>
            <span>Progression globale</span>
            <span style={{ fontWeight: 700, color: theme.colors.text }}>
              {Math.round(overallPercent)}%
            </span>
          </OverallLabel>
          <OverallTrack>
            <OverallFill $percent={overallPercent} />
          </OverallTrack>
        </OverallProgress>
      </StatsBar>

      {/* Filters */}
      <FilterBar>
        {filters.map((f) => (
          <FilterButton
            key={f.key}
            $active={filter === f.key}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            <FilterCount>({counts[f.key]})</FilterCount>
          </FilterButton>
        ))}
      </FilterBar>

      {/* Grid */}
      <Grid>
        {sorted.length === 0 && (
          <EmptyState>Aucun achievement dans cette catégorie.</EmptyState>
        )}

        {sorted.map((a) => {
          const status = a.claimed
            ? "claimed"
            : a.unlocked
              ? "unlocked"
              : "locked";
          const icon = getAchievementIcon(a.condition_type);
          const isJustClaimed = justClaimedIds.has(a.id);
          const claimResult = claimResults[a.id];

          return (
            <Card
              key={a.id}
              $unlocked={a.unlocked}
              $justClaimed={isJustClaimed}
            >
              {a.unlocked && <UnlockedShimmer />}

              {/* Claim success overlay */}
              {isJustClaimed && claimResult && (
                <ClaimSuccessOverlay>
                  <ClaimSuccessText>
                    <ClaimSuccessTitle>
                      ✓ Récompense réclamée !
                    </ClaimSuccessTitle>
                    <ClaimSuccessRewards>
                      {claimResult.gems > 0 && (
                        <span>+{formatGems(claimResult.gems)} gemmes </span>
                      )}
                      {claimResult.xp > 0 && (
                        <span>+{claimResult.xp} XP</span>
                      )}
                    </ClaimSuccessRewards>
                  </ClaimSuccessText>
                </ClaimSuccessOverlay>
              )}

              <CardInner>
                <CardHeaderRow>
                  <TooltipWrapper>
                    <IconContainer $unlocked={a.unlocked}>
                      {icon}
                    </IconContainer>
                    <Tooltip>
                      {a.unlocked
                        ? `Débloqué${a.unlocked_at ? ` le ${new Date(a.unlocked_at).toLocaleDateString("fr-FR")}` : ""}`
                        : `Objectif : ${a.condition_value} ${getConditionLabel(a.condition_type)}`}
                    </Tooltip>
                  </TooltipWrapper>

                  <CardTitleArea>
                    <CardName>{a.name}</CardName>
                    <CardCondition>
                      {a.condition_value} {getConditionLabel(a.condition_type)}
                    </CardCondition>
                  </CardTitleArea>

                  <BadgeArea>
                    <StatusBadge $status={status}>
                      {status === "claimed"
                        ? "✓ Réclamé"
                        : status === "unlocked"
                          ? "Débloqué"
                          : "🔒 Verrouillé"}
                    </StatusBadge>
                  </BadgeArea>
                </CardHeaderRow>

                <CardDescription>{a.description}</CardDescription>

                {/* Progress bar for locked achievements */}
                {!a.unlocked && (() => {
                  const current = progressMap[a.condition_type] ?? 0;
                  const pct = Math.min(100, Math.round((current / a.condition_value) * 100));
                  return (
                    <ProgressSection>
                      <ProgressTrack>
                        <ProgressFill $percent={pct} />
                      </ProgressTrack>
                      <ProgressLabel>
                        <span>Progression</span>
                        <span>
                          {current} / {a.condition_value}
                        </span>
                      </ProgressLabel>
                    </ProgressSection>
                  );
                })()}

                <RewardsRow>
                  <RewardTags>
                    {a.reward_gems > 0 && (
                      <RewardTag $type="gems">
                        <RewardIcon>◆</RewardIcon>
                        {formatGems(a.reward_gems)}
                      </RewardTag>
                    )}
                    {a.reward_xp > 0 && (
                      <RewardTag $type="xp">
                        <RewardIcon>⚡</RewardIcon>
                        {a.reward_xp} XP
                      </RewardTag>
                    )}
                  </RewardTags>

                  {a.unlocked && !a.claimed && (
                    <GlowButton
                      $size="sm"
                      $variant="success"
                      onClick={() => handleClaim(a.id)}
                      disabled={claimingId === a.id}
                      loading={claimingId === a.id}
                      icon={StarIcon}
                    >
                      Réclamer
                    </GlowButton>
                  )}
                </RewardsRow>
              </CardInner>
            </Card>
          );
        })}
      </Grid>
    </Page>
  );
}
