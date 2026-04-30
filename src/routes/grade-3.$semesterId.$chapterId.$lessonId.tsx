import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BookOpenText } from "lucide-react";
import { findG3S2Lesson, grade3Semesters } from "@/data/curriculum-g3";
import { quizzes } from "@/data/quizzes";
import { SiteHeader } from "@/components/SiteHeader";
import { MiyarAssistant, type MiyarMessage } from "@/components/MiyarAssistant";
import { LabFrame } from "@/components/LabFrame";
import { QuizSection } from "@/components/QuizSection";
import { CompletionPanel } from "@/components/CompletionPanel";
import { labRegistry } from "@/components/labs/registry";
import { useLabProgress } from "@/lib/use-lab-progress";

export const Route = createFileRoute("/grade-3/$semesterId/$chapterId/$lessonId")({
  loader: ({ params }) => {
    const semester = grade3Semesters.find((s) => s.id === params.semesterId);
    if (!semester) throw notFound();
    if (params.semesterId !== "s2") throw notFound(); // only s2 for now
    const found = findG3S2Lesson(params.chapterId, params.lessonId);
    if (!found) throw notFound();
    return { semester, ...found };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.lesson.title ?? "درس"} | مختبر مِيار` },
      { name: "description", content: loaderData?.lesson.summary ?? "درس الفيزياء" },
    ],
  }),
  component: LessonPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <Link to="/grade-3" className="text-primary font-bold">عودة</Link>
    </div>
  ),
});

function LessonPage() {
  const { semester, chapter, lesson } = Route.useLoaderData();
  const labKey = lesson.lab;
  const labId = labKey ? `g3s2:${labKey}` : "";
  const { progress, saveResult } = useLabProgress(labId);

  const [miyarMsg, setMiyarMsg] = useState<MiyarMessage | null>({
    text: labKey
      ? "أهلاً بكِ في المختبر! اضبطي المتغيّرات وابدئي التجربة 🌟"
      : `سنتعلم اليوم درس "${lesson.title}". هيا نبدأ!`,
    mood: "happy",
  });
  const [quizScore, setQuizScore] = useState(0);
  const [quizMistakes, setQuizMistakes] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);

  const sayMiyar = (text: string, mood?: MiyarMessage["mood"]) => setMiyarMsg({ text, mood });

  const meta = labKey ? labRegistry[labKey] : null;
  const labQuiz = labKey ? quizzes[labKey] ?? [] : [];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="container mx-auto px-4 pt-8 pb-24 max-w-6xl">
        <Link
          to="/grade-3/$semesterId/$chapterId"
          params={{ semesterId: semester.id, chapterId: chapter.id }}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-5 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 rotate-180" /> {chapter.title}
        </Link>

        <div className="text-center mb-8">
          <div className="text-xs text-primary font-bold mb-1">
            الفصل {chapter.number} • {chapter.title}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-foreground">{lesson.title}</h1>
          <p className="mt-2 text-muted-foreground">{lesson.summary}</p>
        </div>

        {meta ? (
          <div className="space-y-8">
            <LabFrame title={meta.title} goal={meta.goal} conclusion={meta.conclusion}>
              <meta.Component onMiyarSay={sayMiyar} />
            </LabFrame>

            {labQuiz.length > 0 && (
              <QuizSection
                questions={labQuiz}
                onResult={(score, mistakes, total) => {
                  setQuizScore(score);
                  setQuizMistakes(mistakes);
                  setQuizTotal(total);
                }}
                onMiyarSay={(t, m) => sayMiyar(t, m)}
              />
            )}

            <CompletionPanel
              labId={labId}
              quizScore={quizScore}
              quizTotal={quizTotal || labQuiz.length}
              mistakes={quizMistakes}
              completed={progress?.completed ?? false}
              pointsEarned={progress?.points_earned ?? 0}
              onComplete={() => saveResult(quizScore, quizTotal || labQuiz.length, quizMistakes)}
            />
          </div>
        ) : (
          <div className="rounded-3xl bg-card border border-border p-8 md:p-12 shadow-card text-center">
            <BookOpenText className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-display font-extrabold text-foreground mb-2">قريباً جداً ✨</h2>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              نعمل على إعداد محتوى تفاعلي مميز لهذا الدرس.
            </p>
          </div>
        )}
      </section>

      <MiyarAssistant message={miyarMsg} />
    </div>
  );
}
