"use client";

import { useEffect, useState, useMemo } from "react";
import styled, { keyframes, css } from "styled-components";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { RARITY_COLORS, type Rarity } from "@/lib/constants";
import { RarityBadge } from "@/components/shared/rarity-badge";
import { Button } from "@/components/ui/button";
import type { Card, Series } from "@/types/cards";
import type { UserSeriesProgress } from "@/types/game";

// ─── Types ────────────────────────────────────────────────────────
type FilterType = "all" | "completed" | "in_progress" | "not_started";

interface SeriesWithProgress extends Series {
  progress: UserSeriesProgress | null;
  cards: Card[];
  ownedCardIds: Set<string>;
}

// ─── Gem Icons par reward_type ─────────────────────────────────────
const GEM_ICONS: Record<string, { icon: string; color: string; label: string }> = {
  ruby: { icon: "♦", color: "#E63946", label: "Rubis" },
  emerald: { icon: "♦", color: "#2A9D8F", label: "Émeraude" },
  sapphire: { icon: "♦", color: "#60A5FA", label: "Saphir" },
  amethyst: { icon: "♦", color: "#A78BFA", label: "Améthyste" },
  topaz: { icon: "♦", color: "#FBBF24", label: "Topaze" },
  gems: { icon: "◆", color: "#F4A261", label: "Gemmes" },
};

function getGemInfo(rewardType: string) {
  return GEM_ICONS[rewardType] || GEM_ICONS.gems;
}

// ─── Animations ───────────────────────────────────────────────────
const goldShimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const expandIn = keyframes`
  from { opacity: 0; max-height: 0; }
  to { opacity: 1; max-height: 600px; }
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
  color: #8888aa;
  font-size: 0.95rem;
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
  border: 1px solid ${(p) => (p.$active ? "#e63946" : "#2a2a35")};
  background: ${(p) => (p.$active ? "#e6394620" : "transparent")};
  color: ${(p) => (p.$active ? "#e63946" : "#8888aa")};

  &:hover {
    border-color: #e6394660;
    color: #e5e5e5;
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
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #8888aa;
  font-size: 0.95rem;
  grid-column: 1 / -1;
`;

// ─── Series Card ──────────────────────────────────────────────────
const CardContainer = styled.div<{ $completed: boolean }>`
  background: #12121a;
  border: 1px solid ${(p) => (p.$completed ? "#FBBF2440" : "#2a2a35")};
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.3s, box-shadow 0.3s;
  animation: ${fadeIn} 0.3s ease-out;

  ${(p) =>
    p.$completed &&
    css`
    box-shadow: 0 0 20px #FBBF2410;

    &::before {
      content: '';
      display: block;
      height: 3px;
      background: linear-gradient(90deg, transparent, #FBBF24, #F4A261, #FBBF24, transparent);
      background-size: 200% 100%;
      animation: ${goldShimmer} 3s infinite;
    }
  `}

  &:hover {
    border-color: ${(p) => (p.$completed ? "#FBBF2460" : "#e6394640")};
  }
`;

const CardHeader = styled.div`
  padding: 24px;
  cursor: pointer;
  user-select: none;
`;

const CardTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const SeriesName = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  flex: 1;
  margin-right: 12px;
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
`;

const CompletedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #FBBF24;
  background: #FBBF2420;
  border: 1px solid #FBBF2440;
`;

const InProgressBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #e63946;
  background: #e6394620;
  border: 1px solid #e6394640;
`;

const SeriesDesc = styled.p`
  color: #8888aa;
  font-size: 0.85rem;
  margin-bottom: 16px;
  line-height: 1.4;
`;

// ─── Progress Bar ─────────────────────────────────────────────────
const ProgressBarContainer = styled.div`
  margin-bottom: 8px;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  background: #2a2a35;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percent: number; $completed: boolean }>`
  height: 100%;
  width: ${(p) => p.$percent}%;
  background: ${(p) =>
    p.$completed
      ? "linear-gradient(90deg, #FBBF24, #F4A261)"
      : p.$percent > 0
        ? "linear-gradient(90deg, #e63946, #E6394690)"
        : "transparent"};
  border-radius: 4px;
  transition: width 0.5s ease-out;
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
`;

const ProgressText = styled.span`
  font-size: 0.8rem;
  color: #8888aa;
`;

const ProgressPercent = styled.span<{ $completed: boolean }>`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${(p) => (p.$completed ? "#FBBF24" : "#e5e5e5")};
`;

// ─── Reward Section ───────────────────────────────────────────────
const RewardRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px 16px;
`;

const RewardInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const GemIcon = styled.span<{ $color: string }>`
  font-size: 1.3rem;
  color: ${(p) => p.$color};
  filter: drop-shadow(0 0 4px ${(p) => p.$color}60);
`;

const RewardLabel = styled.div`
  font-size: 0.8rem;
  color: #8888aa;
`;

const RewardValue = styled.div<{ $color: string }>`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${(p) => p.$color};
`;

const ClaimedTag = styled.span`
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #2A9D8F;
  background: #2A9D8F20;
  border: 1px solid #2A9D8F40;
`;

// ─── Expand Toggle ────────────────────────────────────────────────
const ExpandToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-top: 1px solid #2a2a35;
  cursor: pointer;
  font-size: 0.8rem;
  color: #8888aa;
  transition: color 0.2s, background 0.2s;
  gap: 6px;

  &:hover {
    color: #e5e5e5;
    background: #1a1a25;
  }
`;

const Arrow = styled.span<{ $expanded: boolean }>`
  display: inline-block;
  transition: transform 0.3s;
  transform: rotate(${(p) => (p.$expanded ? "180deg" : "0")});
`;

// ─── Expanded Card List ───────────────────────────────────────────
const ExpandedContent = styled.div`
  animation: ${expandIn} 0.3s ease-out;
  overflow: hidden;
  border-top: 1px solid #2a2a35;
`;

const CardList = styled.div`
  padding: 16px 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
`;

const MiniCard = styled.div<{ $owned: boolean; $rarity: Rarity }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  background: ${(p) => (p.$owned ? "#1a1a25" : "#0a0a0f")};
  border: 1px solid ${(p) =>
    p.$owned ? `${RARITY_COLORS[p.$rarity]}40` : "#2a2a3540"};
  opacity: ${(p) => (p.$owned ? 1 : 0.5)};
  transition: opacity 0.2s;
`;

const MiniCardIcon = styled.span<{ $owned: boolean }>`
  font-size: 1.2rem;
  filter: ${(p) => (p.$owned ? "none" : "grayscale(1)")};
`;

const MiniCardInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const MiniCardName = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MiniCardRarity = styled.div<{ $color: string }>`
  font-size: 0.7rem;
  color: ${(p) => p.$color};
`;

const StatusIcon = styled.span<{ $owned: boolean }>`
  font-size: 0.85rem;
  color: ${(p) => (p.$owned ? "#2A9D8F" : "#8888aa")};
  flex-shrink: 0;
`;

const ViewDetailLink = styled(Link)`
  display: block;
  text-align: center;
  padding: 12px;
  border-top: 1px solid #2a2a3540;
  font-size: 0.8rem;
  font-weight: 600;
  color: #e63946;
  transition: background 0.2s;

  &:hover {
    background: #e6394610;
  }
`;

// ─── Loading ──────────────────────────────────────────────────────
const Loading = styled.div`
  text-align: center;
  padding: 60px;
  color: #8888aa;
`;

// ─── Component ────────────────────────────────────────────────────
export default function SeriesPage() {
  const { user, loading: userLoading } = useUser();
  const [seriesData, setSeriesData] = useState<SeriesWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [claimingId, setClaimingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      // Fetch all active series
      const { data: series } = await supabase
        .from("series")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (!series) {
        setLoading(false);
        return;
      }

      // Fetch all cards grouped by series
      const seriesIds = (series as Series[]).map((s: Series) => s.id);
      const { data: allCards } = await supabase
        .from("cards")
        .select("*")
        .in("series_id", seriesIds);

      // Fetch user progress + owned cards
      let progressMap: Record<string, UserSeriesProgress> = {};
      let ownedCardIdsSet = new Set<string>();

      if (user) {
        const { data: progress } = await supabase
          .from("user_series_progress")
          .select("*")
          .eq("user_id", user.id);

        if (progress) {
          for (const p of progress) {
            progressMap[p.series_id] = p as UserSeriesProgress;
          }
        }

        const { data: userCards } = await supabase
          .from("user_cards")
          .select("card_id")
          .eq("user_id", user.id);

        if (userCards) {
          ownedCardIdsSet = new Set(userCards.map((uc: { card_id: string }) => uc.card_id));
        }
      }

      // Combine data
      const combined: SeriesWithProgress[] = (series as Series[]).map((s) => ({
        ...s,
        progress: progressMap[s.id] || null,
        cards: ((allCards as Card[]) || []).filter((c) => c.series_id === s.id),
        ownedCardIds: new Set(
          ((allCards as Card[]) || [])
            .filter((c) => c.series_id === s.id && ownedCardIdsSet.has(c.id))
            .map((c) => c.id)
        ),
      }));

      setSeriesData(combined);
      setLoading(false);
    }

    if (!userLoading) fetchData();
  }, [user, userLoading]);

  // ─── Filter logic ───────────────────────────────────────────────
  const getStatus = (s: SeriesWithProgress) => {
    if (s.progress?.completed) return "completed";
    if (s.progress && s.progress.cards_collected > 0) return "in_progress";
    return "not_started";
  };

  const counts = useMemo(() => {
    const c = { all: 0, completed: 0, in_progress: 0, not_started: 0 };
    for (const s of seriesData) {
      c.all++;
      c[getStatus(s)]++;
    }
    return c;
  }, [seriesData]);

  const filtered = useMemo(() => {
    if (filter === "all") return seriesData;
    return seriesData.filter((s) => getStatus(s) === filter);
  }, [seriesData, filter]);

  // ─── Sorted: completed first, then in progress, then not started ─
  const sorted = useMemo(() => {
    const order = { completed: 0, in_progress: 1, not_started: 2 };
    return [...filtered].sort(
      (a, b) => order[getStatus(a)] - order[getStatus(b)]
    );
  }, [filtered]);

  // ─── Expand / Collapse ──────────────────────────────────────────
  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ─── Claim Reward ───────────────────────────────────────────────
  const handleClaim = async (seriesId: string) => {
    setClaimingId(seriesId);
    const res = await fetch("/api/series/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seriesId }),
    });

    if (res.ok) {
      setSeriesData((prev) =>
        prev.map((s) =>
          s.id === seriesId && s.progress
            ? { ...s, progress: { ...s.progress, reward_claimed: true } }
            : s
        )
      );
    }
    setClaimingId(null);
  };

  // ─── Render ─────────────────────────────────────────────────────
  if (loading) return <Loading>Chargement des séries...</Loading>;

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "Toutes" },
    { key: "completed", label: "Complétées" },
    { key: "in_progress", label: "En cours" },
    { key: "not_started", label: "Non commencées" },
  ];

  return (
    <Page>
      <PageHeader>
        <Title>Séries</Title>
        <Subtitle>
          Complète des séries de cartes pour obtenir des pierres précieuses et
          des récompenses exclusives.
        </Subtitle>
      </PageHeader>

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

      <Grid>
        {sorted.length === 0 && (
          <EmptyState>Aucune série dans cette catégorie.</EmptyState>
        )}

        {sorted.map((series) => {
          const status = getStatus(series);
          const isCompleted = status === "completed";
          const isInProgress = status === "in_progress";
          const collected = series.progress?.cards_collected ?? 0;
          const total = series.total_cards;
          const percent = total > 0 ? Math.min((collected / total) * 100, 100) : 0;
          const isExpanded = expandedIds.has(series.id);
          const gem = getGemInfo(series.reward_type);
          const rewardClaimed = series.progress?.reward_claimed ?? false;

          return (
            <CardContainer key={series.id} $completed={isCompleted}>
              <CardHeader onClick={() => toggleExpand(series.id)}>
                <CardTopRow>
                  <SeriesName>{series.name}</SeriesName>
                  <BadgeRow>
                    {isCompleted && <CompletedBadge>✓ Complétée</CompletedBadge>}
                    {isInProgress && (
                      <InProgressBadge>En cours</InProgressBadge>
                    )}
                  </BadgeRow>
                </CardTopRow>

                <SeriesDesc>{series.description}</SeriesDesc>

                <ProgressBarContainer>
                  <ProgressTrack>
                    <ProgressFill $percent={percent} $completed={isCompleted} />
                  </ProgressTrack>
                  <ProgressInfo>
                    <ProgressText>
                      {collected} / {total} cartes
                    </ProgressText>
                    <ProgressPercent $completed={isCompleted}>
                      {Math.round(percent)}%
                    </ProgressPercent>
                  </ProgressInfo>
                </ProgressBarContainer>
              </CardHeader>

              {/* Reward row */}
              <RewardRow>
                <RewardInfo>
                  <GemIcon $color={gem.color}>{gem.icon}</GemIcon>
                  <div>
                    <RewardLabel>Récompense</RewardLabel>
                    <RewardValue $color={gem.color}>
                      {series.reward_desc || gem.label}
                    </RewardValue>
                  </div>
                </RewardInfo>

                {isCompleted && !rewardClaimed && (
                  <Button
                    $size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClaim(series.id);
                    }}
                    disabled={claimingId === series.id}
                  >
                    {claimingId === series.id
                      ? "Réclamation..."
                      : "Réclamer"}
                  </Button>
                )}
                {rewardClaimed && <ClaimedTag>✓ Réclamée</ClaimedTag>}
              </RewardRow>

              {/* Expanded card list */}
              {isExpanded && (
                <ExpandedContent>
                  <CardList>
                    {series.cards.map((card) => {
                      const owned = series.ownedCardIds.has(card.id);
                      return (
                        <MiniCard
                          key={card.id}
                          $owned={owned}
                          $rarity={card.rarity}
                        >
                          <MiniCardIcon $owned={owned}>⚔</MiniCardIcon>
                          <MiniCardInfo>
                            <MiniCardName>{card.name}</MiniCardName>
                            <MiniCardRarity $color={RARITY_COLORS[card.rarity]}>
                              {card.rarity}
                            </MiniCardRarity>
                          </MiniCardInfo>
                          <StatusIcon $owned={owned}>
                            {owned ? "✓" : "✗"}
                          </StatusIcon>
                        </MiniCard>
                      );
                    })}
                  </CardList>
                  <ViewDetailLink href={`/series/${series.id}`}>
                    Voir le détail de la série →
                  </ViewDetailLink>
                </ExpandedContent>
              )}

              {/* Expand toggle */}
              <ExpandToggle onClick={() => toggleExpand(series.id)}>
                <span>
                  {isExpanded ? "Masquer les cartes" : "Voir les cartes"}
                </span>
                <Arrow $expanded={isExpanded}>▼</Arrow>
              </ExpandToggle>
            </CardContainer>
          );
        })}
      </Grid>
    </Page>
  );
}
