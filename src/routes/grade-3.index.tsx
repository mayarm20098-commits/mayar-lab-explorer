import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Lock } from "lucide-react";
import { grade3Semesters } from "@/data/curriculum-g3";
import { SiteHeader } from "@/components/SiteHeader";
import { MiyarAssistant } from "@/components/MiyarAssistant";
import { sounds } from "@/lib/sounds";

export const Route = createFileRoute("/grade-3/")({
  head: () => ({
    meta: [
      { title: "ثالث ثانوي — اختاري الفصل الدراسي | مختبر مِيار" },
      { name: "description", content: "اختاري الفصل الدراسي الأول أو الثاني لمنهج فيزياء ثالث ثانوي." },
    ],
  }),
  component: Grade3Page,
});

function Grade3Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="container mx-auto px-4 pt-10 pb-6 text-center">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4 rotate-180" /> الرئيسية
        </Link>
        <div className="inline-flex items-center gap-2 bg-card border border-primary/20 px-4 py-1.5 rounded-full text-xs font-bold text-primary shadow-soft mb-5">
          <BookOpen className="h-3.5 w-3.5" /> ثالث ثانوي — مسارات
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-extrabold text-foreground leading-tight">
          اختاري <span className="bg-gradient-to-l from-primary to-sky bg-clip-text text-transparent">الفصل الدراسي</span>
        </h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
          منهج فيزياء ثالث ثانوي مقسوم إلى فصلين دراسيين — كل واحد يحوي 9 فصول علمية.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {grade3Semesters.map((s, i) => {
            const card = (
              <div
                className={`group relative h-full rounded-3xl overflow-hidden p-7 text-right transition-all duration-300 animate-pop-in ${
                  s.enabled
                    ? "bg-card border-2 border-border hover:border-primary hover:shadow-glow hover:-translate-y-2 cursor-pointer"
                    : "bg-muted/40 border border-border opacity-75 cursor-not-allowed"
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {!s.enabled && (
                  <div className="absolute top-4 left-4 bg-deep text-deep-foreground rounded-full p-2 shadow-soft">
                    <Lock className="h-4 w-4" />
                  </div>
                )}
                <div className="text-5xl mb-4">{s.emoji}</div>
                <div className="text-xs text-primary font-bold mb-1">{s.subtitle}</div>
                <h3 className="text-2xl font-display font-extrabold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {s.enabled ? "ابدئي رحلتك مع تجارب تفاعلية لكل فصل." : "نعمل على إعداد محتوى رائع — قريباً!"}
                </p>
                {s.enabled && (
                  <div className="flex items-center gap-1 text-primary font-bold text-sm group-hover:gap-2 transition-all">
                    ادخلي <ArrowLeft className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
            return s.enabled ? (
              <Link key={s.id} to="/grade-3/$semesterId" params={{ semesterId: s.id }} onClick={() => sounds.click()} className="block h-full">
                {card}
              </Link>
            ) : (
              <div key={s.id} className="h-full">{card}</div>
            );
          })}
        </div>
      </section>

      <MiyarAssistant
        message={{ text: "الفصل الدراسي الثاني متاح بالكامل! 9 مختبرات تفاعلية تنتظركِ ✨", mood: "happy" }}
      />
    </div>
  );
}
