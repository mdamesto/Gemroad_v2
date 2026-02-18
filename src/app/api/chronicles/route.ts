import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Fetch all arcs, chapters, nodes
  const [
    { data: arcs },
    { data: chapters },
    { data: nodes },
    { data: progress },
    { data: userCards },
    { data: codexEntries },
    { data: allCards },
  ] = await Promise.all([
    admin.from("story_arcs").select("*").order("sort_order"),
    admin.from("story_chapters").select("*").order("sort_order"),
    admin.from("story_nodes").select("*").order("sort_order"),
    admin.from("user_story_progress").select("*").eq("user_id", user.id),
    admin.from("user_cards").select("card_id").eq("user_id", user.id),
    admin.from("user_codex").select("*").eq("user_id", user.id),
    admin.from("cards").select("id, name"),
  ]);

  if (!arcs || !chapters || !nodes) {
    return NextResponse.json({ error: "Données non trouvées" }, { status: 500 });
  }

  const completedNodeIds = new Set((progress || []).map((p) => p.node_id));
  const ownedCardIds = new Set((userCards || []).map((uc) => uc.card_id));
  const codexNodeIds = new Set((codexEntries || []).map((c) => c.node_id));
  const cardNameMap = new Map((allCards || []).map((c) => [c.id, c.name]));

  // Build enriched nodes
  const enrichedNodes = (nodes || []).map((node) => {
    const completed = completedNodeIds.has(node.id);

    // Check if parent is completed (or null = first node)
    const parentCompleted = !node.parent_node_id || completedNodeIds.has(node.parent_node_id);

    // For choice nodes where parent_node_id points to the same parent as a sibling choice,
    // check if either sibling choice is already completed
    const siblingChoices = (nodes || []).filter(
      (n) => n.parent_node_id === node.parent_node_id && n.is_choice && n.id !== node.id
    );
    const siblingCompleted = siblingChoices.some((s) => completedNodeIds.has(s.id));

    // For convergence nodes (non-choice nodes after choices), check if any choice leading to it is completed
    // A convergence node's parent is one of the choice nodes
    const parentIsChoice = (nodes || []).find((n) => n.id === node.parent_node_id)?.is_choice;
    let choiceParentCompleted = parentCompleted;
    if (parentIsChoice) {
      // Find all choice nodes that share the same parent as this node's parent
      const parentNode = (nodes || []).find((n) => n.id === node.parent_node_id);
      const allChoiceNodes = (nodes || []).filter(
        (n) => n.parent_node_id === parentNode?.parent_node_id && n.is_choice
      );
      choiceParentCompleted = allChoiceNodes.some((c) => completedNodeIds.has(c.id));
    }

    // Check required cards (AND logic)
    const requiredCards = node.required_cards || [];
    const hasAllRequired = requiredCards.length === 0 || requiredCards.every((cid: string) => ownedCardIds.has(cid));

    // Check required_any_cards (OR logic)
    const requiredAnyCards = node.required_any_cards || [];
    const hasAnyRequired = requiredAnyCards.length === 0 || requiredAnyCards.some((cid: string) => ownedCardIds.has(cid));

    // Can unlock if: not completed, parent done (or choice parent done), has cards, no sibling choice already completed
    const canUnlock = !completed
      && (parentIsChoice ? choiceParentCompleted : parentCompleted)
      && hasAllRequired
      && hasAnyRequired
      && !siblingCompleted;

    return {
      ...node,
      completed,
      canUnlock,
      requiredCardNames: requiredCards.map((id: string) => cardNameMap.get(id) || "???"),
      requiredAnyCardNames: requiredAnyCards.map((id: string) => cardNameMap.get(id) || "???"),
    };
  });

  // Build chapters with nodes
  const enrichedChapters = (chapters || []).map((chapter) => {
    const chapterNodes = enrichedNodes.filter((n) => n.chapter_id === chapter.id);
    return {
      ...chapter,
      nodes: chapterNodes,
      completedCount: chapterNodes.filter((n) => n.completed).length,
      totalCount: chapterNodes.length,
    };
  });

  // Build arcs with chapters
  const enrichedArcs = (arcs || []).map((arc) => {
    const arcChapters = enrichedChapters.filter((c) => c.arc_id === arc.id);
    const totalNodes = arcChapters.reduce((sum, c) => sum + c.totalCount, 0);
    const completedNodes = arcChapters.reduce((sum, c) => sum + c.completedCount, 0);
    const hasUnlockable = arcChapters.some((c) => c.nodes.some((n: { canUnlock: boolean }) => n.canUnlock));

    return {
      ...arc,
      chapters: arcChapters,
      totalNodes,
      completedNodes,
      hasUnlockable,
    };
  });

  // Build codex data
  const codexData = (nodes || [])
    .filter((n) => n.codex_entry)
    .map((n) => {
      const chapter = (chapters || []).find((c) => c.id === n.chapter_id);
      const arc = (arcs || []).find((a) => a.id === chapter?.arc_id);
      const codex = (codexEntries || []).find((c) => c.node_id === n.id);

      return {
        node_id: n.id,
        title: n.title,
        codex_entry: n.codex_entry,
        arc_name: arc?.name || "",
        arc_slug: arc?.slug || "",
        unlocked: codexNodeIds.has(n.id),
        unlocked_at: codex?.unlocked_at,
      };
    });

  return NextResponse.json({ arcs: enrichedArcs, codex: codexData });
}
