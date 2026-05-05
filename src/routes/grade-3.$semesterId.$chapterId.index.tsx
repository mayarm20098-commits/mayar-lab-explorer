import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, FlaskConical } from "lucide-react";
import { grade3Semesters } from "@/data/curriculum-g3";
import { SiteHeader } from "@/components/SiteHeader";
import { MiyarAssistant } from "@/components/MiyarAssistant";

export const Route = createFileRoute("/grade-3/$semesterId/$chapterId/")({
  loader: ({ params }) => {
    const semester = grade3Semesters.find((s) => s.id === params.semesterId);
    if (!semester) throw notFound();
    const chapter = semester.chapters.find((c) => c.id === params.chapterId);
    if (!chapter) throw notFound();
    return { semester, chapter };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.chapter.title ?? "فصل"} | مختبر ميار` },
      { name: "description", content: loaderData?.chapter.description ?? "دروس الفصل" },
    ],
  }),
  component: ChapterPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <Link to="/grade-3" className="text-primary font-bold">عودة</Link>
    </div>
  ),
});

function ChapterPage() {
  const { semester, chapter } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="container mx-auto px-4 pt-10 pb-8 max-w-4xl">
        <Link
          to="/grade-3/$semesterId"
          params={{ semesterId: semester.id }}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 rotate-180" /> {semester.title}
        </Link>

        <div className="text-center mb-10">
          <div className="inline-flex h-20 w-20 rounded-3xl bg-gradient-card text-primary-foreground shadow-glow items-center justify-center text-4xl mb-4">
            {chapter.emoji}
          </div>
          <div className="text-xs text-primary font-bold mb-1">الفصل {chapter.number}</div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-foreground">{chapter.title}</h1>
          <p className="mt-2 text-muted-foreground text-sm md:text-base">{chapter.description}</p>
        </div>

        <div className="grid gap-3">
          {chapter.lessons.map((lesson: { id: string; title: string; lab?: string; summary: string }, i: number) => (
            <Link
              key={lesson.id}
              to="/grade-3/$semesterId/$chapterId/$lessonId"
              params={{ semesterId: semester.id, chapterId: chapter.id, lessonId: lesson.id }}
              className="group rounded-2xl bg-card border-2 border-border hover:border-primary hover:shadow-soft p-5 flex items-center gap-4 transition-all animate-pop-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-sky text-deep flex items-center justify-center font-display font-extrabold text-lg shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 text-right">
                <h3 className="font-display font-extrabold text-foreground flex items-center gap-2 flex-wrap">
                  {lesson.title}
                  {lesson.lab && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      <FlaskConical className="h-3 w-3" /> مختبر
                    </span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">{lesson.summary}</p>
              </div>
              <FlaskConical className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </section>

      <MiyarAssistant message={{ text: "اختاري الدرس وستجدين تجربة تفاعلية فريدة 🧪", mood: "happy" }} />
    </div>
  );
}
