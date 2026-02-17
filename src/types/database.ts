export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          gems_balance: number;
          level: number;
          xp: number;
          talent_points: number;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          gems_balance?: number;
          level?: number;
          xp?: number;
          talent_points?: number;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          avatar_url?: string | null;
          gems_balance?: number;
          level?: number;
          xp?: number;
          talent_points?: number;
          is_admin?: boolean;
          updated_at?: string;
        };
      };
      cards: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image_url: string;
          rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
          type: "character" | "artifact" | "location" | "event";
          faction: "dome_dwellers" | "underground_resistance" | "surface_survivors" | "tech_scavengers" | null;
          series_id: string | null;
          attack: number | null;
          defense: number | null;
          lore: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          image_url: string;
          rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
          type?: "character" | "artifact" | "location" | "event";
          faction?: "dome_dwellers" | "underground_resistance" | "surface_survivors" | "tech_scavengers" | null;
          series_id?: string | null;
          attack?: number | null;
          defense?: number | null;
          lore?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          image_url?: string;
          rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";
          type?: "character" | "artifact" | "location" | "event";
          faction?: "dome_dwellers" | "underground_resistance" | "surface_survivors" | "tech_scavengers" | null;
          series_id?: string | null;
          attack?: number | null;
          defense?: number | null;
          lore?: string | null;
        };
      };
      series: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image_url: string | null;
          total_cards: number;
          reward_type: string;
          reward_desc: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          total_cards: number;
          reward_type: string;
          reward_desc?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          image_url?: string | null;
          total_cards?: number;
          reward_type?: string;
          reward_desc?: string | null;
          is_active?: boolean;
        };
      };
      booster_types: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image_url: string | null;
          cards_count: number;
          price_gems: number;
          price_cents: number | null;
          drop_rates: Json;
          faction_filter: string | null;
          guaranteed_rarity: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          cards_count?: number;
          price_gems: number;
          price_cents?: number | null;
          drop_rates: Json;
          faction_filter?: string | null;
          guaranteed_rarity?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          image_url?: string | null;
          cards_count?: number;
          price_gems?: number;
          price_cents?: number | null;
          drop_rates?: Json;
          faction_filter?: string | null;
          guaranteed_rarity?: string | null;
          is_active?: boolean;
        };
      };
      user_cards: {
        Row: {
          id: string;
          user_id: string;
          card_id: string;
          quantity: number;
          obtained_at: string;
          obtained_from: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          card_id: string;
          quantity?: number;
          obtained_at?: string;
          obtained_from?: string | null;
        };
        Update: {
          quantity?: number;
          obtained_from?: string | null;
        };
      };
      user_boosters: {
        Row: {
          id: string;
          user_id: string;
          booster_type_id: string;
          purchased_at: string;
          opened_at: string | null;
          obtained_from: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          booster_type_id: string;
          purchased_at?: string;
          opened_at?: string | null;
          obtained_from?: string | null;
        };
        Update: {
          opened_at?: string | null;
          obtained_from?: string | null;
        };
      };
      achievements: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon_url: string | null;
          condition_type: string;
          condition_value: number;
          reward_gems: number;
          reward_xp: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon_url?: string | null;
          condition_type: string;
          condition_value: number;
          reward_gems?: number;
          reward_xp?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          description?: string;
          icon_url?: string | null;
          condition_type?: string;
          condition_value?: number;
          reward_gems?: number;
          reward_xp?: number;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          unlocked_at: string;
          claimed: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          unlocked_at?: string;
          claimed?: boolean;
        };
        Update: {
          claimed?: boolean;
        };
      };
      user_series_progress: {
        Row: {
          id: string;
          user_id: string;
          series_id: string;
          cards_collected: number;
          completed: boolean;
          completed_at: string | null;
          reward_claimed: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          series_id: string;
          cards_collected?: number;
          completed?: boolean;
          completed_at?: string | null;
          reward_claimed?: boolean;
        };
        Update: {
          cards_collected?: number;
          completed?: boolean;
          completed_at?: string | null;
          reward_claimed?: boolean;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          amount: number;
          description: string | null;
          stripe_session_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          amount: number;
          description?: string | null;
          stripe_session_id?: string | null;
          created_at?: string;
        };
        Update: {
          type?: string;
          amount?: number;
          description?: string | null;
        };
      };
      daily_rewards: {
        Row: {
          id: string;
          user_id: string;
          day_streak: number;
          gems_earned: number;
          claimed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          day_streak?: number;
          gems_earned: number;
          claimed_at?: string;
        };
        Update: {
          day_streak?: number;
          gems_earned?: number;
        };
      };
      talent_trees: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          faction: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          faction: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          faction?: string;
        };
      };
      talents: {
        Row: {
          id: string;
          talent_tree_id: string;
          name: string;
          description: string | null;
          tier: number;
          cost: number;
          effect_type: string;
          effect_value: Json;
          prerequisite_talent_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          talent_tree_id: string;
          name: string;
          description?: string | null;
          tier?: number;
          cost?: number;
          effect_type: string;
          effect_value?: Json;
          prerequisite_talent_id?: string | null;
          created_at?: string;
        };
        Update: {
          talent_tree_id?: string;
          name?: string;
          description?: string | null;
          tier?: number;
          cost?: number;
          effect_type?: string;
          effect_value?: Json;
          prerequisite_talent_id?: string | null;
        };
      };
      user_talents: {
        Row: {
          id: string;
          user_id: string;
          talent_id: string;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          talent_id: string;
          unlocked_at?: string;
        };
        Update: {
          user_id?: string;
          talent_id?: string;
        };
      };
    };
  };
}
