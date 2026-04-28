import { CheckCircle2, Trophy } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Link } from "@tanstack/react-router";
import { sounds } from "@/lib/sounds";

type Props = {
  labId: string;
  quizScore: number;
  quizTotal: number;
  mistakes: number;
  completed: boolean;
  pointsEarned: number;
  onComplete: () => void;
};

export function CompletionPanel({ quizScore, quizTotal, mistakes, completed, pointsEarned, onComplete }: Props) {
  const { user } = useAuth();
  const isPerfect = mistakes === 0 && quizScore === quizTotal && quizTotal > 0;
  const points = 10 + quizScore * 2 + (isPerfect ? 5 : 0);

  if (!user) {
    return (
      <div className="rounded-3xl bg-gradient-card text-primary-foreground p-6 text-center shadow-deep">
        <Trophy className="h-10 w-10 mx-auto mb-2" />
        <h3 className="text-lg font-display font-extrabold mb-1">سجّلي الدخول لحفظ نقاطك!</h3>
        <p className="text-sm opacity-90 mb-4">اكسبي شارات وتتبعي تقدمك مع ميار</p>
        <Link to="/auth" className="inline-block bg-background/20 hover:bg-background/30 px-5 py-2 rounded-full font-bold transition-colors">
          سجّلي الآن
        </Link>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="rounded-3xl bg-success/10 border-2 border-success p-6 text-center">
        <CheckCircle2 className="h-10 w-10 mx-auto mb-2 text-success" />
        <h3 className="text-lg font-display font-extrabold text-foreground mb-1">أكملتِ هذا المختبر!</h3>
        <p className="text-sm text-muted-foreground">حصلتِ على {pointsEarned} نقطة 🎉</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-card border-2 border-primary/30 p-6 text-center shadow-card">
      <Trophy className="h-10 w-10 mx-auto mb-2 text-primary" />
      <h3 className="text-lg font-display font-extrabold text-foreground mb-1">جاهزة لإنهاء التجربة؟</h3>
      <p className="text-sm text-muted-foreground mb-3">
        ستحصلين على <span className="font-bold text-primary">{points} نقطة</span>
        {isPerfect && <span className="text-success font-bold"> + مكافأة الأداء المثالي!</span>}
      </p>
      <button
        onClick={() => {
          sounds.celebrate();
          onComplete();
        }}
        className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold shadow-glow"
      >
        إنهاء التجربة وحفظ النقاط ✨
      </button>
    </div>
  );
}
