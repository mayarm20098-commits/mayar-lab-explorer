import { useState } from "react";
import { CheckCircle2, XCircle, Sparkles, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/data/quizzes";

type Props = {
  questions: QuizQuestion[];
  onMiyarSay?: (text: string, mood?: "celebrate" | "encourage" | "thinking") => void;
};

export function QuizSection({ questions, onMiyarSay }: Props) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[index];

  function pick(i: number) {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === q.correctIndex;
    if (correct) {
      setScore((s) => s + 1);
      onMiyarSay?.("ممتاز! إجابة صحيحة 🌟", "celebrate");
    } else {
      onMiyarSay?.("لا بأس، حاولي مرة أخرى. اقرئي التفسير 💡", "encourage");
    }
  }

  function next() {
    if (index + 1 >= questions.length) {
      setDone(true);
      const pct = Math.round(((score + (selected === q.correctIndex ? 0 : 0)) / questions.length) * 100);
      onMiyarSay?.(`أنهيتِ الاختبار! نتيجتك ${pct}%`, "celebrate");
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  }

  function reset() {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="rounded-3xl bg-gradient-card text-primary-foreground p-8 text-center shadow-deep animate-pop-in">
        <Sparkles className="h-12 w-12 mx-auto mb-3" />
        <h3 className="text-2xl font-display font-extrabold mb-2">أحسنتِ!</h3>
        <p className="text-lg mb-1">نتيجتك: {score} من {questions.length}</p>
        <p className="text-4xl font-extrabold mb-4">{pct}%</p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-background/20 hover:bg-background/30 text-primary-foreground px-5 py-2.5 rounded-full font-bold transition-colors"
        >
          <RotateCcw className="h-4 w-4" /> أعيدي الاختبار
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-card p-6 md:p-8 shadow-card border border-border">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg md:text-xl font-display font-extrabold text-foreground">
          📝 اختبري نفسك مع ميار
        </h3>
        <span className="text-sm text-muted-foreground">
          سؤال {index + 1} / {questions.length}
        </span>
      </div>

      <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-card transition-all duration-500"
          style={{ width: `${((index + (selected !== null ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <p className="text-base md:text-lg font-semibold text-foreground mb-5 leading-relaxed">
        {q.question}
      </p>

      <div className="grid gap-2.5">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correctIndex;
          const isPicked = i === selected;
          const reveal = selected !== null;
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={reveal}
              className={cn(
                "text-right flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all font-medium",
                "hover:border-primary hover:bg-primary/5",
                !reveal && "border-border bg-secondary/40",
                reveal && isCorrect && "border-success bg-success/10 text-foreground animate-pop-in",
                reveal && isPicked && !isCorrect && "border-destructive bg-destructive/10 text-foreground",
                reveal && !isCorrect && !isPicked && "opacity-60",
              )}
            >
              <span className="flex-1">{opt}</span>
              {reveal && isCorrect && <CheckCircle2 className="h-5 w-5 text-success" />}
              {reveal && isPicked && !isCorrect && <XCircle className="h-5 w-5 text-destructive" />}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="mt-5 p-4 rounded-2xl bg-accent/40 border border-primary/20 animate-fade-in">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-bold text-primary">التفسير: </span>
            {q.explanation}
          </p>
          <button
            onClick={next}
            className="mt-3 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-full font-bold text-sm shadow-soft transition-colors"
          >
            {index + 1 >= questions.length ? "إنهاء الاختبار" : "السؤال التالي ←"}
          </button>
        </div>
      )}
    </div>
  );
}
