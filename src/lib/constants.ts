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
  artifact: "Cristal",
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
  dome_dwellers: "Le Consortium",
  underground_resistance: "Les Profonds",
  surface_survivors: "Les Gardiens du Réseau",
  tech_scavengers: "L'Ordre Ancien",
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

// Feature 9: Foil cards
export const FOIL_CHANCE = 0.05;

// Feature 6: Fusion / Crafting
export const FUSION_COST: Record<string, number> = {
  common: 5,
  uncommon: 5,
  rare: 4,
  epic: 3,
};

export const FUSION_TARGET: Record<string, string> = {
  common: "uncommon",
  uncommon: "rare",
  rare: "epic",
  epic: "legendary",
};

export const RECYCLE_GEM_VALUES: Record<string, number> = {
  common: 5,
  uncommon: 15,
  rare: 40,
  epic: 100,
  legendary: 250,
};

// World Map — Regions
export const REGIONS = ["neon_ruins", "ash_desert", "toxic_ocean"] as const;
export type RegionConst = (typeof REGIONS)[number];

export const REGION_LABELS: Record<RegionConst, string> = {
  neon_ruins: "Géode de Madagascar",
  ash_desert: "Plateaux de l'Inde",
  toxic_ocean: "Abysses de Sibérie",
};

export const REGION_COLORS: Record<RegionConst, string> = {
  neon_ruins: "#38BDF8",
  ash_desert: "#F59E0B",
  toxic_ocean: "#22D3EE",
};

export const REGION_DESCRIPTIONS: Record<RegionConst, string> = {
  neon_ruins: "Site de la découverte originelle. Immenses cavernes cristallines aux reflets émeraude. L'Ordre Ancien et Les Profonds s'y affrontent.",
  ash_desert: "Vaste réseau de filons cristallins en surface. Les Gardiens du Réseau y ont établi leurs laboratoires de terrain.",
  toxic_ocean: "Les cristaux les plus profonds et les plus puissants. Mines dangereuses contrôlées par Les Profonds.",
};

export const REGION_FACTIONS: Record<RegionConst, FactionConst[]> = {
  neon_ruins: ["tech_scavengers", "underground_resistance"],
  ash_desert: ["surface_survivors"],
  toxic_ocean: ["underground_resistance"],
};

// Faction Encyclopedia — slug mapping (URL ↔ DB key)
export const FACTION_SLUGS = ["dome-dwellers", "underground-resistance", "surface-survivors", "tech-scavengers"] as const;
export type FactionSlug = (typeof FACTION_SLUGS)[number];

export const SLUG_TO_FACTION: Record<FactionSlug, FactionConst> = {
  "dome-dwellers": "dome_dwellers",
  "underground-resistance": "underground_resistance",
  "surface-survivors": "surface_survivors",
  "tech-scavengers": "tech_scavengers",
};

export const FACTION_TO_SLUG: Record<FactionConst, FactionSlug> = {
  dome_dwellers: "dome-dwellers",
  underground_resistance: "underground-resistance",
  surface_survivors: "surface-survivors",
  tech_scavengers: "tech-scavengers",
};

// Narrative Events
export const EVENT_PARTICIPATION_REWARD_BONUS = 25; // bonus gems if winning choice

// Feature 8: Missions
export const MISSION_TEMPLATES = {
  daily: [
    { name: "Ouvreur de boosters", description: "Ouvre {value} booster(s)", condition_type: "open_boosters", condition_value: 2, reward_gems: 30, reward_xp: 20 },
    { name: "Collectionneur du jour", description: "Obtiens {value} nouvelle(s) carte(s)", condition_type: "collect_cards", condition_value: 3, reward_gems: 25, reward_xp: 15 },
    { name: "Acheteur malin", description: "Achète {value} booster(s)", condition_type: "purchase_boosters", condition_value: 1, reward_gems: 20, reward_xp: 10 },
    { name: "Recycleur", description: "Recycle {value} carte(s)", condition_type: "recycle_cards", condition_value: 3, reward_gems: 20, reward_xp: 15 },
    { name: "Alchimiste", description: "Fusionne {value} fois", condition_type: "craft_fusion", condition_value: 1, reward_gems: 35, reward_xp: 25 },
  ],
  weekly: [
    { name: "Maître des boosters", description: "Ouvre {value} boosters cette semaine", condition_type: "open_boosters", condition_value: 10, reward_gems: 150, reward_xp: 100 },
    { name: "Grand collectionneur", description: "Obtiens {value} nouvelles cartes", condition_type: "collect_cards", condition_value: 15, reward_gems: 120, reward_xp: 80 },
    { name: "Forgeron de la semaine", description: "Fusionne {value} fois cette semaine", condition_type: "craft_fusion", condition_value: 5, reward_gems: 100, reward_xp: 75 },
    { name: "Récupérateur d'élite", description: "Recycle {value} cartes cette semaine", condition_type: "recycle_cards", condition_value: 15, reward_gems: 100, reward_xp: 60 },
  ],
};
