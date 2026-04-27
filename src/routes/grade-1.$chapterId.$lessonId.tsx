import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BookOpenText } from "lucide-react";
import { findLesson } from "@/data/curriculum";
import { quizzes } from "@/data/quizzes";
import { SiteHeader } from "@/components/SiteHeader";
import { MiyarAssistant, type MiyarMessage } from "@/components/MiyarAssistant";
import { LabFrame } from "@/components/LabFrame";
import { FreeFallLab } from "@/components/labs/FreeFallLab";
import { ProjectileLab } from "@/components/labs/ProjectileLab";
import { QuizSection } from "@/components/QuizSection";

export const Route = createFileRoute("/grade-1/$chapterId/$lessonId")({
  loader: ({ params }) => {
    const found = findLesson(params.chapterId, params.lessonId);
    if (!found) throw notFound();
    return found;
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
      <Link to="/grade-1" className="text-primary font-bold">عودة للفصول</Link>
    </div>
  ),
});

const labMeta = {
  "free-fall": {
    title: "السقوط الحر",
    goal: "اكتشفي كيف تؤثر الجاذبية على الأجسام الساقطة، وتأكدي بنفسك أن الكتلة لا تغيّر زمن السقوط في غياب مقاومة الهواء.",
    conclusion:
      "في السقوط الحر، تسارع جميع الأجسام نحو الأرض يساوي تسارع الجاذبية g (≈ 9.8 م/ث² على سطح الأرض)، بصرف النظر عن كتلتها.\n\nالمعادلتان الأساسيتان:\n• h = ½ g t²  (الارتفاع بدلالة الزمن)\n• v = g t   (السرعة عند الوصول)\n\nعند تفعيل مقاومة الهواء، تظهر قوة معاكسة للحركة فيتباطأ الجسم.",
  },
  projectile: {
    title: "حركة المقذوف",
    goal: "أصيبي الهدف بالمدفع! اكتشفي كيف تؤثر زاوية الإطلاق والسرعة على المسار والمدى الأفقي.",
    conclusion:
      "حركة المقذوف هي تركيب لحركتين مستقلتين:\n• حركة أفقية بسرعة ثابتة: vₓ = v·cos(θ)\n• حركة رأسية متسارعة بفعل الجاذبية: v_y = v·sin(θ) − g·t\n\n• المدى الأقصى: R = v² · sin(2θ) / g  ⇒ يكون أعظم عند θ = 45°.\n• الارتفاع الأقصى: H = v² · sin²(θ) / (2g).",
  },
} as const;

function LessonPage() {
  const { chapter, lesson } = Route.useLoaderData();
  const [miyarMsg, setMiyarMsg] = useState<MiyarMessage | null>({
    text: lesson.lab
      ? "أهلاً بكِ في المختبر! اضبطي المتغيرات ثم ابدئي التجربة. لا تترددي في التجريب 🌟"
      : `سنتعلم اليوم درس "${lesson.title}". هيا نبدأ!`,
    mood: "happy",
  });

  const sayMiyar = (text: string, mood?: MiyarMessage["mood"]) => setMiyarMsg({ text, mood });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="container mx-auto px-4 pt-8 pb-24 max-w-6xl">
        <Link
          to="/grade-1/$chapterId"
          params={{ chapterId: chapter.id }}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-5 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 rotate-180" /> {chapter.title}
        </Link>

        <div className="text-center mb-8">
          <div className="text-xs text-primary font-bold mb-1">
            الفصل {chapter.number} • {chapter.title}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-foreground">
            {lesson.title}
          </h1>
          <p className="mt-2 text-muted-foreground">{lesson.summary}</p>
        </div>

        {lesson.lab ? (
          <div className="space-y-8">
            <LabFrame
              title={labMeta[lesson.lab].title}
              goal={labMeta[lesson.lab].goal}
              conclusion={labMeta[lesson.lab].conclusion}
            >
              {lesson.lab === "free-fall" ? (
                <FreeFallLab onMiyarSay={sayMiyar} />
              ) : (
                <ProjectileLab onMiyarSay={sayMiyar} />
              )}
            </LabFrame>

            <QuizSection
              questions={quizzes[lesson.lab]}
              onMiyarSay={(t, m) => sayMiyar(t, m)}
            />
          </div>
        ) : (
          <div className="rounded-3xl bg-card border border-border p-8 md:p-12 shadow-card text-center">
            <BookOpenText className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-display font-extrabold text-foreground mb-2">
              قريباً جداً ✨
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              نعمل حالياً على إعداد محتوى تفاعلي ومميز لهذا الدرس. في هذه النسخة، التجارب التفاعلية
              متاحة في درسي <span className="font-bold text-primary">السقوط الحر</span> و
              <span className="font-bold text-primary"> حركة المقذوف</span>.
            </p>
            <Link
              to="/grade-1/$chapterId"
              params={{ chapterId: chapter.id }}
              className="inline-flex items-center gap-1 mt-6 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-full font-bold text-sm shadow-soft transition-colors"
            >
              العودة لدروس الفصل
            </Link>
          </div>
        )}
      </section>

      <MiyarAssistant message={miyarMsg} />
    </div>
  );
}
