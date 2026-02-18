"use client";

import styled from "styled-components";

import { LoadingState } from "@/components/ui/skeleton-loader";
import { useWorldMap } from "@/hooks/use-world-map";
import { RegionCard } from "@/components/world-map/region-card";

const Page = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 24px;
`;

export default function WorldMapPage() {
  const { regions, loading } = useWorldMap();

  if (loading) return <LoadingState text="Chargement de la carte..." />;

  return (
    <Page>
      <Grid>
        {regions.map((region, i) => (
          <RegionCard key={region.slug} region={region} index={i} />
        ))}
      </Grid>
    </Page>
  );
}
