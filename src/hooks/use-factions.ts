"use client";

import { useState, useCallback, useEffect } from "react";
import { FactionWithStats } from "@/types/game";

export function useFactions() {
  const [factions, setFactions] = useState<FactionWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFactions = useCallback(async () => {
    try {
      const res = await fetch("/api/factions");
      if (res.ok) {
        const data = await res.json();
        setFactions(data.factions || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFactions();
  }, [fetchFactions]);

  return { factions, loading, refresh: fetchFactions };
}
