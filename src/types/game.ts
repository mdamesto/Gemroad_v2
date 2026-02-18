import type { Database } from "./database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Achievement = Database["public"]["Tables"]["achievements"]["Row"];
export type UserAchievement = Database["public"]["Tables"]["user_achievements"]["Row"];
export type UserSeriesProgress = Database["public"]["Tables"]["user_series_progress"]["Row"];
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export type DailyReward = Database["public"]["Tables"]["daily_rewards"]["Row"];
export type TalentTree = Database["public"]["Tables"]["talent_trees"]["Row"];
export type Talent = Database["public"]["Tables"]["talents"]["Row"];
export type UserTalent = Database["public"]["Tables"]["user_talents"]["Row"];

export interface AchievementWithStatus extends Achievement {
  unlocked: boolean;
  claimed: boolean;
  unlocked_at?: string;
}

export interface SeriesProgressWithDetails {
  series_id: string;
  series_name: string;
  series_description: string | null;
  series_image_url: string | null;
  total_cards: number;
  cards_collected: number;
  completed: boolean;
  reward_type: string;
  reward_desc: string | null;
  reward_claimed: boolean;
}

export interface TalentTreeWithTalents extends TalentTree {
  talents: Talent[];
}

export interface TalentWithStatus extends Talent {
  unlocked: boolean;
  unlocked_at?: string;
}

export type Mission = Database["public"]["Tables"]["missions"]["Row"];
export type UserMission = Database["public"]["Tables"]["user_missions"]["Row"];

export interface MissionWithProgress extends Mission {
  user_mission_id?: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
  expires_at?: string;
}

export type StoryArc = Database["public"]["Tables"]["story_arcs"]["Row"];
export type StoryChapter = Database["public"]["Tables"]["story_chapters"]["Row"];
export type StoryNode = Database["public"]["Tables"]["story_nodes"]["Row"];
export type UserStoryProgress = Database["public"]["Tables"]["user_story_progress"]["Row"];
export type UserCodex = Database["public"]["Tables"]["user_codex"]["Row"];

export interface StoryNodeWithStatus extends StoryNode {
  completed: boolean;
  canUnlock: boolean;
  requiredCardNames: string[];
  requiredAnyCardNames: string[];
}

export interface StoryChapterWithNodes extends StoryChapter {
  nodes: StoryNodeWithStatus[];
  completedCount: number;
  totalCount: number;
}

export interface StoryArcWithChapters extends StoryArc {
  chapters: StoryChapterWithNodes[];
  completedNodes: number;
  totalNodes: number;
  hasUnlockable: boolean;
}

export interface CodexEntry {
  node_id: string;
  title: string;
  codex_entry: string;
  arc_name: string;
  arc_slug: string;
  unlocked: boolean;
  unlocked_at?: string;
}

// World Map / Exploration
export type ExplorationMission = Database["public"]["Tables"]["exploration_missions"]["Row"];
export type UserExplorationProgress = Database["public"]["Tables"]["user_exploration_progress"]["Row"];

export type RegionSlug = "neon_ruins" | "ash_desert" | "toxic_ocean";

export interface ExplorationMissionWithStatus extends ExplorationMission {
  completed: boolean;
  eligible: boolean;
  current_progress: number;
}

export interface RegionData {
  slug: RegionSlug;
  missions: ExplorationMissionWithStatus[];
  completedCount: number;
  totalCount: number;
}
