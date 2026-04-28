import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Play, RotateCcw } from "lucide-react";
import { sounds } from "@/lib/sounds";

export function VelocityLab() {
  const [v, setV] = useState(4); // m/s
  const [distance, setDistance] = useState(40); // m
  const [running, setRunning] = useState(false);
  const [t, setT] = useState(0);
  const [pos, setPos] = useState(0);
  const startRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const tick = () => {
      const elapsed = (performance.now() - startRef.current) / 1000;
      const newPos = Math.min(distance, v * elapsed);
      setT(elapsed);
      setPos(newPos);
      if (newPos >= distance) {
        setRunning(false);
        sounds.success();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, v, distance]);

  function start() {
    sounds.click();
    setT(0);
    setPos(0);
    startRef.current = performance.now();
    setRunning(true);
  }
  function reset() {
    sounds.click();
    setRunning(false);
    setT(0);
    setPos(0);
  }

  const avgV = t > 0 ? pos / t : 0;
  const carX = (pos / distance) * 100;

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky p-6 min-h-[460px] flex flex-col shadow-card border border-border">
        <div className="text-sm font-bold text-foreground mb-2">سيارة تتحرك بسرعة ثابتة على مسار {distance} م</div>
        <div className="relative h-32 bg-card rounded-2xl border border-border overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-deep flex items-center justify-around text-deep-foreground text-[10px] font-bold">
            {[0, 25, 50, 75, 100].map(p => <span key={p}>{(distance * p / 100).toFixed(0)} م</span>)}
          </div>
          <div
            className="absolute bottom-8 text-4xl transition-none"
            style={{ left: `calc(${carX}% - 24px)`, transform: "scaleX(-1)" }}
          >
            🚗
          </div>
          <div className="absolute top-0 right-0 left-0 h-2 bg-yellow-300/30" />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="bg-card rounded-2xl p-3 text-center shadow-soft">
            <div className="text-xs text-muted-foreground">الزمن</div>
            <div className="font-bold text-foreground">{t.toFixed(2)} ث</div>
          </div>
          <div className="bg-card rounded-2xl p-3 text-center shadow-soft">
            <div className="text-xs text-muted-foreground">الموقع</div>
            <div className="font-bold text-foreground">{pos.toFixed(1)} م</div>
          </div>
          <div className="bg-card rounded-2xl p-3 text-center shadow-soft">
            <div className="text-xs text-muted-foreground">السرعة المتوسطة</div>
            <div className="font-bold text-primary">{avgV.toFixed(2)} م/ث</div>
          </div>
        </div>

        <div className="mt-3 flex gap-2 justify-center">
          <button onClick={start} disabled={running} className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-bold shadow-glow flex items-center gap-2 disabled:opacity-60">
            <Play className="h-4 w-4 fill-current" /> ابدئي
          </button>
          <button onClick={reset} className="bg-card border border-border text-foreground px-4 py-2 rounded-full font-bold flex items-center gap-2">
            <RotateCcw className="h-4 w-4" /> إعادة
          </button>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground">🎛️ التحكم</h4>
        <Ctl label="سرعة السيارة" unit="م/ث" value={v} min={1} max={20} step={1} onChange={setV} />
        <Ctl label="طول المسار" unit="م" value={distance} min={10} max={100} step={10} onChange={setDistance} />
        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs">
          <div className="font-bold mb-1">💡 ملاحظة</div>
          <div>v = d / t = {v} م/ث (نظري)</div>
          <div>الزمن المتوقع: {(distance / v).toFixed(2)} ث</div>
        </div>
      </div>
    </div>
  );
}

function Ctl({ label, unit, value, min, max, step, onChange }: { label: string; unit: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-bold text-foreground">{label}</label>
        <span className="text-sm font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-md">{value} {unit}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} dir="ltr" />
    </div>
  );
}
