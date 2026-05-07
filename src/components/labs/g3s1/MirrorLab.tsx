import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function MirrorLab({ onMiyarSay }: Props) {
  const [type, setType] = useState<"concave" | "convex">("concave");
  const [f, setF] = useState(60); // focal length px
  const [doVal, setDoVal] = useState(120); // object distance
  const fSigned = type === "concave" ? f : -f;
  // 1/f = 1/do + 1/di
  const di = 1 / (1 / fSigned - 1 / doVal);
  const ho = 50;
  const hi = -ho * di / doVal;
  const M = -di / doVal;

  const cx = 280;
  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-3 shadow-card min-h-[460px] flex items-center justify-center">
        <svg viewBox="0 0 560 320" className="w-full h-full">
          <line x1={20} y1={160} x2={540} y2={160} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" strokeWidth={1} />
          {/* mirror curve */}
          <path d={type === "concave" ? `M ${cx} 60 Q ${cx - 20} 160 ${cx} 260` : `M ${cx} 60 Q ${cx + 20} 160 ${cx} 260`} stroke="hsl(var(--deep))" strokeWidth={3} fill="none" />
          {/* focal point */}
          <circle cx={cx - fSigned} cy={160} r={4} fill="hsl(var(--primary))" />
          <text x={cx - fSigned - 6} y={180} fontSize={11} fill="hsl(var(--primary))" fontWeight="bold">F</text>
          <circle cx={cx - 2 * fSigned} cy={160} r={3} fill="hsl(var(--muted-foreground))" />
          <text x={cx - 2 * fSigned - 6} y={180} fontSize={10} fill="hsl(var(--muted-foreground))">C</text>
          {/* object */}
          <line x1={cx - doVal} y1={160} x2={cx - doVal} y2={160 - ho} stroke="hsl(0 70% 55%)" strokeWidth={3} markerEnd="url(#arrO)" />
          {/* image */}
          {Number.isFinite(di) && Math.abs(di) < 400 && (
            <line x1={cx - di} y1={160} x2={cx - di} y2={160 - hi} stroke="hsl(140 60% 45%)" strokeWidth={3} markerEnd="url(#arrI)" strokeDasharray={di < 0 ? "5 3" : undefined} />
          )}
          {/* rays: parallel then through F */}
          <line x1={cx - doVal} y1={160 - ho} x2={cx} y2={160 - ho} stroke="hsl(220 70% 55%)" strokeWidth={1.2} />
          <line x1={cx} y1={160 - ho} x2={cx - di} y2={160 - hi} stroke="hsl(220 70% 55%)" strokeWidth={1.2} />
          <defs>
            <marker id="arrO" markerWidth="8" markerHeight="8" refX="4" refY="2" orient="auto"><path d="M0,0 L5,2 L0,4 Z" fill="hsl(0 70% 55%)" /></marker>
            <marker id="arrI" markerWidth="8" markerHeight="8" refX="4" refY="2" orient="auto"><path d="M0,0 L5,2 L0,4 Z" fill="hsl(140 60% 45%)" /></marker>
          </defs>
        </svg>
      </div>
      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold">🪞 المرايا الكروية</h4>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => { setType("concave"); sounds.click(); }} className={`py-2 rounded-xl font-bold text-sm border-2 ${type === "concave" ? "border-primary bg-primary/10" : "border-border"}`}>مقعّرة</button>
          <button onClick={() => { setType("convex"); sounds.click(); }} className={`py-2 rounded-xl font-bold text-sm border-2 ${type === "convex" ? "border-primary bg-primary/10" : "border-border"}`}>محدّبة</button>
        </div>
        <Ctrl label="البعد البؤري |f|" unit="سم" value={f} min={30} max={150} step={5} onChange={setF} />
        <Ctrl label="بُعد الجسم dₒ" unit="سم" value={doVal} min={20} max={300} step={5} onChange={setDoVal} />
        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs font-mono space-y-1">
          <div>1/f = 1/dₒ + 1/dᵢ</div>
          <div>dᵢ = <b>{Number.isFinite(di) ? di.toFixed(1) : "∞"}</b></div>
          <div>التكبير M = <b>{M.toFixed(2)}</b></div>
        </div>
        <button onClick={() => { sounds.success(); onMiyarSay?.("المرآة المقعّرة تكوّن صوراً حقيقية أو وهمية حسب موقع الجسم. المحدّبة دائماً تعطي صورة وهمية مصغّرة. 🪞", "celebrate"); }} className="w-full bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow">القاعدة؟</button>
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
