"use client";

import styled from "styled-components";
import { CardItem, type CollectionCardData } from "./card-item";
import { theme } from "@/lib/theme";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  justify-items: center;

  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
    gap: 14px;
  }
`;

const Empty = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: ${theme.colors.textMuted};
  font-size: 1.1rem;
`;

interface CollectionGridProps {
  cards: CollectionCardData[];
  onCardClick: (data: CollectionCardData) => void;
}

export function CollectionGrid({ cards, onCardClick }: CollectionGridProps) {
  if (cards.length === 0) {
    return (
      <Grid>
        <Empty>Aucune carte trouvée avec ces filtres.</Empty>
      </Grid>
    );
  }

  return (
    <Grid>
      {cards.map((data) => (
        <CardItem key={data.card.id} data={data} onClick={() => onCardClick(data)} />
      ))}
    </Grid>
  );
}
