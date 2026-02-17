"use client";

import { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useUser } from "@/hooks/use-user";
import { useCurrency } from "@/hooks/use-currency";
import { useGameStore } from "@/stores/game-store";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { formatGems } from "@/lib/utils";
import { FREE_DAILY_BOOSTERS } from "@/lib/constants";
import type { BoosterType, UserBooster } from "@/types/cards";

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #e5e7eb;
`;

const Section = styled.section`
  margin-bottom: 48px;
`;

const BoosterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

const BoosterCard = styled.div`
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: border-color 0.3s;

  &:hover {
    border-color: #38BDF840;
  }
`;

const BoosterIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
`;

const BoosterName = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

const BoosterDesc = styled.p`
  color: #94a3b8;
  font-size: 0.85rem;
  margin-bottom: 16px;
  line-height: 1.4;
`;

const Price = styled.div`
  color: #dbb45d;
  font-weight: 700;
  margin-bottom: 16px;
  font-size: 1.1rem;
`;

const UnopenedList = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const UnopenedBooster = styled.div`
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  width: 180px;
  transition: border-color 0.3s;

  &:hover {
    border-color: #dbb45d;
  }
`;

const UnopenedIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 8px;
`;

const EmptyState = styled.p`
  color: #94a3b8;
  font-size: 0.9rem;
`;

const Loading = styled.div`
  text-align: center;
  padding: 60px;
  color: #94a3b8;
`;

const FreeCard = styled.div`
  background: linear-gradient(135deg, #0f1a12, #0f172a);
  border: 1px solid #34d39940;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

const FreeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FreeTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: #e5e7eb;
`;

const FreeSubtitle = styled.p`
  font-size: 0.82rem;
  color: #94a3b8;
`;

const FreeBadge = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 8px;
  background: #34d39920;
  border: 1px solid #34d39940;
  color: #34d399;
`;

export default function BoostersPage() {
  const { user, loading: userLoading } = useUser();
  const { balance, refresh: refreshBalance } = useCurrency(user?.id);
  const startBoosterOpen = useGameStore((s) => s.startBoosterOpen);

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
    }

    setClaimingFree(false);
  };

  if (userLoading || loading) {
    return <Loading>Chargement...</Loading>;
  }

  if (!user) {
    return <Loading>Connectez-vous pour accéder aux boosters.</Loading>;
  }

  return (
    <Page>
      <Title>Boosters</Title>

      <Section>
        <SectionTitle>Boosters Gratuits du Jour</SectionTitle>
        <FreeCard>
          <FreeInfo>
            <FreeTitle>
              Ouvre {FREE_DAILY_BOOSTERS} boosters gratuits chaque jour !
            </FreeTitle>
            <FreeSubtitle>
              <FreeBadge>
                {freeRemaining} / {FREE_DAILY_BOOSTERS} restant{freeRemaining > 1 ? "s" : ""}
              </FreeBadge>
            </FreeSubtitle>
          </FreeInfo>
          <Button
            onClick={handleClaimFree}
            disabled={freeRemaining <= 0 || claimingFree}
          >
            {claimingFree
              ? "Récupération..."
              : freeRemaining <= 0
                ? "Reviens demain !"
                : "Récupérer un booster gratuit"}
          </Button>
        </FreeCard>
      </Section>

      <Section>
        <SectionTitle>
          Mes Boosters non ouverts ({unopened.length})
        </SectionTitle>
        {unopened.length === 0 ? (
          <EmptyState>
            Aucun booster à ouvrir. Achetez-en dans la boutique ci-dessous !
          </EmptyState>
        ) : (
          <UnopenedList>
            {unopened.map((b) => (
              <UnopenedBooster key={b.id}>
                <UnopenedIcon>&#127183;</UnopenedIcon>
                <p style={{ fontSize: "0.85rem", marginBottom: 12 }}>
                  {b.booster_type.name}
                </p>
                <Button
                  $size="sm"
                  onClick={() => handleOpen(b.id)}
                  disabled={opening === b.id}
                >
                  {opening === b.id ? "Ouverture..." : "Ouvrir"}
                </Button>
              </UnopenedBooster>
            ))}
          </UnopenedList>
        )}
      </Section>

      <Section>
        <SectionTitle>Acheter avec des Gems</SectionTitle>
        <BoosterGrid>
          {boosterTypes.map((bt) => (
            <BoosterCard key={bt.id}>
              <BoosterIcon>&#127183;</BoosterIcon>
              <BoosterName>{bt.name}</BoosterName>
              <BoosterDesc>
                {bt.description} &middot; {bt.cards_count} cartes
              </BoosterDesc>
              <Price>&#9670; {formatGems(bt.price_gems)}</Price>
              <Button
                onClick={() => handlePurchase(bt.id)}
                disabled={
                  balance < bt.price_gems || purchasing === bt.id
                }
                $fullWidth
              >
                {purchasing === bt.id
                  ? "Achat..."
                  : balance < bt.price_gems
                    ? "Solde insuffisant"
                    : "Acheter"}
              </Button>
            </BoosterCard>
          ))}
        </BoosterGrid>
      </Section>
    </Page>
  );
}
