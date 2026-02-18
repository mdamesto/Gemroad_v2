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
import { FUSION_COST, FUSION_TARGET, RECYCLE_GEM_VALUES, RARITY_COLORS, RARITY_LABELS, type Rarity } from "@/lib/constants";
import type { Card } from "@/types/cards";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px 40px;
`;

const Tabs = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 28px;
  background: ${theme.colors.bgCard};
  padding: 4px;
  border-radius: 12px;
  width: fit-content;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(p) => (p.$active ? alpha(theme.colors.primary, 0.12) : "transparent")};
  color: ${(p) => (p.$active ? theme.colors.primary : theme.colors.textMuted)};

  &:hover {
    color: ${theme.colors.text};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const CardRow = styled(GlassCard)`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  animation: ${fadeIn} 0.3s ease-out;
`;

const CardThumb = styled.div<{ $rarity: Rarity }>`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: ${(p) => alpha(RARITY_COLORS[p.$rarity], 0.12)};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
  border: 2px solid ${(p) => alpha(RARITY_COLORS[p.$rarity], 0.3)};
`;

const CardInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const CardName = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardMeta = styled.div`
  font-size: 0.78rem;
  color: ${theme.colors.textMuted};
  display: flex;
  gap: 8px;
  align-items: center;
`;

const RarityDot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  display: inline-block;
`;

const Quantity = styled.span`
  font-weight: 700;
  color: ${theme.colors.text};
`;

const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const GemValue = styled.div`
  font-size: 0.78rem;
  color: ${theme.colors.accent};
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${theme.colors.textMuted};
  grid-column: 1 / -1;
`;

const ResultOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: ${fadeIn} 0.2s ease;
`;

const ResultCard = styled.div<{ $rarity: Rarity }>`
  background: ${theme.colors.bgCard};
  border-radius: 20px;
  padding: 32px;
  text-align: center;
  max-width: 360px;
  width: 100%;
  box-shadow: ${(p) => theme.shadows.glow(RARITY_COLORS[p.$rarity])};
`;

const ResultTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;

const ResultRarity = styled.div<{ $color: string }>`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${(p) => p.$color};
  margin-bottom: 16px;
`;

interface UserCardEntry {
  id: string;
  card_id: string;
  quantity: number;
  is_foil: boolean;
  card: Card;
}

export default function FusionPage() {
  const { user, loading: userLoading } = useUser();
  const addToast = useToastStore((s) => s.addToast);
  const [tab, setTab] = useState<"fusion" | "recycle">("fusion");
  const [userCards, setUserCards] = useState<UserCardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [fusionResult, setFusionResult] = useState<{ name: string; rarity: Rarity } | null>(null);

  useEffect(() => {
    if (!user) return;
    async function fetchData() {
      const supabase = createClient();
      const { data } = await supabase
        .from("user_cards")
        .select("id, card_id, quantity, is_foil, cards(*)")
        .eq("user_id", user!.id)
        .gt("quantity", 1)
        .eq("is_foil", false);

      if (data) {
        setUserCards(
          data.map((d: Record<string, unknown>) => ({
            id: d.id as string,
            card_id: d.card_id as string,
            quantity: d.quantity as number,
            is_foil: d.is_foil as boolean,
            card: d.cards as unknown as Card,
          }))
        );
      }
      setLoading(false);
    }
    fetchData();
  }, [user]);

  const fusionEligible = useMemo(() => {
    return userCards.filter((uc) => {
      const cost = FUSION_COST[uc.card.rarity];
      return cost && FUSION_TARGET[uc.card.rarity] && uc.quantity >= cost;
    });
  }, [userCards]);

  const recycleEligible = useMemo(() => {
    return userCards.filter((uc) => uc.quantity > 1);
  }, [userCards]);

  const handleFusion = async (uc: UserCardEntry) => {
    setActionId(uc.id);
    const res = await fetch("/api/fusion/craft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId: uc.card_id, rarity: uc.card.rarity }),
    });

    if (res.ok) {
      const data = await res.json();
      setFusionResult({ name: data.resultCard.name, rarity: data.resultCard.rarity });
      addToast(`Fusion réussie ! Nouvelle carte ${data.resultCard.name}`, "success");
      // Update local state
      setUserCards((prev) =>
        prev
          .map((c) => (c.id === uc.id ? { ...c, quantity: c.quantity - (FUSION_COST[uc.card.rarity] || 0) } : c))
          .filter((c) => c.quantity > 0)
      );
    } else {
      const err = await res.json();
      addToast(err.error || "Erreur de fusion", "error");
    }
    setActionId(null);
  };

  const handleRecycle = async (uc: UserCardEntry) => {
    const amount = uc.quantity - 1; // Keep 1, recycle the rest
    if (amount < 1) return;

    setActionId(uc.id);
    const res = await fetch("/api/fusion/recycle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId: uc.id, amount }),
    });

    if (res.ok) {
      const data = await res.json();
      addToast(`+${formatGems(data.gemsEarned)} gemmes recyclées !`, "success");
      setUserCards((prev) =>
        prev
          .map((c) => (c.id === uc.id ? { ...c, quantity: 1 } : c))
          .filter((c) => c.quantity > 1 || tab === "fusion")
      );
    } else {
      const err = await res.json();
      addToast(err.error || "Erreur de recyclage", "error");
    }
    setActionId(null);
  };

  if (userLoading || loading) return <LoadingState text="Chargement..." />;

  return (
    <Page>
      <Tabs>
        <Tab $active={tab === "fusion"} onClick={() => setTab("fusion")}>
          Fusion
        </Tab>
        <Tab $active={tab === "recycle"} onClick={() => setTab("recycle")}>
          Recyclage
        </Tab>
      </Tabs>

      {tab === "fusion" ? (
        <Grid>
          {fusionEligible.length === 0 && (
            <EmptyState>
              Pas assez de doublons pour fusionner. Continue de collecter !
            </EmptyState>
          )}
          {fusionEligible.map((uc) => {
            const cost = FUSION_COST[uc.card.rarity] || 0;
            const target = FUSION_TARGET[uc.card.rarity];
            return (
              <CardRow key={uc.id}>
                <CardThumb $rarity={uc.card.rarity as Rarity}>
                  {uc.card.image_url ? (
                    <img src={uc.card.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
                  ) : "🃏"}
                </CardThumb>
                <CardInfo>
                  <CardName>{uc.card.name}</CardName>
                  <CardMeta>
                    <RarityDot $color={RARITY_COLORS[uc.card.rarity as Rarity]} />
                    {RARITY_LABELS[uc.card.rarity as Rarity]}
                    &rarr; {RARITY_LABELS[target as Rarity]}
                  </CardMeta>
                  <CardMeta>
                    <Quantity>x{uc.quantity}</Quantity> / {cost} nécessaires
                  </CardMeta>
                </CardInfo>
                <ActionArea>
                  <GlowButton
                    $size="sm"
                    $variant="accent"
                    onClick={() => handleFusion(uc)}
                    loading={actionId === uc.id}
                    disabled={!!actionId}
                  >
                    Fusionner
                  </GlowButton>
                </ActionArea>
              </CardRow>
            );
          })}
        </Grid>
      ) : (
        <Grid>
          {recycleEligible.length === 0 && (
            <EmptyState>
              Aucun doublon à recycler.
            </EmptyState>
          )}
          {recycleEligible.map((uc) => {
            const gemValue = RECYCLE_GEM_VALUES[uc.card.rarity] || 5;
            const recyclable = uc.quantity - 1;
            return (
              <CardRow key={uc.id}>
                <CardThumb $rarity={uc.card.rarity as Rarity}>
                  {uc.card.image_url ? (
                    <img src={uc.card.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
                  ) : "🃏"}
                </CardThumb>
                <CardInfo>
                  <CardName>{uc.card.name}</CardName>
                  <CardMeta>
                    <RarityDot $color={RARITY_COLORS[uc.card.rarity as Rarity]} />
                    {RARITY_LABELS[uc.card.rarity as Rarity]}
                  </CardMeta>
                  <CardMeta>
                    <Quantity>x{recyclable}</Quantity> recyclable(s)
                  </CardMeta>
                </CardInfo>
                <ActionArea>
                  <GemValue>{formatGems(gemValue * recyclable)} ◆</GemValue>
                  <GlowButton
                    $size="sm"
                    $variant="primary"
                    onClick={() => handleRecycle(uc)}
                    loading={actionId === uc.id}
                    disabled={!!actionId || recyclable < 1}
                  >
                    Recycler
                  </GlowButton>
                </ActionArea>
              </CardRow>
            );
          })}
        </Grid>
      )}

      {fusionResult && (
        <ResultOverlay onClick={() => setFusionResult(null)}>
          <ResultCard $rarity={fusionResult.rarity} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>✨</div>
            <ResultTitle>{fusionResult.name}</ResultTitle>
            <ResultRarity $color={RARITY_COLORS[fusionResult.rarity]}>
              {RARITY_LABELS[fusionResult.rarity]}
            </ResultRarity>
            <GlowButton $size="md" $variant="primary" onClick={() => setFusionResult(null)}>
              Fermer
            </GlowButton>
          </ResultCard>
        </ResultOverlay>
      )}
    </Page>
  );
}
