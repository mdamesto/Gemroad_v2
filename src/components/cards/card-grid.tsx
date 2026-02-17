"use client";

import styled from "styled-components";
import { CardDisplay } from "./card-display";
import type { Card } from "@/types/cards";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  justify-items: center;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #8888aa;
  font-size: 1.1rem;
`;

interface CardGridProps {
  cards: Array<{ card: Card; quantity?: number }>;
  onCardClick?: (card: Card) => void;
  emptyMessage?: string;
}

export function CardGrid({
  cards,
  onCardClick,
  emptyMessage = "Aucune carte trouvée",
}: CardGridProps) {
  if (cards.length === 0) {
    return (
      <Grid>
        <EmptyState>{emptyMessage}</EmptyState>
      </Grid>
    );
  }

  return (
    <Grid>
      {cards.map(({ card, quantity }) => (
        <CardDisplay
          key={card.id}
          card={card}
          quantity={quantity}
          onClick={onCardClick ? () => onCardClick(card) : undefined}
        />
      ))}
    </Grid>
  );
}
