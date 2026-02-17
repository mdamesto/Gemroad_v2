"use client";

import { useEffect, useState, useMemo } from "react";
import styled, { keyframes, css } from "styled-components";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
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
const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 15px #2a9d8f20, 0 0 30px #2a9d8f10; }
  50% { box-shadow: 0 0 25px #2a9d8f30, 0 0 50px #2a9d8f15; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const claimBurst = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const spinIn = keyframes`
  from { transform: rotate(-10deg) scale(0.8); opacity: 0; }
  to { transform: rotate(0deg) scale(1); opacity: 1; }
`;

// ─── Page Layout ──────────────────────────────────────────────────
const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 0.95rem;
`;

// ─── Stats Bar ────────────────────────────────────────────────────
const StatsBar = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 28px;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 180px;
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
  color: #e5e7eb;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
`;

const OverallProgress = styled.div`
  flex: 1;
  min-width: 280px;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 16px 24px;
`;

const OverallLabel = styled.div`
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
`;

const OverallTrack = styled.div`
  width: 100%;
  height: 10px;
  background: #1e293b;
  border-radius: 5px;
  overflow: hidden;
`;

const OverallFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${(p) => p.$percent}%;
  background: linear-gradient(90deg, #2a9d8f, #34d399);
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
  transition: all 0.2s;
  border: 1px solid ${(p) => (p.$active ? "#38BDF8" : "#1e293b")};
  background: ${(p) => (p.$active ? "#38BDF820" : "transparent")};
  color: ${(p) => (p.$active ? "#38BDF8" : "#94a3b8")};

  &:hover {
    border-color: #38BDF860;
    color: #e5e7eb;
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
  gap: 16px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
  font-size: 0.95rem;
  grid-column: 1 / -1;
`;

// ─── Achievement Card ─────────────────────────────────────────────
const Card = styled.div<{ $unlocked: boolean; $justClaimed: boolean }>`
  position: relative;
  background: #0f172a;
  border: 1px solid ${(p) => (p.$unlocked ? "#2a9d8f40" : "#1e293b")};
  border-radius: 14px;
  padding: 20px;
  transition: all 0.3s;
  animation: ${fadeIn} 0.3s ease-out;

  ${(p) =>
    p.$unlocked &&
    css`
    animation: ${glowPulse} 4s ease-in-out infinite;
  `}

  ${(p) =>
    p.$justClaimed &&
    css`
    animation: ${claimBurst} 0.4s ease-out;
  `}

  &:hover {
    border-color: ${(p) => (p.$unlocked ? "#2a9d8f60" : "#1e293b80")};
    transform: translateY(-2px);
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
  background: linear-gradient(90deg, transparent, #2a9d8f, #34d399, #2a9d8f, transparent);
  background-size: 200% 100%;
  animation: ${shimmer} 3s infinite;
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
  background: ${(p) => (p.$unlocked ? "#2a9d8f15" : "#1e293b")};
  border: 1px solid ${(p) => (p.$unlocked ? "#2a9d8f30" : "#1e293b")};
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
  color: #e5e7eb;
`;

const CardCondition = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  font-style: italic;
`;

const BadgeArea = styled.div`
  flex-shrink: 0;
`;

const StatusBadge = styled.span<{ $status: "locked" | "unlocked" | "claimed" }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  ${(p) =>
    p.$status === "claimed"
      ? css`
        background: #2a9d8f20;
        color: #2a9d8f;
        border: 1px solid #2a9d8f40;
      `
      : p.$status === "unlocked"
        ? css`
        background: #dbb45d20;
        color: #dbb45d;
        border: 1px solid #dbb45d40;
      `
        : css`
        background: #1e293b;
        color: #475569;
        border: 1px solid #1e293b;
      `}
`;

const CardDescription = styled.p`
  color: #94a3b8;
  font-size: 0.85rem;
  margin-bottom: 14px;
  line-height: 1.5;
`;

// ─── Progress Bar (for locked achievements) ───────────────────────
const ProgressSection = styled.div`
  margin-bottom: 14px;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 6px;
  background: #1e293b;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
`;

const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${(p) => p.$percent}%;
  background: linear-gradient(90deg, #38BDF8, #38BDF890);
  border-radius: 3px;
  transition: width 0.5s ease-out;
`;

const ProgressLabel = styled.div`
  font-size: 0.72rem;
  color: #64748b;
  display: flex;
  justify-content: space-between;
`;

// ─── Rewards Row ──────────────────────────────────────────────────
const RewardsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
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
        background: #dbb45d15;
        color: #dbb45d;
        border: 1px solid #dbb45d30;
      `
      : css`
        background: #60a5fa15;
        color: #60a5fa;
        border: 1px solid #60a5fa30;
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
  background: #2a9d8f10;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ClaimSuccessText = styled.div`
  background: #0f172a;
  border: 1px solid #2a9d8f40;
  border-radius: 12px;
  padding: 12px 24px;
  text-align: center;
`;

const ClaimSuccessTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: #2a9d8f;
  margin-bottom: 4px;
`;

const ClaimSuccessRewards = styled.div`
  font-size: 0.8rem;
  color: #94a3b8;
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
  background: #1e293b;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.78rem;
  color: #e5e7eb;
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
    border-top-color: #1e293b;
  }
`;

// ─── Loading ──────────────────────────────────────────────────────
const Loading = styled.div`
  text-align: center;
  padding: 60px;
  color: #94a3b8;
`;

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

// ─── Component ────────────────────────────────────────────────────
export default function AchievementsPage() {
  const { user, loading: userLoading } = useUser();
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
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

      const { data: allAchievements } = await supabase
        .from("achievements")
        .select("*")
        .order("condition_value");

      if (!allAchievements) {
        setLoading(false);
        return;
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
  if (loading) return <Loading>Chargement des achievements...</Loading>;

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "Tous" },
    { key: "unlocked", label: "Débloqués" },
    { key: "locked", label: "Verrouillés" },
  ];

  return (
    <Page>
      <PageHeader>
        <Title>Achievements</Title>
        <Subtitle>
          Accomplis des défis pour débloquer des récompenses exclusives.
        </Subtitle>
      </PageHeader>

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
            <StatValue style={{ color: "#dbb45d" }}>
              {formatGems(totalGems)}
            </StatValue>
            <StatLabel>Gemmes récoltées</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon>⚡</StatIcon>
          <StatInfo>
            <StatValue style={{ color: "#60a5fa" }}>{totalXp}</StatValue>
            <StatLabel>XP récoltée</StatLabel>
          </StatInfo>
        </StatCard>

        <OverallProgress>
          <OverallLabel>
            <span>Progression globale</span>
            <span style={{ fontWeight: 700, color: "#e5e7eb" }}>
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
                {!a.unlocked && (
                  <ProgressSection>
                    <ProgressTrack>
                      <ProgressFill $percent={0} />
                    </ProgressTrack>
                    <ProgressLabel>
                      <span>Progression</span>
                      <span>
                        ? / {a.condition_value}
                      </span>
                    </ProgressLabel>
                  </ProgressSection>
                )}

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
                    <Button
                      $size="sm"
                      onClick={() => handleClaim(a.id)}
                      disabled={claimingId === a.id}
                    >
                      {claimingId === a.id ? "Réclamation..." : "Réclamer"}
                    </Button>
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
