import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Play, RotateCcw } from "lucide-react";
import { sounds } from "@/lib/sounds";

const g = 9.8;

export function FrictionLab() {
  const [F, setF] = useState(20);
  const [m, setM] = useState(5);
  const [mu, setMu] = useState(0.3);
  const [kinetic, setKinetic] = useState(false);
  const [running, setRunning] = useState(false);
  const [pos, setPos] = useState(0);
  const [vel, setVel] = useState(0);
  const startRef = useRef(0);
  const lastRef = useRef(0);

  const N = m * g;
  const fStatic = mu * N; // approx
  const fKinetic = mu * 0.8 * N;
  const moving = F > fStatic;
  const a = moving ? (F - fKinetic) / m : 0;

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    startRef.current = performance.now();
    lastRef.current = performance.now();
    setPos(0);
    setVel(0);
    const tick = () => {
      const now = performance.now();
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      setVel((v) => v + a * dt);
      setPos((p) => {
        const next = p + (vel + a * dt) * dt * 30;
        if (next > 400) {
          setRunning(false);
          return 400;
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, a]);

  function start() {
    sounds.click();
    if (!moving) {
      sounds.error();
    }
    setRunning(true);
  }
  function reset() {
    sounds.click();
    setRunning(false);
    setPos(0);
    setVel(0);
  }

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky p-6 min-h-[460px] flex flex-col shadow-card border border-border">
        <div className="text-sm font-bold text-foreground mb-2">صندوق على سطح ذي احتكاك</div>
        <div className="relative h-40 bg-card rounded-2xl border border-border overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-amber-700/40 to-amber-200/20" />
          <div className="absolute bottom-12 transition-none" style={{ left: pos }}>
            <div className="bg-primary text-primary-foreground rounded-md px-3 py-2 text-sm font-bold shadow-soft">
              📦 {m}kg
            </div>
          </div>
          {/* force arrow */}
          <div className="absolute top-2 right-2 text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
            F = {F} N →
          </div>
          {!moving && (
            <div className="absolute top-2 left-2 text-xs bg-muted px-2 py-1 rounded font-bold">
              الجسم ساكن (F &lt; قوة الاحتكاك)
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat label="القوة العمودية N" value={`${N.toFixed(1)} N`} />
          <Stat label={kinetic ? "احتكاك حركي" : "احتكاك سكوني"} value={`${(kinetic ? fKinetic : fStatic).toFixed(1)} N`} />
          <Stat label="التسارع" value={`${a.toFixed(2)} م/ث²`} />
        </div>

        <div className="mt-3 flex gap-2 justify-center">
          <button onClick={start} disabled={running} className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-bold shadow-glow flex items-center gap-2 disabled:opacity-60">
            <Play className="h-4 w-4 fill-current" /> ادفعي
          </button>
          <button onClick={reset} className="bg-card border border-border text-foreground px-4 py-2 rounded-full font-bold flex items-center gap-2">
            <RotateCcw className="h-4 w-4" /> إعادة
          </button>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground">🎛️ التحكم</h4>
        <Ctl label="القوة المؤثرة" unit="N" value={F} min={0} max={80} step={1} onChange={setF} />
        <Ctl label="كتلة الجسم" unit="كجم" value={m} min={1} max={20} step={1} onChange={setM} />
        <Ctl label="معامل الاحتكاك μ" unit="" value={mu} min={0} max={1} step={0.05} onChange={setMu} />
        <div className="flex items-center justify-between bg-muted/50 rounded-2xl p-3">
          <div className="text-sm font-bold text-foreground">احتكاك حركي</div>
          <Switch checked={kinetic} onCheckedChange={setKinetic} />
        </div>
        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs">
          <div className="font-bold mb-1">📐 f = μ × N</div>
          <div>μ زجاج/زجاج ≈ 0.94</div>
          <div>μ ثلج/ثلج ≈ 0.03</div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card rounded-2xl p-3 text-center shadow-soft">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-bold text-foreground text-sm">{value}</div>
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
