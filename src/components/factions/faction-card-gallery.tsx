"use client";

import { useState } from "react";
import styled from "styled-components";
import { theme, alpha } from "@/lib/theme";
import { RARITIES, RARITY_LABELS, RARITY_COLORS, CARD_TYPES, CARD_TYPE_LABELS } from "@/lib/constants";
import type { Rarity, CardTypeConst } from "@/lib/constants";
import { fadeInUp } from "@/lib/animations";

const Wrapper = styled.div`
  margin-top: 24px;
`;

const Filters = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

const FilterChip = styled.button<{ $active?: boolean; $color?: string }>`
  padding: 6px 14px;
  border-radius: ${theme.radii.full};
  border: none;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $active, $color }) =>
    $active ? alpha($color || theme.colors.primary, 0.18) : "var(--white-alpha-006)"};
  color: ${({ $active, $color }) =>
    $active ? $color || theme.colors.primary : theme.colors.textMuted};

  &:hover {
    background: ${({ $color }) => alpha($color || theme.colors.primary, 0.12)};
    color: ${({ $color }) => $color || theme.colors.text};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }
`;

const CardItem = styled.div<{ $owned: boolean; $index: number; $rarityColor: string }>`
  position: relative;
  border-radius: ${theme.radii.lg};
  overflow: hidden;
  background: ${theme.colors.glassBg};
  border: 1px solid ${({ $owned, $rarityColor }) =>
    $owned ? alpha($rarityColor, 0.3) : "var(--white-alpha-006)"};
  opacity: ${({ $owned }) => ($owned ? 1 : 0.45)};
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.4s ease-out both;
  animation-delay: ${({ $index }) => Math.min($index * 0.03, 0.5)}s;

  &:hover {
    transform: ${({ $owned }) => ($owned ? "translateY(-2px)" : "none")};
    box-shadow: ${({ $owned, $rarityColor }) =>
      $owned ? `0 4px 16px ${alpha($rarityColor, 0.15)}` : "none"};
  }
`;

const CardImage = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  background: ${theme.colors.bgCard};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardInfo = styled.div`
  padding: 8px 10px;
`;

const CardName = styled.p`
  font-size: 0.78rem;
  font-weight: 600;
  color: ${theme.colors.text};
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RarityDot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  box-shadow: 0 0 6px ${({ $color }) => alpha($color, 0.5)};
`;

const Quantity = styled.span`
  font-size: 0.72rem;
  color: ${theme.colors.textMuted};
`;

const EmptyState = styled.p`
  text-align: center;
  color: ${theme.colors.textMuted};
  padding: 40px 20px;
  font-size: 0.9rem;
`;

interface CardData {
  id: string;
  name: string;
  image_url: string;
  rarity: Rarity;
  type: CardTypeConst;
  owned: boolean;
  quantity: number;
  lore?: string | null;
}

interface FactionCardGalleryProps {
  cards: CardData[];
  accentColor: string;
}

export function FactionCardGallery({ cards, accentColor }: FactionCardGalleryProps) {
  const [rarityFilter, setRarityFilter] = useState<Rarity | "all">("all");
  const [typeFilter, setTypeFilter] = useState<CardTypeConst | "all">("all");

  const filtered = cards.filter((c) => {
    if (rarityFilter !== "all" && c.rarity !== rarityFilter) return false;
    if (typeFilter !== "all" && c.type !== typeFilter) return false;
    return true;
  });

  return (
    <Wrapper>
      <Filters>
        <FilterChip
          $active={rarityFilter === "all"}
          $color={accentColor}
          onClick={() => setRarityFilter("all")}
        >
          Toutes
        </FilterChip>
        {RARITIES.map((r) => (
          <FilterChip
            key={r}
            $active={rarityFilter === r}
            $color={RARITY_COLORS[r]}
            onClick={() => setRarityFilter(r)}
          >
            {RARITY_LABELS[r]}
          </FilterChip>
        ))}
      </Filters>

      <Filters>
        <FilterChip
          $active={typeFilter === "all"}
          $color={accentColor}
          onClick={() => setTypeFilter("all")}
        >
          Tous types
        </FilterChip>
        {CARD_TYPES.map((t) => (
          <FilterChip
            key={t}
            $active={typeFilter === t}
            $color={accentColor}
            onClick={() => setTypeFilter(t)}
          >
            {CARD_TYPE_LABELS[t]}
          </FilterChip>
        ))}
      </Filters>

      {filtered.length === 0 ? (
        <EmptyState>Aucune carte trouvée avec ces filtres.</EmptyState>
      ) : (
        <Grid>
          {filtered.map((card, i) => (
            <CardItem
              key={card.id}
              $owned={card.owned}
              $index={i}
              $rarityColor={RARITY_COLORS[card.rarity]}
            >
              <CardImage>
                <img src={card.image_url} alt={card.name} loading="lazy" />
              </CardImage>
              <CardInfo>
                <CardName>{card.name}</CardName>
                <CardMeta>
                  <RarityDot $color={RARITY_COLORS[card.rarity]} />
                  <Quantity>
                    {card.owned ? `x${card.quantity}` : "???"}
                  </Quantity>
                </CardMeta>
              </CardInfo>
            </CardItem>
          ))}
        </Grid>
      )}
    </Wrapper>
  );
}
