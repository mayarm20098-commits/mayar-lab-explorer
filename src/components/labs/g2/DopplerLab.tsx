import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Volume2 } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function DopplerLab({ onMiyarSay }: Props) {
  const [sourceVel, setSourceVel] = useState(20); // m/s (موجبة = نحو المراقب)
  const [sourceFreq, setSourceFreq] = useState(440); // Hz
  const c = 340; // سرعة الصوت
  const observed = sourceFreq * (c / (c - sourceVel));

  // محاكاة بصرية: مصدر يتحرك يطلق دوائر
  const [t, setT] = useState(0);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setT((v) => v + dt);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const W = 480;
  const cy = 240;
  // موضع المصدر: يتحرك ذهاباً وإياباً
  const period = 6;
  const phase = (t % period) / period; // 0..1
  const sourceX = 60 + (W - 120) * phase * (sourceVel >= 0 ? 1 : 1); // يتحرك دائماً يميناً للوضوح
  const observerX = W - 40;

  // 5 موجات منبعثة في أوقات سابقة
  const wavesEmitted = Array.from({ length: 6 }, (_, i) => {
    const emitTime = t - i * 0.7;
    if (emitTime < 0) return null;
    const elapsed = t - emitTime;
    const radius = elapsed * 60; // px/sec بصرياً
    const emitPhase = (emitTime % period) / period;
    const emitX = 60 + (W - 120) * emitPhase;
    return { x: emitX, r: radius, key: i };
  }).filter(Boolean);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden">
        <svg viewBox="0 0 480 480" className="w-full h-full">
          {/* أرض */}
          <line x1={0} y1={cy + 60} x2={W} y2={cy + 60} stroke="hsl(var(--deep))" strokeWidth={2} />
          {/* الموجات الصوتية */}
          {wavesEmitted.map((w) => w && (
            <circle key={w.key} cx={w.x} cy={cy} r={w.r} stroke="hsl(var(--primary) / 0.6)" strokeWidth={2} fill="none" />
          ))}
          {/* المراقب */}
          <text x={observerX} y={cy + 8} fontSize="32" textAnchor="middle">👂</text>
          <text x={observerX} y={cy + 80} fontSize="11" fontWeight="bold" textAnchor="middle" fill="hsl(var(--deep))">المراقبة</text>
          {/* المصدر */}
          <text x={sourceX} y={cy + 8} fontSize="32" textAnchor="middle">🚗</text>
          <text x={sourceX} y={cy + 80} fontSize="11" fontWeight="bold" textAnchor="middle" fill="hsl(var(--deep))">المصدر</text>
        </svg>

        <div className="absolute top-3 right-3 bg-card/90 rounded-xl px-3 py-2 text-[11px] font-mono space-y-0.5 shadow-soft">
          <div>تردد المصدر: <b>{sourceFreq} Hz</b></div>
          <div>التردد المسموع: <b className={observed > sourceFreq ? "text-success" : "text-destructive"}>{observed.toFixed(1)} Hz</b></div>
          <div>{observed > sourceFreq ? "🔺 صوت أحدّ (مقترب)" : "🔻 صوت أغلظ (مبتعد)"}</div>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-primary" /> تأثير دوبلر
        </h4>

        <Ctrl label="تردد المصدر f₀" unit="هرتز" value={sourceFreq} min={100} max={1000} step={10} onChange={(v) => { setSourceFreq(v); sounds.click(); }} />
        <Ctrl label="سرعة المصدر v" unit="م/ث" value={sourceVel} min={-100} max={100} step={5} onChange={(v) => { setSourceVel(v); sounds.click(); }} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>f' = f₀ · (c / (c − v_s))</div>
          <div>c = 340 م/ث (سرعة الصوت)</div>
          <div className="opacity-80">v موجبة = اقتراب</div>
        </div>

        <button
          onClick={() => {
            sounds.success();
            onMiyarSay?.(
              `عند اقتراب المصدر يزيد التردد المسموع (صوت حادّ)، وعند ابتعاده يقلّ (صوت غليظ). هذا تأثير دوبلر! 🚓`,
              "celebrate",
            );
          }}
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
