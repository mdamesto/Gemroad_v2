"use client";

import styled from "styled-components";
import Link from "next/link";
import { useChronicles } from "@/hooks/use-chronicles";
import { ArcCard } from "@/components/chronicles/arc-card";

import { LoadingState } from "@/components/ui/skeleton-loader";
import { theme, alpha } from "@/lib/theme";

const Page = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px 40px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
`;

const CodexLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 10px;
  background: ${alpha(theme.colors.primary, 0.08)};
  color: ${theme.colors.primary};
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: ${alpha(theme.colors.primary, 0.15)};
  }
`;

const ArcsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

export default function ChroniclesPage() {
  const { arcs, loading } = useChronicles();

  if (loading) return <LoadingState text="Chargement des chroniques..." />;

  return (
    <Page>
      <TopBar>
        <CodexLink href="/chronicles/codex">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          Codex
        </CodexLink>
      </TopBar>

      <ArcsGrid>
        {arcs.map((arc, i) => (
          <ArcCard key={arc.id} arc={arc} index={i} />
        ))}
      </ArcsGrid>
    </Page>
  );
}
