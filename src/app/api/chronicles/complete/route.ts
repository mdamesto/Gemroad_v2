import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { nodeId } = await request.json();

  if (!nodeId) {
    return NextResponse.json({ error: "nodeId requis" }, { status: 400 });
  }

  const admin = createAdminClient();

  // 1. Get the node
  const { data: node } = await admin
    .from("story_nodes")
    .select("*")
    .eq("id", nodeId)
    .single();

  if (!node) {
    return NextResponse.json({ error: "Noeud non trouvé" }, { status: 404 });
  }

  // 2. Check if already completed
  const { data: existing } = await admin
    .from("user_story_progress")
    .select("id")
    .eq("user_id", user.id)
    .eq("node_id", nodeId)
    .single();

  if (existing) {
    return NextResponse.json({ error: "Déjà complété" }, { status: 400 });
  }

  // 3. Check parent node is completed (if any)
  if (node.parent_node_id) {
    // If parent is a choice node, check if any sibling choice was completed
    const { data: parentNode } = await admin
      .from("story_nodes")
      .select("is_choice, parent_node_id")
      .eq("id", node.parent_node_id)
      .single();

    if (parentNode?.is_choice) {
      // This is a convergence node — check if any choice from same parent is completed
      const { data: siblingChoices } = await admin
        .from("story_nodes")
        .select("id")
        .eq("parent_node_id", parentNode.parent_node_id)
        .eq("is_choice", true);

      const choiceIds = (siblingChoices || []).map((s) => s.id);
      const { data: completedChoices } = await admin
        .from("user_story_progress")
        .select("node_id")
        .eq("user_id", user.id)
        .in("node_id", choiceIds);

      if (!completedChoices || completedChoices.length === 0) {
        return NextResponse.json({ error: "Noeud parent non complété" }, { status: 400 });
      }
    } else {
      const { data: parentProgress } = await admin
        .from("user_story_progress")
        .select("id")
        .eq("user_id", user.id)
        .eq("node_id", node.parent_node_id)
        .single();

      if (!parentProgress) {
        return NextResponse.json({ error: "Noeud parent non complété" }, { status: 400 });
      }
    }
  }

  // 4. Check if this is a choice node and a sibling choice was already completed
  if (node.is_choice && node.parent_node_id) {
    const { data: siblings } = await admin
      .from("story_nodes")
      .select("id")
      .eq("parent_node_id", node.parent_node_id)
      .eq("is_choice", true)
      .neq("id", nodeId);

    const siblingIds = (siblings || []).map((s) => s.id);
    if (siblingIds.length > 0) {
      const { data: completedSiblings } = await admin
        .from("user_story_progress")
        .select("id")
        .eq("user_id", user.id)
        .in("node_id", siblingIds);

      if (completedSiblings && completedSiblings.length > 0) {
        return NextResponse.json({ error: "Un autre choix a déjà été fait" }, { status: 400 });
      }
    }
  }

  // 5. Check required cards (AND)
  const requiredCards: string[] = node.required_cards || [];
  if (requiredCards.length > 0) {
    const { data: ownedCards } = await admin
      .from("user_cards")
      .select("card_id")
      .eq("user_id", user.id)
      .in("card_id", requiredCards);

    const ownedIds = new Set((ownedCards || []).map((c) => c.card_id));
    const missingCards = requiredCards.filter((id) => !ownedIds.has(id));

    if (missingCards.length > 0) {
      return NextResponse.json({ error: "Cartes requises manquantes" }, { status: 400 });
    }
  }

  // 6. Check required_any_cards (OR)
  const requiredAnyCards: string[] = node.required_any_cards || [];
  if (requiredAnyCards.length > 0) {
    const { data: ownedAny } = await admin
      .from("user_cards")
      .select("card_id")
      .eq("user_id", user.id)
      .in("card_id", requiredAnyCards);

    if (!ownedAny || ownedAny.length === 0) {
      return NextResponse.json({ error: "Au moins une carte requise manquante" }, { status: 400 });
    }
  }

  // 7. Insert progress
  await admin.from("user_story_progress").insert({
    user_id: user.id,
    node_id: nodeId,
  });

  // 8. Insert codex entry if exists
  if (node.codex_entry) {
    await admin.from("user_codex").insert({
      user_id: user.id,
      node_id: nodeId,
    });
  }

  // 9. Calculate rewards
  let totalGems = node.reward_gems || 0;
  let totalXp = node.reward_xp || 0;

  // Check if chapter is now complete
  const { data: chapterNodes } = await admin
    .from("story_nodes")
    .select("id")
    .eq("chapter_id", node.chapter_id);

  const chapterNodeIds = (chapterNodes || []).map((n) => n.id);

  const { data: completedChapterNodes } = await admin
    .from("user_story_progress")
    .select("node_id")
    .eq("user_id", user.id)
    .in("node_id", chapterNodeIds);

  // A chapter is complete if all non-choice alternatives are completed
  // For simplicity, count completed nodes vs minimum required (total - one branch per choice)
  const completedSet = new Set((completedChapterNodes || []).map((n) => n.node_id));
  const allChapterNodesData = await admin
    .from("story_nodes")
    .select("*")
    .eq("chapter_id", node.chapter_id);

  const chapterNodesAll = allChapterNodesData.data || [];
  // Find choice groups: nodes with same parent_node_id and is_choice=true
  const choiceGroups = new Map<string, string[]>();
  for (const n of chapterNodesAll) {
    if (n.is_choice && n.parent_node_id) {
      const group = choiceGroups.get(n.parent_node_id) || [];
      group.push(n.id);
      choiceGroups.set(n.parent_node_id, group);
    }
  }

  // For each choice group, at least one must be completed
  // For non-choice nodes, all must be completed
  let chapterComplete = true;
  for (const n of chapterNodesAll) {
    if (n.is_choice) continue; // handled via groups
    if (!completedSet.has(n.id)) {
      chapterComplete = false;
      break;
    }
  }
  for (const [, group] of choiceGroups) {
    if (!group.some((id) => completedSet.has(id))) {
      chapterComplete = false;
      break;
    }
  }

  if (chapterComplete) {
    const { data: chapter } = await admin
      .from("story_chapters")
      .select("reward_gems, reward_xp")
      .eq("id", node.chapter_id)
      .single();

    if (chapter) {
      totalGems += chapter.reward_gems || 0;
      totalXp += chapter.reward_xp || 0;
    }
  }

  // 10. Give rewards
  if (totalGems > 0 || totalXp > 0) {
    const { data: profile } = await admin
      .from("profiles")
      .select("gems_balance, xp")
      .eq("id", user.id)
      .single();

    if (profile) {
      await admin
        .from("profiles")
        .update({
          gems_balance: (profile.gems_balance || 0) + totalGems,
          xp: (profile.xp || 0) + totalXp,
        })
        .eq("id", user.id);
    }
  }

  return NextResponse.json({
    success: true,
    gems: totalGems,
    xp: totalXp,
    chapterComplete,
    codexUnlocked: !!node.codex_entry,
    codexEntry: node.codex_entry,
  });
}
