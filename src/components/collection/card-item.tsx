"use client";

import { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { RARITY_COLORS, RARITY_LABELS, type Rarity } from "@/lib/constants";
import { CardPlaceholder } from "@/components/shared/card-placeholder";
import type { Card } from "@/types/cards";

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const holoShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Wrapper = styled.div<{ $rarity: Rarity; $owned: boolean }>`
  position: relative;
  width: 100%;
  max-width: 200px;
  border-radius: 12px;
  overflow: hidden;
  background: #0f172a;
  border: 2px solid ${(p) => (p.$owned ? RARITY_COLORS[p.$rarity] + "60" : "#1e293b")};
  transition: transform 0.25s, box-shadow 0.25s;
  cursor: pointer;
  opacity: ${(p) => (p.$owned ? 1 : 0.45)};
  filter: ${(p) => (p.$owned ? "none" : "grayscale(0.8)")};

  /* Holographic overlay — visible on hover for owned cards */
  ${(p) =>
    p.$owned &&
    css`
      &::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 12px;
        background: linear-gradient(
          135deg,
          rgba(255, 0, 128, 0.12) 0%,
          rgba(0, 200, 255, 0.12) 25%,
          rgba(128, 0, 255, 0.12) 50%,
          rgba(255, 200, 0, 0.12) 75%,
          rgba(255, 0, 128, 0.12) 100%
        );
        background-size: 300% 300%;
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
        z-index: 3;
      }

      &:hover::after {
        opacity: 1;
        animation: ${holoShift} 3s ease infinite;
      }
    `}

  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: ${(p) =>
      p.$owned
        ? `0 0 20px ${RARITY_COLORS[p.$rarity]}50, 0 8px 30px rgba(0,0,0,0.4)`
        : "0 0 10px rgba(255,255,255,0.05)"};
  }

  /* Legendary shimmer top bar */
  ${(p) =>
    p.$owned &&
    p.$rarity === "legendary" &&
    css`
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, transparent, ${RARITY_COLORS.legendary}, transparent);
        background-size: 200% 100%;
        animation: ${shimmer} 2s infinite;
        z-index: 4;
      }
    `}
`;

const ImageArea = styled.div<{ $hasImage: boolean }>`
  width: 100%;
  height: 160px;
  background: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  ${(p) =>
    !p.$hasImage &&
    css`
      color: #334155;
      font-size: 2.8rem;
    `}

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Body = styled.div`
  padding: 10px;
`;

const Name = styled.h3`
  margin: 4px 0 0;
  font-size: 0.82rem;
  font-weight: 700;
  color: #e5e7eb;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RarityTag = styled.span<{ $color: string }>`
  display: inline-flex;
  padding: 1px 8px;
  border-radius: 9999px;
  font-size: 0.62rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(p) => p.$color};
  background: ${(p) => p.$color}20;
  border: 1px solid ${(p) => p.$color}40;
`;

const BadgeContainer = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 5;
`;

const CountBadge = styled.span`
  background: #020617cc;
  color: #e5e7eb;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-align: center;
`;

const NewBadge = styled.span`
  background: linear-gradient(135deg, #38BDF8, #ff6b6b);
  color: #fff;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.6rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: center;
`;

const LockIcon = styled.div`
  background: #020617cc;
  color: #475569;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.7rem;
  text-align: center;
`;

export interface CollectionCardData {
  card: Card;
  quantity: number;
  owned: boolean;
  isNew: boolean;
}

interface CardItemProps {
  data: CollectionCardData;
  onClick: () => void;
}

export function CardItem({ data, onClick }: CardItemProps) {
  const { card, quantity, owned, isNew } = data;
  const hasImage = !!card.image_url && card.image_url !== "";
  const [imgError, setImgError] = useState(false);
  const showImage = hasImage && owned && !imgError;

  return (
    <Wrapper $rarity={card.rarity} $owned={owned} onClick={onClick}>
      <BadgeContainer>
        {owned && isNew && <NewBadge>NEW</NewBadge>}
        {owned && quantity > 1 && <CountBadge>x{quantity}</CountBadge>}
        {!owned && <LockIcon>?</LockIcon>}
      </BadgeContainer>

      <ImageArea $hasImage={showImage}>
        {showImage ? (
          <img src={card.image_url} alt={card.name} loading="lazy" onError={() => setImgError(true)} />
        ) : (
          <CardPlaceholder rarity={card.rarity} size={48} />
        )}
      </ImageArea>

      <Body>
        <RarityTag $color={RARITY_COLORS[card.rarity]}>
          {RARITY_LABELS[card.rarity]}
        </RarityTag>
        <Name>{owned ? card.name : "???"}</Name>
      </Body>
    </Wrapper>
  );
}
