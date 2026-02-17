import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function checkAdmin() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) return null;
  return { user, admin };
}

export async function GET() {
  const auth = await checkAdmin();
  if (!auth) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { data: series } = await auth.admin
    .from("series")
    .select("*")
    .order("created_at", { ascending: false });

  return NextResponse.json({ series });
}

export async function POST(request: NextRequest) {
  const auth = await checkAdmin();
  if (!auth) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await request.json();
  const { data: series, error } = await auth.admin
    .from("series")
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ series }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const auth = await checkAdmin();
  if (!auth) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { id, ...updates } = await request.json();

  const { data: series, error } = await auth.admin
    .from("series")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ series });
}

export async function DELETE(request: NextRequest) {
  const auth = await checkAdmin();
  if (!auth) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { id } = await request.json();
  const { error } = await auth.admin.from("series").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
