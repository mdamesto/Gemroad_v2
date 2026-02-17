"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export function useCurrency(userId: string | undefined) {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchBalance() {
      const { data } = await supabase
        .from("profiles")
        .select("gems_balance")
        .eq("id", userId!)
        .single();

      if (data) {
        setBalance(data.gems_balance);
      }
      setLoading(false);
    }

    fetchBalance();

    const channel = supabase
      .channel("gems-balance")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        (payload: { new: Record<string, unknown> }) => {
          setBalance((payload.new as { gems_balance: number }).gems_balance);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const refresh = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("profiles")
      .select("gems_balance")
      .eq("id", userId)
      .single();
    if (data) setBalance(data.gems_balance);
  }, [userId]);

  return { balance, loading, refresh };
}
