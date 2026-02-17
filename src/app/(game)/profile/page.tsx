"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { useUser } from "@/hooks/use-user";
import { useCurrency } from "@/hooks/use-currency";
import { createClient } from "@/lib/supabase/client";
import { xpToNextLevel } from "@/lib/utils";

const Page = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 24px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 32px;
`;

const ProfileCard = styled.div`
  background: #12121a;
  border: 1px solid #2a2a35;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
`;

const Username = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 4px;
`;

const Email = styled.p`
  color: #8888aa;
  font-size: 0.9rem;
  margin-bottom: 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
`;

const StatBox = styled.div`
  background: #1a1a25;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
`;

const StatValue = styled.div<{ $color?: string }>`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${(p) => p.$color || "#e5e5e5"};
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #8888aa;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const LevelBar = styled.div`
  margin-top: 20px;
`;

const LevelLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 8px;
  color: #8888aa;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #2a2a35;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${(p) => p.$percent}%;
  background: #e63946;
  border-radius: 4px;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 16px;
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #12121a;
  border: 1px solid #2a2a35;
  border-radius: 8px;
  font-size: 0.85rem;
`;

const TransactionAmount = styled.span<{ $positive: boolean }>`
  font-weight: 700;
  color: ${(p) => (p.$positive ? "#2a9d8f" : "#e63946")};
`;

const TransactionDate = styled.span`
  color: #555566;
  font-size: 0.75rem;
`;

const Loading = styled.div`
  text-align: center;
  padding: 60px;
  color: #8888aa;
`;

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  created_at: string;
}

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

  if (userLoading || loading) return <Loading>Chargement...</Loading>;
  if (!user || !profile) return <Loading>Connectez-vous pour voir votre profil.</Loading>;

  const xpInLevel = profile.xp % 100;
  const xpNeeded = xpToNextLevel(profile.xp);

  return (
    <Page>
      <Title>Profil</Title>

      <ProfileCard>
        <Username>{profile.username}</Username>
        <Email>{user.email}</Email>

        <StatsGrid>
          <StatBox>
            <StatValue $color="#f4a261">{balance}</StatValue>
            <StatLabel>Gems</StatLabel>
          </StatBox>
          <StatBox>
            <StatValue $color="#e63946">{profile.level}</StatValue>
            <StatLabel>Niveau</StatLabel>
          </StatBox>
          <StatBox>
            <StatValue>{stats.uniqueCards}</StatValue>
            <StatLabel>Cartes uniques</StatLabel>
          </StatBox>
          <StatBox>
            <StatValue>{stats.boostersOpened}</StatValue>
            <StatLabel>Boosters ouverts</StatLabel>
          </StatBox>
          <StatBox>
            <StatValue $color="#2a9d8f">{stats.seriesCompleted}</StatValue>
            <StatLabel>Séries complétées</StatLabel>
          </StatBox>
          <StatBox>
            <StatValue>{stats.totalCards}</StatValue>
            <StatLabel>Cartes totales</StatLabel>
          </StatBox>
        </StatsGrid>

        <LevelBar>
          <LevelLabel>
            <span>Niveau {profile.level}</span>
            <span>
              {xpInLevel} / 100 XP ({xpNeeded} XP restants)
            </span>
          </LevelLabel>
          <ProgressBar>
            <ProgressFill $percent={xpInLevel} />
          </ProgressBar>
        </LevelBar>
      </ProfileCard>

      <ProfileCard>
        <SectionTitle>Dernières transactions</SectionTitle>
        {transactions.length === 0 ? (
          <p style={{ color: "#8888aa", fontSize: "0.9rem" }}>
            Aucune transaction
          </p>
        ) : (
          <TransactionList>
            {transactions.map((t) => (
              <TransactionItem key={t.id}>
                <div>
                  <div>{t.description || t.type}</div>
                  <TransactionDate>
                    {new Date(t.created_at).toLocaleDateString("fr-FR")}
                  </TransactionDate>
                </div>
                <TransactionAmount $positive={t.amount > 0}>
                  {t.amount > 0 ? "+" : ""}
                  {t.amount}
                </TransactionAmount>
              </TransactionItem>
            ))}
          </TransactionList>
        )}
      </ProfileCard>
    </Page>
  );
}
