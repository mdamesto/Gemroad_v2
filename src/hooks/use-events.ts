"use client";

import { useState, useCallback, useEffect } from "react";
import { NarrativeEventWithDetails } from "@/types/game";

export function useEvents() {
  const [events, setEvents] = useState<NarrativeEventWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const vote = useCallback(async (eventId: string, choiceId: string) => {
    const res = await fetch("/api/events/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, choiceId }),
    });

    if (res.ok) {
      await fetchEvents();
      return true;
    }
    return false;
  }, [fetchEvents]);

  const claimReward = useCallback(async (eventId: string) => {
    const res = await fetch("/api/events/claim-reward", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId }),
    });

    if (res.ok) {
      const result = await res.json();
      await fetchEvents();
      return result;
    }
    return null;
  }, [fetchEvents]);

  return { events, loading, vote, claimReward, refresh: fetchEvents };
}
