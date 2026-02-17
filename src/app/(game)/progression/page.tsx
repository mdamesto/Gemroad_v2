"use client";

import { useEffect, useState, useCallback } from "react";
import styled, { keyframes, css } from "styled-components";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { xpToNextLevel, formatGems } from "@/lib/utils";
import { FACTION_COLORS, type FactionConst } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import type {
  TalentTree,
  Talent,
} from "@/types/game";

// ─── Types ────────────────────────────────────────────────────────
interface TalentWithStatus extends Talent {
  unlocked: boolean;
  available: boolean; // prerequisite met + has points
}

interface TreeWithTalents extends TalentTree {
  talents: TalentWithStatus[];
}

// ─── Talent Icons by effect_type ──────────────────────────────────
const EFFECT_ICONS: Record<string, string> = {
  drop_rate_boost: "🎲",
  xp_boost: "⚡",
  gem_boost: "💎",
  daily_bonus: "📅",
  booster_discount: "🏷️",
  extra_card: "🃏",
  rare_guarantee: "✨",
  series_bonus: "📚",
  duplicate_bonus: "🔄",
  shop_discount: "🛒",
  talent_discount: "🧠",
  luck_boost: "🍀",
};

function getTalentIcon(effectType: string): string {
  return EFFECT_ICONS[effectType] || "⚙️";
}

// ─── Faction labels ───────────────────────────────────────────────
const FACTION_LABELS: Record<string, string> = {
  dome_dwellers: "Dome Dwellers",
  underground_resistance: "Underground Resistance",
  surface_survivors: "Surface Survivors",
  tech_scavengers: "Tech Scavengers",
};

// ─── Animations ───────────────────────────────────────────────────
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const unlockBurst = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 currentColor; }
  50% { transform: scale(1.15); box-shadow: 0 0 30px currentColor; }
  100% { transform: scale(1); box-shadow: 0 0 0 0 transparent; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulseGlow = keyframes`
  0%, 100% { filter: drop-shadow(0 0 6px var(--glow-color)); }
  50% { filter: drop-shadow(0 0 14px var(--glow-color)); }
`;

const confirmFadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
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

// ─── Stats Section ────────────────────────────────────────────────
const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 36px;
`;

const StatCard = styled.div<{ $highlight?: boolean }>`
  background: #0f172a;
  border: 1px solid ${(p) => (p.$highlight ? "#dbb45d40" : "#1e293b")};
  border-radius: 14px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: border-color 0.3s;

  ${(p) =>
    p.$highlight &&
    css`
    box-shadow: 0 0 20px #dbb45d10;
  `}
`;

const StatIconBox = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${(p) => p.$color}15;
  border: 1px solid ${(p) => p.$color}30;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatValue = styled.div<{ $color?: string }>`
  font-size: 1.4rem;
  font-weight: 800;
  color: ${(p) => p.$color || "#e5e7eb"};
`;

const StatLabel = styled.div`
  font-size: 0.78rem;
  color: #94a3b8;
  margin-top: 2px;
`;

// ─── XP Progress Bar ─────────────────────────────────────────────
const XpBarSection = styled.div`
  flex: 1;
`;

const XpLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 0.8rem;
  color: #94a3b8;
`;

const XpTrack = styled.div`
  height: 10px;
  background: #1e293b;
  border-radius: 5px;
  overflow: hidden;
`;

const XpFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${(p) => p.$percent}%;
  background: linear-gradient(90deg, #38BDF8, #dbb45d);
  border-radius: 5px;
  transition: width 0.5s ease-out;
`;

// ─── Talent Trees Section ─────────────────────────────────────────
const TreesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const TreeCard = styled.div<{ $color: string }>`
  background: #0f172a;
  border: 1px solid ${(p) => p.$color}30;
  border-radius: 16px;
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease-out;
`;

const TreeHeader = styled.div<{ $color: string }>`
  padding: 20px 24px;
  border-bottom: 1px solid ${(p) => p.$color}20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, ${(p) => p.$color}, transparent);
    background-size: 200% 100%;
    animation: ${shimmer} 4s infinite;
  }
`;

const TreeTitleArea = styled.div``;

const TreeName = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 2px;
`;

const TreeDesc = styled.p`
  font-size: 0.8rem;
  color: #94a3b8;
`;

const TreeProgress = styled.div<{ $color: string }>`
  font-size: 0.85rem;
  font-weight: 700;
  color: ${(p) => p.$color};
`;

const TreeBody = styled.div`
  padding: 24px;
`;

// ─── Talent Tiers (horizontal rows per tier) ──────────────────────
const TierRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const TierLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  width: 48px;
  flex-shrink: 0;
  text-align: right;
`;

const TierNodes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  flex: 1;
`;

// ─── Connection Line between tiers ────────────────────────────────
const ConnectorRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const ConnectorSpacer = styled.div`
  width: 48px;
  flex-shrink: 0;
  margin-right: 16px;
`;

const ConnectorLine = styled.div<{ $color: string; $active: boolean }>`
  width: 2px;
  height: 20px;
  margin-left: 32px;
  background: ${(p) => (p.$active ? p.$color : "#1e293b")};
  border-radius: 1px;
  transition: background 0.3s;
`;

// ─── Talent Node ──────────────────────────────────────────────────
const NodeWrapper = styled.div`
  position: relative;
`;

const Node = styled.button<{
  $unlocked: boolean;
  $available: boolean;
  $color: string;
  $justUnlocked: boolean;
}>`
  width: 64px;
  height: 64px;
  border-radius: 14px;
  border: 2px solid
    ${(p) =>
      p.$unlocked
        ? p.$color
        : p.$available
          ? `${p.$color}80`
          : "#1e293b"};
  background: ${(p) =>
    p.$unlocked
      ? `${p.$color}20`
      : p.$available
        ? "#1e293b"
        : "#0d0d14"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: ${(p) => (p.$available && !p.$unlocked ? "pointer" : "default")};
  transition: all 0.3s;
  --glow-color: ${(p) => p.$color}60;
  position: relative;

  ${(p) =>
    p.$justUnlocked &&
    css`
    color: ${p.$color};
    animation: ${unlockBurst} 0.6s ease-out;
  `}

  ${(p) =>
    p.$unlocked &&
    css`
    animation: ${pulseGlow} 3s ease-in-out infinite;
    box-shadow: 0 0 12px ${p.$color}30;
  `}

  ${(p) =>
    !p.$unlocked &&
    !p.$available &&
    css`
    opacity: 0.4;
    filter: grayscale(0.8);
  `}

  ${(p) =>
    p.$available &&
    !p.$unlocked &&
    css`
    &:hover {
      border-color: ${p.$color};
      background: ${p.$color}15;
      transform: scale(1.08);
      box-shadow: 0 0 20px ${p.$color}20;
    }
  `}
`;

const NodeCostBadge = styled.span<{ $color: string; $affordable: boolean }>`
  position: absolute;
  bottom: -6px;
  right: -6px;
  background: ${(p) => (p.$affordable ? p.$color : "#1e293b")};
  color: ${(p) => (p.$affordable ? "#fff" : "#475569")};
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 6px;
  min-width: 18px;
  text-align: center;
`;

const UnlockedCheck = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: #2a9d8f;
  color: white;
  font-size: 0.6rem;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
`;

// ─── Tooltip ──────────────────────────────────────────────────────
const TooltipContainer = styled.div<{ $visible: boolean; $color: string }>`
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  border: 1px solid ${(p) => p.$color}40;
  border-radius: 12px;
  padding: 14px 18px;
  min-width: 220px;
  max-width: 280px;
  z-index: 20;
  pointer-events: none;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  visibility: ${(p) => (p.$visible ? "visible" : "hidden")};
  transition: all 0.2s;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: ${(p) => p.$color}40;
  }
`;

const TooltipName = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 4px;
`;

const TooltipDesc = styled.div`
  font-size: 0.78rem;
  color: #94a3b8;
  line-height: 1.4;
  margin-bottom: 8px;
`;

const TooltipMeta = styled.div`
  display: flex;
  gap: 12px;
  font-size: 0.72rem;
`;

const TooltipTag = styled.span<{ $color: string }>`
  padding: 2px 8px;
  border-radius: 6px;
  background: ${(p) => p.$color}15;
  color: ${(p) => p.$color};
  font-weight: 600;
`;

const TooltipStatus = styled.div<{ $color: string }>`
  margin-top: 8px;
  font-size: 0.72rem;
  font-weight: 600;
  color: ${(p) => p.$color};
`;

// ─── Confirmation Modal ───────────────────────────────────────────
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalCard = styled.div<{ $color: string }>`
  background: #0f172a;
  border: 1px solid ${(p) => p.$color}40;
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  animation: ${confirmFadeIn} 0.3s ease-out;
`;

const ModalIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 12px;
`;

const ModalTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

const ModalDesc = styled.p`
  font-size: 0.85rem;
  color: #94a3b8;
  line-height: 1.5;
  margin-bottom: 8px;
`;

const ModalCost = styled.div<{ $color: string }>`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${(p) => p.$color};
  margin-bottom: 20px;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

// ─── Unlock Success Feedback ──────────────────────────────────────
const SuccessBanner = styled.div<{ $color: string }>`
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: ${(p) => p.$color}20;
  border: 1px solid ${(p) => p.$color}40;
  border-radius: 12px;
  padding: 14px 28px;
  z-index: 200;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: ${confirmFadeIn} 0.3s ease-out;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`;

const SuccessText = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #e5e7eb;
`;

// ─── Loading ──────────────────────────────────────────────────────
const Loading = styled.div`
  text-align: center;
  padding: 60px;
  color: #94a3b8;
`;

// ─── Component ────────────────────────────────────────────────────
export default function ProgressionPage() {
  const { user, profile, loading: userLoading } = useUser();
  const [trees, setTrees] = useState<TreeWithTalents[]>([]);
  const [talentPoints, setTalentPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hoveredTalent, setHoveredTalent] = useState<string | null>(null);
  const [confirmTalent, setConfirmTalent] = useState<TalentWithStatus | null>(null);
  const [confirmTreeColor, setConfirmTreeColor] = useState("#38BDF8");
  const [unlocking, setUnlocking] = useState(false);
  const [justUnlockedId, setJustUnlockedId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<{
    text: string;
    color: string;
  } | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();

    // Fetch talent trees
    const { data: treesData } = await supabase
      .from("talent_trees")
      .select("*")
      .order("created_at");

    if (!treesData) {
      setLoading(false);
      return;
    }

    // Fetch all talents
    const { data: talentsData } = await supabase
      .from("talents")
      .select("*")
      .order("tier");

    // Fetch user's unlocked talents
    const { data: userTalents } = await supabase
      .from("user_talents")
      .select("talent_id")
      .eq("user_id", user.id);

    const unlockedIds = new Set(
      (userTalents || []).map((ut: { talent_id: string }) => ut.talent_id)
    );

    // Fetch current talent points
    const { data: prof } = await supabase
      .from("profiles")
      .select("talent_points")
      .eq("id", user.id)
      .single();

    const points = prof?.talent_points ?? 0;
    setTalentPoints(points);

    // Combine trees with talents
    const combined: TreeWithTalents[] = (treesData as TalentTree[]).map(
      (tree) => {
        const treeTalents = ((talentsData as Talent[]) || [])
          .filter((t) => t.talent_tree_id === tree.id)
          .map((t) => {
            const unlocked = unlockedIds.has(t.id);
            const prereqMet = !t.prerequisite_talent_id || unlockedIds.has(t.prerequisite_talent_id);
            return {
              ...t,
              unlocked,
              available: prereqMet && !unlocked && points >= t.cost,
            };
          });
        return { ...tree, talents: treeTalents };
      }
    );

    setTrees(combined);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!userLoading && user) fetchData();
    if (!userLoading && !user) setLoading(false);
  }, [user, userLoading, fetchData]);

  // ─── Unlock handler ─────────────────────────────────────────────
  const handleUnlock = async () => {
    if (!confirmTalent) return;
    setUnlocking(true);

    const res = await fetch("/api/talents/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ talentId: confirmTalent.id }),
    });

    if (res.ok) {
      const result = await res.json();
      setTalentPoints(result.talent_points_remaining);
      setJustUnlockedId(confirmTalent.id);
      setConfirmTalent(null);

      // Show success
      setSuccessMsg({
        text: `${confirmTalent.name} débloqué !`,
        color: confirmTreeColor,
      });

      // Refresh data
      await fetchData();

      // Clear animations
      setTimeout(() => setJustUnlockedId(null), 1500);
      setTimeout(() => setSuccessMsg(null), 3000);
    } else {
      const err = await res.json();
      alert(err.error || "Erreur lors du déblocage");
    }

    setUnlocking(false);
  };

  // ─── Render ─────────────────────────────────────────────────────
  if (loading || userLoading)
    return <Loading>Chargement de la progression...</Loading>;

  if (!user || !profile)
    return <Loading>Connectez-vous pour voir votre progression.</Loading>;

  const xpInLevel = profile.xp % 100;
  const xpNeeded = xpToNextLevel(profile.xp);
  const xpPercent = xpInLevel;
  const totalTalents = trees.reduce((s, t) => s + t.talents.length, 0);
  const unlockedTalents = trees.reduce(
    (s, t) => s + t.talents.filter((tal) => tal.unlocked).length,
    0
  );

  return (
    <Page>
      <PageHeader>
        <Title>Progression</Title>
        <Subtitle>
          Monte en niveau, débloque des talents et renforce ton jeu.
        </Subtitle>
      </PageHeader>

      {/* Stats Row */}
      <StatsRow>
        <StatCard>
          <StatIconBox $color="#38BDF8">⚔</StatIconBox>
          <StatInfo>
            <StatValue $color="#38BDF8">Niveau {profile.level}</StatValue>
            <StatLabel>
              {profile.xp} XP total
            </StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard $highlight={talentPoints > 0}>
          <StatIconBox $color="#dbb45d">🧠</StatIconBox>
          <StatInfo>
            <StatValue $color={talentPoints > 0 ? "#dbb45d" : "#e5e7eb"}>
              {talentPoints}
            </StatValue>
            <StatLabel>
              {talentPoints > 0
                ? "Points disponibles !"
                : "Points de talent"}
            </StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIconBox $color="#2a9d8f">🌟</StatIconBox>
          <StatInfo>
            <StatValue>
              {unlockedTalents}/{totalTalents}
            </StatValue>
            <StatLabel>Talents débloqués</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIconBox $color="#60a5fa">📈</StatIconBox>
          <XpBarSection>
            <XpLabels>
              <span>Niveau {profile.level}</span>
              <span>
                {xpInLevel}/100 XP ({xpNeeded} restants)
              </span>
            </XpLabels>
            <XpTrack>
              <XpFill $percent={xpPercent} />
            </XpTrack>
          </XpBarSection>
        </StatCard>
      </StatsRow>

      {/* Talent Trees */}
      <TreesContainer>
        {trees.map((tree) => {
          const factionKey = tree.faction as FactionConst;
          const color = FACTION_COLORS[factionKey] || "#38BDF8";
          const treeUnlocked = tree.talents.filter((t) => t.unlocked).length;

          // Group talents by tier
          const tiers = new Map<number, TalentWithStatus[]>();
          for (const t of tree.talents) {
            const list = tiers.get(t.tier) || [];
            list.push(t);
            tiers.set(t.tier, list);
          }
          const sortedTiers = [...tiers.entries()].sort(
            ([a], [b]) => a - b
          );

          return (
            <TreeCard key={tree.id} $color={color}>
              <TreeHeader $color={color}>
                <TreeTitleArea>
                  <TreeName>
                    {tree.name}
                  </TreeName>
                  <TreeDesc>
                    {tree.description || FACTION_LABELS[tree.faction] || tree.faction}
                  </TreeDesc>
                </TreeTitleArea>
                <TreeProgress $color={color}>
                  {treeUnlocked}/{tree.talents.length}
                </TreeProgress>
              </TreeHeader>

              <TreeBody>
                {sortedTiers.map(([tier, talents], tierIndex) => (
                  <div key={tier}>
                    {/* Connector line between tiers */}
                    {tierIndex > 0 && (
                      <ConnectorRow>
                        <ConnectorSpacer />
                        {talents.map((t) => {
                          const prereqUnlocked = !t.prerequisite_talent_id ||
                            tree.talents.find((pt) => pt.id === t.prerequisite_talent_id)?.unlocked;
                          return (
                            <ConnectorLine
                              key={`conn-${t.id}`}
                              $color={color}
                              $active={!!prereqUnlocked}
                            />
                          );
                        })}
                      </ConnectorRow>
                    )}

                    <TierRow>
                      <TierLabel>Tier {tier}</TierLabel>
                      <TierNodes>
                        {talents.map((talent) => (
                          <NodeWrapper
                            key={talent.id}
                            onMouseEnter={() => setHoveredTalent(talent.id)}
                            onMouseLeave={() => setHoveredTalent(null)}
                          >
                            <Node
                              $unlocked={talent.unlocked}
                              $available={talent.available}
                              $color={color}
                              $justUnlocked={justUnlockedId === talent.id}
                              onClick={() => {
                                if (talent.available && !talent.unlocked) {
                                  setConfirmTalent(talent);
                                  setConfirmTreeColor(color);
                                }
                              }}
                            >
                              {getTalentIcon(talent.effect_type)}
                              {talent.unlocked && <UnlockedCheck>✓</UnlockedCheck>}
                              {!talent.unlocked && (
                                <NodeCostBadge
                                  $color={color}
                                  $affordable={talentPoints >= talent.cost}
                                >
                                  {talent.cost}
                                </NodeCostBadge>
                              )}
                            </Node>

                            {/* Tooltip */}
                            <TooltipContainer
                              $visible={hoveredTalent === talent.id}
                              $color={color}
                            >
                              <TooltipName>{talent.name}</TooltipName>
                              <TooltipDesc>
                                {talent.description || "Aucune description"}
                              </TooltipDesc>
                              <TooltipMeta>
                                <TooltipTag $color={color}>
                                  Tier {talent.tier}
                                </TooltipTag>
                                <TooltipTag $color="#dbb45d">
                                  Coût: {talent.cost}
                                </TooltipTag>
                              </TooltipMeta>
                              <TooltipStatus
                                $color={
                                  talent.unlocked
                                    ? "#2a9d8f"
                                    : talent.available
                                      ? color
                                      : "#475569"
                                }
                              >
                                {talent.unlocked
                                  ? "✓ Débloqué"
                                  : talent.available
                                    ? "Cliquer pour débloquer"
                                    : talent.prerequisite_talent_id &&
                                      !tree.talents.find(
                                        (pt) => pt.id === talent.prerequisite_talent_id
                                      )?.unlocked
                                      ? "🔒 Prérequis manquant"
                                      : "Points insuffisants"}
                              </TooltipStatus>
                            </TooltipContainer>
                          </NodeWrapper>
                        ))}
                      </TierNodes>
                    </TierRow>
                  </div>
                ))}
              </TreeBody>
            </TreeCard>
          );
        })}

        {trees.length === 0 && (
          <Loading>Aucun arbre de talents disponible.</Loading>
        )}
      </TreesContainer>

      {/* Confirmation Modal */}
      {confirmTalent && (
        <ModalOverlay onClick={() => !unlocking && setConfirmTalent(null)}>
          <ModalCard
            $color={confirmTreeColor}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalIcon>{getTalentIcon(confirmTalent.effect_type)}</ModalIcon>
            <ModalTitle>Débloquer {confirmTalent.name} ?</ModalTitle>
            <ModalDesc>
              {confirmTalent.description || "Ce talent améliorera vos capacités."}
            </ModalDesc>
            <ModalCost $color={confirmTreeColor}>
              Coût : {confirmTalent.cost} point{confirmTalent.cost > 1 ? "s" : ""} de talent
            </ModalCost>
            <ModalButtons>
              <Button
                $variant="ghost"
                onClick={() => setConfirmTalent(null)}
                disabled={unlocking}
              >
                Annuler
              </Button>
              <Button
                onClick={handleUnlock}
                disabled={unlocking}
              >
                {unlocking ? "Déblocage..." : "Confirmer"}
              </Button>
            </ModalButtons>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* Success Banner */}
      {successMsg && (
        <SuccessBanner $color={successMsg.color}>
          <span style={{ fontSize: "1.2rem" }}>🌟</span>
          <SuccessText>{successMsg.text}</SuccessText>
        </SuccessBanner>
      )}
    </Page>
  );
}
