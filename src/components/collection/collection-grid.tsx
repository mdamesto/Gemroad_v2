"use client";

import styled from "styled-components";
import { CardItem, type CollectionCardData } from "./card-item";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  justify-items: center;

  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;
  }
`;

const Empty = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #8888aa;
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
