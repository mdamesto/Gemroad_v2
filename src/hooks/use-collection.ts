"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UserCardWithDetails } from "@/types/cards";

export function useCollection(userId: string | undefined) {
  const [cards, setCards] = useState<UserCardWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchCollection() {
      const { data } = await supabase
        .from("user_cards")
        .select("*, card:cards(*)")
        .eq("user_id", userId!)
        .order("obtained_at", { ascending: false });

      if (data) {
        setCards(
          data.map((uc: Record<string, unknown>) => ({
            ...uc,
            card: uc.card as UserCardWithDetails["card"],
          }))
        );
      }
      setLoading(false);
    }

    fetchCollection();
  }, [userId]);

  return { cards, loading };
}
