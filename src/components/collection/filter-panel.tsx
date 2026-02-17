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
import { theme } from "@/lib/theme";

const Bar = styled.div`
  position: sticky;
  top: 64px;
  z-index: 10;
  background: rgba(2, 6, 23, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
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
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  min-width: 60px;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 14px;
    height: 14px;
    opacity: 0.6;
  }
`;

const Pill = styled.button<{ $active: boolean; $color?: string }>`
  padding: 5px 14px;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid ${(p) => (p.$active ? p.$color || theme.colors.primary : theme.colors.border)};
  background: ${(p) => (p.$active ? (p.$color || theme.colors.primary) + "20" : "transparent")};
  color: ${(p) => (p.$active ? p.$color || theme.colors.primary : theme.colors.textMuted)};
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    border-color: ${(p) => p.$color || theme.colors.primary};
    color: ${(p) => p.$color || theme.colors.primary};
    transform: translateY(-1px);
  }
`;

const SearchInput = styled.input`
  padding: 8px 14px;
  background: ${theme.colors.bgHover};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  color: ${theme.colors.text};
  font-size: 0.85rem;
  outline: none;
  width: 100%;
  max-width: 300px;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${theme.colors.primary};
  }

  &::placeholder {
    color: #475569;
  }
`;

const ToggleLabel = styled.label`
  font-size: 0.8rem;
  color: ${theme.colors.textMuted};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Checkbox = styled.input`
  accent-color: ${theme.colors.primary};
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
        <Label>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
          Rareté
        </Label>
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
        <Label>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
          Type
        </Label>
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
        <Label>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          Faction
        </Label>
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
