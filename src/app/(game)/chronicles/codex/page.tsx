"use client";

import styled from "styled-components";
import Link from "next/link";
import { useChronicles } from "@/hooks/use-chronicles";

import { GlassCard } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/skeleton-loader";
import { theme, alpha } from "@/lib/theme";
import { fadeInUp } from "@/lib/animations";

const Page = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px 40px;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 0;
  margin-top: 20px;
  color: ${theme.colors.textMuted};
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: color 0.2s;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    color: ${theme.colors.text};
  }
`;

const ArcGroup = styled.div`
  margin-bottom: 32px;
  animation: ${fadeInUp} 0.4s ease-out;
`;

const ArcGroupTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: 1.1rem;
  color: ${theme.colors.text};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${alpha(theme.colors.primary, 0.15)};
  }
`;

const EntryCard = styled(GlassCard)<{ $locked: boolean }>`
  margin-bottom: 12px;
  padding: 16px 20px;
  opacity: ${(p) => (p.$locked ? 0.5 : 1)};
`;

const EntryTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${theme.colors.text};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LockIcon = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.textMuted};
`;

const EntryText = styled.div`
  font-size: 0.85rem;
  color: ${theme.colors.textMuted};
  line-height: 1.6;
  font-style: italic;
  border-left: 3px solid ${alpha(theme.colors.accent, 0.3)};
  padding-left: 14px;
`;

const LockedText = styled.div`
  font-size: 0.85rem;
  color: ${alpha(theme.colors.textMuted, 0.5)};
  font-style: italic;
`;

const Stats = styled.div`
  text-align: center;
  padding: 12px;
  color: ${theme.colors.textMuted};
  font-size: 0.85rem;
  margin-bottom: 20px;
`;

export default function CodexPage() {
  const { codex, loading } = useChronicles();

  if (loading) return <LoadingState text="Chargement du codex..." />;

  // Group by arc
  const grouped = new Map<string, typeof codex>();
  for (const entry of codex) {
    const group = grouped.get(entry.arc_name) || [];
    group.push(entry);
    grouped.set(entry.arc_name, group);
  }

  const totalEntries = codex.length;
  const unlockedEntries = codex.filter((e) => e.unlocked).length;

  return (
    <Page>
      <BackLink href="/chronicles">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Chroniques
      </BackLink>

      <Stats>
        {unlockedEntries} / {totalEntries} fragments découverts
      </Stats>

      {Array.from(grouped.entries()).map(([arcName, entries]) => (
        <ArcGroup key={arcName}>
          <ArcGroupTitle>{arcName}</ArcGroupTitle>
          {entries.map((entry) => (
            <EntryCard key={entry.node_id} $locked={!entry.unlocked}>
              <EntryTitle>
                {entry.unlocked ? entry.title : "???"}
                {!entry.unlocked && <LockIcon>🔒</LockIcon>}
              </EntryTitle>
              {entry.unlocked ? (
                <EntryText>{entry.codex_entry}</EntryText>
              ) : (
                <LockedText>Complétez le noeud pour découvrir ce fragment...</LockedText>
              )}
            </EntryCard>
          ))}
        </ArcGroup>
      ))}

      {codex.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: theme.colors.textMuted }}>
          Aucun fragment de lore disponible. Commencez votre aventure dans les Chroniques !
        </div>
      )}
    </Page>
  );
}
