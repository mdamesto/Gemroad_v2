"use client";

import styled, { keyframes } from "styled-components";
import { useGameStore } from "@/stores/game-store";
import { CardDisplay } from "./card-display";
import { RARITY_COLORS, type Rarity } from "@/lib/constants";
import { theme } from "@/lib/theme";
import { GlowButton } from "@/components/ui/glow-button";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const packAppear = keyframes`
  0% { transform: scale(0.3) rotateY(-20deg); opacity: 0; }
  60% { transform: scale(1.05) rotateY(5deg); opacity: 1; }
  100% { transform: scale(1) rotateY(0); opacity: 1; }
`;

const packShake = keyframes`
  0%, 100% { transform: translateX(0) rotate(0); }
  20% { transform: translateX(-3px) rotate(-1deg); }
  40% { transform: translateX(3px) rotate(1deg); }
  60% { transform: translateX(-2px) rotate(-0.5deg); }
  80% { transform: translateX(2px) rotate(0.5deg); }
`;

const cardReveal = keyframes`
  0% { transform: scale(0.3) rotateY(180deg); opacity: 0; }
  50% { transform: scale(1.1) rotateY(0); opacity: 1; }
  100% { transform: scale(1) rotateY(0); opacity: 1; }
`;

const flashBurst = keyframes`
  0% { opacity: 0.8; transform: scale(0.5); }
  50% { opacity: 0.4; transform: scale(2); }
  100% { opacity: 0; transform: scale(3); }
`;

const particleExplode = keyframes`
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
`;

const scaleInFinal = keyframes`
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const Overlay = styled.div<{ $scrollable?: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${(p) => (p.$scrollable ? "flex-start" : "center")};
  z-index: 100;
  animation: ${fadeIn} 0.3s ease;
  overflow-y: auto;
  padding: 40px 20px;
`;

const PackContainer = styled.div`
  animation: ${packAppear} 0.6s ease-out;
  cursor: pointer;

  &:hover {
    animation: ${packShake} 0.4s ease infinite;
  }
`;

const PackImage = styled.img`
  width: 140px;
  height: 187px;
  filter: drop-shadow(0 0 30px rgba(56, 189, 248, 0.4));
`;

const CardReveal = styled.div`
  animation: ${cardReveal} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
`;

const FlashOverlay = styled.div<{ $color: string }>`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 101;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200px;
    height: 200px;
    margin: -100px;
    border-radius: 50%;
    background: ${(p) => p.$color};
    animation: ${flashBurst} 0.6s ease-out forwards;
  }
`;

const ParticlesOverlay = styled.div<{ $color: string }>`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 101;

  span {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${(p) => p.$color};
    animation: ${particleExplode} 0.8s ease-out forwards;
  }
`;

const Counter = styled.div`
  margin-top: 24px;
  color: ${theme.colors.textMuted};
  font-family: ${theme.fonts.heading};
  font-size: 1rem;
  letter-spacing: 0.1em;
`;

const ClickHint = styled.div`
  margin-top: 16px;
  color: ${theme.colors.textMuted};
  font-size: 0.85rem;
  animation: ${fadeIn} 0.5s ease 0.5s both;
`;

const AllCardsGrid = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1100px;
  animation: ${scaleInFinal} 0.5s ease;

  & > * {
    transform: scale(0.85);
    transform-origin: top center;
  }
`;

const RarityFlash = styled.div<{ $rarity: Rarity }>`
  position: fixed;
  inset: 0;
  pointer-events: none;
  box-shadow: inset 0 0 120px ${(p) => RARITY_COLORS[p.$rarity]}40,
    inset 0 0 60px ${(p) => RARITY_COLORS[p.$rarity]}20;
  animation: ${fadeIn} 0.3s ease;
  z-index: 99;
`;

function generateParticles(color: string, count: number) {
  return Array.from({ length: count }).map((_, i) => {
    const angle = (i / count) * 360;
    const dist = 80 + Math.random() * 120;
    const tx = Math.cos((angle * Math.PI) / 180) * dist;
    const ty = Math.sin((angle * Math.PI) / 180) * dist;
    return (
      <span
        key={i}
        style={{
          "--tx": `${tx}px`,
          "--ty": `${ty}px`,
          animationDelay: `${Math.random() * 0.2}s`,
        } as React.CSSProperties}
      />
    );
  });
}

export function BoosterAnimation() {
  const { boosterOpen, revealNextCard, closeBoosterOpen } = useGameStore();
  const { isOpening, revealedCards, currentIndex } = boosterOpen;

  if (!isOpening) return null;

  const allRevealed = currentIndex >= revealedCards.length - 1;
  const currentCard = currentIndex >= 0 ? revealedCards[currentIndex] : null;
  const isHighRarity = currentCard && (currentCard.rarity === "epic" || currentCard.rarity === "legendary");

  const handleClick = () => {
    if (allRevealed) return;
    revealNextCard();
  };

  return (
    <Overlay onClick={handleClick} $scrollable={allRevealed}>
      {currentCard && (
        <>
          <RarityFlash $rarity={currentCard.rarity} />
          <FlashOverlay $color={RARITY_COLORS[currentCard.rarity]} />
          {isHighRarity && (
            <ParticlesOverlay $color={RARITY_COLORS[currentCard.rarity]}>
              {generateParticles(RARITY_COLORS[currentCard.rarity], 16)}
            </ParticlesOverlay>
          )}
        </>
      )}

      {!allRevealed ? (
        <>
          {currentCard ? (
            <CardReveal key={currentIndex}>
              <CardDisplay card={currentCard} />
            </CardReveal>
          ) : (
            <PackContainer>
              <PackImage
                src="/images/ui/booster-standard.svg"
                alt="Booster Pack"
              />
              <ClickHint>Cliquez pour ouvrir le booster...</ClickHint>
            </PackContainer>
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
          <GlowButton
            $variant="primary"
            $size="lg"
            style={{ marginTop: 32, marginBottom: 20 }}
            onClick={(e) => {
              e.stopPropagation();
              closeBoosterOpen();
            }}
          >
            Fermer
          </GlowButton>
        </>
      )}
    </Overlay>
  );
}
