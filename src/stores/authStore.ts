// src/stores/authStore.ts
import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  role: "member" | "coach" | "admin" | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null, session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  role: null,
  isLoading: true,
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Auth signIn error:", error.message);
      throw error;
    }
    if (data.session) {
      const user = data.session.user;
      // Assuming role is stored in user's app_metadata.role
      const role =
        (user?.app_metadata?.role as "member" | "coach" | "admin") || null;
      set({ user, session: data.session, role, isLoading: false });
    }
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Auth signOut error:", error.message);
      throw error;
    }
    set({ user: null, session: null, role: null, isLoading: false });
  },
  setUser: (user, session) => {
    const role =
      (user?.app_metadata?.role as "member" | "coach" | "admin") || null;
    set({ user, session, role, isLoading: false });
  },
}));
