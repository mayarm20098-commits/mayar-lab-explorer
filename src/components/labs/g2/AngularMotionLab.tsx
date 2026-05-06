import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Compass } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function AngularMotionLab({ onMiyarSay }: Props) {
  const [omega, setOmega] = useState(2); // rad/s
  const [r, setR] = useState(80); // px
  const [angle, setAngle] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setAngle((a) => a + omega * dt);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [omega]);

  const v = omega * (r / 100); // السرعة الخطية بـ m/s (افتراضاً)
  const T = (2 * Math.PI) / omega;
  const x = Math.cos(angle) * r;
  const y = Math.sin(angle) * r;

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden flex items-center justify-center">
        <svg viewBox="-150 -150 300 300" className="w-full max-w-md h-full">
          <circle cx={0} cy={0} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth={2} strokeDasharray="4 4" />
          <line x1={0} y1={0} x2={x} y2={y} stroke="hsl(var(--primary))" strokeWidth={2} />
          <circle cx={0} cy={0} r={5} fill="hsl(var(--deep))" />
          <circle cx={x} cy={y} r={10} fill="hsl(var(--primary))" />
          <text x={x + 12} y={y + 4} fontSize={11} fill="hsl(var(--foreground))">θ</text>
        </svg>
        <div className="absolute top-3 right-3 bg-card/90 rounded-xl px-3 py-2 text-[11px] font-mono space-y-0.5 shadow-soft">
          <div>θ = <b>{(angle % (2 * Math.PI)).toFixed(2)} rad</b></div>
          <div>v = ω·r = <b>{v.toFixed(2)} م/ث</b></div>
          <div>T = <b>{T.toFixed(2)} ث</b></div>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <Compass className="h-4 w-4 text-primary" /> الحركة الزاوية
        </h4>
        <Ctrl label="السرعة الزاوية ω" unit="rad/s" value={omega} min={0.2} max={6} step={0.1} onChange={(v) => { setOmega(v); sounds.click(); }} />
        <Ctrl label="نصف القطر r" unit="" value={r} min={30} max={130} step={5} onChange={(v) => { setR(v); sounds.click(); }} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>v = ω · r</div>
          <div>T = 2π / ω</div>
        </div>

        <button
          onClick={() => { sounds.success(); onMiyarSay?.(`السرعة الخطية تساوي السرعة الزاوية × نصف القطر. لذلك أطراف المروحة أسرع من المركز! ⚙️`, "celebrate"); }}
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
