"use client";

import styled, { keyframes } from "styled-components";
import {
  RARITY_COLORS,
  RARITY_LABELS,
  CARD_TYPE_LABELS,
  FACTION_LABELS,
  type Rarity,
  type FactionConst,
} from "@/lib/constants";
import type { CollectionCardData } from "./card-item";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: ${fadeIn} 0.2s ease;
  padding: 20px;
`;

const Card = styled.div<{ $rarity: Rarity }>`
  background: #0f172a;
  border: 1px solid ${(p) => RARITY_COLORS[p.$rarity]}40;
  border-radius: 20px;
  max-width: 480px;
  width: 100%;
  overflow: hidden;
  animation: ${slideUp} 0.3s ease;
  max-height: 90vh;
  overflow-y: auto;
`;

const ImageArea = styled.div<{ $hasImage: boolean }>`
  width: 100%;
  height: 260px;
  background: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  ${(p) => !p.$hasImage && `color: #334155; font-size: 5rem;`}

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Body = styled.div`
  padding: 24px;
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
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(p) => p.$color};
  background: ${(p) => p.$color}20;
  border: 1px solid ${(p) => p.$color}40;
`;

const MetaTag = styled.span`
  font-size: 0.75rem;
  color: #94a3b8;
  padding: 3px 10px;
  border: 1px solid #1e293b;
  border-radius: 9999px;
`;

const Name = styled.h2`
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 8px;
`;

const Description = styled.p`
  color: #94a3b8;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 16px;
`;

const Lore = styled.p`
  color: #475569;
  font-size: 0.8rem;
  line-height: 1.5;
  font-style: italic;
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 2px solid #1e293b;
`;

const Stats = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
`;

const Stat = styled.div<{ $color: string }>`
  font-size: 1.1rem;
  font-weight: 800;
  color: ${(p) => p.$color};
`;

const StatLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 500;
  color: #94a3b8;
  margin-left: 4px;
`;

const Quantity = styled.div`
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 20px;

  strong {
    color: #e5e7eb;
  }
`;

const CloseBtn = styled.button`
  width: 100%;
  padding: 12px;
  background: #1e293b;
  border: 1px solid #1e293b;
  border-radius: 8px;
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #1e293b;
    color: #e5e7eb;
  }
`;

interface CardModalProps {
  data: CollectionCardData;
  onClose: () => void;
}

export function CardModal({ data, onClose }: CardModalProps) {
  const { card, quantity, owned } = data;
  const hasImage = !!card.image_url && card.image_url !== "";

  return (
    <Overlay onClick={onClose}>
      <Card $rarity={card.rarity} onClick={(e) => e.stopPropagation()}>
        <ImageArea $hasImage={hasImage && owned}>
          {hasImage && owned ? (
            <img src={card.image_url} alt={card.name} />
          ) : (
            <>&#9876;</>
          )}
        </ImageArea>

        <Body>
          <Meta>
            <RarityTag $color={RARITY_COLORS[card.rarity]}>
              {RARITY_LABELS[card.rarity]}
            </RarityTag>
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
                  {card.attack}
                  <StatLabel>ATK</StatLabel>
                </Stat>
              )}
              {card.defense !== null && (
                <Stat $color="#60A5FA">
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

          <CloseBtn onClick={onClose}>Fermer</CloseBtn>
        </Body>
      </Card>
    </Overlay>
  );
}
