"use client";

import { useState, useCallback, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import { RARITY_COLORS, RARITY_LABELS, type Rarity } from "@/lib/constants";
import { CardPlaceholder } from "@/components/shared/card-placeholder";
import { popIn, holoRainbow } from "@/lib/animations";
import { theme, alpha } from "@/lib/theme";
import type { Card } from "@/types/cards";

const holoShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;


const Wrapper = styled.div<{ $rarity: Rarity; $owned: boolean; $isNew?: boolean }>`
  position: relative;
  width: 100%;
  max-width: 200px;
  border-radius: 12px;
  overflow: hidden;
  background: ${theme.colors.bgCard};
  border: none;
  box-shadow: ${(p) => (p.$owned
    ? `0 0 12px ${alpha(RARITY_COLORS[p.$rarity], 0.15)}, 0 4px 12px rgba(var(--shadow-base), 0.3)`
    : `0 2px 8px rgba(var(--shadow-base), 0.3)`)};
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
          rgba(255, 255, 255, 0.03) 50%,
          transparent 75%
        );
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
      color: ${theme.colors.border};
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
  font-size: 0.85rem;
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
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(p) => p.$color};
  background: ${(p) => alpha(p.$color, 0.12)};
  border: none;
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
  background: ${alpha(theme.colors.bg, 0.8)};
  color: ${theme.colors.text};
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
  text-align: center;
`;

const NewBadge = styled.span`
  background: linear-gradient(135deg, #38BDF8, #ff6b6b);
  color: #fff;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: center;
`;

const LockIcon = styled.div`
  background: ${alpha(theme.colors.bg, 0.8)};
  color: ${theme.colors.textMuted};
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.8rem;
  text-align: center;
`;

const ShimmerOverlay = styled.div<{ $rarity: Rarity }>`
  position: absolute;
  inset: 0;
  border-radius: 12px;
  pointer-events: none;
  z-index: 4;
  opacity: 0;
  transition: opacity 0.3s ease;
  mix-blend-mode: overlay;
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    ${(p) =>
      p.$rarity === "legendary"
        ? "rgba(255, 215, 0, 0.4), rgba(255, 100, 0, 0.2), transparent 70%"
        : p.$rarity === "epic"
          ? "rgba(167, 139, 250, 0.35), rgba(139, 92, 246, 0.15), transparent 70%"
          : p.$rarity === "rare"
            ? "rgba(96, 165, 250, 0.3), rgba(59, 130, 246, 0.12), transparent 70%"
            : p.$rarity === "uncommon"
              ? "rgba(52, 211, 153, 0.2), transparent 60%"
              : "rgba(255, 255, 255, 0.1), transparent 60%"}
  );

  ${(p) =>
    p.$rarity === "legendary" &&
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
        background-size: 200% 200%;
        animation: ${holoRainbow} 3s ease infinite;
      }
    `}

  ${(p) =>
    p.$rarity === "epic" &&
    css`
      &::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 12px;
        background: linear-gradient(
          135deg,
          rgba(167, 139, 250, 0.1),
          rgba(139, 92, 246, 0.15),
          rgba(167, 139, 250, 0.1)
        );
        background-size: 200% 200%;
        animation: ${holoRainbow} 4s ease infinite;
      }
    `}
`;

const FoilBadge = styled.span`
  background: linear-gradient(135deg, #FFD700, #FF6B6B, #00CED1, #FFD700);
  background-size: 200% 200%;
  animation: ${holoRainbow} 2s ease infinite;
  color: #fff;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
`;

export interface CollectionCardData {
  card: Card;
  quantity: number;
  owned: boolean;
  isNew: boolean;
  isFoil?: boolean;
}

interface CardItemProps {
  data: CollectionCardData;
  onClick: () => void;
  index?: number;
}

export function CardItem({ data, onClick, index = 0 }: CardItemProps) {
  const { card, quantity, owned, isNew, isFoil } = data;
  const hasImage = !!card.image_url && card.image_url !== "";
  const [imgError, setImgError] = useState(false);
  const showImage = hasImage && owned && !imgError;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!owned || !wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (y - 0.5) * -12;
      const rotateY = (x - 0.5) * 12;
      wrapperRef.current.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
      wrapperRef.current.style.boxShadow = `0 0 20px ${alpha(RARITY_COLORS[card.rarity], 0.31)}, 0 8px 30px rgba(0,0,0,0.4)`;

      // Update shimmer position
      if (shimmerRef.current) {
        shimmerRef.current.style.setProperty("--mouse-x", `${Math.round(x * 100)}%`);
        shimmerRef.current.style.setProperty("--mouse-y", `${Math.round(y * 100)}%`);
        shimmerRef.current.style.opacity = "1";
      }
    },
    [owned, card.rarity]
  );

  const handleMouseLeave = useCallback(() => {
    if (!wrapperRef.current) return;
    wrapperRef.current.style.transform = "";
    wrapperRef.current.style.boxShadow = "";
    if (shimmerRef.current) {
      shimmerRef.current.style.opacity = isFoil ? "0.6" : "0";
    }
  }, [isFoil]);

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
        ...(isFoil && owned ? { boxShadow: `0 0 15px ${alpha(RARITY_COLORS[card.rarity], 0.4)}, 0 0 30px ${alpha(RARITY_COLORS[card.rarity], 0.2)}` } : {}),
      }}
    >
      <BadgeContainer>
        {owned && isFoil && <FoilBadge>FOIL</FoilBadge>}
        {owned && isNew && <NewBadge>NEW</NewBadge>}
        {owned && quantity > 1 && <CountBadge>x{quantity}</CountBadge>}
        {!owned && <LockIcon>?</LockIcon>}
      </BadgeContainer>

      {owned && (
        <ShimmerOverlay
          ref={shimmerRef}
          $rarity={card.rarity}
          style={{ opacity: isFoil ? 0.6 : 0 }}
        />
      )}

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
