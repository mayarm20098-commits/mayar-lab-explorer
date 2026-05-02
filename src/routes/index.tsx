import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, ArrowLeft, Sparkles, Atom, FlaskConical, LogIn } from "lucide-react";
import { MiyarAssistant } from "@/components/MiyarAssistant";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "مختبر ميار الفيزيائي الذكي — اختاري مرحلتك" },
      { name: "description", content: "تعلّمي الفيزياء بأسلوب تفاعلي ممتع. اختاري مرحلتك الدراسية وابدئي رحلة الاكتشاف." },
    ],
  }),
  component: HomePage,
});

const stages = [
  {
    id: "grade-1",
    title: "أول ثانوي",
    subtitle: "مسارات • فيزياء 1",
    description: "ابدئي رحلتك مع 6 فصول كاملة وتجارب محاكاة تفاعلية",
    enabled: true,
    chapters: 6,
    color: "from-primary via-primary-glow to-sky",
    icon: <Atom className="h-10 w-10" />,
    href: "/grade-1" as const,
  },
  {
    id: "grade-2",
    title: "ثاني ثانوي",
    subtitle: "فصلان دراسيان",
    description: "الموائع، الديناميكا الحرارية، الموجات، الصوت والضوء",
    enabled: true,
    chapters: 6,
    color: "from-primary-glow via-primary to-deep",
    icon: <FlaskConical className="h-10 w-10" />,
    href: "/grade-2" as const,
  },
  {
    id: "grade-3",
    title: "ثالث ثانوي",
    subtitle: "فصلان دراسيان",
    description: "الكهرباء، المغناطيسية، الكم، الذرة، والفيزياء النووية",
    enabled: true,
    chapters: 18,
    color: "from-primary via-sky to-primary-glow",
    icon: <Sparkles className="h-10 w-10" />,
    href: "/grade-3" as const,
  },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-sky/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 h-[300px] w-[300px] bg-primary-glow/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="container mx-auto px-4 pt-6 pb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-card shadow-glow flex items-center justify-center text-2xl">
            ⚛️
          </div>
          <div className="text-right">
            <div className="font-display font-extrabold text-foreground text-lg leading-none">
              مختبر ميار
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">الفيزياء التفاعلية الذكية</div>
          </div>
        </div>
        <AccountButton />
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 pt-12 md:pt-20 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 bg-card border border-primary/20 px-4 py-1.5 rounded-full text-xs font-bold text-primary shadow-soft animate-fade-in mb-6">
          <Sparkles className="h-3.5 w-3.5" /> منهج المملكة العربية السعودية • نظام المسارات
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold text-foreground leading-[1.15] text-balance animate-slide-up">
          الفيزياء ليست مجرد معادلات…
          <br />
          <span className="bg-gradient-to-l from-primary via-primary-glow to-sky bg-clip-text text-transparent">
            بل تجربة تعيشينها
          </span>
        </h1>

        <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
          مرحباً بكِ في مختبرٍ ذكي يجمع بين منهجك الدراسي ومحاكاة فيزيائية حقيقية،
          ترافقك فيه <span className="font-bold text-primary">ميار</span> خطوة بخطوة.
        </p>
      </section>

      {/* Stage selector */}
      <section className="container mx-auto px-4 mt-14 md:mt-20 pb-24">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-foreground">
            اختاري مرحلتك الدراسية
          </h2>
          <p className="text-sm text-muted-foreground mt-2">ابدئي رحلتك من أول ثانوي</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {stages.map((stage, i) => {
            const card = (
              <div
                className={`group relative h-full rounded-3xl overflow-hidden p-7 text-right transition-all duration-300 animate-pop-in ${
                  stage.enabled
                    ? "bg-card border-2 border-border hover:border-primary hover:shadow-glow hover:-translate-y-2 cursor-pointer"
                    : "bg-muted/40 border border-border opacity-75 cursor-not-allowed"
                }`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* Gradient accent */}
                <div
                  className={`absolute -top-20 -left-20 h-44 w-44 rounded-full bg-gradient-to-br ${stage.color} opacity-30 blur-2xl group-hover:opacity-50 transition-opacity`}
                />

                {!stage.enabled && (
                  <div className="absolute top-4 left-4 bg-deep text-deep-foreground rounded-full p-2 shadow-soft">
                    <Lock className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`relative h-16 w-16 rounded-2xl bg-gradient-to-br ${stage.color} text-white shadow-glow flex items-center justify-center mb-5`}
                >
                  {stage.icon}
                </div>

                <div className="text-xs text-primary font-bold mb-1">{stage.subtitle}</div>
                <h3 className="text-2xl font-display font-extrabold text-foreground mb-2">
                  {stage.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {stage.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                    {stage.chapters} فصول
                  </span>
                  {stage.enabled && (
                    <div className="flex items-center gap-1 text-primary font-bold text-sm group-hover:gap-2 transition-all">
                      ابدئي <ArrowLeft className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>
            );

            return stage.enabled && stage.href ? (
              <Link key={stage.id} to={stage.href} className="block h-full">
                {card}
              </Link>
            ) : (
              <div key={stage.id} className="h-full">{card}</div>
            );
          })}
        </div>
      </section>

      <MiyarAssistant
        message={{
          text: "أهلاً وسهلاً بكِ! أنا ميار، سأرافقكِ في رحلة استكشاف الفيزياء 💙",
          mood: "happy",
        }}
      />
    </div>
  );
}

function AccountButton() {
  const { user, profile } = useAuth();
  if (user && profile) {
    return (
      <Link
        to="/profile"
        className="flex items-center gap-2 bg-card border-2 border-primary/30 hover:border-primary px-3 py-2 rounded-full text-sm font-bold shadow-soft transition-colors"
      >
        <span className="text-xl">{profile.avatar_emoji}</span>
        <span className="hidden sm:inline">{profile.display_name}</span>
        {profile.role !== "teacher" && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-mono">
            {profile.total_points}
          </span>
        )}
      </Link>
    );
  }
  return (
    <Link
      to="/auth"
      className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold shadow-glow hover:scale-105 transition-transform"
    >
      <LogIn className="h-4 w-4" /> دخول
    </Link>
  );
}
