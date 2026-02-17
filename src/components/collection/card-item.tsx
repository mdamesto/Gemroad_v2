"use client";

import { useState, useCallback, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import { RARITY_COLORS, RARITY_LABELS, type Rarity } from "@/lib/constants";
import { CardPlaceholder } from "@/components/shared/card-placeholder";
import { shimmer, popIn } from "@/lib/animations";
import { theme } from "@/lib/theme";
import type { Card } from "@/types/cards";

const holoShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const mysteryShimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const Wrapper = styled.div<{ $rarity: Rarity; $owned: boolean; $isNew?: boolean }>`
  position: relative;
  width: 100%;
  max-width: 200px;
  border-radius: 12px;
  overflow: hidden;
  background: ${theme.colors.bgCard};
  border: 2px solid ${(p) => (p.$owned ? RARITY_COLORS[p.$rarity] + "60" : theme.colors.border)};
  cursor: pointer;
  transition: box-shadow 0.3s ease;
  transform-style: preserve-3d;
  will-change: transform;

  ${(p) =>
    !p.$owned &&
    css`
      &::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          transparent 25%,
          rgba(255, 255, 255, 0.04) 50%,
          transparent 75%
        );
        background-size: 400% 100%;
        animation: ${mysteryShimmer} 3s ease infinite;
        pointer-events: none;
        z-index: 3;
      }
    `}

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
          rgba(255, 0, 128, 0.15) 0%,
          rgba(0, 200, 255, 0.15) 25%,
          rgba(128, 0, 255, 0.15) 50%,
          rgba(255, 200, 0, 0.15) 75%,
          rgba(255, 0, 128, 0.15) 100%
        );
        background-size: 300% 300%;
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
        z-index: 3;
      }

      &:hover::after {
        opacity: 1;
        animation: ${holoShift} 2.5s ease infinite;
      }
    `}

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

  opacity: ${(p) => (p.$owned ? 1 : 0.5)};
  filter: ${(p) => (p.$owned ? "none" : "grayscale(0.7)")};

  ${(p) =>
    p.$isNew &&
    css`
      animation: ${popIn} 0.4s ease-out;
    `}
`;

const ImageArea = styled.div<{ $hasImage: boolean }>`
  width: 100%;
  height: 160px;
  background: ${theme.colors.bgHover};
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
  color: ${theme.colors.text};
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
  color: ${theme.colors.text};
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
  index?: number;
}

export function CardItem({ data, onClick, index = 0 }: CardItemProps) {
  const { card, quantity, owned, isNew } = data;
  const hasImage = !!card.image_url && card.image_url !== "";
  const [imgError, setImgError] = useState(false);
  const showImage = hasImage && owned && !imgError;
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!owned || !wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (y - 0.5) * -12;
      const rotateY = (x - 0.5) * 12;
      wrapperRef.current.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
      wrapperRef.current.style.boxShadow = `0 0 20px ${RARITY_COLORS[card.rarity]}50, 0 8px 30px rgba(0,0,0,0.4)`;
    },
    [owned, card.rarity]
  );

  const handleMouseLeave = useCallback(() => {
    if (!wrapperRef.current) return;
    wrapperRef.current.style.transform = "";
    wrapperRef.current.style.boxShadow = "";
  }, []);

  return (
    <Wrapper
      ref={wrapperRef}
      $rarity={card.rarity}
      $owned={owned}
      $isNew={isNew}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        animationDelay: `${Math.min(index * 30, 600)}ms`,
      }}
    >
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
