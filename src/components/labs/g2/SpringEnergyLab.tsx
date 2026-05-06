import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Activity } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function SpringEnergyLab({ onMiyarSay }: Props) {
  const [k, setK] = useState(50); // ثابت الزنبرك N/m
  const [x0, setX0] = useState(0.2); // الانضغاط الابتدائي
  const [m] = useState(1);
  const [t, setT] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setT((p) => p + dt);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const omega = Math.sqrt(k / m);
  const x = x0 * Math.cos(omega * t);
  const v = -x0 * omega * Math.sin(omega * t);
  const PE = 0.5 * k * x * x;
  const KE = 0.5 * m * v * v;
  const E = PE + KE;

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden flex flex-col items-center justify-center gap-4">
        <svg viewBox="-180 -60 360 120" className="w-full max-w-md">
          <rect x={-180} y={-30} width={10} height={60} fill="hsl(var(--deep))" />
          {/* الزنبرك */}
          <path d={`M -170 0 L ${-150 + x * 200} 0`} stroke="hsl(var(--primary))" strokeWidth={3} />
          {[...Array(10)].map((_, i) => {
            const xs = -170 + i * ((80 + x * 200) / 10);
            return <circle key={i} cx={xs} cy={i % 2 ? -8 : 8} r={3} fill="hsl(var(--primary))" />;
          })}
          {/* الكتلة */}
          <rect x={-150 + x * 200} y={-25} width={50} height={50} fill="hsl(var(--accent))" rx={6} />
        </svg>
        <div className="w-full max-w-md grid grid-cols-3 gap-2 text-xs">
          <Bar label="PE" val={PE} max={E} color="primary" />
          <Bar label="KE" val={KE} max={E} color="accent" />
          <Bar label="E" val={E} max={E} color="deep" />
        </div>
        <div className="bg-card/90 rounded-xl px-3 py-2 text-[11px] font-mono shadow-soft">
          x = {x.toFixed(3)} م | v = {v.toFixed(2)} م/ث | E = <b>{E.toFixed(2)} J</b>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" /> طاقة الزنبرك
        </h4>
        <Ctrl label="ثابت الزنبرك k" unit="N/م" value={k} min={10} max={200} step={5} onChange={(v) => { setK(v); sounds.click(); }} />
        <Ctrl label="الإزاحة الأولى x₀" unit="م" value={x0} min={0.05} max={0.4} step={0.05} onChange={(v) => { setX0(v); sounds.click(); }} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>PE = ½·k·x²</div>
          <div>E = PE + KE = ثابت</div>
        </div>

        <button
          onClick={() => { sounds.success(); onMiyarSay?.(`طاقة الزنبرك تتحول بين وضع وحركة باستمرار، ومجموعها يبقى ثابتاً! 🌀`, "celebrate"); }}
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
