"use client";

import styled from "styled-components";
import { RARITY_COLORS, RARITY_LABELS, type Rarity } from "@/lib/constants";

const Badge = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(p) => p.$color};
  background: ${(p) => p.$color}20;
  border: 1px solid ${(p) => p.$color}40;
`;

export function RarityBadge({ rarity }: { rarity: Rarity }) {
  return (
    <Badge $color={RARITY_COLORS[rarity]}>{RARITY_LABELS[rarity]}</Badge>
  );
}
