"use client";

import styled from "styled-components";

import { LoadingState } from "@/components/ui/skeleton-loader";
import { useFactions } from "@/hooks/use-factions";
import { FactionCard } from "@/components/factions/faction-card";

const Page = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
  margin-top: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export default function FactionsPage() {
  const { factions, loading } = useFactions();

  if (loading) return <LoadingState text="Chargement de l'encyclopédie..." />;

  return (
    <Page>
      <Grid>
        {factions.map((faction, i) => (
          <FactionCard key={faction.slug} faction={faction} index={i} />
        ))}
      </Grid>
    </Page>
  );
}
