"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styled from "styled-components";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { CardGrid } from "@/components/cards/card-grid";
import { Button } from "@/components/ui/button";
import type { Card, Series } from "@/types/cards";

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 8px;
`;

const Description = styled.p`
  color: #8888aa;
  font-size: 0.95rem;
  margin-bottom: 20px;
  line-height: 1.5;
`;

const ProgressBar = styled.div`
  width: 100%;
  max-width: 400px;
  height: 10px;
  background: #2a2a35;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${(p) => p.$percent}%;
  background: #e63946;
  border-radius: 5px;
  transition: width 0.3s;
`;

const ProgressText = styled.p`
  font-size: 0.85rem;
  color: #8888aa;
  margin-bottom: 20px;
`;

const RewardSection = styled.div`
  background: #12121a;
  border: 1px solid #f4a26140;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 32px;
  max-width: 500px;
`;

const RewardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #f4a261;
  margin-bottom: 8px;
`;

const RewardDesc = styled.p`
  font-size: 0.9rem;
  color: #8888aa;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 20px;
`;

const Loading = styled.div`
  text-align: center;
  padding: 60px;
  color: #8888aa;
`;

export default function SeriesDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const [series, setSeries] = useState<Series | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [ownedCardIds, setOwnedCardIds] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const { data: seriesData } = await supabase
        .from("series")
        .select("*")
        .eq("id", id)
        .single();

      const { data: cardsData } = await supabase
        .from("cards")
        .select("*")
        .eq("series_id", id);

      setSeries(seriesData as Series);
      setCards((cardsData as Card[]) || []);

      if (user) {
        const { data: userCards } = await supabase
          .from("user_cards")
          .select("card_id")
          .eq("user_id", user.id);

        const owned = new Set<string>(
          (userCards || []).map((uc: { card_id: string }) => uc.card_id)
        );
        setOwnedCardIds(owned);

        const { data: progress } = await supabase
          .from("user_series_progress")
          .select("*")
          .eq("user_id", user.id)
          .eq("series_id", id)
          .single();

        if (progress) {
          setCompleted(progress.completed);
          setRewardClaimed(progress.reward_claimed);
        }
      }

      setLoading(false);
    }

    fetchData();
  }, [id, user]);

  const handleClaim = async () => {
    setClaiming(true);
    const res = await fetch("/api/series/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seriesId: id }),
    });

    if (res.ok) {
      setRewardClaimed(true);
    }
    setClaiming(false);
  };

  if (loading) return <Loading>Chargement...</Loading>;
  if (!series) return <Loading>Série non trouvée</Loading>;

  const collectedCount = cards.filter((c) => ownedCardIds.has(c.id)).length;
  const percent = Math.min((collectedCount / series.total_cards) * 100, 100);

  return (
    <Page>
      <Header>
        <Title>{series.name}</Title>
        <Description>{series.description}</Description>

        <ProgressBar>
          <ProgressFill $percent={percent} />
        </ProgressBar>
        <ProgressText>
          {collectedCount} / {series.total_cards} cartes collectées (
          {Math.round(percent)}%)
        </ProgressText>
      </Header>

      <RewardSection>
        <RewardTitle>Récompense de série</RewardTitle>
        <RewardDesc>{series.reward_desc || series.reward_type}</RewardDesc>
        {completed && !rewardClaimed && (
          <Button onClick={handleClaim} disabled={claiming}>
            {claiming ? "Réclamation..." : "Réclamer la récompense"}
          </Button>
        )}
        {rewardClaimed && (
          <Button $variant="ghost" disabled>
            Récompense réclamée
          </Button>
        )}
        {!completed && (
          <Button $variant="ghost" disabled>
            Série incomplète
          </Button>
        )}
      </RewardSection>

      <SectionTitle>Cartes de la série</SectionTitle>
      <CardGrid
        cards={cards.map((card) => ({
          card,
          quantity: ownedCardIds.has(card.id) ? 1 : 0,
        }))}
      />
    </Page>
  );
}
