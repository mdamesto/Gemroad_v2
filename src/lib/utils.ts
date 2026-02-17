import { Rarity, XP_PER_LEVEL } from "./constants";

export function pickRarity(dropRates: Record<string, number>): Rarity {
  const rand = Math.random();
  let cumulative = 0;

  const entries = Object.entries(dropRates).sort((a, b) => a[1] - b[1]);

  for (const [rarity, rate] of entries) {
    cumulative += rate;
    if (rand <= cumulative) {
      return rarity as Rarity;
    }
  }

  return "common";
}

export function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpToNextLevel(xp: number): number {
  return XP_PER_LEVEL - (xp % XP_PER_LEVEL);
}

export function formatGems(amount: number): string {
  return amount.toLocaleString("fr-FR");
}

export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}
