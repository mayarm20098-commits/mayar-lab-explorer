import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function CoulombLab({ onMiyarSay }: Props) {
  const [q1, setQ1] = useState(2); // µC
  const [q2, setQ2] = useState(-3); // µC
  const [r, setR] = useState(0.3); // m
  const k = 8.99e9;
  const F = (k * Math.abs(q1 * q2) * 1e-12) / (r * r); // N
  const attractive = q1 * q2 < 0;

  const cx1 = 120;
  const cx2 = 120 + r * 700;
  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-3 shadow-card min-h-[460px] flex items-center justify-center">
        <svg viewBox="0 0 560 320" className="w-full h-full">
          <line x1={20} y1={160} x2={540} y2={160} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" strokeWidth={1} />
          {/* charge 1 */}
          <circle cx={cx1} cy={160} r={Math.min(40, 15 + Math.abs(q1) * 5)} fill={q1 >= 0 ? "hsl(0 70% 55%)" : "hsl(220 70% 55%)"} stroke="hsl(var(--deep))" strokeWidth={2} />
          <text x={cx1} y={166} fontSize={20} fontWeight="bold" fill="white" textAnchor="middle">{q1 >= 0 ? "+" : "−"}</text>
          <text x={cx1} y={220} fontSize={12} fontWeight="bold" textAnchor="middle">{q1}μC</text>
          {/* charge 2 */}
          <circle cx={cx2} cy={160} r={Math.min(40, 15 + Math.abs(q2) * 5)} fill={q2 >= 0 ? "hsl(0 70% 55%)" : "hsl(220 70% 55%)"} stroke="hsl(var(--deep))" strokeWidth={2} />
          <text x={cx2} y={166} fontSize={20} fontWeight="bold" fill="white" textAnchor="middle">{q2 >= 0 ? "+" : "−"}</text>
          <text x={cx2} y={220} fontSize={12} fontWeight="bold" textAnchor="middle">{q2}μC</text>
          {/* arrows */}
          {attractive ? (
            <>
              <line x1={cx1 + 50} y1={120} x2={cx1 + 110} y2={120} stroke="hsl(140 60% 40%)" strokeWidth={3} markerEnd="url(#arr)" />
              <line x1={cx2 - 50} y1={120} x2={cx2 - 110} y2={120} stroke="hsl(140 60% 40%)" strokeWidth={3} markerEnd="url(#arr)" />
            </>
          ) : (
            <>
              <line x1={cx1 + 50} y1={120} x2={cx1} y2={120} stroke="hsl(0 70% 50%)" strokeWidth={3} markerEnd="url(#arr)" />
              <line x1={cx2 - 50} y1={120} x2={cx2} y2={120} stroke="hsl(0 70% 50%)" strokeWidth={3} markerEnd="url(#arr)" />
            </>
          )}
          <defs>
            <marker id="arr" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="currentColor" /></marker>
          </defs>
          <text x={280} y={260} fontSize={14} fontWeight="bold" textAnchor="middle">r = {r.toFixed(2)} م — قوة {attractive ? "تجاذب" : "تنافر"}</text>
        </svg>
      </div>
      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold">⚡ قانون كولوم</h4>
        <Ctrl label="الشحنة q₁" unit="μC" value={q1} min={-5} max={5} step={0.5} onChange={setQ1} />
        <Ctrl label="الشحنة q₂" unit="μC" value={q2} min={-5} max={5} step={0.5} onChange={setQ2} />
        <Ctrl label="المسافة r" unit="م" value={r} min={0.05} max={0.6} step={0.01} onChange={setR} />
        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs font-mono space-y-1">
          <div>F = k · |q₁·q₂| / r²</div>
          <div>F = <b>{F.toExponential(2)} N</b></div>
        </div>
        <button onClick={() => { sounds.success(); onMiyarSay?.("القوة عكسياً مع مربع المسافة! إذا ضاعفتِ المسافة تصبح القوة رُبعَ ما كانت. ⚡", "celebrate"); }} className="w-full bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow">القاعدة؟</button>
      </div>
    </div>
  );
}

function Ctrl({ label, unit, value, min, max, step, onChange }: { label: string; unit: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-bold">{label}</label>
        <span className="text-sm font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-md">{value} {unit}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => { onChange(v[0]); sounds.click(); }} dir="ltr" />
    </div>
  );
}
