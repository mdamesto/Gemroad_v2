import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { RARITIES } from "@/lib/constants";

const RARITY_RANK: Record<string, number> = {};
RARITIES.forEach((r, i) => {
  RARITY_RANK[r] = i + 1;
});

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { missionId } = await request.json();

  if (!missionId) {
    return NextResponse.json({ error: "ID de mission requis" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Get mission
  const { data: mission } = await admin
    .from("exploration_missions")
    .select("*")
    .eq("id", missionId)
    .single();

  if (!mission) {
    return NextResponse.json({ error: "Mission non trouvée" }, { status: 404 });
  }

  // Check not already completed
  const { data: existing } = await admin
    .from("user_exploration_progress")
    .select("id")
    .eq("user_id", user.id)
    .eq("mission_id", missionId)
    .eq("completed", true)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "Mission déjà complétée" }, { status: 400 });
  }

  // Re-verify condition server-side
  const eligible = await verifyCondition(admin, user.id, mission);

  if (!eligible) {
    return NextResponse.json({ error: "Condition non remplie" }, { status: 400 });
  }

  // Mark as completed
  await admin.from("user_exploration_progress").upsert({
    user_id: user.id,
    mission_id: missionId,
    completed: true,
    completed_at: new Date().toISOString(),
  });

  // Award gems + XP
  const { data: profile } = await admin
    .from("profiles")
    .select("gems_balance, xp, level, talent_points")
    .eq("id", user.id)
    .single();

  if (profile) {
    const newXp = profile.xp + (mission.reward_xp || 0);
    const newLevel = Math.floor(newXp / 100) + 1;
    const levelsGained = newLevel - profile.level;

    await admin
      .from("profiles")
      .update({
        gems_balance: profile.gems_balance + mission.reward_gems,
        xp: newXp,
        level: newLevel,
        talent_points: profile.talent_points + Math.max(0, levelsGained),
      })
      .eq("id", user.id);
  }

  // Log transaction
  await admin.from("transactions").insert({
    user_id: user.id,
    type: "earn_gems",
    amount: mission.reward_gems,
    description: `Exploration : ${mission.title}`,
  });

  return NextResponse.json({
    success: true,
    gems: mission.reward_gems,
    xp: mission.reward_xp,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function verifyCondition(admin: any, userId: string, mission: any): Promise<boolean> {
  const { condition_type, condition_value, condition_faction, region } = mission;

  switch (condition_type) {
    case "collect_faction_cards": {
      const { data: userCards } = await admin
        .from("user_cards")
        .select("card_id, cards:card_id(faction)")
        .eq("user_id", userId);
      const distinctCards = new Set<string>();
      for (const uc of userCards || []) {
        const card = uc.cards as unknown as { faction: string | null } | null;
        if (card?.faction === condition_faction) distinctCards.add(uc.card_id);
      }
      return distinctCards.size >= condition_value;
    }

    case "collect_faction_rarity": {
      const { data: userCards } = await admin
        .from("user_cards")
        .select("card_id, cards:card_id(faction, rarity)")
        .eq("user_id", userId);
      for (const uc of userCards || []) {
        const card = uc.cards as unknown as { faction: string | null; rarity: string } | null;
        if (card && card.faction === condition_faction) {
          const rank = RARITY_RANK[card.rarity] || 0;
          if (rank >= condition_value) return true;
        }
      }
      return false;
    }

    case "collect_all_faction_rarity": {
      const { data: allCards } = await admin
        .from("cards")
        .select("id")
        .eq("faction", condition_faction)
        .eq("rarity", RARITIES[condition_value - 1]);
      const { data: userCards } = await admin
        .from("user_cards")
        .select("card_id, cards:card_id(faction, rarity)")
        .eq("user_id", userId);
      const ownedIds = new Set<string>();
      for (const uc of userCards || []) {
        const card = uc.cards as unknown as { faction: string | null; rarity: string } | null;
        if (card && card.faction === condition_faction && RARITY_RANK[card.rarity] === condition_value) {
          ownedIds.add(uc.card_id);
        }
      }
      const total = (allCards || []).length;
      return total > 0 && ownedIds.size >= total;
    }

    case "open_faction_boosters": {
      const { data: boosters } = await admin
        .from("user_boosters")
        .select("id, booster_types:booster_type_id(faction_filter)")
        .eq("user_id", userId)
        .not("opened_at", "is", null);
      let count = 0;
      for (const b of boosters || []) {
        const bt = b.booster_types as unknown as { faction_filter: string | null } | null;
        if (bt?.faction_filter === condition_faction) count++;
      }
      return count >= condition_value;
    }

    case "discover_region_codex": {
      const { data: codex } = await admin
        .from("user_codex")
        .select("node_id")
        .eq("user_id", userId);
      const { data: nodes } = await admin.from("story_nodes").select("id, chapter_id");
      const { data: chapters } = await admin.from("story_chapters").select("id, arc_id");
      const { data: arcs } = await admin.from("story_arcs").select("id, region");

      const chapterToArc: Record<string, string> = {};
      for (const ch of chapters || []) chapterToArc[ch.id] = ch.arc_id;
      const nodeToChapter: Record<string, string> = {};
      for (const nd of nodes || []) nodeToChapter[nd.id] = nd.chapter_id;
      const arcRegion: Record<string, string | null> = {};
      for (const arc of arcs || []) arcRegion[arc.id] = arc.region;

      let count = 0;
      for (const entry of codex || []) {
        const chId = nodeToChapter[entry.node_id];
        if (!chId) continue;
        const arcId = chapterToArc[chId];
        if (!arcId) continue;
        if (arcRegion[arcId] === region) count++;
      }
      return count >= condition_value;
    }

    case "complete_story_arc": {
      const { data: arcs } = await admin
        .from("story_arcs")
        .select("id")
        .eq("region", region);
      if (!arcs?.length) return false;
      const arcId = arcs[0].id;

      const { data: chapters } = await admin
        .from("story_chapters")
        .select("id")
        .eq("arc_id", arcId);
      const chapterIds = (chapters || []).map((c: { id: string }) => c.id);
      if (!chapterIds.length) return false;

      const { data: nodes } = await admin
        .from("story_nodes")
        .select("id")
        .in("chapter_id", chapterIds);
      const nodeIds = (nodes || []).map((n: { id: string }) => n.id);
      if (!nodeIds.length) return false;

      const { data: progress } = await admin
        .from("user_story_progress")
        .select("node_id")
        .eq("user_id", userId)
        .in("node_id", nodeIds);
      const completedIds = new Set((progress || []).map((p: { node_id: string }) => p.node_id));
      return nodeIds.every((nId: string) => completedIds.has(nId));
    }

    default:
      return false;
  }
}
