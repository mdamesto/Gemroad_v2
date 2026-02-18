"use client";

import styled from "styled-components";
import { RARITY_COLORS, type Rarity } from "@/lib/constants";
import { alpha } from "@/lib/theme";
import { theme } from "@/lib/theme";

const Wrapper = styled.div<{ $color: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${theme.colors.bgCard} 0%,
    ${(p) => alpha(p.$color, 0.08)} 50%,
    ${theme.colors.bgCard} 100%
  );
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at 50% 40%,
      ${(p) => alpha(p.$color, 0.12)},
      transparent 70%
    );
  }
`;

interface CardPlaceholderProps {
  rarity: Rarity;
  size?: number;
}

export function CardPlaceholder({ rarity, size = 64 }: CardPlaceholderProps) {
  const color = RARITY_COLORS[rarity];

  return (
    <Wrapper $color={color}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Gem shape */}
        <defs>
          <linearGradient id={`gem-${rarity}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.7" />
          </linearGradient>
          <filter id={`glow-${rarity}`}>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer glow */}
        <polygon
          points="32,4 52,20 52,44 32,60 12,44 12,20"
          fill={color}
          opacity="0.1"
          filter={`url(#glow-${rarity})`}
        />

        {/* Main gem body */}
        <polygon
          points="32,8 48,22 48,42 32,56 16,42 16,22"
          fill={`url(#gem-${rarity})`}
          stroke={color}
          strokeWidth="1"
          strokeOpacity="0.5"
        />

        {/* Top facet highlight */}
        <polygon
          points="32,8 48,22 32,28 16,22"
          fill="white"
          opacity="0.15"
        />

        {/* Left facet */}
        <polygon
          points="16,22 32,28 32,56 16,42"
          fill="black"
          opacity="0.15"
        />

        {/* Center line */}
        <line
          x1="32" y1="28" x2="32" y2="56"
          stroke={color}
          strokeWidth="0.5"
          strokeOpacity="0.3"
        />

        {/* Sparkle top-right */}
        <circle cx="42" cy="16" r="1.5" fill="white" opacity="0.6" />
        <circle cx="44" cy="14" r="0.8" fill="white" opacity="0.4" />
      </svg>
    </Wrapper>
  );
}
