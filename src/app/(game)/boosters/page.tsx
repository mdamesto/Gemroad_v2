"use client";

import { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useUser } from "@/hooks/use-user";
import { useCurrency } from "@/hooks/use-currency";
import { useGameStore } from "@/stores/game-store";
import { useToastStore } from "@/stores/toast-store";
import { createClient } from "@/lib/supabase/client";
import { GlowButton } from "@/components/ui/glow-button";
import { GlassCard } from "@/components/ui/glass-card";

import { LoadingState } from "@/components/ui/skeleton-loader";
import { EmptyState } from "@/components/ui/empty-state";
import { theme, alpha } from "@/lib/theme";
import { fadeInUp } from "@/lib/animations";
import { formatGems } from "@/lib/utils";
import { FREE_DAILY_BOOSTERS, FACTION_COLORS, FACTION_LABELS } from "@/lib/constants";
import type { BoosterType, UserBooster } from "@/types/cards";
import type { FactionConst } from "@/lib/constants";

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 40px;
`;

const Section = styled.section`
  margin-bottom: 48px;
  animation: ${fadeInUp} 0.5s ease-out both;

  &:nth-child(2) { animation-delay: 0.1s; }
  &:nth-child(3) { animation-delay: 0.2s; }
  &:nth-child(4) { animation-delay: 0.3s; }
`;

const SectionTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: ${theme.colors.text};
  letter-spacing: 0.02em;
`;

const BoosterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

const BoosterCardStyled = styled(GlassCard)<{ $factionColor?: string }>`
  text-align: center;
  transition: all 0.3s ease;
  ${({ $factionColor }) => $factionColor ? `border-top: 3px solid ${$factionColor};` : ""}

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow:
      0 4px 16px rgba(var(--shadow-base), 0.35),
      0 0 24px ${({ $factionColor }) => $factionColor ? alpha($factionColor, 0.2) : alpha(theme.colors.primary, 0.09)};
  }
`;

const BoosterImage = styled.img`
  width: 80px;
  height: 107px;
  margin: 0 auto 16px;
  display: block;
  filter: drop-shadow(0 4px 12px rgba(var(--shadow-base), 0.4));
`;

const BoosterName = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: ${theme.colors.text};
`;

const BoosterDesc = styled.p`
  color: ${theme.colors.textMuted};
  font-size: 0.85rem;
  margin-bottom: 16px;
  line-height: 1.4;
`;

const Price = styled.div`
  color: ${theme.colors.accent};
  font-weight: 700;
  margin-bottom: 16px;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const GemIconInline = styled.span`
  color: ${theme.colors.accent};
  font-size: 0.9em;
`;

const FactionBadge = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: ${theme.radii.full};
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ $color }) => $color};
  background: ${({ $color }) => alpha($color, 0.12)};
  margin-bottom: 12px;
`;

const UnopenedList = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const UnopenedBooster = styled(GlassCard)`
  text-align: center;
  width: 180px;
  animation: ${fadeInUp} 0.4s ease-out;
  box-shadow: 0 0 15px rgba(219, 180, 93, 0.15), 0 4px 12px rgba(var(--shadow-base), 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 25px rgba(219, 180, 93, 0.3), 0 8px 20px rgba(var(--shadow-base), 0.3);
  }
`;

const UnopenedImage = styled.img`
  width: 50px;
  height: 67px;
  margin: 0 auto 8px;
  display: block;
  filter: drop-shadow(0 2px 8px rgba(var(--shadow-base), 0.4));
`;

const FreeCard = styled(GlassCard)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  box-shadow: 0 0 15px ${alpha(theme.colors.success, 0.07)}, 0 4px 12px rgba(var(--shadow-base), 0.2);
`;

const FreeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FreeTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${theme.colors.text};
`;

const FreeSubtitle = styled.p`
  font-size: 0.82rem;
  color: ${theme.colors.textMuted};
`;

const FreeBadge = styled.span<{ $hasRemaining: boolean }>`
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 8px;
  background: ${(p) => p.$hasRemaining ? `${alpha(theme.colors.success, 0.19)}` : `${alpha(theme.colors.success, 0.12)}`};
  border: none;
  color: ${theme.colors.success};
`;

// SVG Icons
const GiftIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
);

const BoxOpenIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const GemBuyIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 9l10 13L22 9 12 2z" />
  </svg>
);

function getBoosterImage(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("légend") || lower.includes("legend")) return "/images/ui/booster-legendary.svg";
  if (lower.includes("premi") || lower.includes("premium")) return "/images/ui/booster-premium.svg";
  return "/images/ui/booster-standard.svg";
}

export default function BoostersPage() {
  const { user, loading: userLoading } = useUser();
  const { balance, refresh: refreshBalance } = useCurrency(user?.id);
  const startBoosterOpen = useGameStore((s) => s.startBoosterOpen);
  const addToast = useToastStore((s) => s.addToast);

  const [boosterTypes, setBoosterTypes] = useState<BoosterType[]>([]);
  const [unopened, setUnopened] = useState<(UserBooster & { booster_type: BoosterType })[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [opening, setOpening] = useState<string | null>(null);
  const [freeRemaining, setFreeRemaining] = useState(FREE_DAILY_BOOSTERS);
  const [claimingFree, setClaimingFree] = useState(false);

  const fetchFreeRemaining = useCallback(async () => {
    const res = await fetch("/api/boosters/claim-free");
    if (res.ok) {
      const data = await res.json();
      setFreeRemaining(data.freeRemaining);
    }
  }, []);

  useEffect(() => {
    if (user) fetchFreeRemaining();
  }, [user, fetchFreeRemaining]);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      const supabase = createClient();

      const { data: types } = await supabase
        .from("booster_types")
        .select("*")
        .eq("is_active", true)
        .order("price_gems");

      const { data: userBoosters } = await supabase
        .from("user_boosters")
        .select("*, booster_type:booster_types(*)")
        .eq("user_id", user!.id)
        .is("opened_at", null);

      setBoosterTypes((types as BoosterType[]) || []);
      setUnopened(
        (userBoosters as (UserBooster & { booster_type: BoosterType })[]) || []
      );
      setLoading(false);
    }

    fetchData();
  }, [user]);

  const handlePurchase = async (boosterTypeId: string) => {
    setPurchasing(boosterTypeId);

    const res = await fetch("/api/boosters/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boosterTypeId }),
    });

    if (res.ok) {
      const { booster } = await res.json();
      const type = boosterTypes.find((t) => t.id === boosterTypeId)!;
      setUnopened((prev) => [...prev, { ...booster, booster_type: type }]);
      refreshBalance();
      addToast("Booster acheté avec succès !", "success");
    } else {
      addToast("Erreur lors de l'achat du booster", "error");
    }

    setPurchasing(null);
  };

  const handleOpen = async (boosterId: string) => {
    setOpening(boosterId);

    const res = await fetch("/api/boosters/open", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boosterId }),
    });

    if (res.ok) {
      const { cards } = await res.json();
      setUnopened((prev) => prev.filter((b) => b.id !== boosterId));
      startBoosterOpen(cards);
      refreshBalance();
    } else {
      addToast("Erreur lors de l'ouverture du booster", "error");
    }

    setOpening(null);
  };

  const handleClaimFree = async () => {
    if (claimingFree || freeRemaining <= 0) return;
    setClaimingFree(true);

    const res = await fetch("/api/boosters/claim-free", {
      method: "POST",
    });

    if (res.ok) {
      const { booster, boosterType, freeRemaining: remaining } = await res.json();
      setFreeRemaining(remaining);
      setUnopened((prev) => [
        ...prev,
        { ...booster, booster_type: boosterType },
      ]);
      addToast("Booster gratuit obtenu !", "success");
    } else {
      addToast("Erreur lors de la récupération", "error");
    }

    setClaimingFree(false);
  };

  if (userLoading || loading) {
    return <LoadingState text="Chargement des boosters..." />;
  }

  if (!user) {
    return <LoadingState text="Connectez-vous pour accéder aux boosters." />;
  }

  return (
    <Page>
      <Section>
        <SectionTitle>Boosters Gratuits du Jour</SectionTitle>
        <FreeCard>
          <FreeInfo>
            <FreeTitle>
              Ouvre {FREE_DAILY_BOOSTERS} boosters gratuits chaque jour !
            </FreeTitle>
            <FreeSubtitle>
              <FreeBadge $hasRemaining={freeRemaining > 0}>
                {freeRemaining} / {FREE_DAILY_BOOSTERS} restant{freeRemaining > 1 ? "s" : ""}
              </FreeBadge>
            </FreeSubtitle>
          </FreeInfo>
          <GlowButton
            $variant="success"
            onClick={handleClaimFree}
            disabled={freeRemaining <= 0 || claimingFree}
            loading={claimingFree}
            icon={GiftIcon}
          >
            {freeRemaining <= 0
              ? "Reviens demain !"
              : "Récupérer un booster gratuit"}
          </GlowButton>
        </FreeCard>
      </Section>

      <Section>
        <SectionTitle>
          Mes Boosters non ouverts ({unopened.length})
        </SectionTitle>
        {unopened.length === 0 ? (
          <EmptyState
            illustration="chest"
            title="Aucun booster à ouvrir"
            subtitle="Achetez-en dans la boutique ci-dessous ou récupérez vos boosters gratuits !"
          />
        ) : (
          <UnopenedList>
            {unopened.map((b) => (
              <UnopenedBooster key={b.id} $padding="20px">
                <UnopenedImage
                  src={getBoosterImage(b.booster_type.name)}
                  alt={b.booster_type.name}
                />
                <p style={{ fontSize: "0.85rem", marginBottom: 12, color: theme.colors.text }}>
                  {b.booster_type.name}
                </p>
                <GlowButton
                  $variant="accent"
                  $size="sm"
                  onClick={() => handleOpen(b.id)}
                  disabled={opening === b.id}
                  loading={opening === b.id}
                  icon={BoxOpenIcon}
                >
                  Ouvrir
                </GlowButton>
              </UnopenedBooster>
            ))}
          </UnopenedList>
        )}
      </Section>

      <Section>
        <SectionTitle>Acheter avec des Gems</SectionTitle>
        <BoosterGrid>
          {boosterTypes.map((bt) => {
            const factionColor = bt.faction_filter
              ? FACTION_COLORS[bt.faction_filter as FactionConst]
              : undefined;
            const factionLabel = bt.faction_filter
              ? FACTION_LABELS[bt.faction_filter as FactionConst]
              : undefined;

            return (
              <BoosterCardStyled key={bt.id} $padding="24px" $factionColor={factionColor}>
                <BoosterImage
                  src={getBoosterImage(bt.name)}
                  alt={bt.name}
                />
                <BoosterName>{bt.name}</BoosterName>
                {factionLabel && (
                  <FactionBadge $color={factionColor!}>
                    {factionLabel}
                  </FactionBadge>
                )}
                <BoosterDesc>
                  {bt.description} &middot; {bt.cards_count} cartes
                </BoosterDesc>
                <Price>
                  <GemIconInline>&#9670;</GemIconInline>
                  {formatGems(bt.price_gems)}
                </Price>
                <GlowButton
                  $variant="primary"
                  $fullWidth
                  onClick={() => handlePurchase(bt.id)}
                  disabled={balance < bt.price_gems || purchasing === bt.id}
                  loading={purchasing === bt.id}
                  icon={GemBuyIcon}
                >
                  {balance < bt.price_gems
                    ? "Solde insuffisant"
                    : "Acheter"}
                </GlowButton>
              </BoosterCardStyled>
            );
          })}
        </BoosterGrid>
      </Section>
    </Page>
  );
}
