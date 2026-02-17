"use client";

import styled, { keyframes } from "styled-components";
import { useGameStore } from "@/stores/game-store";
import { CardDisplay } from "./card-display";
import { RARITY_COLORS, type Rarity } from "@/lib/constants";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const scaleIn = keyframes`
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const Overlay = styled.div<{ $scrollable?: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${(p) => (p.$scrollable ? "flex-start" : "center")};
  z-index: 100;
  animation: ${fadeIn} 0.3s ease;
  overflow-y: auto;
  padding: 40px 20px;
`;

const CardReveal = styled.div`
  animation: ${scaleIn} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

const Counter = styled.div`
  margin-top: 24px;
  color: #94a3b8;
  font-size: 0.9rem;
`;

const ClickHint = styled.div`
  margin-top: 16px;
  color: #94a3b8;
  font-size: 0.85rem;
  animation: ${fadeIn} 0.5s ease 0.5s both;
`;

const AllCardsGrid = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1100px;
  animation: ${scaleIn} 0.4s ease;

  & > * {
    transform: scale(0.85);
    transform-origin: top center;
  }
`;

const CloseButton = styled.button`
  margin-top: 32px;
  margin-bottom: 20px;
  flex-shrink: 0;
  padding: 12px 32px;
  background: #38BDF8;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #0EA5E9;
  }
`;

const RarityFlash = styled.div<{ $rarity: Rarity }>`
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-shadow: inset 0 0 100px ${(p) => RARITY_COLORS[p.$rarity]}30;
  animation: ${fadeIn} 0.3s ease;
`;

export function BoosterAnimation() {
  const { boosterOpen, revealNextCard, closeBoosterOpen } = useGameStore();
  const { isOpening, revealedCards, currentIndex } = boosterOpen;

  if (!isOpening) return null;

  const allRevealed = currentIndex >= revealedCards.length - 1;
  const currentCard = currentIndex >= 0 ? revealedCards[currentIndex] : null;

  const handleClick = () => {
    if (allRevealed) return;
    revealNextCard();
  };

  return (
    <Overlay onClick={handleClick} $scrollable={allRevealed}>
      {currentCard && (
        <RarityFlash $rarity={currentCard.rarity} />
      )}

      {!allRevealed ? (
        <>
          {currentCard ? (
            <CardReveal key={currentIndex}>
              <CardDisplay card={currentCard} />
            </CardReveal>
          ) : (
            <ClickHint>Cliquez pour ouvrir le booster...</ClickHint>
          )}
          <Counter>
            {currentIndex + 1} / {revealedCards.length}
          </Counter>
          {currentIndex >= 0 && (
            <ClickHint>Cliquez pour la carte suivante</ClickHint>
          )}
        </>
      ) : (
        <>
          <AllCardsGrid>
            {revealedCards.map((card, i) => (
              <CardDisplay key={`${card.id}-${i}`} card={card} />
            ))}
          </AllCardsGrid>
          <CloseButton
            onClick={(e) => {
              e.stopPropagation();
              closeBoosterOpen();
            }}
          >
            Fermer
          </CloseButton>
        </>
      )}
    </Overlay>
  );
}
