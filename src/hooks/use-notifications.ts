"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "./use-user";

export interface NotificationState {
  achievements: number;  // unclaimed achievements
  dailyReward: boolean;  // daily reward available
  missions: number;      // completed but unclaimed missions
  boosters: number;      // free boosters remaining
}

export function useNotifications() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<NotificationState>({
    achievements: 0,
    dailyReward: false,
    missions: 0,
    boosters: 0,
  });

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      const [achievementsRes, dailyRes, missionsRes, boostersRes] = await Promise.all([
        fetch("/api/achievements/progress").then((r) => r.ok ? r.json() : null).catch(() => null),
        fetch("/api/daily-reward/check").then((r) => r.ok ? r.json() : null).catch(() => null),
        fetch("/api/missions").then((r) => r.ok ? r.json() : null).catch(() => null),
        fetch("/api/boosters/claim-free").then((r) => r.ok ? r.json() : null).catch(() => null),
      ]);

      setNotifications({
        achievements: 0, // Will be computed separately if needed
        dailyReward: dailyRes?.canClaim ?? false,
        missions: (missionsRes?.missions || []).filter(
          (m: { completed: boolean; claimed: boolean }) => m.completed && !m.claimed
        ).length,
        boosters: boostersRes?.remaining ?? 0,
      });
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    // Refresh every 5 minutes
    const interval = setInterval(fetchNotifications, 300000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Compute which paths have notifications
  const badgeMap: Record<string, boolean> = {
    "/achievements": notifications.achievements > 0,
    "/daily-reward": notifications.dailyReward,
    "/missions": notifications.missions > 0,
    "/boosters": notifications.boosters > 0,
  };

  return { notifications, badgeMap, refresh: fetchNotifications };
}
