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

    let cancelled = false;

    async function fetchBalance() {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("gems_balance")
          .eq("id", userId!)
          .single();

        if (!cancelled && data) {
          setBalance(data.gems_balance);
        }
      } catch {
        // Silently fail - balance stays at 0
      }
      if (!cancelled) setLoading(false);
    }

    fetchBalance();

    const channel = supabase
      .channel(`gems-balance-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        (payload: { new: Record<string, unknown> }) => {
          if (!cancelled) {
            setBalance((payload.new as { gems_balance: number }).gems_balance);
          }
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const refresh = useCallback(async () => {
    if (!userId) return;
    try {
      const { data } = await supabase
        .from("profiles")
        .select("gems_balance")
        .eq("id", userId)
        .single();
      if (data) setBalance(data.gems_balance);
    } catch {
      // Silently fail
    }
  }, [userId]);

  return { balance, loading, refresh };
}
