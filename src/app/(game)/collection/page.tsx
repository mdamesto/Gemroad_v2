"use client";

import { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { FilterPanel, type FilterState } from "@/components/collection/filter-panel";
import { CollectionGrid } from "@/components/collection/collection-grid";
import { CardModal } from "@/components/collection/card-modal";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/skeleton-loader";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { theme } from "@/lib/theme";
import { fadeInUp } from "@/lib/animations";
import type { CollectionCardData } from "@/components/collection/card-item";
import type { Card } from "@/types/cards";

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 40px;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
`;

const StatCard = styled(GlassCard)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 24px;
  min-width: 120px;
`;

const StatValue = styled.span`
  font-size: 1.3rem;
  font-weight: 800;
  color: ${theme.colors.text};
`;

const StatLabel = styled.span`
  font-size: 0.7rem;
  color: ${theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ProgressBarOuter = styled.div`
  width: 100%;
  max-width: 200px;
  height: 6px;
  background: ${theme.colors.border};
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressBarInner = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${(p) => p.$percent}%;
  background: ${theme.gradients.primary};
  border-radius: 3px;
  transition: width 0.8s ease;
`;

const ContentArea = styled.div`
  animation: ${fadeInUp} 0.5s ease-out 0.2s both;
`;

const NEW_CARD_THRESHOLD_MS = 24 * 60 * 60 * 1000;

export default function CollectionPage() {
  const { user, loading: userLoading } = useUser();
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [ownedMap, setOwnedMap] = useState<Map<string, { quantity: number; obtainedAt: string }>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    rarity: "all",
    type: "all",
    faction: "all",
    search: "",
    showUnowned: true,
  });
  const [selected, setSelected] = useState<CollectionCardData | null>(null);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      const supabase = createClient();

      const [{ data: cards }, { data: owned }] = await Promise.all([
        supabase.from("cards").select("*").order("name"),
        supabase
          .from("user_cards")
          .select("card_id, quantity, obtained_at")
          .eq("user_id", user!.id),
      ]);

      setAllCards((cards as Card[]) || []);

      const map = new Map<string, { quantity: number; obtainedAt: string }>();
      (owned || []).forEach((uc: { card_id: string; quantity: number; obtained_at: string }) => {
        map.set(uc.card_id, { quantity: uc.quantity, obtainedAt: uc.obtained_at });
      });
      setOwnedMap(map);
      setLoading(false);
    }

    fetchData();
  }, [user]);

  const collectionCards = useMemo<CollectionCardData[]>(() => {
    const now = Date.now();
    return allCards.map((card) => {
      const entry = ownedMap.get(card.id);
      return {
        card,
        quantity: entry?.quantity || 0,
        owned: !!entry,
        isNew: entry ? now - new Date(entry.obtainedAt).getTime() < NEW_CARD_THRESHOLD_MS : false,
      };
    });
  }, [allCards, ownedMap]);

  const filtered = useMemo(() => {
    let result = collectionCards;

    if (!filters.showUnowned) {
      result = result.filter((c) => c.owned);
    }
    if (filters.rarity !== "all") {
      result = result.filter((c) => c.card.rarity === filters.rarity);
    }
    if (filters.type !== "all") {
      result = result.filter((c) => c.card.type === filters.type);
    }
    if (filters.faction !== "all") {
      result = result.filter((c) => c.card.faction === filters.faction);
    }
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter((c) => c.card.name.toLowerCase().includes(q));
    }

    const rarityOrder: Record<string, number> = {
      legendary: 5,
      epic: 4,
      rare: 3,
      uncommon: 2,
      common: 1,
    };
    result.sort((a, b) => {
      if (a.owned !== b.owned) return a.owned ? -1 : 1;
      const ra = rarityOrder[a.card.rarity] || 0;
      const rb = rarityOrder[b.card.rarity] || 0;
      if (ra !== rb) return rb - ra;
      return a.card.name.localeCompare(b.card.name);
    });

    return result;
  }, [collectionCards, filters]);

  const ownedCount = collectionCards.filter((c) => c.owned).length;
  const totalCount = collectionCards.length;
  const percent = totalCount > 0 ? Math.round((ownedCount / totalCount) * 100) : 0;

  if (userLoading || loading) {
    return <LoadingState text="Chargement de votre collection..." />;
  }

  if (!user) {
    return <LoadingState text="Connectez-vous pour voir votre collection." />;
  }

  return (
    <Page>
      <PageHeader title="Ma Collection" subtitle="Collectionnez toutes les cartes du monde post-apocalyptique">
        <StatsRow>
          <StatCard>
            <StatValue>
              <AnimatedCounter value={ownedCount} color={theme.colors.primary} />
            </StatValue>
            <StatLabel>Possédées</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{totalCount}</StatValue>
            <StatLabel>Total</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>
              <AnimatedCounter value={percent} color={theme.colors.accent} suffix="%" />
            </StatValue>
            <StatLabel>Complétion</StatLabel>
            <ProgressBarOuter>
              <ProgressBarInner $percent={percent} />
            </ProgressBarOuter>
          </StatCard>
        </StatsRow>
      </PageHeader>

      <ContentArea>
        <FilterPanel filters={filters} onChange={setFilters} />
        <CollectionGrid cards={filtered} onCardClick={setSelected} />
      </ContentArea>

      {selected && <CardModal data={selected} onClose={() => setSelected(null)} />}
    </Page>
  );
}
