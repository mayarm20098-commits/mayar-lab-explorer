import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth, type AppRole } from "@/lib/auth-context";
import { sounds } from "@/lib/sounds";
import { toast } from "sonner";
import { GraduationCap, BookOpen } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | مختبر ميار" },
      { name: "description", content: "سجّلي حسابك واحفظي تقدمك في تعلم الفيزياء." },
    ],
  }),
  component: AuthPage,
});

const EMOJI_OPTIONS = ["👩‍🔬", "👩‍🎓", "🧕", "👩‍🚀", "🦋", "🌸", "⭐", "🌙", "🦄", "🌷", "🐱", "🦊"];

function AuthPage() {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<AppRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [emoji, setEmoji] = useState(EMOJI_OPTIONS[0]);
  const [inviteCode, setInviteCode] = useState("");
  const [section, setSection] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/profile" });
  }, [user, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    sounds.click();
    if (mode === "signin") {
      const { error } = await signIn(email, password);
      if (error) toast.error(error);
      else {
        sounds.success();
        toast.success("أهلاً بكِ من جديد!");
        navigate({ to: "/profile" });
      }
    } else {
      if (!displayName.trim()) {
        toast.error("اكتبي اسمكِ");
        setLoading(false);
        return;
      }
      const { error } = await signUp({
        email,
        password,
        displayName: displayName.trim().slice(0, 40),
        avatarEmoji: emoji,
        role,
        inviteCode: role === "student" ? inviteCode : undefined,
        section: role === "student" ? section : undefined,
      });
      if (error) toast.error(error);
      else {
        sounds.celebrate();
        toast.success("تم إنشاء حسابكِ بنجاح!");
      }
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-deep border border-border p-6 md:p-8">
        <Link to="/" className="text-xs text-muted-foreground hover:text-primary">→ الرئيسية</Link>
        <div className="text-center mt-2 mb-6">
          <div className="text-4xl mb-2">⚛️</div>
          <h1 className="text-2xl font-display font-extrabold text-foreground">
            {mode === "signin" ? "أهلاً بكِ من جديد" : "انضمي إلى مختبر ميار"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signin" ? "سجّلي الدخول لمتابعة تقدمكِ" : "أنشئي حسابكِ وابدئي رحلة الفيزياء"}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <>
              {/* Role selector */}
              <div>
                <label className="text-sm font-bold text-foreground block mb-1.5">من أنتِ؟</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { sounds.pop(); setRole("student"); }}
                    className={`rounded-2xl border-2 p-3 text-sm font-bold transition-all flex flex-col items-center gap-1 ${role === "student" ? "border-primary bg-primary/10" : "border-border bg-card"}`}
                  >
                    <BookOpen className="h-5 w-5" />
                    طالبة
                  </button>
                  <button
                    type="button"
                    onClick={() => { sounds.pop(); setRole("teacher"); }}
                    className={`rounded-2xl border-2 p-3 text-sm font-bold transition-all flex flex-col items-center gap-1 ${role === "teacher" ? "border-primary bg-primary/10" : "border-border bg-card"}`}
                  >
                    <GraduationCap className="h-5 w-5" />
                    معلمة
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-foreground block mb-1.5">اسمكِ</label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  maxLength={40}
                  placeholder="مثال: ميار"
                  className="w-full rounded-xl border-2 border-border bg-background p-2.5"
                />
                {role === "student" && displayName.trim() && (
                  <div className="text-xs text-primary mt-1">
                    سيظهر اسمكِ هكذا: <span className="font-bold">العالِمة {displayName.trim()}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-bold text-foreground block mb-1.5">اختاري إيموجي</label>
                <div className="grid grid-cols-6 gap-2">
                  {EMOJI_OPTIONS.map((em) => (
                    <button
                      type="button"
                      key={em}
                      onClick={() => { sounds.pop(); setEmoji(em); }}
                      className={`rounded-xl border-2 p-2 text-2xl transition-all ${emoji === em ? "border-primary bg-primary/10 scale-110" : "border-border bg-card"}`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {role === "student" && (
                <div>
                  <label className="text-sm font-bold text-foreground block mb-1.5">
                    كود المعلمة <span className="text-muted-foreground font-normal">(اختياري)</span>
                  </label>
                  <input
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    dir="ltr"
                    placeholder="ABC123"
                    className="w-full rounded-xl border-2 border-border bg-background p-2.5 font-mono tracking-widest text-center"
                  />
                </div>
              )}

              {role === "student" && (
                <div>
                  <label className="text-sm font-bold text-foreground block mb-1.5">الفصل</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((n) => (
                      <button
                        type="button"
                        key={n}
                        onClick={() => { sounds.pop(); setSection(n); }}
                        className={`rounded-xl border-2 p-2.5 text-sm font-bold transition-all ${section === n ? "border-primary bg-primary/10 scale-105" : "border-border bg-card"}`}
                      >
                        فصل {n}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div>
            <label className="text-sm font-bold text-foreground block mb-1.5">البريد الإلكتروني</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required dir="ltr" className="w-full rounded-xl border-2 border-border bg-background p-2.5" />
          </div>
          <div>
            <label className="text-sm font-bold text-foreground block mb-1.5">كلمة المرور</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} dir="ltr" className="w-full rounded-xl border-2 border-border bg-background p-2.5" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded-full font-bold shadow-glow disabled:opacity-60">
            {loading ? "..." : mode === "signin" ? "دخول" : "إنشاء الحساب"}
          </button>
        </form>

        <div className="text-center mt-5 text-sm text-muted-foreground">
          {mode === "signin" ? "ليس لديكِ حساب؟" : "لديكِ حساب بالفعل؟"}{" "}
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-primary font-bold hover:underline">
            {mode === "signin" ? "أنشئي حساباً" : "سجّلي الدخول"}
          </button>
        </div>
      </div>
    </div>
  );
}
