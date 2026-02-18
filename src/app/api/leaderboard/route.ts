import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const tab = request.nextUrl.searchParams.get("tab") || "collection";
  const admin = createAdminClient();

  if (tab === "collection") {
    // Rank by unique cards collected
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, username, avatar_url, level")
      .order("level", { ascending: false })
      .limit(50);

    if (!profiles) return NextResponse.json({ leaderboard: [] });

    const leaderboard = [];
    for (const p of profiles) {
      const { count } = await admin
        .from("user_cards")
        .select("*", { count: "exact", head: true })
        .eq("user_id", p.id);

      leaderboard.push({
        id: p.id,
        username: p.username,
        avatar_url: p.avatar_url,
        level: p.level,
        value: count ?? 0,
        isCurrentUser: p.id === user.id,
      });
    }

    leaderboard.sort((a, b) => b.value - a.value);
    return NextResponse.json({ leaderboard: leaderboard.slice(0, 50) });
  }

  if (tab === "level") {
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, username, avatar_url, level, xp")
      .order("level", { ascending: false })
      .order("xp", { ascending: false })
      .limit(50);

    const leaderboard = (profiles || []).map((p) => ({
      id: p.id,
      username: p.username,
      avatar_url: p.avatar_url,
      level: p.level,
      value: p.level,
      isCurrentUser: p.id === user.id,
    }));

    return NextResponse.json({ leaderboard });
  }

  if (tab === "achievements") {
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, username, avatar_url, level")
      .limit(50);

    if (!profiles) return NextResponse.json({ leaderboard: [] });

    const leaderboard = [];
    for (const p of profiles) {
      const { count } = await admin
        .from("user_achievements")
        .select("*", { count: "exact", head: true })
        .eq("user_id", p.id);

      leaderboard.push({
        id: p.id,
        username: p.username,
        avatar_url: p.avatar_url,
        level: p.level,
        value: count ?? 0,
        isCurrentUser: p.id === user.id,
      });
    }

    leaderboard.sort((a, b) => b.value - a.value);
    return NextResponse.json({ leaderboard: leaderboard.slice(0, 50) });
  }

  return NextResponse.json({ leaderboard: [] });
}
