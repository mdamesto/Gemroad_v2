"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import React from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/game";
import type { User } from "@supabase/supabase-js";

// ─── Context ──────────────────────────────────────────────────────
interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

// ─── Provider ─────────────────────────────────────────────────────
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const p = await fetchProfile(user.id);
    if (p) setProfile(p);
  }, [user]);

  useEffect(() => {
    let cancelled = false;

    // Initial session check
    supabase.auth.getSession().then(async ({ data, error }: { data: { session: { user: User } | null }; error: Error | null }) => {
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
    }).catch(() => {
      if (!cancelled) {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    // Listen for auth changes
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

  return React.createElement(
    AuthContext.Provider,
    { value: { user, profile, loading, refreshProfile } },
    children
  );
}

// ─── Hook ─────────────────────────────────────────────────────────
export function useUser() {
  return useContext(AuthContext);
}
