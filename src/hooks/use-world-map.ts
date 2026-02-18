"use client";

import { useState, useCallback, useEffect } from "react";
import type { RegionData } from "@/types/game";

export function useWorldMap() {
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorldMap = useCallback(async () => {
    try {
      const res = await fetch("/api/world-map");
      if (res.ok) {
        const data = await res.json();
        setRegions(data.regions || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorldMap();
  }, [fetchWorldMap]);

  const completeMission = useCallback(
    async (missionId: string): Promise<{ gems: number; xp: number } | null> => {
      const res = await fetch("/api/world-map/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missionId }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      // Refresh data
      await fetchWorldMap();
      return { gems: data.gems, xp: data.xp };
    },
    [fetchWorldMap]
  );

  return { regions, loading, completeMission, refresh: fetchWorldMap };
}
