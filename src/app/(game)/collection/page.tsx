"use client";

import { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { FilterPanel, type FilterState } from "@/components/collection/filter-panel";
import { CollectionGrid } from "@/components/collection/collection-grid";
import { CardModal } from "@/components/collection/card-modal";
import type { CollectionCardData } from "@/components/collection/card-item";
import type { Card } from "@/types/cards";

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 8px;
`;

const Stats = styled.p`
  color: #94a3b8;
  font-size: 0.9rem;

  strong {
    color: #e5e7eb;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 60px;
  color: #94a3b8;
`;

// Cards obtained in the last 24 hours are considered "new"
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

  if (userLoading || loading) {
    return <Loading>Chargement de votre collection...</Loading>;
  }

  if (!user) {
    return <Loading>Connectez-vous pour voir votre collection.</Loading>;
  }

  return (
    <Page>
      <Header>
        <Title>Ma Collection</Title>
        <Stats>
          <strong>{ownedCount}</strong> / {totalCount} cartes collectionnées
        </Stats>
      </Header>

      <FilterPanel filters={filters} onChange={setFilters} />

      <CollectionGrid cards={filtered} onCardClick={setSelected} />

      {selected && <CardModal data={selected} onClose={() => setSelected(null)} />}
    </Page>
  );
}
