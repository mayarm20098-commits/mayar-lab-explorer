import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Orbit } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function KeplerLab({ onMiyarSay }: Props) {
  const [a, setA] = useState(120); // نصف المحور الأكبر
  const [e, setE] = useState(0.4); // الشذوذ
  const [t, setT] = useState(0);
  const rafRef = useRef<number | null>(null);

  const b = a * Math.sqrt(1 - e * e);
  const c = a * e;
  const T = Math.pow(a / 100, 1.5) * 4; // قانون كبلر الثالث: T² ∝ a³

  useEffect(() => {
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setT((p) => (p + dt / T) % 1);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [T]);

  // الحل العددي لمعادلة كبلر للحصول على الموقع
  const M = 2 * Math.PI * t;
  let E = M;
  for (let i = 0; i < 8; i++) E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  const x = a * (Math.cos(E) - e);
  const y = b * Math.sin(E);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-to-br from-indigo-950 to-purple-900 border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden flex items-center justify-center">
        <svg viewBox="-180 -150 360 300" className="w-full max-w-md h-full">
          {[...Array(40)].map((_, i) => (
            <circle key={i} cx={(i * 137) % 360 - 180} cy={(i * 211) % 300 - 150} r={0.5} fill="white" opacity={0.6} />
          ))}
          <ellipse cx={0} cy={0} rx={a} ry={b} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1} strokeDasharray="3 3" />
          {/* الشمس في إحدى البؤرتين */}
          <circle cx={c} cy={0} r={14} fill="url(#sun)" />
          <defs>
            <radialGradient id="sun"><stop offset="0%" stopColor="#fff7c2" /><stop offset="100%" stopColor="#f59e0b" /></radialGradient>
          </defs>
          {/* الكوكب */}
          <line x1={c} y1={0} x2={x} y2={y} stroke="hsl(var(--primary))" strokeWidth={1} opacity={0.5} />
          <circle cx={x} cy={y} r={6} fill="hsl(var(--primary))" />
        </svg>
        <div className="absolute top-3 right-3 bg-card/90 rounded-xl px-3 py-2 text-[11px] font-mono space-y-0.5 shadow-soft">
          <div>a = <b>{(a / 100).toFixed(2)} AU</b></div>
          <div>الشذوذ e = <b>{e.toFixed(2)}</b></div>
          <div>T² ∝ a³ ⇒ T = <b>{(T / 4).toFixed(2)} سنة</b></div>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <Orbit className="h-4 w-4 text-primary" /> قوانين كبلر
        </h4>
        <Ctrl label="نصف المحور a" unit="" value={a} min={60} max={160} step={5} onChange={(v) => { setA(v); sounds.click(); }} />
        <Ctrl label="الشذوذ e" unit="" value={e} min={0} max={0.8} step={0.05} onChange={(v) => { setE(v); sounds.click(); }} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>1️⃣ مدارات إهليلجية</div>
          <div>2️⃣ المساحات المتساوية / زمن متساوي</div>
          <div>3️⃣ T² = k · a³</div>
        </div>

        <button
          onClick={() => { sounds.success(); onMiyarSay?.(`كلما زاد نصف المحور a زاد زمن الدوران بنسبة a^(3/2). هذا قانون كبلر الثالث! 🪐`, "celebrate"); }}
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
