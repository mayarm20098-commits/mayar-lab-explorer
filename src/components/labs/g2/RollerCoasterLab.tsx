import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { TrendingDown } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function RollerCoasterLab({ onMiyarSay }: Props) {
  const [h0, setH0] = useState(80); // ارتفاع البداية
  const [m] = useState(2);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const g = 9.8;

  useEffect(() => {
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setProgress((p) => (p + dt * 0.3) % 1);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // مسار: تنازلي ثم صاعد
  const curve = (x: number) => 0.5 * (Math.cos(Math.PI * x) + 1) * h0; // من h0 إلى 0
  const x = progress;
  const h = curve(x);
  const PE = m * g * h / 10;
  const E0 = m * g * h0 / 10;
  const KE = E0 - PE;
  const v = Math.sqrt(Math.max(0, 2 * KE / m));

  const trackX = (xx: number) => -150 + xx * 300;
  const trackY = (xx: number) => 80 - curve(xx);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden flex flex-col items-center justify-center gap-4">
        <svg viewBox="-160 -10 320 120" className="w-full max-w-md">
          <path d={`M ${[...Array(50)].map((_, i) => `${trackX(i / 49)} ${trackY(i / 49)}`).join(" L ")}`}
            fill="none" stroke="hsl(var(--deep))" strokeWidth={3} />
          <circle cx={trackX(x)} cy={trackY(x) - 8} r={10} fill="hsl(var(--primary))" />
        </svg>
        <div className="w-full max-w-md grid grid-cols-3 gap-2">
          <Bar label="PE" val={PE} max={E0} color="primary" />
          <Bar label="KE" val={KE} max={E0} color="accent" />
          <Bar label="E" val={E0} max={E0} color="deep" />
        </div>
        <div className="bg-card/90 rounded-xl px-3 py-2 text-[11px] font-mono shadow-soft">
          h = {h.toFixed(1)} | v = <b>{v.toFixed(2)} م/ث</b> | E = <b>{E0.toFixed(2)} J</b>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-primary" /> الأفعوانية
        </h4>
        <Ctrl label="ارتفاع البداية h₀" unit="" value={h0} min={30} max={120} step={5} onChange={(v) => { setH0(v); sounds.click(); }} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>E = PE + KE = ثابت</div>
          <div>v = √(2·g·(h₀−h))</div>
        </div>

        <button
          onClick={() => { sounds.success(); onMiyarSay?.(`في القمة كل الطاقة وضع، وفي القاع كلها حركة. الإجمالي ثابت دائماً! 🎢`, "celebrate"); }}
          className="w-full bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow hover:scale-105 transition-transform"
        >
          ما القاعدة؟
        </button>
      </div>
    </div>
  );
}

function Bar({ label, val, max, color }: { label: string; val: number; max: number; color: string }) {
  const pct = max > 0 ? (val / max) * 100 : 0;
  return (
    <div className="bg-card border border-border rounded-xl p-2">
      <div className="text-center text-[10px] font-bold mb-1">{label}</div>
      <div className="h-16 bg-muted rounded relative overflow-hidden">
        <div className="absolute bottom-0 inset-x-0 transition-all" style={{ height: `${pct}%`, background: `hsl(var(--${color}))` }} />
      </div>
      <div className="text-center text-[10px] font-mono mt-1">{val.toFixed(2)}J</div>
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
