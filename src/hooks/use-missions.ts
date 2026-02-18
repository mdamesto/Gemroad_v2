"use client";

import { useState, useEffect, useCallback } from "react";

interface MissionData {
  id: string;
  mission_id: string;
  name: string;
  description: string;
  condition_type: string;
  condition_value: number;
  reward_gems: number;
  reward_xp: number;
  frequency: "daily" | "weekly";
  progress: number;
  completed: boolean;
  claimed: boolean;
  expires_at: string;
}

export function useMissions() {
  const [missions, setMissions] = useState<MissionData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMissions = useCallback(async () => {
    try {
      const res = await fetch("/api/missions");
      if (res.ok) {
        const data = await res.json();
        setMissions(data.missions || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  const claimMission = useCallback(async (missionId: string) => {
    const res = await fetch("/api/missions/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ missionId }),
    });

    if (res.ok) {
      const result = await res.json();
      setMissions((prev) =>
        prev.map((m) => (m.id === missionId ? { ...m, claimed: true } : m))
      );
      return result;
    }
    return null;
  }, []);

  const dailyMissions = missions.filter((m) => m.frequency === "daily");
  const weeklyMissions = missions.filter((m) => m.frequency === "weekly");

  return { missions, dailyMissions, weeklyMissions, loading, claimMission, refresh: fetchMissions };
}
