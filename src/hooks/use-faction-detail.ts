"use client";

import { useState, useCallback, useEffect } from "react";

interface FactionDetailData {
  faction: any;
  cards: any[];
  notableCards: any[];
  talentTree: any;
  storyArcs: any[];
  stats: {
    totalCards: number;
    ownedCards: number;
    completionPercent: number;
  };
}

export function useFactionDetail(factionSlug: string) {
  const [data, setData] = useState<FactionDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    try {
      const res = await fetch(`/api/factions/${factionSlug}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [factionSlug]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { data, loading, refresh: fetchDetail };
}
