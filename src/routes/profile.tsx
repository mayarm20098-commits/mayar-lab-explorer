import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trophy, LogOut, Sparkles, Copy, Users, Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { CommentsSection } from "@/components/CommentsSection";
import { BADGES } from "@/lib/use-lab-progress";
import { getAllGrade1LabIds } from "@/data/curriculum";
import { getAllG3S2LabIds } from "@/data/curriculum-g3";
import { Progress } from "@/components/ui/progress";
import { sounds } from "@/lib/sounds";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "ملفكِ | مختبر مِيار" },
      { name: "description", content: "تقدمكِ في الفيزياء، نقاطكِ، وشاراتكِ." },
    ],
  }),
  component: ProfilePage,
});

type ProgressRow = { lab_id: string; quiz_score: number; quiz_total: number; completed: boolean };

function ProfilePage() {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [badges, setBadges] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("lab_progress").select("lab_id, quiz_score, quiz_total, completed").eq("user_id", user.id)
      .then(({ data }) => setProgress((data as ProgressRow[]) ?? []));
    supabase.from("badges").select("badge_key").eq("user_id", user.id)
      .then(({ data }) => setBadges((data ?? []).map((b: { badge_key: string }) => b.badge_key)));
  }, [user]);

  if (loading || !user || !profile) {
    return <div className="min-h-screen flex items-center justify-center">جارِ التحميل...</div>;
  }

  const completedCount = progress.filter((p) => p.completed).length;
  const totalLabs = getAllGrade1LabIds().length;
  const totalCorrect = progress.reduce((s, p) => s + p.quiz_score, 0);
  const totalQs = progress.reduce((s, p) => s + p.quiz_total, 0);
  const accuracy = totalQs > 0 ? Math.round((totalCorrect / totalQs) * 100) : 0;
  const overallPct = totalLabs > 0 ? Math.round((completedCount / totalLabs) * 100) : 0;

  const isTeacher = profile.role === "teacher";
  // Title: "العالِمة + اسم الطالبة" (use scientist_name which we set to that format)
  const displayTitle = isTeacher ? `المعلمة ${profile.display_name}` : (profile.scientist_name || `العالِمة ${profile.display_name}`);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container mx-auto px-4 pt-8 pb-16 max-w-4xl">
        <div className="rounded-3xl bg-gradient-card text-primary-foreground p-6 md:p-8 shadow-deep mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="h-20 w-20 rounded-full bg-background/20 flex items-center justify-center text-5xl">
              {profile.avatar_emoji}
            </div>
            <div className="flex-1">
              <div className="text-xs opacity-80">{isTeacher ? "حساب معلمة" : "حساب طالبة"}</div>
              <h1 className="text-2xl font-display font-extrabold">{displayTitle}</h1>
            </div>
            {!isTeacher && (
              <div className="text-center">
                <Trophy className="h-7 w-7 mx-auto mb-1" />
                <div className="text-3xl font-display font-extrabold">{profile.total_points}</div>
                <div className="text-xs opacity-80">نقطة</div>
              </div>
            )}
            <button onClick={() => { sounds.click(); signOut(); }} className="bg-background/20 hover:bg-background/30 px-3 py-2 rounded-full text-sm font-bold flex items-center gap-1">
              <LogOut className="h-4 w-4" /> خروج
            </button>
          </div>
        </div>

        {isTeacher ? (
          <TeacherDashboard userId={user.id} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatCard label="تجارب مكتملة" value={`${completedCount} / ${totalLabs}`} />
              <StatCard label="نسبة الإجابات الصحيحة" value={`${accuracy}%`} />
              <StatCard label="التقدم العام" value={`${overallPct}%`} />
            </div>

            <div className="rounded-3xl bg-card border border-border p-5 shadow-card mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-foreground">تقدمكِ الإجمالي</span>
                <span className="text-sm font-mono text-primary">{overallPct}%</span>
              </div>
              <Progress value={overallPct} />
            </div>

            <div className="rounded-3xl bg-card border border-border p-5 shadow-card mb-6">
              <h2 className="text-lg font-display font-extrabold text-foreground flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" /> الشارات
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(BADGES).map(([key, b]) => {
                  const earned = badges.includes(key);
                  return (
                    <div key={key} className={`rounded-2xl p-3 text-center border-2 transition-all ${earned ? "border-success bg-success/5" : "border-border bg-muted/30 opacity-50"}`}>
                      <div className="text-3xl mb-1">{b.emoji}</div>
                      <div className="font-bold text-sm text-foreground">{b.name}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{b.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Link to="/grade-1" className="block text-center bg-primary text-primary-foreground py-3 rounded-full font-bold shadow-glow mb-6">
              متابعة التعلّم →
            </Link>
          </>
        )}

        <CommentsSection />
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-card border border-border p-5 shadow-card text-center">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-2xl font-display font-extrabold text-primary">{value}</div>
    </div>
  );
}

type StudentRow = {
  id: string;
  display_name: string;
  avatar_emoji: string;
  total_points: number;
  completed: number;
  section: number | null;
};

type SortMode = "completed" | "name";

function TeacherDashboard({ userId }: { userId: string }) {
  const [classroom, setClassroom] = useState<{ id: string; name: string; invite_code: string } | null>(null);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: c } = await supabase
        .from("classrooms")
        .select("id, name, invite_code")
        .eq("teacher_id", userId)
        .maybeSingle();
      if (c) {
        setClassroom(c);
        const { data: profs } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_emoji, total_points, section")
          .eq("classroom_id", c.id);
        const list = (profs ?? []) as Omit<StudentRow, "completed">[];
        // get completed counts
        const { data: prog } = await supabase
          .from("lab_progress")
          .select("user_id, completed")
          .in("user_id", list.map((s) => s.id))
          .eq("completed", true);
        const counts: Record<string, number> = {};
        (prog ?? []).forEach((r: { user_id: string }) => { counts[r.user_id] = (counts[r.user_id] ?? 0) + 1; });
        setStudents(list.map((s) => ({ ...s, completed: counts[s.id] ?? 0 })));
      }
    })();
  }, [userId]);

  function copyCode() {
    if (!classroom) return;
    navigator.clipboard.writeText(classroom.invite_code);
    sounds.success();
    setCopied(true);
    toast.success("نُسخ الكود!");
    setTimeout(() => setCopied(false), 2000);
  }

  if (!classroom) return <div className="text-center text-muted-foreground py-8">جارِ التحميل...</div>;

  return (
    <div className="space-y-6">
      {/* Invite code */}
      <div className="rounded-3xl bg-card border-2 border-primary/30 p-6 shadow-card">
        <div className="text-xs text-muted-foreground mb-2">كود الدعوة لطالباتكِ</div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-4xl font-mono font-extrabold tracking-[0.4em] text-primary bg-primary/5 px-6 py-3 rounded-2xl border-2 border-dashed border-primary/40">
            {classroom.invite_code}
          </div>
          <button
            onClick={copyCode}
            className="bg-primary text-primary-foreground px-4 py-3 rounded-full font-bold flex items-center gap-1.5 shadow-glow hover:scale-105 transition-transform"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "تم" : "نسخ"}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          أرسلي هذا الكود لطالباتك لينضممن إلى فصلكِ عند تسجيل حساب جديد.
        </p>
      </div>

      {/* Students grouped by section */}
      <div className="rounded-3xl bg-card border border-border p-5 shadow-card">
        <h2 className="text-lg font-display font-extrabold text-foreground flex items-center gap-2 mb-1">
          <Users className="h-5 w-5 text-primary" /> طالباتكِ ({students.length})
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          إجمالي التجارب المتاحة: {getAllGrade1LabIds().length + getAllG3S2LabIds().length} تجربة
        </p>
        {students.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            لم تنضم أي طالبة بعد. شاركي الكود معهن!
          </p>
        ) : (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((sec) => {
              const inSection = students.filter((s) => (s.section ?? 0) === sec);
              if (inSection.length === 0) return null;
              return <SectionGroup key={sec} section={sec} students={inSection} />;
            })}
            {(() => {
              const unassigned = students.filter((s) => !s.section || ![1,2,3,4].includes(s.section));
              if (unassigned.length === 0) return null;
              return <SectionGroup key={0} section={0} students={unassigned} />;
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionGroup({ section, students }: { section: number; students: StudentRow[] }) {
  const [sortMode, setSortMode] = useState<SortMode>("completed");
  const totalLabs = getAllGrade1LabIds().length + getAllG3S2LabIds().length;

  const sorted = [...students].sort((a, b) => {
    if (sortMode === "name") {
      return a.display_name.localeCompare(b.display_name, "ar");
    }
    return b.completed - a.completed || b.total_points - a.total_points;
  });

  const title = section === 0 ? "بدون فصل محدد" : `الفصل ${section}`;

  return (
    <div className="border border-border/60 rounded-2xl p-4 bg-background/40">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="bg-primary/10 text-primary font-bold rounded-full px-3 py-1 text-sm">
            {title}
          </span>
          <span className="text-xs text-muted-foreground">{students.length} طالبة</span>
        </div>
        <div className="inline-flex items-center bg-muted rounded-full p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => { sounds.pop(); setSortMode("completed"); }}
            className={`px-3 py-1.5 rounded-full transition-all ${sortMode === "completed" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"}`}
          >
            حسب التجارب
          </button>
          <button
            type="button"
            onClick={() => { sounds.pop(); setSortMode("name"); }}
            className={`px-3 py-1.5 rounded-full transition-all ${sortMode === "name" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"}`}
          >
            أبجدي
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {sorted.map((s, i) => {
          const pct = totalLabs > 0 ? Math.round((s.completed / totalLabs) * 100) : 0;
          const isTop = sortMode === "completed" && i === 0 && s.completed > 0;
          return (
            <div key={s.id} className="bg-muted/30 rounded-2xl p-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{s.avatar_emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-bold text-foreground truncate">العالِمة {s.display_name}</div>
                    {isTop && <Trophy className="h-4 w-4 text-amber-500 shrink-0" />}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    أكملت <span className="font-bold text-primary">{s.completed}</span> من {totalLabs} تجربة
                  </div>
                </div>
                <div className="text-center shrink-0">
                  <div className="text-lg font-extrabold text-primary">{s.total_points}</div>
                  <div className="text-[10px] text-muted-foreground">نقطة</div>
                </div>
              </div>
              <div className="mt-2">
                <Progress value={pct} className="h-2" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
