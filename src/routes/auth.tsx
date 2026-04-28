import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { sounds } from "@/lib/sounds";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | مختبر مِيار" },
      { name: "description", content: "سجّلي حسابك واحفظي تقدمك في تعلم الفيزياء." },
    ],
  }),
  component: AuthPage,
});

const SCIENTISTS = [
  { name: "ماري كوري", emoji: "👩‍🔬" },
  { name: "ليز مايتنر", emoji: "⚛️" },
  { name: "روزاليند فرانكلين", emoji: "🧬" },
  { name: "هيدي لامار", emoji: "📡" },
  { name: "إيمي نويثر", emoji: "🧮" },
  { name: "سامية الأمودي", emoji: "🔭" },
];

function AuthPage() {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [scientist, setScientist] = useState(SCIENTISTS[0]);
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
      const { error } = await signUp(email, password, displayName || "طالبة", scientist.name, scientist.emoji);
      if (error) toast.error(error);
      else {
        sounds.celebrate();
        toast.success("تم إنشاء حسابكِ! تحقّقي من بريدك لتفعيله.");
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
            {mode === "signin" ? "أهلاً بكِ من جديد" : "انضمي إلى مختبر مِيار"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signin" ? "سجّلي الدخول لمتابعة تقدمكِ" : "أنشئي حسابكِ واحفظي نقاطك وشاراتك"}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <>
              <div>
                <label className="text-sm font-bold text-foreground block mb-1.5">اسمكِ</label>
                <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required className="w-full rounded-xl border-2 border-border bg-background p-2.5" />
              </div>
              <div>
                <label className="text-sm font-bold text-foreground block mb-1.5">اختاري عالمتكِ المفضلة</label>
                <div className="grid grid-cols-3 gap-2">
                  {SCIENTISTS.map((s) => (
                    <button
                      type="button"
                      key={s.name}
                      onClick={() => { sounds.pop(); setScientist(s); }}
                      className={`rounded-xl border-2 p-2 text-xs font-bold transition-all ${scientist.name === s.name ? "border-primary bg-primary/10" : "border-border bg-card"}`}
                    >
                      <div className="text-2xl">{s.emoji}</div>
                      <div className="mt-1">{s.name}</div>
                    </button>
                  ))}
                </div>
              </div>
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
