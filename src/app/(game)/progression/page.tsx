"use client";

import { useEffect, useState, useCallback } from "react";
import styled, { keyframes, css } from "styled-components";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { xpToNextLevel } from "@/lib/utils";
import { FACTION_COLORS, FACTION_LABELS as GLOBAL_FACTION_LABELS, type FactionConst } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { GlowButton } from "@/components/ui/glow-button";
import { useToastStore } from "@/stores/toast-store";
import { LoadingState } from "@/components/ui/skeleton-loader";
import { theme, alpha } from "@/lib/theme";
import type { TalentTree, Talent } from "@/types/game";

// ─── Types ────────────────────────────────────────────────────────
interface TalentWithStatus extends Talent {
  unlocked: boolean;
  available: boolean;
}

interface TreeWithTalents extends TalentTree {
  talents: TalentWithStatus[];
}

// ─── Talent Icons by effect_type ──────────────────────────────────
const EFFECT_ICONS: Record<string, string> = {
  drop_rate_boost: "🎲",
  drop_rate_bonus: "🎲",
  xp_boost: "⚡",
  xp_bonus: "⚡",
  gem_boost: "💎",
  gem_bonus: "💎",
  gem_on_open: "💎",
  daily_bonus: "📅",
  daily_bonus_gems: "📅",
  booster_discount: "🏷️",
  booster_preview: "👁️",
  extra_card: "🃏",
  extra_cards: "🃏",
  extra_free_booster: "🎁",
  rare_guarantee: "✨",
  guaranteed_rarity: "✨",
  series_bonus: "📚",
  series_bonus_gems: "📚",
  duplicate_bonus: "🔄",
  shop_discount: "🛒",
  talent_discount: "🧠",
  luck_boost: "🍀",
  discount: "🏷️",
  reveal_missing: "🔍",
  new_card_xp_bonus: "⚡",
  achievement_reward_multiplier: "🏆",
  unlock_quest: "🗝️",
};

function getTalentIcon(effectType: string): string {
  return EFFECT_ICONS[effectType] || "⚙️";
}

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

const confirmFadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

// ─── Page Layout: Sidebar + Content ──────────────────────────────
const Page = styled.div`
  display: flex;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 40px;
  min-height: calc(100vh - 120px);

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

// ─── Left Sidebar (sticky) ───────────────────────────────────────
const Sidebar = styled.aside`
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 80px;
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 900px) {
    position: static;
    width: 100%;
  }
`;

const SidebarCard = styled.div`
  background: ${theme.colors.bgCard};
  border-radius: 16px;
  padding: 20px;
  box-shadow:
    0 2px 8px rgba(var(--shadow-base), 0.3),
    0 4px 16px rgba(var(--shadow-base), 0.15);
`;

const SidebarTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${theme.colors.textMuted};
  margin-bottom: 14px;
`;

// ─── Compact Stats ───────────────────────────────────────────────
const StatRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;

  & + & {
    border-top: 1px solid ${alpha(theme.colors.border, 0.3)};
  }
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${(p) => alpha(p.$color, 0.08)};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
`;

const StatInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const StatValue = styled.div<{ $color?: string }>`
  font-size: 1.1rem;
  font-weight: 800;
  color: ${(p) => p.$color || theme.colors.text};
  line-height: 1.2;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${theme.colors.textMuted};
`;

// ─── XP Bar (compact) ────────────────────────────────────────────
const XpBarWrap = styled.div`
  margin-top: 4px;
`;

const XpLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: ${theme.colors.textMuted};
  margin-bottom: 4px;
`;

const XpTrack = styled.div`
  height: 6px;
  background: ${theme.colors.bgHover};
  border-radius: 3px;
  overflow: hidden;
`;

const XpFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${(p) => p.$percent}%;
  background: linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent});
  border-radius: 3px;
  transition: width 0.5s ease-out;
`;

// ─── Tree Selector ───────────────────────────────────────────────
const TreeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const TreeItem = styled.button<{ $color: string; $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: none;
  background: ${(p) => (p.$active ? alpha(p.$color, 0.12) : "transparent")};
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  width: 100%;

  ${(p) =>
    p.$active &&
    css`
    box-shadow: inset 0 0 0 1px ${alpha(p.$color, 0.2)};
  `}

  &:hover {
    background: ${(p) => alpha(p.$color, p.$active ? 0.12 : 0.06)};
  }
`;

const TreeItemDot = styled.div<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  flex-shrink: 0;
`;

const TreeItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const TreeItemName = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TreeItemProgress = styled.div`
  font-size: 0.7rem;
  color: ${theme.colors.textMuted};
`;

const TreeItemBadge = styled.span<{ $color: string }>`
  font-size: 0.7rem;
  font-weight: 700;
  color: ${(p) => p.$color};
  flex-shrink: 0;
`;

// ─── Main Content Area ───────────────────────────────────────────
const Content = styled.div`
  flex: 1;
  min-width: 0;
  animation: ${fadeIn} 0.3s ease-out;
`;

const TreeCard = styled.div<{ $color: string }>`
  background: ${theme.colors.bgCard};
  border-radius: 20px;
  box-shadow:
    0 2px 8px rgba(var(--shadow-base), 0.3),
    0 8px 24px rgba(var(--shadow-base), 0.2),
    inset 0 0 30px ${(p) => alpha(p.$color, 0.02)};
  overflow: hidden;
`;

const TreeHeader = styled.div<{ $color: string }>`
  padding: 24px 28px;
  background-image: linear-gradient(90deg, transparent, ${(p) => alpha(p.$color, 0.12)}, transparent);
  background-size: 100% 1px;
  background-repeat: no-repeat;
  background-position: bottom;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, ${(p) => p.$color}, transparent);
  }
`;

const TreeName = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 4px;
`;

const TreeDesc = styled.p`
  font-size: 0.85rem;
  color: ${theme.colors.textMuted};
`;

const TreeBody = styled.div`
  padding: 28px;
`;

// ─── Talent Tiers ────────────────────────────────────────────────
const TierRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const TierLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
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

// ─── Connectors ──────────────────────────────────────────────────
const ConnectorRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const ConnectorSpacer = styled.div`
  width: 48px;
  flex-shrink: 0;
  margin-right: 16px;
`;

const ConnectorLine = styled.div<{ $color: string; $active: boolean }>`
  width: 3px;
  height: 20px;
  margin-left: 32px;
  background: ${(p) => (p.$active ? p.$color : theme.colors.border)};
  border-radius: 2px;
  transition: background 0.3s;
  ${(p) => p.$active && `box-shadow: 0 0 8px ${alpha(p.$color, 0.25)};`}
`;

// ─── Talent Node ─────────────────────────────────────────────────
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
  border: none;
  box-shadow:
    ${(p) =>
      p.$unlocked
        ? `0 0 12px ${alpha(p.$color, 0.25)}, inset 0 0 8px ${alpha(p.$color, 0.08)}`
        : p.$available
          ? `0 0 8px ${alpha(p.$color, 0.15)}`
          : `0 1px 4px rgba(var(--shadow-base), 0.3)`};
  background: ${(p) =>
    p.$unlocked
      ? alpha(p.$color, 0.12)
      : p.$available
        ? theme.colors.bgHover
        : `rgba(var(--c-bg), 0.8)`};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: ${(p) => (p.$available && !p.$unlocked ? "pointer" : "default")};
  transition: all 0.3s;
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
    box-shadow: 0 0 12px ${alpha(p.$color, 0.19)};
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
      background: ${alpha(p.$color, 0.08)};
      transform: scale(1.08);
      box-shadow: 0 0 20px ${alpha(p.$color, 0.12)};
    }
  `}
`;

const NodeCostBadge = styled.span<{ $color: string; $affordable: boolean }>`
  position: absolute;
  bottom: -6px;
  right: -6px;
  background: ${(p) => (p.$affordable ? p.$color : theme.colors.bgHover)};
  color: ${(p) => (p.$affordable ? "#fff" : theme.colors.textMuted)};
  font-size: 0.75rem;
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
  background: ${theme.colors.success};
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

// ─── Tooltip ─────────────────────────────────────────────────────
const TooltipContainer = styled.div<{ $visible: boolean; $color: string }>`
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  background: ${theme.colors.bgHover};
  border-radius: 12px;
  padding: 14px 18px;
  min-width: 220px;
  max-width: 280px;
  z-index: 20;
  pointer-events: none;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  visibility: ${(p) => (p.$visible ? "visible" : "hidden")};
  transition: all 0.2s;
  box-shadow: 0 8px 24px rgba(var(--shadow-base), 0.4);

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: ${theme.colors.bgHover};
  }
`;

const TooltipName = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 4px;
`;

const TooltipDesc = styled.div`
  font-size: 0.78rem;
  color: ${theme.colors.textMuted};
  line-height: 1.4;
  margin-bottom: 8px;
`;

const TooltipMeta = styled.div`
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
`;

const TooltipTag = styled.span<{ $color: string }>`
  padding: 2px 8px;
  border-radius: 6px;
  background: ${(p) => alpha(p.$color, 0.08)};
  color: ${(p) => p.$color};
  font-weight: 600;
`;

const TooltipStatus = styled.div<{ $color: string }>`
  margin-top: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(p) => p.$color};
`;

// ─── Confirmation Modal ──────────────────────────────────────────
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(var(--shadow-base), 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalCard = styled.div<{ $color: string }>`
  background: ${theme.colors.bgCard};
  border-radius: 20px;
  box-shadow: 0 0 40px ${(p) => alpha(p.$color, 0.12)}, 0 16px 48px rgba(var(--shadow-base), 0.5);
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
  color: ${theme.colors.textMuted};
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

// ─── Success Banner ──────────────────────────────────────────────
const SuccessBanner = styled.div<{ $color: string }>`
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: ${(p) => alpha(p.$color, 0.12)};
  border-radius: 12px;
  padding: 14px 28px;
  z-index: 200;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: ${confirmFadeIn} 0.3s ease-out;
  box-shadow: 0 8px 32px rgba(var(--shadow-base), 0.4);
`;

const SuccessText = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${theme.colors.text};
`;

// ─── Empty state ─────────────────────────────────────────────────
const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: ${theme.colors.textMuted};
  font-size: 0.9rem;
`;

// ─── Component ────────────────────────────────────────────────────
export default function ProgressionPage() {
  const { user, profile, loading: userLoading } = useUser();
  const addToast = useToastStore((s) => s.addToast);
  const [trees, setTrees] = useState<TreeWithTalents[]>([]);
  const [talentPoints, setTalentPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null);
  const [hoveredTalent, setHoveredTalent] = useState<string | null>(null);
  const [confirmTalent, setConfirmTalent] = useState<TalentWithStatus | null>(null);
  const [confirmTreeColor, setConfirmTreeColor] = useState(theme.colors.primary);
  const [unlocking, setUnlocking] = useState(false);
  const [justUnlockedId, setJustUnlockedId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<{
    text: string;
    color: string;
  } | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();

    const { data: treesData } = await supabase
      .from("talent_trees")
      .select("*")
      .order("created_at");

    if (!treesData) {
      setLoading(false);
      return;
    }

    const { data: talentsData } = await supabase
      .from("talents")
      .select("*")
      .order("tier");

    const { data: userTalents } = await supabase
      .from("user_talents")
      .select("talent_id")
      .eq("user_id", user.id);

    const unlockedIds = new Set(
      (userTalents || []).map((ut: { talent_id: string }) => ut.talent_id)
    );

    const { data: prof } = await supabase
      .from("profiles")
      .select("talent_points")
      .eq("id", user.id)
      .single();

    const points = prof?.talent_points ?? 0;
    setTalentPoints(points);

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
    if (!selectedTreeId && combined.length > 0) {
      setSelectedTreeId(combined[0].id);
    }
    setLoading(false);
  }, [user, selectedTreeId]);

  useEffect(() => {
    if (!userLoading && user) fetchData();
    if (!userLoading && !user) setLoading(false);
  }, [user, userLoading, fetchData]);

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

      addToast(`${confirmTalent.name} débloqué !`, "success");

      setSuccessMsg({
        text: `${confirmTalent.name} débloqué !`,
        color: confirmTreeColor,
      });

      await fetchData();

      setTimeout(() => setJustUnlockedId(null), 1500);
      setTimeout(() => setSuccessMsg(null), 3000);
    } else {
      const err = await res.json();
      addToast(err.error || "Erreur lors du déblocage", "error");
    }

    setUnlocking(false);
  };

  if (loading || userLoading)
    return <LoadingState text="Chargement de la progression..." />;

  if (!user || !profile)
    return <LoadingState text="Connectez-vous pour voir votre progression." />;

  const xpInLevel = profile.xp % 100;
  const xpNeeded = xpToNextLevel(profile.xp);
  const xpPercent = xpInLevel;
  const totalTalents = trees.reduce((s, t) => s + t.talents.length, 0);
  const unlockedTalents = trees.reduce(
    (s, t) => s + t.talents.filter((tal) => tal.unlocked).length,
    0
  );

  const activeTree = trees.find((t) => t.id === selectedTreeId);
  const activeColor = activeTree
    ? FACTION_COLORS[activeTree.faction as FactionConst] || theme.colors.primary
    : theme.colors.primary;

  // Group talents of active tree by tier
  const activeTiers = new Map<number, TalentWithStatus[]>();
  if (activeTree) {
    for (const t of activeTree.talents) {
      const list = activeTiers.get(t.tier) || [];
      list.push(t);
      activeTiers.set(t.tier, list);
    }
  }
  const sortedTiers = [...activeTiers.entries()].sort(([a], [b]) => a - b);

  return (
    <Page>
      {/* ─── Left Sidebar ─── */}
      <Sidebar>
        {/* Stats */}
        <SidebarCard>
          <SidebarTitle>Progression</SidebarTitle>
          <StatRow>
            <StatIcon $color={theme.colors.primary}>⚔</StatIcon>
            <StatInfo>
              <StatValue $color={theme.colors.primary}>Niveau {profile.level}</StatValue>
              <XpBarWrap>
                <XpLabels>
                  <span>{xpInLevel}/100 XP</span>
                  <span>{xpNeeded} restants</span>
                </XpLabels>
                <XpTrack>
                  <XpFill $percent={xpPercent} />
                </XpTrack>
              </XpBarWrap>
            </StatInfo>
          </StatRow>
          <StatRow>
            <StatIcon $color={theme.colors.accent}>🧠</StatIcon>
            <StatInfo>
              <StatValue $color={talentPoints > 0 ? theme.colors.accent : theme.colors.text}>
                {talentPoints}
              </StatValue>
              <StatLabel>
                {talentPoints > 0 ? "Points disponibles !" : "Points de talent"}
              </StatLabel>
            </StatInfo>
          </StatRow>
          <StatRow>
            <StatIcon $color={theme.colors.success}>🌟</StatIcon>
            <StatInfo>
              <StatValue>{unlockedTalents}/{totalTalents}</StatValue>
              <StatLabel>Talents débloqués</StatLabel>
            </StatInfo>
          </StatRow>
        </SidebarCard>

        {/* Tree Selector */}
        <SidebarCard>
          <SidebarTitle>Arbres de talents</SidebarTitle>
          <TreeList>
            {trees.map((tree) => {
              const factionKey = tree.faction as FactionConst;
              const color = FACTION_COLORS[factionKey] || theme.colors.primary;
              const treeUnlocked = tree.talents.filter((t) => t.unlocked).length;
              const label = GLOBAL_FACTION_LABELS[factionKey] || tree.faction;

              return (
                <TreeItem
                  key={tree.id}
                  $color={color}
                  $active={selectedTreeId === tree.id}
                  onClick={() => setSelectedTreeId(tree.id)}
                >
                  <TreeItemDot $color={color} />
                  <TreeItemInfo>
                    <TreeItemName>{tree.name}</TreeItemName>
                    <TreeItemProgress>
                      {tree.faction !== "all" ? label : "Universel"}
                    </TreeItemProgress>
                  </TreeItemInfo>
                  <TreeItemBadge $color={color}>
                    {treeUnlocked}/{tree.talents.length}
                  </TreeItemBadge>
                </TreeItem>
              );
            })}
          </TreeList>
        </SidebarCard>
      </Sidebar>

      {/* ─── Main Content: Selected Tree ─── */}
      <Content key={selectedTreeId}>
        {activeTree ? (
          <TreeCard $color={activeColor}>
            <TreeHeader $color={activeColor}>
              <TreeName>{activeTree.name}</TreeName>
              <TreeDesc>
                {activeTree.description ||
                  GLOBAL_FACTION_LABELS[activeTree.faction as FactionConst] ||
                  activeTree.faction}
              </TreeDesc>
            </TreeHeader>

            <TreeBody>
              {sortedTiers.map(([tier, talents], tierIndex) => (
                <div key={tier}>
                  {tierIndex > 0 && (
                    <ConnectorRow>
                      <ConnectorSpacer />
                      {talents.map((t) => {
                        const prereqUnlocked =
                          !t.prerequisite_talent_id ||
                          activeTree.talents.find(
                            (pt) => pt.id === t.prerequisite_talent_id
                          )?.unlocked;
                        return (
                          <ConnectorLine
                            key={`conn-${t.id}`}
                            $color={activeColor}
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
                            $color={activeColor}
                            $justUnlocked={justUnlockedId === talent.id}
                            onClick={() => {
                              if (talent.available && !talent.unlocked) {
                                setConfirmTalent(talent);
                                setConfirmTreeColor(activeColor);
                              }
                            }}
                          >
                            {getTalentIcon(talent.effect_type)}
                            {talent.unlocked && <UnlockedCheck>✓</UnlockedCheck>}
                            {!talent.unlocked && (
                              <NodeCostBadge
                                $color={activeColor}
                                $affordable={talentPoints >= talent.cost}
                              >
                                {talent.cost}
                              </NodeCostBadge>
                            )}
                          </Node>

                          <TooltipContainer
                            $visible={hoveredTalent === talent.id}
                            $color={activeColor}
                          >
                            <TooltipName>{talent.name}</TooltipName>
                            <TooltipDesc>
                              {talent.description || "Aucune description"}
                            </TooltipDesc>
                            <TooltipMeta>
                              <TooltipTag $color={activeColor}>
                                Tier {talent.tier}
                              </TooltipTag>
                              <TooltipTag $color={theme.colors.accent}>
                                Coût: {talent.cost}
                              </TooltipTag>
                            </TooltipMeta>
                            <TooltipStatus
                              $color={
                                talent.unlocked
                                  ? theme.colors.success
                                  : talent.available
                                    ? activeColor
                                    : theme.colors.textMuted
                              }
                            >
                              {talent.unlocked
                                ? "✓ Débloqué"
                                : talent.available
                                  ? "Cliquer pour débloquer"
                                  : talent.prerequisite_talent_id &&
                                    !activeTree.talents.find(
                                      (pt) =>
                                        pt.id === talent.prerequisite_talent_id
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
        ) : (
          <EmptyState>Sélectionnez un arbre de talents.</EmptyState>
        )}
      </Content>

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
              <GlowButton
                $variant="primary"
                onClick={handleUnlock}
                disabled={unlocking}
                loading={unlocking}
              >
                Confirmer
              </GlowButton>
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
