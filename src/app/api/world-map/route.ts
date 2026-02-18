import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { REGIONS, RARITIES } from "@/lib/constants";
import type { RegionSlug, ExplorationMissionWithStatus, RegionData } from "@/types/game";

const RARITY_RANK: Record<string, number> = {};
RARITIES.forEach((r, i) => {
  RARITY_RANK[r] = i + 1;
});

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Fetch everything in parallel
  const [
    { data: missions },
    { data: progress },
    { data: userCards },
    { data: userBoosters },
    { data: userCodex },
    { data: storyArcs },
    { data: storyChapters },
    { data: storyNodes },
    { data: userStoryProgress },
  ] = await Promise.all([
    admin.from("exploration_missions").select("*").order("sort_order"),
    admin.from("user_exploration_progress").select("*").eq("user_id", user.id),
    admin
      .from("user_cards")
      .select("card_id, quantity, cards:card_id(id, faction, rarity)")
      .eq("user_id", user.id),
    admin
      .from("user_boosters")
      .select("id, booster_type_id, opened_at, booster_types:booster_type_id(faction_filter)")
      .eq("user_id", user.id)
      .not("opened_at", "is", null),
    admin.from("user_codex").select("node_id").eq("user_id", user.id),
    admin.from("story_arcs").select("id, slug, region"),
    admin.from("story_chapters").select("id, arc_id"),
    admin.from("story_nodes").select("id, chapter_id"),
    admin.from("user_story_progress").select("node_id").eq("user_id", user.id),
  ]);

  const completedMissionIds = new Set(
    (progress || []).filter((p) => p.completed).map((p) => p.mission_id)
  );

  // Build lookup structures

  // Cards by faction: distinct card IDs
  const factionCards: Record<string, Set<string>> = {};
  // Cards by faction+rarity: highest rarity per faction
  const factionCardsByRarity: Record<string, Set<string>> = {};
  // All cards by faction: group by rarity for collect_all_faction_rarity
  const factionRarityCards: Record<string, Record<number, Set<string>>> = {};

  // We also need to know total cards per faction per rarity in the DB
  const { data: allCards } = await admin.from("cards").select("id, faction, rarity");
  const totalFactionRarityCards: Record<string, Record<number, number>> = {};

  for (const card of allCards || []) {
    if (!card.faction) continue;
    const rank = RARITY_RANK[card.rarity] || 0;
    if (!totalFactionRarityCards[card.faction]) totalFactionRarityCards[card.faction] = {};
    totalFactionRarityCards[card.faction][rank] =
      (totalFactionRarityCards[card.faction][rank] || 0) + 1;
  }

  for (const uc of userCards || []) {
    const card = uc.cards as unknown as { id: string; faction: string | null; rarity: string } | null;
    if (!card || !card.faction) continue;
    const faction = card.faction;
    const rank = RARITY_RANK[card.rarity] || 0;

    // Distinct cards per faction
    if (!factionCards[faction]) factionCards[faction] = new Set();
    factionCards[faction].add(card.id);

    // Cards by faction grouped by rarity rank
    const key = `${faction}_${rank}`;
    if (!factionCardsByRarity[key]) factionCardsByRarity[key] = new Set();
    factionCardsByRarity[key].add(card.id);

    // For collect_all_faction_rarity
    if (!factionRarityCards[faction]) factionRarityCards[faction] = {};
    if (!factionRarityCards[faction][rank]) factionRarityCards[faction][rank] = new Set();
    factionRarityCards[faction][rank].add(card.id);
  }

  // Opened boosters per faction
  const factionBoostersOpened: Record<string, number> = {};
  for (const ub of userBoosters || []) {
    const bt = ub.booster_types as unknown as { faction_filter: string | null } | null;
    if (!bt?.faction_filter) continue;
    factionBoostersOpened[bt.faction_filter] =
      (factionBoostersOpened[bt.faction_filter] || 0) + 1;
  }

  // Codex entries per region
  // We need node → chapter → arc → region mapping
  const chapterToArc: Record<string, string> = {};
  for (const ch of storyChapters || []) {
    chapterToArc[ch.id] = ch.arc_id;
  }
  const nodeToChapter: Record<string, string> = {};
  for (const nd of storyNodes || []) {
    nodeToChapter[nd.id] = nd.chapter_id;
  }
  const arcRegion: Record<string, string | null> = {};
  for (const arc of storyArcs || []) {
    arcRegion[arc.id] = arc.region;
  }

  const codexByRegion: Record<string, number> = {};
  for (const entry of userCodex || []) {
    const chapterId = nodeToChapter[entry.node_id];
    if (!chapterId) continue;
    const arcId = chapterToArc[chapterId];
    if (!arcId) continue;
    const region = arcRegion[arcId];
    if (!region) continue;
    codexByRegion[region] = (codexByRegion[region] || 0) + 1;
  }

  // Story arc completion per region
  // An arc is complete if all its nodes are completed
  const completedNodeIds = new Set(
    (userStoryProgress || []).map((p) => p.node_id)
  );
  const arcNodes: Record<string, string[]> = {};
  for (const nd of storyNodes || []) {
    const chId = nd.chapter_id;
    const arcId = chapterToArc[chId];
    if (!arcId) continue;
    if (!arcNodes[arcId]) arcNodes[arcId] = [];
    arcNodes[arcId].push(nd.id);
  }

  const regionArcCompleted: Record<string, boolean> = {};
  for (const arc of storyArcs || []) {
    if (!arc.region) continue;
    const nodes = arcNodes[arc.id] || [];
    const allDone = nodes.length > 0 && nodes.every((nId) => completedNodeIds.has(nId));
    regionArcCompleted[arc.region] = allDone;
  }

  // Evaluate each mission
  function evaluateMission(mission: {
    condition_type: string;
    condition_value: number;
    condition_faction: string | null;
    region: string;
  }): { eligible: boolean; current_progress: number } {
    const { condition_type, condition_value, condition_faction, region } = mission;

    switch (condition_type) {
      case "collect_faction_cards": {
        const count = condition_faction
          ? factionCards[condition_faction]?.size || 0
          : 0;
        return { eligible: count >= condition_value, current_progress: count };
      }
      case "collect_faction_rarity": {
        // condition_value = min rarity rank (3=rare, 4=epic, 5=legendary)
        if (!condition_faction) return { eligible: false, current_progress: 0 };
        let count = 0;
        for (let r = condition_value; r <= 5; r++) {
          const key = `${condition_faction}_${r}`;
          count += factionCardsByRarity[key]?.size || 0;
        }
        return { eligible: count >= 1, current_progress: Math.min(count, 1) };
      }
      case "collect_all_faction_rarity": {
        // condition_value = rarity rank (1=common)
        if (!condition_faction) return { eligible: false, current_progress: 0 };
        const owned = factionRarityCards[condition_faction]?.[condition_value]?.size || 0;
        const total = totalFactionRarityCards[condition_faction]?.[condition_value] || 0;
        return {
          eligible: total > 0 && owned >= total,
          current_progress: owned,
        };
      }
      case "open_faction_boosters": {
        const count = condition_faction
          ? factionBoostersOpened[condition_faction] || 0
          : 0;
        return { eligible: count >= condition_value, current_progress: count };
      }
      case "discover_region_codex": {
        const count = codexByRegion[region] || 0;
        return { eligible: count >= condition_value, current_progress: count };
      }
      case "complete_story_arc": {
        const done = regionArcCompleted[region] || false;
        return { eligible: done, current_progress: done ? 1 : 0 };
      }
      default:
        return { eligible: false, current_progress: 0 };
    }
  }

  // Build region data
  const regions: RegionData[] = REGIONS.map((slug) => {
    const regionMissions = (missions || []).filter((m) => m.region === slug);

    const enrichedMissions: ExplorationMissionWithStatus[] = regionMissions.map(
      (m) => {
        const completed = completedMissionIds.has(m.id);
        const { eligible, current_progress } = evaluateMission(m);
        return {
          ...m,
          completed,
          eligible: completed ? false : eligible,
          current_progress,
        };
      }
    );

    return {
      slug: slug as RegionSlug,
      missions: enrichedMissions,
      completedCount: enrichedMissions.filter((m) => m.completed).length,
      totalCount: enrichedMissions.length,
    };
  });

  return NextResponse.json({ regions });
}
