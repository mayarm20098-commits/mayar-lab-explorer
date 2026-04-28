import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { sounds } from "@/lib/sounds";
import { Play, RotateCcw } from "lucide-react";

export function MotionDiagramLab() {
  const [acceleration, setAcceleration] = useState(0); // 0 = constant velocity
  const [v0, setV0] = useState(2);
  const [running, setRunning] = useState(false);
  const [t, setT] = useState(0);
  const [snapshots, setSnapshots] = useState<number[]>([]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setT((prev) => {
        const next = prev + 0.5;
        const x = v0 * next + 0.5 * acceleration * next * next;
        setSnapshots((s) => [...s, x]);
        sounds.pop();
        if (next >= 5) {
          setRunning(false);
          return next;
        }
        return next;
      });
    }, 600);
    return () => clearInterval(id);
  }, [running, v0, acceleration]);

  function start() {
    sounds.click();
    setSnapshots([0]);
    setT(0);
    setRunning(true);
  }
  function reset() {
    sounds.click();
    setRunning(false);
    setT(0);
    setSnapshots([]);
  }

  const maxX = Math.max(20, ...snapshots);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky p-6 min-h-[460px] flex flex-col shadow-card border border-border">
        <div className="text-sm font-bold text-foreground mb-2">مخطط الحركة (نقاط بفترات 0.5 ث)</div>
        <svg viewBox="0 0 600 120" className="w-full bg-card rounded-2xl border border-border">
          <line x1="20" y1="80" x2="580" y2="80" stroke="oklch(0.50 0.05 250)" strokeWidth="2" />
          {snapshots.map((x, i) => {
            const px = 30 + (x / maxX) * 540;
            return (
              <g key={i}>
                <circle cx={px} cy="80" r="8" fill="oklch(0.55 0.20 252)" />
                <text x={px} y="105" fontSize="9" textAnchor="middle" fill="oklch(0.22 0.10 255)">
                  t={(i * 0.5).toFixed(1)}
                </text>
                {i > 0 && (
                  <line
                    x1={30 + (snapshots[i - 1] / maxX) * 540}
                    y1="65"
                    x2={px - 4}
                    y2="65"
                    stroke="oklch(0.55 0.20 252)"
                    strokeWidth="2"
                    markerEnd="url(#arrow)"
                  />
                )}
              </g>
            );
          })}
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="oklch(0.55 0.20 252)" />
            </marker>
          </defs>
        </svg>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="bg-card rounded-2xl p-3 shadow-soft">
            <div className="text-xs text-muted-foreground">الزمن</div>
            <div className="font-bold text-foreground">{t.toFixed(1)} ث</div>
          </div>
          <div className="bg-card rounded-2xl p-3 shadow-soft">
            <div className="text-xs text-muted-foreground">الموقع</div>
            <div className="font-bold text-foreground">{(v0 * t + 0.5 * acceleration * t * t).toFixed(1)} م</div>
          </div>
          <div className="bg-card rounded-2xl p-3 shadow-soft">
            <div className="text-xs text-muted-foreground">السرعة</div>
            <div className="font-bold text-foreground">{(v0 + acceleration * t).toFixed(1)} م/ث</div>
          </div>
        </div>

        <div className="mt-3 flex gap-2 justify-center">
          <button onClick={start} disabled={running} className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-bold shadow-glow flex items-center gap-2 disabled:opacity-60">
            <Play className="h-4 w-4 fill-current" /> ابدئي
          </button>
          <button onClick={reset} className="bg-card border border-border text-foreground px-4 py-2 rounded-full font-bold flex items-center gap-2">
            <RotateCcw className="h-4 w-4" /> إعادة
          </button>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground">🎛️ المتغيرات</h4>
        <ControlSlider label="السرعة الابتدائية" unit="م/ث" value={v0} min={0} max={10} step={0.5} onChange={setV0} />
        <ControlSlider label="التسارع" unit="م/ث²" value={acceleration} min={-2} max={5} step={0.5} onChange={setAcceleration} hint="0 = سرعة ثابتة، +ve = تسارع" />
        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs">
          <div className="font-bold mb-1">📊 لاحظي:</div>
          <div>عند تسارع = 0 → النقاط متباعدة بانتظام</div>
          <div>عند تسارع &gt; 0 → النقاط تتباعد أكثر</div>
        </div>
      </div>
    </div>
  );
}

function ControlSlider({ label, unit, value, min, max, step, onChange, hint }: { label: string; unit: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; hint?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-bold text-foreground">{label}</label>
        <span className="text-sm font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-md">{value} {unit}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} dir="ltr" />
      {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}
