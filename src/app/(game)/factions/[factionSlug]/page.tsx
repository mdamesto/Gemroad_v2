"use client";

import { useParams } from "next/navigation";
import styled from "styled-components";
import { BackButton } from "@/components/ui/back-button";
import { GlassCard } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/skeleton-loader";
import { useFactionDetail } from "@/hooks/use-faction-detail";
import { FactionCardGallery } from "@/components/factions/faction-card-gallery";
import { theme, alpha } from "@/lib/theme";
import { RARITY_COLORS } from "@/lib/constants";
import type { Rarity } from "@/lib/constants";
import { fadeInUp } from "@/lib/animations";
import Link from "next/link";

const Page = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 16px;
`;

const FactionHeader = styled.div<{ $color: string }>`
  text-align: center;
  margin-bottom: 32px;
  animation: ${fadeInUp} 0.5s ease-out;

  h1 {
    font-family: ${theme.fonts.heading};
    font-size: clamp(1.6rem, 4vw, 2.2rem);
    color: ${({ $color }) => $color};
    margin: 0 0 8px;
  }
`;

const Motto = styled.p`
  font-style: italic;
  color: ${theme.colors.textMuted};
  font-size: 1rem;
  margin: 0 0 12px;
`;

const LeaderInfo = styled.p`
  font-size: 0.88rem;
  color: ${theme.colors.textMuted};
  margin: 0;

  strong {
    color: ${theme.colors.text};
  }
`;

const Section = styled.section`
  margin-top: 32px;
  animation: ${fadeInUp} 0.5s ease-out both;
`;

const SectionTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: 1.2rem;
  color: ${theme.colors.text};
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${theme.gradients.separator};
  }
`;

const LoreText = styled.p`
  color: ${theme.colors.textMuted};
  font-size: 0.92rem;
  line-height: 1.7;
  margin: 0;
`;

const StatsBar = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div<{ $color?: string }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ $color }) => $color || theme.colors.text};
`;

const StatLabel = styled.div`
  font-size: 0.78rem;
  color: ${theme.colors.textMuted};
  margin-top: 2px;
`;

const ProgressContainer = styled.div`
  flex: 1;
  min-width: 200px;
`;

const ProgressTrack = styled.div`
  height: 8px;
  background: var(--white-alpha-006);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percent: number; $color: string }>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background: ${({ $color }) => $color};
  border-radius: 4px;
  transition: width 0.6s ease;
`;

const ProgressLabel = styled.div`
  font-size: 0.78rem;
  color: ${theme.colors.textMuted};
  margin-top: 4px;
  text-align: right;
`;

const NotableGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const NotableCard = styled(GlassCard)<{ $rarityColor: string }>`
  border-top: 2px solid ${({ $rarityColor }) => $rarityColor};
`;

const NotableName = styled.h4<{ $color: string }>`
  font-family: ${theme.fonts.heading};
  font-size: 1rem;
  color: ${({ $color }) => $color};
  margin: 0 0 8px;
`;

const NotableLore = styled.p`
  font-size: 0.84rem;
  color: ${theme.colors.textMuted};
  line-height: 1.5;
  margin: 0;
  font-style: italic;
`;

const BadgeList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Badge = styled.span<{ $color?: string }>`
  padding: 6px 14px;
  border-radius: ${theme.radii.full};
  background: ${({ $color }) => $color ? alpha($color, 0.12) : "var(--white-alpha-006)"};
  color: ${({ $color }) => $color || theme.colors.textMuted};
  font-size: 0.82rem;
  font-weight: 500;
`;

const ArcLink = styled(Link)<{ $color?: string }>`
  display: block;
  padding: 12px 16px;
  border-radius: ${theme.radii.lg};
  background: var(--white-alpha-004);
  border-left: 3px solid ${({ $color }) => $color || theme.colors.primary};
  text-decoration: none;
  color: ${theme.colors.text};
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: var(--white-alpha-006);
    transform: translateX(4px);
  }

  span {
    display: block;
    font-size: 0.8rem;
    color: ${theme.colors.textMuted};
    margin-top: 4px;
    font-weight: 400;
  }
`;

const ArcList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EmptyText = styled.p`
  color: ${theme.colors.textMuted};
  font-size: 0.88rem;
  font-style: italic;
`;

export default function FactionDetailPage() {
  const params = useParams();
  const factionSlug = params.factionSlug as string;
  const { data, loading } = useFactionDetail(factionSlug);

  if (loading) return <LoadingState text="Chargement de la faction..." />;
  if (!data) return <LoadingState text="Faction introuvable" />;

  const { faction, cards, notableCards, talentTree, storyArcs, stats } = data;

  return (
    <Page>
      <BackButton label="Factions" />

      <FactionHeader $color={faction.color}>
        <h1>{faction.name}</h1>
        {faction.motto && <Motto>&laquo; {faction.motto} &raquo;</Motto>}
        {faction.leader_name && (
          <LeaderInfo>
            <strong>{faction.leader_name}</strong>
            {faction.leader_title && ` — ${faction.leader_title}`}
          </LeaderInfo>
        )}
      </FactionHeader>

      <Section>
        <SectionTitle>Lore</SectionTitle>
        <LoreText>{faction.lore}</LoreText>
      </Section>

      <Section>
        <SectionTitle>Statistiques</SectionTitle>
        <GlassCard>
          <StatsBar>
            <StatItem>
              <StatNumber>{stats.totalCards}</StatNumber>
              <StatLabel>Cartes totales</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber $color={faction.color}>{stats.ownedCards}</StatNumber>
              <StatLabel>Possédées</StatLabel>
            </StatItem>
            <ProgressContainer>
              <ProgressTrack>
                <ProgressFill $percent={stats.completionPercent} $color={faction.color} />
              </ProgressTrack>
              <ProgressLabel>{stats.completionPercent}% complété</ProgressLabel>
            </ProgressContainer>
          </StatsBar>
        </GlassCard>
      </Section>

      <Section>
        <SectionTitle>Cartes</SectionTitle>
        <FactionCardGallery cards={cards} accentColor={faction.color} />
      </Section>

      {notableCards.length > 0 && (
        <Section>
          <SectionTitle>Personnages Notables</SectionTitle>
          <NotableGrid>
            {notableCards.map((card: { id: string; name: string; rarity: Rarity; lore: string }) => (
              <NotableCard key={card.id} $rarityColor={RARITY_COLORS[card.rarity]}>
                <NotableName $color={RARITY_COLORS[card.rarity]}>{card.name}</NotableName>
                <NotableLore>{card.lore}</NotableLore>
              </NotableCard>
            ))}
          </NotableGrid>
        </Section>
      )}

      {talentTree && (
        <Section>
          <SectionTitle>Arbre de Talents</SectionTitle>
          <BadgeList>
            <Badge $color={faction.color}>{talentTree.name}</Badge>
            {talentTree.talents?.length > 0 && (
              <Badge>{talentTree.talents.length} talents</Badge>
            )}
          </BadgeList>
        </Section>
      )}

      <Section>
        <SectionTitle>Arcs Narratifs</SectionTitle>
        {storyArcs.length > 0 ? (
          <ArcList>
            {storyArcs.map((arc: { id: string; slug: string; name: string; description: string }) => (
              <ArcLink key={arc.id} href={`/chronicles/${arc.slug}`} $color={faction.color}>
                {arc.name}
                <span>{arc.description}</span>
              </ArcLink>
            ))}
          </ArcList>
        ) : (
          <EmptyText>Aucun arc narratif lié à cette faction pour le moment.</EmptyText>
        )}
      </Section>
    </Page>
  );
}
