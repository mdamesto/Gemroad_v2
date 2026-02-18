"use client";

import styled from "styled-components";
import { RARITY_COLORS, RARITY_LABELS, type Rarity } from "@/lib/constants";
import { alpha } from "@/lib/theme";

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
  background: ${(p) => alpha(p.$color, 0.12)};
  border: 1px solid ${(p) => alpha(p.$color, 0.25)};
`;

export function RarityBadge({ rarity }: { rarity: Rarity }) {
  return (
    <Badge $color={RARITY_COLORS[rarity]}>{RARITY_LABELS[rarity]}</Badge>
  );
}
