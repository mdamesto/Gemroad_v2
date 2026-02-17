"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/game";
import type { User } from "@supabase/supabase-js";

const supabase = createClient();

async function fetchProfile(userId: string): Promise<Profile | null> {
  try {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    return data as Profile | null;
  } catch {
    return null;
  }
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent double-init in StrictMode
    if (initialized.current) return;
    initialized.current = true;

    let cancelled = false;

    async function init() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (cancelled) return;

        if (error || !data.session) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        const currentUser = data.session.user;
        setUser(currentUser);

        const p = await fetchProfile(currentUser.id);
        if (!cancelled) {
          setProfile(p);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    }

    init();

    // Listen for auth changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: string, session: { user: User } | null) => {
      if (cancelled) return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const p = await fetchProfile(currentUser.id);
        if (!cancelled) setProfile(p);
      } else {
        setProfile(null);
      }

      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading };
}
