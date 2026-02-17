export const RARITIES = ["common", "uncommon", "rare", "epic", "legendary"] as const;
export type Rarity = (typeof RARITIES)[number];

export const RARITY_COLORS: Record<Rarity, string> = {
  common: "#9CA3AF",
  uncommon: "#34D399",
  rare: "#60A5FA",
  epic: "#A78BFA",
  legendary: "#FBBF24",
};

export const RARITY_LABELS: Record<Rarity, string> = {
  common: "Commune",
  uncommon: "Peu commune",
  rare: "Rare",
  epic: "Épique",
  legendary: "Légendaire",
};

export const CARD_TYPES = ["character", "artifact", "location", "event"] as const;
export type CardTypeConst = (typeof CARD_TYPES)[number];

export const CARD_TYPE_LABELS: Record<CardTypeConst, string> = {
  character: "Personnage",
  artifact: "Artéfact",
  location: "Lieu",
  event: "Événement",
};

export const CARD_TYPE_COLORS: Record<CardTypeConst, string> = {
  character: "#EF4444",
  artifact: "#F59E0B",
  location: "#10B981",
  event: "#8B5CF6",
};

export const FACTIONS = ["dome_dwellers", "underground_resistance", "surface_survivors", "tech_scavengers"] as const;
export type FactionConst = (typeof FACTIONS)[number];

export const FACTION_LABELS: Record<FactionConst, string> = {
  dome_dwellers: "Dome Dwellers",
  underground_resistance: "Underground Resistance",
  surface_survivors: "Surface Survivors",
  tech_scavengers: "Tech Scavengers",
};

export const FACTION_COLORS: Record<FactionConst, string> = {
  dome_dwellers: "#3B82F6",
  underground_resistance: "#DC2626",
  surface_survivors: "#16A34A",
  tech_scavengers: "#D97706",
};

export const XP_PER_LEVEL = 100;
export const XP_PER_BOOSTER = 10;
export const XP_PER_CARD_NEW = 5;

export const DAILY_REWARD_BASE = 25;
export const DAILY_REWARD_STREAK_BONUS = 10;
export const DAILY_REWARD_MAX_STREAK = 7;

export const STARTER_GEMS = 200;

export const FREE_DAILY_BOOSTERS = 3;
