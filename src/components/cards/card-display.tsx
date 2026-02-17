"use client";

import { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { RARITY_COLORS, type Rarity } from "@/lib/constants";
import { RarityBadge } from "@/components/shared/rarity-badge";
import { CardPlaceholder } from "@/components/shared/card-placeholder";
import type { Card } from "@/types/cards";

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const CardWrapper = styled.div<{ $rarity: Rarity; $clickable?: boolean }>`
  position: relative;
  width: 220px;
  border-radius: 12px;
  overflow: hidden;
  background: #0f172a;
  border: 2px solid ${(p) => RARITY_COLORS[p.$rarity]}60;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: ${(p) => (p.$clickable ? "pointer" : "default")};

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 0 20px ${(p) => RARITY_COLORS[p.$rarity]}40,
      0 0 40px ${(p) => RARITY_COLORS[p.$rarity]}20;
  }

  ${(p) =>
    p.$rarity === "legendary" &&
    css`
    &::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, ${RARITY_COLORS.legendary}, transparent);
      background-size: 200% 100%;
      animation: ${shimmer} 2s infinite;
      z-index: 1;
    }
  `}
`;

const CardImage = styled.div`
  width: 100%;
  height: 180px;
  background: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 3rem;
`;

const CardBody = styled.div`
  padding: 12px;
`;

const CardName = styled.h3`
  margin: 0 0 6px;
  font-size: 0.95rem;
  font-weight: 700;
  color: #e5e7eb;
`;

const CardDescription = styled.p`
  margin: 0 0 8px;
  font-size: 0.75rem;
  color: #94a3b8;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardStats = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const Stat = styled.span<{ $type: "attack" | "defense" }>`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${(p) => (p.$type === "attack" ? "#38BDF8" : "#60A5FA")};
`;

const QuantityBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  background: #020617cc;
  color: #e5e7eb;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  z-index: 2;
`;

interface CardDisplayProps {
  card: Card;
  quantity?: number;
  onClick?: () => void;
}

export function CardDisplay({ card, quantity, onClick }: CardDisplayProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = !!card.image_url && !imgError;

  return (
    <CardWrapper
      $rarity={card.rarity}
      $clickable={!!onClick}
      onClick={onClick}
    >
      {quantity && quantity > 1 && <QuantityBadge>x{quantity}</QuantityBadge>}
      <CardImage>
        {showImage ? (
          <img src={card.image_url} alt={card.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setImgError(true)} />
        ) : (
          <CardPlaceholder rarity={card.rarity} size={56} />
        )}
      </CardImage>
      <CardBody>
        <RarityBadge rarity={card.rarity} />
        <CardName>{card.name}</CardName>
        {card.description && (
          <CardDescription>{card.description}</CardDescription>
        )}
        <CardStats>
          {card.attack !== null && <Stat $type="attack">ATK {card.attack}</Stat>}
          {card.defense !== null && (
            <Stat $type="defense">DEF {card.defense}</Stat>
          )}
        </CardStats>
      </CardBody>
    </CardWrapper>
  );
}
