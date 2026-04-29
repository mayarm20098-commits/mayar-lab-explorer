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
    // Title display: "العالِمة + اسم الطالبة" — derive scientist_name from displayName
    const scientistName = `العالِمة ${args.displayName}`;

    const { data, error } = await supabase.auth.signUp({
      email: args.email,
      password: args.password,
      options: {
        emailRedirectTo: redirect,
        data: {
          display_name: args.displayName,
          scientist_name: scientistName,
          avatar_emoji: args.avatarEmoji,
        },
      },
    });
    if (error) return { error: error.message };

    const uid = data.user?.id;
    if (!uid) return { error: null };

    // assign role
    await supabase.from("user_roles").insert({ user_id: uid, role: args.role });
    await supabase.from("profiles").update({ role: args.role }).eq("id", uid);

    if (args.role === "student" && args.inviteCode) {
      // lookup classroom by invite_code
      const code = args.inviteCode.trim().toUpperCase();
      const { data: classroom } = await supabase
        .from("classrooms")
        .select("id")
        .eq("invite_code", code)
        .maybeSingle();
      if (classroom?.id) {
        await supabase.from("profiles").update({ classroom_id: classroom.id }).eq("id", uid);
      } else {
        return { error: "كود الدعوة غير صحيح. ستحتاجين لإدخاله لاحقاً من ملفكِ." };
      }
    }

    if (args.role === "teacher") {
      // auto-create classroom with random code
      const code = randomCode();
      await supabase.from("classrooms").insert({
        teacher_id: uid,
        name: `فصل ${args.displayName}`,
        invite_code: code,
      });
    }

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

function randomCode(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}
