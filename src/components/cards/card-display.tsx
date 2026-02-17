"use client";

import { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { RARITY_COLORS, type Rarity } from "@/lib/constants";
import { RarityBadge } from "@/components/shared/rarity-badge";
import { CardPlaceholder } from "@/components/shared/card-placeholder";
import { theme } from "@/lib/theme";
import type { Card } from "@/types/cards";

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const CardWrapper = styled.div<{ $rarity: Rarity; $clickable?: boolean }>`
  position: relative;
  width: 220px;
  border-radius: 14px;
  overflow: hidden;
  background: ${theme.colors.bgCard};
  border: 2px solid ${(p) => RARITY_COLORS[p.$rarity]}60;
  transition: transform 0.25s, box-shadow 0.25s;
  cursor: ${(p) => (p.$clickable ? "pointer" : "default")};

  /* Corner decorations */
  &::after {
    content: "";
    position: absolute;
    inset: 4px;
    border-radius: 10px;
    border: 1px solid ${(p) => RARITY_COLORS[p.$rarity]}15;
    pointer-events: none;
    z-index: 1;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${(p) => theme.shadows.glowStrong(RARITY_COLORS[p.$rarity])};
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
      z-index: 2;
    }
  `}

  ${(p) =>
    p.$rarity === "epic" &&
    css`
    &::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, ${RARITY_COLORS.epic}, transparent);
      background-size: 200% 100%;
      animation: ${shimmer} 3s infinite;
      z-index: 2;
    }
  `}
`;

const CardImage = styled.div`
  width: 100%;
  height: 180px;
  background: ${theme.colors.bgHover};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.textMuted};
  font-size: 3rem;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardBody = styled.div`
  padding: 12px;
  position: relative;
`;

const CardName = styled.h3`
  margin: 0 0 6px;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${theme.colors.text};
`;

const CardDescription = styled.p`
  margin: 0 0 8px;
  font-size: 0.75rem;
  color: ${theme.colors.textMuted};
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardStats = styled.div`
  display: flex;
  gap: 14px;
  margin-top: 8px;
`;

const Stat = styled.span<{ $type: "attack" | "defense" }>`
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${(p) => (p.$type === "attack" ? "#EF4444" : "#60A5FA")};

  svg {
    width: 14px;
    height: 14px;
  }
`;

const QuantityBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  background: #020617cc;
  color: ${theme.colors.text};
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  z-index: 3;
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
          <img src={card.image_url} alt={card.name} onError={() => setImgError(true)} />
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
          {card.attack !== null && (
            <Stat $type="attack">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.5 3.5L12 1 9.5 3.5 7 1 4 4v5l8 8 8-8V4l-3-3-2.5 2.5zM12 14.5L5 7.5V5l2-2 1.5 1.5L12 1l3.5 3.5L17 3l2 2v2.5L12 14.5z" />
              </svg>
              {card.attack}
            </Stat>
          )}
          {card.defense !== null && (
            <Stat $type="defense">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.83-3.4 9.36-7 10.5-3.6-1.14-7-5.67-7-10.5V6.3l7-3.12z" />
              </svg>
              {card.defense}
            </Stat>
          )}
        </CardStats>
      </CardBody>
    </CardWrapper>
  );
}
