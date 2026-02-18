"use client";

import { useState, useEffect, useCallback } from "react";
import type { StoryArcWithChapters, CodexEntry } from "@/types/game";

export function useChronicles() {
  const [arcs, setArcs] = useState<StoryArcWithChapters[]>([]);
  const [codex, setCodex] = useState<CodexEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChronicles = useCallback(async () => {
    try {
      const res = await fetch("/api/chronicles");
      if (res.ok) {
        const data = await res.json();
        setArcs(data.arcs || []);
        setCodex(data.codex || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChronicles();
  }, [fetchChronicles]);

  const completeNode = useCallback(async (nodeId: string) => {
    const res = await fetch("/api/chronicles/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodeId }),
    });

    if (res.ok) {
      const result = await res.json();
      // Refresh data after completing
      await fetchChronicles();
      return result;
    }
    return null;
  }, [fetchChronicles]);

  return { arcs, codex, loading, completeNode, refresh: fetchChronicles };
}
