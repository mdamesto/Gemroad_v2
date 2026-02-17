"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { useUser } from "@/hooks/use-user";
import { useCurrency } from "@/hooks/use-currency";
import { createClient } from "@/lib/supabase/client";
import { xpToNextLevel } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/skeleton-loader";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { theme } from "@/lib/theme";
import { fadeInUp, gradientShift } from "@/lib/animations";

const Page = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px 40px;
`;

const ContentArea = styled.div`
  animation: ${fadeInUp} 0.5s ease-out 0.2s both;
`;

const HeroCard = styled(GlassCard)`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding: 28px;
`;

const AvatarCircle = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${theme.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  font-weight: 800;
  color: white;
  text-transform: uppercase;
  flex-shrink: 0;
  box-shadow: 0 0 20px ${theme.colors.primary}30;
`;

const HeroInfo = styled.div`
  flex: 1;
`;

const Username = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2px;
  letter-spacing: 0.02em;
`;

const Email = styled.p`
  color: ${theme.colors.textMuted};
  font-size: 0.85rem;
  margin-bottom: 8px;
`;

const LevelBadge = styled.span`
  display: inline-block;
  padding: 3px 12px;
  border-radius: ${theme.radii.full};
  font-size: 0.75rem;
  font-weight: 700;
  background: ${theme.colors.primary}20;
  color: ${theme.colors.primary};
  border: 1px solid ${theme.colors.primary}40;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
`;

const StatBox = styled(GlassCard)`
  text-align: center;
  padding: 16px;
`;

const StatIconCircle = styled.div<{ $color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${(p) => p.$color}15;
  border: 1px solid ${(p) => p.$color}30;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;

  svg {
    width: 18px;
    height: 18px;
    color: ${(p) => p.$color};
  }
`;

const StatValue = styled.div<{ $color?: string }>`
  font-size: 1.4rem;
  font-weight: 800;
  color: ${(p) => p.$color || theme.colors.text};
`;

const StatLabel = styled.div`
  font-size: 0.7rem;
  color: ${theme.colors.textMuted};
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const XpSection = styled(GlassCard)`
  margin-bottom: 24px;
  padding: 20px 24px;
`;

const XpLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 10px;
  color: ${theme.colors.textMuted};
`;

const XpTrack = styled.div`
  height: 12px;
  background: ${theme.colors.border};
  border-radius: 6px;
  overflow: hidden;
`;

const XpFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${(p) => p.$percent}%;
  background: linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent});
  background-size: 200% 100%;
  animation: ${gradientShift} 3s ease infinite;
  border-radius: 6px;
  transition: width 0.5s ease-out;
`;

const SectionTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${theme.colors.text};
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TransactionItem = styled(GlassCard)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
`;

const TransactionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TransactionIcon = styled.div<{ $positive: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${(p) => (p.$positive ? `${theme.colors.success}15` : `${theme.colors.primary}15`)};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
    color: ${(p) => (p.$positive ? theme.colors.success : theme.colors.primary)};
  }
`;

const TransactionDesc = styled.div`
  font-size: 0.85rem;
  color: ${theme.colors.text};
`;

const TransactionDate = styled.div`
  font-size: 0.72rem;
  color: ${theme.colors.textMuted};
`;

const TransactionAmount = styled.span<{ $positive: boolean }>`
  font-weight: 700;
  color: ${(p) => (p.$positive ? theme.colors.success : theme.colors.primary)};
`;

const EmptyText = styled.p`
  color: ${theme.colors.textMuted};
  font-size: 0.9rem;
`;

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  created_at: string;
}

const TYPE_ICONS: Record<string, boolean> = {
  reward: true,
  achievement: true,
  series_reward: true,
};

export default function ProfilePage() {
  const { user, profile, loading: userLoading } = useUser();
  const { balance } = useCurrency(user?.id);
  const [stats, setStats] = useState({
    totalCards: 0,
    uniqueCards: 0,
    boostersOpened: 0,
    seriesCompleted: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      const supabase = createClient();

      const { count: uniqueCards } = await supabase
        .from("user_cards")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id);

      const { data: userCards } = await supabase
        .from("user_cards")
        .select("quantity")
        .eq("user_id", user!.id);

      const totalCards = (userCards || []).reduce(
        (sum: number, uc: { quantity: number }) => sum + uc.quantity,
        0
      );

      const { count: boostersOpened } = await supabase
        .from("user_boosters")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .not("opened_at", "is", null);

      const { count: seriesCompleted } = await supabase
        .from("user_series_progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .eq("completed", true);

      setStats({
        totalCards,
        uniqueCards: uniqueCards || 0,
        boostersOpened: boostersOpened || 0,
        seriesCompleted: seriesCompleted || 0,
      });

      const { data: txns } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(10);

      setTransactions((txns as Transaction[]) || []);
      setLoading(false);
    }

    fetchData();
  }, [user]);

  if (userLoading || loading) return <LoadingState />;
  if (!user || !profile) return <LoadingState text="Connectez-vous pour voir votre profil." />;

  const xpInLevel = profile.xp % 100;
  const xpNeeded = xpToNextLevel(profile.xp);

  return (
    <Page>
      <PageHeader title="Profil" />

      <ContentArea>
        <HeroCard>
          <AvatarCircle>
            {profile.username?.charAt(0) || "?"}
          </AvatarCircle>
          <HeroInfo>
            <Username>{profile.username}</Username>
            <Email>{user.email}</Email>
            <LevelBadge>Niveau {profile.level}</LevelBadge>
          </HeroInfo>
        </HeroCard>

        <StatsGrid>
          <StatBox>
            <StatIconCircle $color={theme.colors.accent}>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 9l10 13L22 9 12 2z" /></svg>
            </StatIconCircle>
            <StatValue $color={theme.colors.accent}>
              <AnimatedCounter value={balance} color={theme.colors.accent} />
            </StatValue>
            <StatLabel>Gems</StatLabel>
          </StatBox>
          <StatBox>
            <StatIconCircle $color={theme.colors.primary}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            </StatIconCircle>
            <StatValue $color={theme.colors.primary}>{profile.level}</StatValue>
            <StatLabel>Niveau</StatLabel>
          </StatBox>
          <StatBox>
            <StatIconCircle $color={theme.colors.rare}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
            </StatIconCircle>
            <StatValue>{stats.uniqueCards}</StatValue>
            <StatLabel>Cartes uniques</StatLabel>
          </StatBox>
          <StatBox>
            <StatIconCircle $color={theme.colors.epic}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
            </StatIconCircle>
            <StatValue>{stats.boostersOpened}</StatValue>
            <StatLabel>Boosters ouverts</StatLabel>
          </StatBox>
          <StatBox>
            <StatIconCircle $color={theme.colors.success}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
            </StatIconCircle>
            <StatValue $color={theme.colors.success}>{stats.seriesCompleted}</StatValue>
            <StatLabel>Séries complétées</StatLabel>
          </StatBox>
          <StatBox>
            <StatIconCircle $color={theme.colors.textMuted}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
            </StatIconCircle>
            <StatValue>{stats.totalCards}</StatValue>
            <StatLabel>Cartes totales</StatLabel>
          </StatBox>
        </StatsGrid>

        <XpSection>
          <XpLabels>
            <span>Niveau {profile.level} → {profile.level + 1}</span>
            <span>{xpInLevel} / 100 XP ({xpNeeded} XP restants)</span>
          </XpLabels>
          <XpTrack>
            <XpFill $percent={xpInLevel} />
          </XpTrack>
        </XpSection>

        <GlassCard $padding="24px">
          <SectionTitle>Dernières transactions</SectionTitle>
          {transactions.length === 0 ? (
            <EmptyText>Aucune transaction</EmptyText>
          ) : (
            <TransactionList>
              {transactions.map((t) => {
                const isPositive = t.amount > 0;
                return (
                  <TransactionItem key={t.id} $padding="12px 16px">
                    <TransactionInfo>
                      <TransactionIcon $positive={isPositive}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          {isPositive ? (
                            <path d="M12 2L2 9l10 13L22 9 12 2z" />
                          ) : (
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                          )}
                        </svg>
                      </TransactionIcon>
                      <div>
                        <TransactionDesc>{t.description || t.type}</TransactionDesc>
                        <TransactionDate>
                          {new Date(t.created_at).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </TransactionDate>
                      </div>
                    </TransactionInfo>
                    <TransactionAmount $positive={isPositive}>
                      {isPositive ? "+" : ""}{t.amount}
                    </TransactionAmount>
                  </TransactionItem>
                );
              })}
            </TransactionList>
          )}
        </GlassCard>
      </ContentArea>
    </Page>
  );
}
