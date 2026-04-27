import { useState } from "react";
import { Lightbulb, X } from "lucide-react";

type Props = {
  title: string;
  goal: string;
  conclusion: string;
  children: React.ReactNode;
};

export function LabFrame({ title, goal, conclusion, children }: Props) {
  const [showGoal, setShowGoal] = useState(false);
  const [showConclusion, setShowConclusion] = useState(false);

  return (
    <section className="rounded-3xl bg-gradient-to-br from-secondary/40 to-accent/30 border border-border p-4 md:p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg md:text-xl font-display font-extrabold text-foreground flex items-center gap-2">
          🧪 {title}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowGoal(true)}
            className="h-10 w-10 rounded-full bg-gradient-card text-primary-foreground shadow-glow flex items-center justify-center hover:scale-110 transition-transform"
            title="هدف التجربة"
          >
            <Lightbulb className="h-5 w-5 fill-current" />
          </button>
          <button
            onClick={() => setShowConclusion(true)}
            className="h-10 px-4 rounded-full bg-card border border-primary/30 text-primary font-bold text-sm shadow-soft hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            الاستنتاج العلمي
          </button>
        </div>
      </div>

      {children}

      {/* Goal Modal */}
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
