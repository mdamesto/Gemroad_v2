"use client";

import { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";

import { GlassCard } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/skeleton-loader";
import { theme, alpha } from "@/lib/theme";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  max-width: 800px;
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

const TopThree = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 28px;
  flex-wrap: wrap;
`;

const TopCard = styled(GlassCard)<{ $rank: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 20px;
  min-width: 140px;
  order: ${(p) => (p.$rank === 1 ? 0 : p.$rank === 2 ? -1 : 1)};

  ${(p) =>
    p.$rank === 1 &&
    css`
      transform: scale(1.05);
      box-shadow: 0 0 24px ${alpha("#FBBF24", 0.2)};
    `}
`;

const Medal = styled.div<{ $rank: number }>`
  font-size: 2rem;
  margin-bottom: 8px;
`;

const TopAvatar = styled.div<{ $rank: number }>`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: ${(p) =>
    p.$rank === 1
      ? "linear-gradient(135deg, #FBBF24, #F59E0B)"
      : p.$rank === 2
        ? "linear-gradient(135deg, #94A3B8, #CBD5E1)"
        : "linear-gradient(135deg, #D97706, #B45309)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: white;
  font-size: 1.2rem;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const TopName = styled.div`
  font-weight: 700;
  font-size: 0.95rem;
  color: ${theme.colors.text};
  margin-bottom: 4px;
`;

const TopValue = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  color: ${theme.colors.primary};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Row = styled.div<{ $isUser: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: 12px;
  background: ${(p) => (p.$isUser ? alpha(theme.colors.primary, 0.06) : theme.colors.bgCard)};
  border: 1px solid ${(p) => (p.$isUser ? alpha(theme.colors.primary, 0.2) : "transparent")};
  animation: ${fadeIn} 0.3s ease-out;
  transition: background 0.2s;

  &:hover {
    background: ${theme.colors.bgHover};
  }
`;

const Rank = styled.div`
  width: 32px;
  font-weight: 800;
  font-size: 0.9rem;
  color: ${theme.colors.textMuted};
  text-align: center;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${theme.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 0.85rem;
  text-transform: uppercase;
  flex-shrink: 0;
`;

const Name = styled.div`
  flex: 1;
  font-weight: 600;
  font-size: 0.9rem;
  color: ${theme.colors.text};
`;

const Level = styled.div`
  font-size: 0.78rem;
  color: ${theme.colors.textMuted};
`;

const Value = styled.div`
  font-weight: 700;
  font-size: 0.95rem;
  color: ${theme.colors.primary};
  min-width: 50px;
  text-align: right;
`;

interface LeaderboardEntry {
  id: string;
  username: string;
  avatar_url: string | null;
  level: number;
  value: number;
  isCurrentUser: boolean;
}

const TAB_LABELS: Record<string, { label: string; valueLabel: string }> = {
  collection: { label: "Collection", valueLabel: "cartes" },
  level: { label: "Niveau", valueLabel: "niv." },
  achievements: { label: "Achievements", valueLabel: "trophées" },
};

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const [tab, setTab] = useState("collection");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?tab=${tab}`)
      .then((r) => r.json())
      .then((data) => {
        setEntries(data.leaderboard || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tab]);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <Page>
      <Tabs>
        {Object.entries(TAB_LABELS).map(([key, { label }]) => (
          <Tab key={key} $active={tab === key} onClick={() => setTab(key)}>
            {label}
          </Tab>
        ))}
      </Tabs>

      {loading ? (
        <LoadingState text="Chargement du classement..." />
      ) : entries.length === 0 ? (
        <div style={{ textAlign: "center", color: theme.colors.textMuted, padding: 40 }}>
          Aucun joueur dans le classement.
        </div>
      ) : (
        <>
          <TopThree>
            {top3.map((entry, i) => (
              <TopCard key={entry.id} $rank={i + 1}>
                <Medal $rank={i + 1}>{MEDALS[i]}</Medal>
                <TopAvatar $rank={i + 1}>
                  {entry.username?.charAt(0) || "?"}
                </TopAvatar>
                <TopName>{entry.username}</TopName>
                <TopValue>
                  {entry.value} {TAB_LABELS[tab].valueLabel}
                </TopValue>
              </TopCard>
            ))}
          </TopThree>

          <List>
            {rest.map((entry, i) => (
              <Row key={entry.id} $isUser={entry.isCurrentUser}>
                <Rank>#{i + 4}</Rank>
                <Avatar>{entry.username?.charAt(0) || "?"}</Avatar>
                <Name>
                  {entry.username}
                  {entry.isCurrentUser && " (vous)"}
                </Name>
                <Level>Niv. {entry.level}</Level>
                <Value>
                  {entry.value} {TAB_LABELS[tab].valueLabel}
                </Value>
              </Row>
            ))}
          </List>
        </>
      )}
    </Page>
  );
}
