"use client";

import { useState, useEffect, useCallback } from "react";

interface DaySchedule {
  day: number;
  gems: number;
  claimed: boolean;
  current: boolean;
}

interface DailyRewardState {
  canClaim: boolean;
  currentStreak: number;
  nextStreak: number;
  nextReward: number;
  msUntilReset: number;
  schedule: DaySchedule[];
  loading: boolean;
  claiming: boolean;
}

export function useDailyReward() {
  const [state, setState] = useState<DailyRewardState>({
    canClaim: false,
    currentStreak: 0,
    nextStreak: 0,
    nextReward: 0,
    msUntilReset: 0,
    schedule: [],
    loading: true,
    claiming: false,
  });

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/daily-reward/check");
      if (res.ok) {
        const data = await res.json();
        setState((prev) => ({ ...prev, ...data, loading: false }));
      } else {
        setState((prev) => ({ ...prev, loading: false }));
      }
    } catch {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const claim = useCallback(async () => {
    setState((prev) => ({ ...prev, claiming: true }));
    try {
      const res = await fetch("/api/daily-reward/claim", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        // Refresh status after claim
        await fetchStatus();
        return data;
      }
    } catch {
      // ignore
    } finally {
      setState((prev) => ({ ...prev, claiming: false }));
    }
    return null;
  }, [fetchStatus]);

  return { ...state, claim, refresh: fetchStatus };
}
