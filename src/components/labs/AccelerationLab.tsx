import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Play, RotateCcw } from "lucide-react";
import { sounds } from "@/lib/sounds";

export function AccelerationLab() {
  const [a, setA] = useState(2);
  const [v0, setV0] = useState(0);
  const [running, setRunning] = useState(false);
  const [t, setT] = useState(0);
  const startRef = useRef(0);
  const trackLength = 80; // m

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const tick = () => {
      const elapsed = (performance.now() - startRef.current) / 1000;
      setT(elapsed);
      const x = v0 * elapsed + 0.5 * a * elapsed * elapsed;
      if (x >= trackLength || elapsed > 30) {
        setRunning(false);
        sounds.success();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, a, v0]);

  function start() {
    sounds.launch();
    setT(0);
    startRef.current = performance.now();
    setRunning(true);
  }
  function reset() {
    sounds.click();
    setRunning(false);
    setT(0);
  }

  const x = v0 * t + 0.5 * a * t * t;
  const v = v0 + a * t;
  const carX = Math.min(100, (x / trackLength) * 100);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky p-6 min-h-[460px] flex flex-col shadow-card border border-border">
        <div className="text-sm font-bold text-foreground mb-2">سيارة تتسارع — راقبي تغير السرعة بالزمن</div>
        <div className="relative h-32 bg-card rounded-2xl border border-border overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-deep" />
          <div
            className="absolute bottom-8 text-4xl"
            style={{ left: `calc(${carX}% - 24px)`, transform: "scaleX(-1)" }}
          >
            🏎️
          </div>
          {/* speed lines */}
          {running && Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="absolute h-0.5 bg-primary/60 animate-pulse" style={{ bottom: 50 + i * 8, left: `${Math.max(0, carX - 5 - i * 3)}%`, width: `${i * 2 + 3}%` }} />
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat label="الزمن" value={`${t.toFixed(2)} ث`} />
          <Stat label="السرعة" value={`${v.toFixed(1)} م/ث`} />
          <Stat label="الموقع" value={`${x.toFixed(1)} م`} />
        </div>

        <div className="mt-3 flex gap-2 justify-center">
          <button onClick={start} disabled={running} className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-bold shadow-glow flex items-center gap-2 disabled:opacity-60">
            <Play className="h-4 w-4 fill-current" /> انطلقي
          </button>
          <button onClick={reset} className="bg-card border border-border text-foreground px-4 py-2 rounded-full font-bold flex items-center gap-2">
            <RotateCcw className="h-4 w-4" /> إعادة
          </button>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground">🎛️ المتغيرات</h4>
        <Ctl label="السرعة الابتدائية" unit="م/ث" value={v0} min={0} max={10} step={1} onChange={setV0} />
        <Ctl label="التسارع" unit="م/ث²" value={a} min={-3} max={8} step={0.5} onChange={setA} hint="سالب = تباطؤ" />
        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1">
          <div className="font-bold mb-1">📐 المعادلات</div>
          <div className="font-mono">v = v₀ + a·t</div>
          <div className="font-mono">x = v₀·t + ½·a·t²</div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card rounded-2xl p-3 text-center shadow-soft">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-bold text-foreground">{value}</div>
    </div>
  );
}

function Ctl({ label, unit, value, min, max, step, onChange, hint }: { label: string; unit: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; hint?: string }) {
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
