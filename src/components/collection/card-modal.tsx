"use client";

import { useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  RARITY_COLORS,
  RARITY_LABELS,
  CARD_TYPE_LABELS,
  FACTION_LABELS,
  type Rarity,
  type FactionConst,
} from "@/lib/constants";
import { CardPlaceholder } from "@/components/shared/card-placeholder";
import { theme, alpha } from "@/lib/theme";
import { fadeIn, scaleIn, holoRainbow } from "@/lib/animations";
import type { CollectionCardData } from "./card-item";

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const particleFloat = keyframes`
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  20% { opacity: 0.6; }
  80% { opacity: 0.4; }
  100% { transform: translateY(-120px) translateX(30px); opacity: 0; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: ${fadeIn} 0.2s ease;
  padding: 20px;
`;

const Card = styled.div<{ $rarity: Rarity }>`
  background: ${theme.colors.bgCard};
  border: none;
  border-radius: 20px;
  max-width: 480px;
  width: 100%;
  overflow: hidden;
  animation: ${slideUp} 0.35s ease;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: ${(p) => theme.shadows.glow(RARITY_COLORS[p.$rarity])};
`;

const ParticlesContainer = styled.div<{ $color: string }>`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;

  span {
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${(p) => p.$color};
    animation: ${particleFloat} 5s ease-in-out infinite;

    &:nth-child(1) { left: 15%; bottom: 20%; animation-delay: 0s; }
    &:nth-child(2) { left: 50%; bottom: 15%; animation-delay: 1s; }
    &:nth-child(3) { left: 80%; bottom: 25%; animation-delay: 2s; }
  }
`;

const ImageArea = styled.div<{ $hasImage: boolean }>`
  width: 100%;
  height: 260px;
  background: ${theme.colors.bgHover};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  z-index: 1;

  ${(p) => !p.$hasImage && `color: ${theme.colors.border}; font-size: 5rem;`}

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Body = styled.div`
  padding: 24px;
  position: relative;
  z-index: 1;
`;

const Meta = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const RarityTag = styled.span<{ $color: string }>`
  display: inline-flex;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${(p) => p.$color};
  background: ${(p) => alpha(p.$color, 0.12)};
  border: none;
`;

const MetaTag = styled.span`
  font-size: 0.75rem;
  color: ${theme.colors.textMuted};
  padding: 3px 10px;
  border: none;
  border-radius: 9999px;
  background: ${theme.colors.bgHover};
`;

const FoilTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #FFD700, #FF6B6B, #00CED1, #FFD700);
  background-size: 200% 200%;
  animation: ${holoRainbow} 2s ease infinite;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const Name = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: 0.02em;
`;

const Description = styled.p`
  color: ${theme.colors.textMuted};
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 16px;
`;

const Lore = styled.p`
  color: ${theme.colors.textMuted};
  font-size: 0.8rem;
  line-height: 1.5;
  font-style: italic;
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 2px solid ${alpha(theme.colors.primary, 0.19)};
`;

const Stats = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
`;

const Stat = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: 800;
  color: ${(p) => p.$color};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const StatLabel = styled.span`
  font-size: 0.78rem;
  font-weight: 500;
  color: ${theme.colors.textMuted};
  margin-left: 2px;
`;

const Quantity = styled.div`
  font-size: 0.85rem;
  color: ${theme.colors.textMuted};
  margin-bottom: 20px;

  strong {
    color: ${theme.colors.text};
  }
`;

const CloseBtn = styled.button`
  width: 100%;
  padding: 12px;
  background: ${theme.colors.bgHover};
  border: none;
  border-radius: 8px;
  color: ${theme.colors.textMuted};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: inset 0 0 0 1px var(--white-alpha-006);

  &:hover {
    color: ${theme.colors.text};
    box-shadow: inset 0 0 0 1px var(--white-alpha-012);
  }
`;

interface CardModalProps {
  data: CollectionCardData;
  onClose: () => void;
}

export function CardModal({ data, onClose }: CardModalProps) {
  const { card, quantity, owned, isFoil } = data;
  const hasImage = !!card.image_url && card.image_url !== "";
  const [imgError, setImgError] = useState(false);
  const showImage = hasImage && owned && !imgError;
  const rarityColor = RARITY_COLORS[card.rarity];

  return (
    <Overlay onClick={onClose}>
      <Card $rarity={card.rarity} onClick={(e) => e.stopPropagation()}>
        {(card.rarity === "epic" || card.rarity === "legendary" || card.rarity === "rare") && (
          <ParticlesContainer $color={rarityColor}>
            <span /><span /><span />
          </ParticlesContainer>
        )}

        <ImageArea $hasImage={showImage}>
          {showImage ? (
            <img src={card.image_url} alt={card.name} onError={() => setImgError(true)} />
          ) : (
            <CardPlaceholder rarity={card.rarity} size={80} />
          )}
        </ImageArea>

        <Body>
          <Meta>
            <RarityTag $color={rarityColor}>
              {RARITY_LABELS[card.rarity]}
            </RarityTag>
            {isFoil && <FoilTag>FOIL</FoilTag>}
            <MetaTag>{CARD_TYPE_LABELS[card.type]}</MetaTag>
            {card.faction && (
              <MetaTag>
                {FACTION_LABELS[card.faction as FactionConst] || card.faction}
              </MetaTag>
            )}
          </Meta>

          <Name>{owned ? card.name : "???"}</Name>

          {owned && card.description && (
            <Description>{card.description}</Description>
          )}

          {owned && card.lore && <Lore>{card.lore}</Lore>}

          {owned && (card.attack !== null || card.defense !== null) && (
            <Stats>
              {card.attack !== null && (
                <Stat $color="#EF4444">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.5 3.5L12 1 9.5 3.5 7 1 4 4v5l8 8 8-8V4l-3-3-2.5 2.5zM12 14.5L5 7.5V5l2-2 1.5 1.5L12 1l3.5 3.5L17 3l2 2v2.5L12 14.5z" />
                  </svg>
                  {card.attack}
                  <StatLabel>ATK</StatLabel>
                </Stat>
              )}
              {card.defense !== null && (
                <Stat $color="#60A5FA">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.83-3.4 9.36-7 10.5-3.6-1.14-7-5.67-7-10.5V6.3l7-3.12z" />
                  </svg>
                  {card.defense}
                  <StatLabel>DEF</StatLabel>
                </Stat>
              )}
            </Stats>
          )}

          <Quantity>
            {owned ? (
              <>
                Possédées : <strong>x{quantity}</strong>
              </>
            ) : (
              "Vous ne possédez pas encore cette carte."
            )}
          </Quantity>

          <CloseBtn onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Fermer
          </CloseBtn>
        </Body>
      </Card>
    </Overlay>
  );
}
