import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Waves } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function WaveLab({ onMiyarSay }: Props) {
  const [amplitude, setAmplitude] = useState(40); // px
  const [frequency, setFrequency] = useState(1); // Hz
  const [wavelength, setWavelength] = useState(150); // px
  const tRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [path, setPath] = useState("");

  const speed = frequency * (wavelength / 100); // m/s (تقريباً، 100px = 1m)

  useEffect(() => {
    let last = performance.now();
    const W = 480;
    const cx = W / 2;
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      tRef.current += dt;
      const t = tRef.current;
      let d = "";
      for (let x = 0; x <= W; x += 4) {
        const k = (2 * Math.PI) / wavelength;
        const w = 2 * Math.PI * frequency;
        const y = cx + amplitude * Math.sin(k * x - w * t);
        d += (x === 0 ? "M" : "L") + ` ${x} ${y} `;
      }
      setPath(d);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [amplitude, frequency, wavelength]);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden">
        <svg viewBox="0 0 480 480" className="w-full h-full">
          {/* محور وسطي */}
          <line x1={0} y1={240} x2={480} y2={240} stroke="hsl(var(--muted-foreground) / 0.3)" strokeDasharray="4 4" />
          {/* الموجة */}
          <path d={path} stroke="hsl(var(--primary))" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {/* مؤشرات السعة وطول الموجة */}
          <line x1={20} y1={240} x2={20} y2={240 - amplitude} stroke="hsl(var(--destructive))" strokeWidth={2} />
          <text x={28} y={240 - amplitude / 2} fill="hsl(var(--destructive))" fontSize="11" fontWeight="bold">A</text>
          <line x1={60} y1={300} x2={60 + wavelength} y2={300} stroke="hsl(var(--success))" strokeWidth={2} />
          <text x={60 + wavelength / 2 - 6} y={316} fill="hsl(var(--success))" fontSize="11" fontWeight="bold">λ</text>
        </svg>

        <div className="absolute top-3 right-3 bg-card/90 rounded-xl px-3 py-2 text-[11px] font-mono space-y-0.5 shadow-soft">
          <div>v = f · λ = <b>{speed.toFixed(2)} م/ث</b></div>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <Waves className="h-4 w-4 text-primary" /> خصائص الموجة
        </h4>

        <Ctrl label="السعة A" unit="px" value={amplitude} min={10} max={100} step={5} onChange={(v) => { setAmplitude(v); sounds.click(); }} />
        <Ctrl label="التردد f" unit="هرتز" value={frequency} min={0.2} max={5} step={0.1} onChange={(v) => { setFrequency(v); sounds.click(); }} />
        <Ctrl label="الطول الموجي λ" unit="px" value={wavelength} min={40} max={400} step={10} onChange={(v) => { setWavelength(v); sounds.click(); }} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>v = f × λ</div>
          <div>السعة = أقصى إزاحة</div>
        </div>

        <button
          onClick={() => {
            sounds.success();
            onMiyarSay?.(
              `سرعة الموجة = التردد × الطول الموجي. السعة لا تؤثر على السرعة بل على الطاقة! 🌊`,
              "celebrate",
            );
          }}
          className="w-full bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow hover:scale-105 transition-transform"
        >
          ما العلاقة؟
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
