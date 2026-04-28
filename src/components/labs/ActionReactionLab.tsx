import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { sounds } from "@/lib/sounds";

export function ActionReactionLab() {
  const [F, setF] = useState(30);
  const [push, setPush] = useState(false);

  const arrowLen = Math.min(120, F * 3);

  function doPush() {
    sounds.impact();
    setPush(true);
    setTimeout(() => setPush(false), 600);
  }

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky p-6 min-h-[460px] flex flex-col items-center justify-center shadow-card border border-border">
        <div className="text-sm font-bold text-foreground mb-4">قانون نيوتن الثالث: لكل فعل رد فعل مساوٍ ومعاكس</div>
        <svg viewBox="0 0 500 240" className="w-full max-w-lg bg-card rounded-2xl border border-border">
          {/* ground */}
          <line x1="20" y1="200" x2="480" y2="200" stroke="oklch(0.22 0.10 255)" strokeWidth="2" />
          {/* wall */}
          <rect x="380" y="60" width="40" height="140" fill="oklch(0.50 0.05 250)" stroke="oklch(0.22 0.10 255)" strokeWidth="2" />
          {/* hand/person */}
          <text x="180" y="160" fontSize="50">🙋‍♀️</text>
          {/* action arrow */}
          <g style={{ opacity: push ? 1 : 0.6, transition: "opacity 0.2s" }}>
            <line x1="280" y1="120" x2={280 + arrowLen} y2="120" stroke="oklch(0.62 0.22 25)" strokeWidth="4" markerEnd="url(#a1)" />
            <text x={280 + arrowLen / 2} y="110" fontSize="11" textAnchor="middle" fill="oklch(0.62 0.22 25)" fontWeight="bold">فعل: {F} N</text>
          </g>
          {/* reaction arrow */}
          <g style={{ opacity: push ? 1 : 0.6, transition: "opacity 0.2s" }}>
            <line x1="370" y1="160" x2={370 - arrowLen} y2="160" stroke="oklch(0.55 0.20 252)" strokeWidth="4" markerEnd="url(#a2)" />
            <text x={370 - arrowLen / 2} y="180" fontSize="11" textAnchor="middle" fill="oklch(0.55 0.20 252)" fontWeight="bold">رد فعل: {F} N</text>
          </g>
          <defs>
            <marker id="a1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="oklch(0.62 0.22 25)" />
            </marker>
            <marker id="a2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="oklch(0.55 0.20 252)" />
            </marker>
          </defs>
        </svg>

        <button onClick={doPush} className="mt-4 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold shadow-glow">
          ادفعي الجدار 👋
        </button>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground">🎛️ التحكم</h4>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-bold text-foreground">قوة الدفع</label>
            <span className="text-sm font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-md">{F} N</span>
          </div>
          <Slider value={[F]} min={5} max={50} step={5} onValueChange={(v) => setF(v[0])} dir="ltr" />
        </div>
        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1">
          <div className="font-bold mb-1">💡 ملاحظة</div>
          <div>القوتان متساويتان في المقدار</div>
          <div>متعاكستان في الاتجاه</div>
          <div>تؤثران على جسمين مختلفين</div>
        </div>
      </div>
    </div>
  );
}
