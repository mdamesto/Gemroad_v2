"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styled from "styled-components";
import { useUser } from "@/hooks/use-user";
import { useToastStore } from "@/stores/toast-store";
import { createClient } from "@/lib/supabase/client";
import { CardGrid } from "@/components/cards/card-grid";
import { GlowButton } from "@/components/ui/glow-button";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/skeleton-loader";
import { BackButton } from "@/components/ui/back-button";
import { theme } from "@/lib/theme";
import { fadeInUp } from "@/lib/animations";
import type { Card, Series } from "@/types/cards";

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 40px;
`;

const ContentArea = styled.div`
  animation: ${fadeInUp} 0.5s ease-out 0.2s both;
`;

const ProgressRingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const ProgressRingSvg = styled.svg`
  width: 80px;
  height: 80px;
  transform: rotate(-90deg);
`;

const ProgressPercent = styled.span`
  font-size: 1.1rem;
  font-weight: 800;
  color: ${theme.colors.text};
`;

const ProgressText = styled.p`
  font-size: 0.85rem;
  color: ${theme.colors.textMuted};
  text-align: center;
  margin-top: 4px;
`;

const RewardSection = styled(GlassCard)`
  margin-bottom: 32px;
  max-width: 500px;
  border-color: ${theme.colors.accent}30;
`;

const RewardTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 1rem;
  font-weight: 700;
  color: ${theme.colors.accent};
  margin-bottom: 8px;
`;

const RewardDesc = styled.p`
  font-size: 0.9rem;
  color: ${theme.colors.textMuted};
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: ${theme.colors.text};
`;

const StatusTag = styled.span<{ $variant: "success" | "muted" }>`
  display: inline-block;
  padding: 6px 16px;
  border-radius: ${theme.radii.full};
  font-size: 0.8rem;
  font-weight: 600;
  ${(p) =>
    p.$variant === "success"
      ? `background: ${theme.colors.success}20; color: ${theme.colors.success}; border: 1px solid ${theme.colors.success}40;`
      : `background: ${theme.colors.border}; color: ${theme.colors.textMuted}; border: 1px solid ${theme.colors.border};`}
`;

const TrophyIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 22V9" /><path d="M14 22V9" /><rect x="6" y="2" width="12" height="7" rx="1" />
  </svg>
);

export default function SeriesDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const addToast = useToastStore((s) => s.addToast);
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
      addToast("Récompense de série réclamée !", "success");
    } else {
      addToast("Erreur lors de la réclamation", "error");
    }
    setClaiming(false);
  };

  if (loading) return <LoadingState text="Chargement de la série..." />;
  if (!series) return <LoadingState text="Série non trouvée" />;

  const collectedCount = cards.filter((c) => ownedCardIds.has(c.id)).length;
  const percent = Math.min((collectedCount / series.total_cards) * 100, 100);
  const circumference = 2 * Math.PI * 32;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <Page>
      <BackButton />
      <PageHeader title={series.name} subtitle={series.description || undefined}>
        <ProgressRingContainer>
          <ProgressRingSvg viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="32" fill="none" stroke={theme.colors.border} strokeWidth="4" />
            <circle
              cx="36" cy="36" r="32"
              fill="none"
              stroke={completed ? theme.colors.accent : theme.colors.primary}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
          </ProgressRingSvg>
          <div>
            <ProgressPercent>{Math.round(percent)}%</ProgressPercent>
            <ProgressText>
              {collectedCount} / {series.total_cards} cartes
            </ProgressText>
          </div>
        </ProgressRingContainer>
      </PageHeader>

      <ContentArea>
        <RewardSection>
          <RewardTitle>Récompense de série</RewardTitle>
          <RewardDesc>{series.reward_desc || series.reward_type}</RewardDesc>
          {completed && !rewardClaimed && (
            <GlowButton
              $variant="accent"
              onClick={handleClaim}
              disabled={claiming}
              loading={claiming}
              icon={TrophyIcon}
            >
              Réclamer la récompense
            </GlowButton>
          )}
          {rewardClaimed && <StatusTag $variant="success">Récompense réclamée</StatusTag>}
          {!completed && <StatusTag $variant="muted">Série incomplète</StatusTag>}
        </RewardSection>

        <SectionTitle>Cartes de la série</SectionTitle>
        <CardGrid
          cards={cards.map((card) => ({
            card,
            quantity: ownedCardIds.has(card.id) ? 1 : 0,
          }))}
        />
      </ContentArea>
    </Page>
  );
}
