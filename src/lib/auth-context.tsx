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
  section?: number | null;
};

type SignUpArgs = {
  email: string;
  password: string;
  displayName: string;
  avatarEmoji: string;
  role: AppRole;
  inviteCode?: string;
  section?: number;
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

    const code = args.role === "student" ? (args.inviteCode?.trim().toUpperCase() ?? "") : "";

    // Validate invite code BEFORE creating account via SECURITY DEFINER RPC (works for anon)
    if (args.role === "student" && code) {
      const { data: isValid, error: vErr } = await supabase.rpc("validate_invite_code", { _code: code });
      if (vErr) return { error: "تعذّر التحقق من الكود. حاولي مرة أخرى." };
      if (!isValid) {
        return { error: "كود المعلمة غير صحيح. تأكدي من الكود وحاولي مرة أخرى." };
      }
    }

    const { data: signUpData, error } = await supabase.auth.signUp({
      email: args.email,
      password: args.password,
      options: {
        emailRedirectTo: redirect,
        data: {
          display_name: args.displayName,
          scientist_name: scientistName,
          avatar_emoji: args.avatarEmoji,
          role: args.role,
          invite_code: code,
          section: args.role === "student" && args.section ? String(args.section) : "",
        },
      },
    });
    if (error) {
      if (error.message.includes("INVALID_INVITE_CODE")) {
        return { error: "كود المعلمة غير صحيح." };
      }
      return { error: error.message };
    }

    // If a session was created immediately (auto-confirm on), verify the link succeeded.
    // If for some reason classroom_id is still null, retry the join via RPC.
    if (args.role === "student" && code && signUpData.session?.user?.id) {
      const uid = signUpData.session.user.id;
      const { data: prof } = await supabase.from("profiles").select("classroom_id").eq("id", uid).maybeSingle();
      if (!prof?.classroom_id) {
        const { error: joinErr } = await supabase.rpc("join_classroom_by_code", { _code: code });
        if (joinErr) return { error: "تم إنشاء الحساب لكن تعذّر الربط بالمعلمة. جرّبي من صفحة الملف الشخصي." };
      }
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
