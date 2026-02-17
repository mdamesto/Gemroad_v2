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

  const { boosterTypeId } = await request.json();

  if (!boosterTypeId) {
    return NextResponse.json(
      { error: "Type de booster requis" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // Get booster type
  const { data: boosterType } = await admin
    .from("booster_types")
    .select("*")
    .eq("id", boosterTypeId)
    .eq("is_active", true)
    .single();

  if (!boosterType) {
    return NextResponse.json(
      { error: "Type de booster non trouvé" },
      { status: 404 }
    );
  }

  // Check user balance
  const { data: profile } = await admin
    .from("profiles")
    .select("gems_balance")
    .eq("id", user.id)
    .single();

  if (!profile || profile.gems_balance < boosterType.price_gems) {
    return NextResponse.json(
      { error: "Solde insuffisant" },
      { status: 400 }
    );
  }

  // Deduct gems
  await admin
    .from("profiles")
    .update({ gems_balance: profile.gems_balance - boosterType.price_gems })
    .eq("id", user.id);

  // Create booster
  const { data: booster } = await admin
    .from("user_boosters")
    .insert({
      user_id: user.id,
      booster_type_id: boosterTypeId,
    })
    .select()
    .single();

  // Log transaction
  await admin.from("transactions").insert({
    user_id: user.id,
    type: "spend_gems",
    amount: -boosterType.price_gems,
    description: `Achat de ${boosterType.name}`,
  });

  return NextResponse.json({ booster });
}
