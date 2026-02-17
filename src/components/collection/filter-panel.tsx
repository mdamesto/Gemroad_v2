"use client";

import styled from "styled-components";
import {
  RARITIES,
  RARITY_LABELS,
  RARITY_COLORS,
  CARD_TYPES,
  CARD_TYPE_LABELS,
  FACTIONS,
  FACTION_LABELS,
  type Rarity,
  type CardTypeConst,
  type FactionConst,
} from "@/lib/constants";

const Bar = styled.div`
  position: sticky;
  top: 64px;
  z-index: 10;
  background: #0a0a0fee;
  backdrop-filter: blur(10px);
  padding: 16px 0;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
`;

const Label = styled.span`
  font-size: 0.75rem;
  color: #555566;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  min-width: 60px;
`;

const Pill = styled.button<{ $active: boolean; $color?: string }>`
  padding: 5px 14px;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid ${(p) => (p.$active ? p.$color || "#e63946" : "#2a2a35")};
  background: ${(p) => (p.$active ? (p.$color || "#e63946") + "20" : "transparent")};
  color: ${(p) => (p.$active ? p.$color || "#e63946" : "#8888aa")};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${(p) => p.$color || "#e63946"};
    color: ${(p) => p.$color || "#e63946"};
  }
`;

const SearchInput = styled.input`
  padding: 8px 14px;
  background: #1a1a25;
  border: 1px solid #2a2a35;
  border-radius: 8px;
  color: #e5e5e5;
  font-size: 0.85rem;
  outline: none;
  width: 100%;
  max-width: 300px;
  transition: border-color 0.2s;

  &:focus {
    border-color: #e63946;
  }

  &::placeholder {
    color: #555566;
  }
`;

const ToggleLabel = styled.label`
  font-size: 0.8rem;
  color: #8888aa;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Checkbox = styled.input`
  accent-color: #e63946;
  cursor: pointer;
`;

export interface FilterState {
  rarity: Rarity | "all";
  type: CardTypeConst | "all";
  faction: FactionConst | "all";
  search: string;
  showUnowned: boolean;
}

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const set = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch });

  return (
    <Bar>
      <Row>
        <SearchInput
          type="text"
          placeholder="Rechercher une carte..."
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
        />
        <ToggleLabel>
          <Checkbox
            type="checkbox"
            checked={filters.showUnowned}
            onChange={(e) => set({ showUnowned: e.target.checked })}
          />
          Afficher non possédées
        </ToggleLabel>
      </Row>

      <Row>
        <Label>Rareté</Label>
        <Pill $active={filters.rarity === "all"} onClick={() => set({ rarity: "all" })}>
          Toutes
        </Pill>
        {RARITIES.map((r) => (
          <Pill
            key={r}
            $active={filters.rarity === r}
            $color={RARITY_COLORS[r]}
            onClick={() => set({ rarity: r })}
          >
            {RARITY_LABELS[r]}
          </Pill>
        ))}
      </Row>

      <Row>
        <Label>Type</Label>
        <Pill $active={filters.type === "all"} onClick={() => set({ type: "all" })}>
          Tous
        </Pill>
        {CARD_TYPES.map((t) => (
          <Pill key={t} $active={filters.type === t} onClick={() => set({ type: t })}>
            {CARD_TYPE_LABELS[t]}
          </Pill>
        ))}
      </Row>

      <Row>
        <Label>Faction</Label>
        <Pill $active={filters.faction === "all"} onClick={() => set({ faction: "all" })}>
          Toutes
        </Pill>
        {FACTIONS.map((f) => (
          <Pill key={f} $active={filters.faction === f} onClick={() => set({ faction: f })}>
            {FACTION_LABELS[f]}
          </Pill>
        ))}
      </Row>
    </Bar>
  );
}
