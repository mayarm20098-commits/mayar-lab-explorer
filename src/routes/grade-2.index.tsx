import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, FlaskConical } from "lucide-react";
import { grade2Chapters } from "@/data/curriculum-g2";
import { SiteHeader } from "@/components/SiteHeader";
import { MiyarAssistant } from "@/components/MiyarAssistant";

export const Route = createFileRoute("/grade-2/")({
  head: () => ({
    meta: [
      { title: "ثاني ثانوي — فصول الفيزياء | مختبر ميار" },
      { name: "description", content: "استعرضي فصول مادة الفيزياء 2 لنظام المسارات بأسلوب تفاعلي ممتع." },
    ],
  }),
  component: Grade2Page,
});

function Grade2Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="container mx-auto px-4 pt-10 pb-6 text-center">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4 rotate-180" /> الرئيسية
        </Link>
        <div className="inline-flex items-center gap-2 bg-card border border-primary/20 px-4 py-1.5 rounded-full text-xs font-bold text-primary shadow-soft mb-5">
          <BookOpen className="h-3.5 w-3.5" /> ثاني ثانوي — مسارات
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-extrabold text-foreground leading-tight">
          فصول مادة <span className="bg-gradient-to-l from-primary to-sky bg-clip-text text-transparent">الفيزياء 2</span>
        </h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
          ستة فصول كاملة من الكتاب المدرسي السعودي. اختاري فصلاً لتبدئي.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {grade2Chapters.map((ch, i) => {
            const hasLab = ch.lessons.some((l) => l.lab);
            return (
              <Link
                key={ch.id}
                to="/grade-2/$chapterId"
                params={{ chapterId: ch.id }}
                className="group relative rounded-3xl bg-card border-2 border-border hover:border-primary hover:shadow-glow hover:-translate-y-1.5 transition-all duration-300 p-6 text-right animate-pop-in overflow-hidden"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="absolute -top-16 -left-10 h-36 w-36 rounded-full bg-gradient-card opacity-20 blur-2xl group-hover:opacity-40 transition-opacity" />

                <div className="flex items-start justify-between mb-4 relative">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-card text-primary-foreground shadow-soft flex items-center justify-center text-3xl">
                    {ch.emoji}
                  </div>
                  <span className="text-xs font-bold text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                    الفصل {ch.number}
                  </span>
                </div>

                <h3 className="text-xl font-display font-extrabold text-foreground mb-1.5">{ch.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 min-h-[2.5rem]">{ch.description}</p>

                <div className="flex items-center justify-between text-sm pt-3 border-t border-border">
                  <div className="flex items-center gap-3 text-muted-foreground text-xs">
                    <span>{ch.lessons.length} دروس</span>
                    {hasLab && (
                      <span className="inline-flex items-center gap-1 text-primary font-bold">
                        <FlaskConical className="h-3.5 w-3.5" /> مختبر تفاعلي
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-primary font-bold group-hover:gap-2 transition-all">
                    ادخلي <ArrowLeft className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <MiyarAssistant message={{ text: "كل فصل يحوي تجربة فريدة! اختاري ما يناسبكِ 🚀", mood: "happy" }} />
    </div>
  );
}
