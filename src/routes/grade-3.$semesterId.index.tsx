import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, FlaskConical, BookOpen } from "lucide-react";
import { grade3Semesters } from "@/data/curriculum-g3";
import { SiteHeader } from "@/components/SiteHeader";
import { MiyarAssistant } from "@/components/MiyarAssistant";

export const Route = createFileRoute("/grade-3/$semesterId/")({
  loader: ({ params }) => {
    const semester = grade3Semesters.find((s) => s.id === params.semesterId);
    if (!semester) throw notFound();
    return { semester };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.semester.title ?? "ثالث ثانوي"} | مختبر ميار` },
      { name: "description", content: `فصول ${loaderData?.semester.title ?? "ثالث ثانوي"}` },
    ],
  }),
  component: SemesterPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <Link to="/grade-3" className="text-primary font-bold">عودة لاختيار الفصل الدراسي</Link>
    </div>
  ),
});

function SemesterPage() {
  const { semester } = Route.useLoaderData();

  if (!semester.enabled) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <section className="container mx-auto px-4 pt-20 text-center max-w-lg">
          <div className="text-6xl mb-4">{semester.emoji}</div>
          <h1 className="text-2xl font-display font-extrabold mb-2">{semester.title}</h1>
          <p className="text-muted-foreground mb-6">قريباً — نعمل على إعداد المحتوى التفاعلي.</p>
          <Link to="/grade-3" className="inline-flex bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-bold text-sm shadow-glow">
            عودة
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container mx-auto px-4 pt-10 pb-6 text-center">
        <Link to="/grade-3" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4 rotate-180" /> الفصول الدراسية
        </Link>
        <div className="inline-flex items-center gap-2 bg-card border border-primary/20 px-4 py-1.5 rounded-full text-xs font-bold text-primary shadow-soft mb-4">
          <BookOpen className="h-3.5 w-3.5" /> {semester.title}
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-extrabold text-foreground">
          فصول <span className="bg-gradient-to-l from-primary to-sky bg-clip-text text-transparent">الفيزياء</span>
        </h1>
      </section>

      <section className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {semester.chapters.map((ch: { id: string; number: number; title: string; description: string; emoji: string; lessons: unknown[] }, i: number) => (
            <Link
              key={ch.id}
              to="/grade-3/$semesterId/$chapterId"
              params={{ semesterId: semester.id, chapterId: ch.id }}
              className="group relative rounded-3xl bg-card border-2 border-border hover:border-primary hover:shadow-glow hover:-translate-y-1.5 transition-all duration-300 p-6 text-right animate-pop-in overflow-hidden"
              style={{ animationDelay: `${i * 0.04}s` }}
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
                <span className="inline-flex items-center gap-1 text-primary font-bold text-xs">
                  <FlaskConical className="h-3.5 w-3.5" /> مختبر تفاعلي
                </span>
                <div className="flex items-center gap-1 text-primary font-bold group-hover:gap-2 transition-all">
                  ادخلي <ArrowLeft className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <MiyarAssistant message={{ text: "كل فصل فيه تجربة فريدة من نوعها! اختاري ما يهمّك 🚀", mood: "happy" }} />
    </div>
  );
}
