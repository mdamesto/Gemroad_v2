"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/game";
import type { User } from "@supabase/supabase-js";

const supabase = createClient();

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data as Profile | null;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use getSession (reads local cookie, no network call) for fast initial load
    supabase.auth.getSession().then(async ({ data: { session } }: { data: { session: { user: User } | null } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const p = await fetchProfile(currentUser.id);
        setProfile(p);
      }

      setLoading(false);
    });

    // Listen for auth changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: string, session: { user: User } | null) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const p = await fetchProfile(currentUser.id);
        setProfile(p);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, profile, loading };
}
