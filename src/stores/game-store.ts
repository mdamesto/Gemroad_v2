import { create } from "zustand";
import type { Card } from "@/types/cards";

const RARITY_ORDER: Record<string, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
};

interface BoosterOpenState {
  isOpening: boolean;
  revealedCards: Card[];
  currentIndex: number;
}

interface GameStore {
  boosterOpen: BoosterOpenState;
  sidebarOpen: boolean;

  startBoosterOpen: (cards: Card[]) => void;
  revealNextCard: () => void;
  closeBoosterOpen: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  boosterOpen: {
    isOpening: false,
    revealedCards: [],
    currentIndex: -1,
  },
  sidebarOpen: false,

  startBoosterOpen: (cards) => {
    const sorted = [...cards].sort(
      (a, b) => (RARITY_ORDER[a.rarity] ?? 0) - (RARITY_ORDER[b.rarity] ?? 0)
    );
    set({
      boosterOpen: {
        isOpening: true,
        revealedCards: sorted,
        currentIndex: -1,
      },
    });
  },

  revealNextCard: () =>
    set((state) => ({
      boosterOpen: {
        ...state.boosterOpen,
        currentIndex: state.boosterOpen.currentIndex + 1,
      },
    })),

  closeBoosterOpen: () =>
    set({
      boosterOpen: {
        isOpening: false,
        revealedCards: [],
        currentIndex: -1,
      },
    }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
