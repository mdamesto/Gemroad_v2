import type { Database } from "./database";

export type Card = Database["public"]["Tables"]["cards"]["Row"];
export type Series = Database["public"]["Tables"]["series"]["Row"];
export type BoosterType = Database["public"]["Tables"]["booster_types"]["Row"];
export type UserCard = Database["public"]["Tables"]["user_cards"]["Row"];
export type UserBooster = Database["public"]["Tables"]["user_boosters"]["Row"];

export type CardType = Card["type"];
export type Faction = NonNullable<Card["faction"]>;

export interface CardWithDetails extends Card {
  series?: Series | null;
}

export interface UserCardWithDetails extends UserCard {
  card: Card;
}

export interface BoosterOpenResult {
  cards: Card[];
  newCards: string[];
  boosterId: string;
}
