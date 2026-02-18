"use client";

import { use } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useChronicles } from "@/hooks/use-chronicles";
import { NodeMap } from "@/components/chronicles/node-map";
import { LoadingState } from "@/components/ui/skeleton-loader";
import { theme, alpha } from "@/lib/theme";
import { fadeInUp } from "@/lib/animations";

const Page = styled.div`
  max-width: 900px;
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

const Header = styled.div`
  text-align: center;
  padding: 30px 0;
  animation: ${fadeInUp} 0.5s ease-out;
`;

const ArcRegion = styled.div<{ $region?: string | null }>`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ $region }) => {
    switch ($region) {
      case "neon_ruins": return "#A78BFA";
      case "ash_desert": return "#F59E0B";
      case "toxic_ocean": return "#34D399";
      default: return theme.colors.primary;
    }
  }};
  margin-bottom: 8px;
`;

const ArcTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: clamp(1.6rem, 3.5vw, 2.2rem);
  color: ${theme.colors.text};
  margin-bottom: 12px;
`;

const ArcDescription = styled.p`
  font-size: 1rem;
  color: ${theme.colors.textMuted};
  font-style: italic;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ProgressOverview = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
`;

const ProgressStat = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 10px;
  background: ${alpha(theme.colors.primary, 0.06)};
  font-size: 0.82rem;
  font-weight: 600;
  color: ${theme.colors.textMuted};
`;

const StatValue = styled.span`
  color: ${theme.colors.primary};
  font-family: ${theme.fonts.mono};
`;

const Separator = styled.div`
  height: 1px;
  margin: 0 0 30px;
  background: ${theme.gradients.separator};
`;

const NotFound = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${theme.colors.textMuted};
  font-size: 1rem;
`;

const REGION_LABELS: Record<string, string> = {
  neon_ruins: "Ruines de Néon",
  ash_desert: "Désert de Cendres",
  toxic_ocean: "Océan Toxique",
};

export default function ArcPage({ params }: { params: Promise<{ arcSlug: string }> }) {
  const { arcSlug } = use(params);
  const { arcs, loading, completeNode } = useChronicles();

  if (loading) return <LoadingState text="Chargement de l'arc..." />;

  const arc = arcs.find((a) => a.slug === arcSlug);

  if (!arc) {
    return (
      <Page>
        <BackLink href="/chronicles">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Retour
        </BackLink>
        <NotFound>Arc non trouvé.</NotFound>
      </Page>
    );
  }

  const percent = arc.totalNodes > 0 ? Math.round((arc.completedNodes / arc.totalNodes) * 100) : 0;
  const regionLabel = arc.region ? REGION_LABELS[arc.region] || arc.region : "Multi-Faction";

  return (
    <Page>
      <BackLink href="/chronicles">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Chroniques
      </BackLink>

      <Header>
        <ArcRegion $region={arc.region}>{regionLabel}</ArcRegion>
        <ArcTitle>{arc.name}</ArcTitle>
        <ArcDescription>{arc.description}</ArcDescription>
        <ProgressOverview>
          <ProgressStat>
            Progression : <StatValue>{percent}%</StatValue>
          </ProgressStat>
          <ProgressStat>
            Noeuds : <StatValue>{arc.completedNodes}/{arc.totalNodes}</StatValue>
          </ProgressStat>
        </ProgressOverview>
      </Header>

      <Separator />

      <NodeMap chapters={arc.chapters} onCompleteNode={completeNode} />
    </Page>
  );
}
