import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "teacher" | "student";

type Profile = {
  id: string;
  display_name: string;
  scientist_name: string;
  avatar_emoji: string;
  total_points: number;
  classroom_id: string | null;
  role: AppRole | null;
};

type SignUpArgs = {
  email: string;
  password: string;
  displayName: string;
  avatarEmoji: string;
  role: AppRole;
  inviteCode?: string;
};

type AuthCtx = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (args: SignUpArgs) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(uid: string) {
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).maybeSingle();
    if (data) setProfile(data as Profile);
  }

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        setTimeout(() => fetchProfile(sess.user.id), 0);
      } else {
        setProfile(null);
      }
    });
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) fetchProfile(sess.user.id);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signUp(args: SignUpArgs) {
    const redirect = typeof window !== "undefined" ? window.location.origin : undefined;
    const scientistName = `العالِمة ${args.displayName}`;

    // Validate invite code BEFORE creating account (so we can return a clear error)
    if (args.role === "student" && args.inviteCode && args.inviteCode.trim()) {
      const code = args.inviteCode.trim().toUpperCase();
      const { data: classroom } = await supabase
        .from("classrooms")
        .select("id")
        .eq("invite_code", code)
        .maybeSingle();
      if (!classroom?.id) {
        return { error: "كود المعلمة غير صحيح. تأكدي من الكود وحاولي مرة أخرى." };
      }
    }

    // All role/classroom logic happens server-side in the handle_new_user trigger
    // via raw_user_meta_data — this works even when email confirmation is required.
    const { error } = await supabase.auth.signUp({
      email: args.email,
      password: args.password,
      options: {
        emailRedirectTo: redirect,
        data: {
          display_name: args.displayName,
          scientist_name: scientistName,
          avatar_emoji: args.avatarEmoji,
          role: args.role,
          invite_code: args.role === "student" ? (args.inviteCode?.trim().toUpperCase() ?? "") : "",
        },
      },
    });
    if (error) return { error: error.message };
    return { error: null };
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function refreshProfile() {
    if (user) await fetchProfile(user.id);
  }

  return (
    <Ctx.Provider value={{ user, session, profile, loading, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
