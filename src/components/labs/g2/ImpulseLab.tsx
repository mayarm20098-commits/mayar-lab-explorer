import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Zap } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function ImpulseLab({ onMiyarSay }: Props) {
  const [F, setF] = useState(50);
  const [dt, setDt] = useState(0.2);
  const [m, setM] = useState(2);
  const J = F * dt; // الدفع
  const dv = J / m; // تغير السرعة

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden flex flex-col items-center justify-center gap-4">
        <div className="text-7xl">⚽</div>
        <div className="w-full max-w-xs space-y-2">
          <div className="text-center text-xs font-bold text-deep">القوة عبر الزمن</div>
          <svg viewBox="0 0 200 80" className="w-full h-20 bg-card rounded-xl border border-border">
            <rect x={20} y={80 - F * 0.6} width={dt * 300} height={F * 0.6} fill="hsl(var(--primary))" opacity={0.6} />
            <line x1={0} y1={80} x2={200} y2={80} stroke="hsl(var(--deep))" strokeWidth={1} />
            <text x={100} y={40} textAnchor="middle" fontSize={10} fill="hsl(var(--foreground))" fontWeight="bold">المساحة = J</text>
          </svg>
        </div>
        <div className="bg-card/90 rounded-xl px-3 py-2 text-xs font-mono shadow-soft">
          الدفع J = F·Δt = <b className="text-primary">{J.toFixed(1)} N·s</b>
          <br />تغير السرعة Δv = <b>{dv.toFixed(2)} م/ث</b>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" /> الدفع وتغير الزخم
        </h4>
        <Ctrl label="القوة F" unit="N" value={F} min={10} max={100} step={5} onChange={(v) => { setF(v); sounds.click(); }} />
        <Ctrl label="زمن التأثير Δt" unit="ث" value={dt} min={0.05} max={1} step={0.05} onChange={(v) => { setDt(v); sounds.click(); }} />
        <Ctrl label="الكتلة m" unit="كغ" value={m} min={0.5} max={10} step={0.5} onChange={(v) => { setM(v); sounds.click(); }} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>J = F·Δt = ΔP</div>
          <div>Δv = J / m</div>
        </div>

        <button
          onClick={() => { sounds.success(); onMiyarSay?.(`زيادة زمن التأثير تقلل القوة المؤثرة لنفس تغير الزخم. لذلك الوسائد الهوائية تحمينا! 🛡️`, "celebrate"); }}
          className="w-full bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow hover:scale-105 transition-transform"
        >
          ما القاعدة؟
        </button>
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
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} dir="ltr" />
    </div>
  );
}
