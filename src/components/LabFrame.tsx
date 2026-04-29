import { useEffect, useState } from "react";
import { Lightbulb, X, Target } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = {
  title: string;
  goal: string;
  conclusion: string;
  children: React.ReactNode;
};

export function LabFrame({ title, goal, conclusion, children }: Props) {
  const [showGoal, setShowGoal] = useState(true); // auto-open on entry
  const [showConclusion, setShowConclusion] = useState(false);

  // ensure each lab navigation re-opens the goal
  useEffect(() => {
    setShowGoal(true);
  }, [title]);

  return (
    <section className="rounded-3xl bg-gradient-to-br from-secondary/40 to-accent/30 border border-border p-4 md:p-6 shadow-card">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="text-lg md:text-xl font-display font-extrabold text-foreground flex items-center gap-2">
          🧪 {title}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => { sounds.click(); setShowGoal(true); }}
            className="h-10 px-3 rounded-full bg-gradient-card text-primary-foreground shadow-glow flex items-center gap-1.5 text-sm font-bold hover:scale-105 transition-transform"
            title="هدف التجربة"
          >
            <Target className="h-4 w-4" /> الهدف
          </button>
          <button
            onClick={() => { sounds.click(); setShowConclusion(true); }}
            className="h-10 px-4 rounded-full bg-card border border-primary/30 text-primary font-bold text-sm shadow-soft hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-1.5"
          >
            <Lightbulb className="h-4 w-4" /> الاستنتاج
          </button>
        </div>
      </div>

      {/* Always-visible goal banner */}
      <div className="mb-4 rounded-2xl bg-primary/10 border border-primary/20 p-3 flex items-start gap-2">
        <Target className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <div className="text-sm text-foreground leading-relaxed">
          <span className="font-bold text-primary">هدف التجربة: </span>
          {goal}
        </div>
      </div>

      {children}

      {showGoal && (
        <Modal title="🎯 هدف التجربة" onClose={() => setShowGoal(false)}>
          <p className="text-base leading-relaxed text-foreground">{goal}</p>
        </Modal>
      )}
      {showConclusion && (
        <Modal title="💡 الاستنتاج العلمي" onClose={() => setShowConclusion(false)}>
          <p className="text-base leading-relaxed text-foreground whitespace-pre-line">{conclusion}</p>
        </Modal>
      )}
    </section>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep/60 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div
        className="bg-card rounded-3xl shadow-deep max-w-md w-full p-6 animate-pop-in border border-primary/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-display font-extrabold text-foreground">{title}</h4>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
