import { create } from "zustand";
import supabase from "../lib/supabaseClient";
import { getDefaultProfile } from "../api/auth";

const useAuthStore = create((set) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,

  setSession: async (session) => {
    if (!session) {
      set({ session: null, user: null, profile: null, loading: false,});
      return;
    }

    try {
      const profile = await getDefaultProfile(session.user.id);
      set({ session, user: session.user, profile, loading: false });
    } catch {
      set({ session, user: session.user, profile: null, loading: false });
    }
  },

  clearSession: () =>
    set({ session: null, user: null, profile: null, loading: false }),

  init: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    set({
      session,
      user: session?.user ?? null,
      loading: false,
    });

    if (session) {
      try {
        const profile = await getDefaultProfile(session.user.id);
        set({ session, user: session.user, profile, loading: false });
      } catch {
        set({ session, user: session.user, profile: null, loading: false });
      }
    } else {
      set({ session: null, user: null, profile: null, loading: false });
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        set({ session: null, user: null, profile: null, loading: false });
        return;
      }

      set({ session, user: session.user, loading: false });
    });
  },
}));

export default useAuthStore;