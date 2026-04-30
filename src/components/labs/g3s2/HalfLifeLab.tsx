import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

const GRID = 12; // 12x12 = 144 atoms

export function HalfLifeLab({ onMiyarSay }: Props) {
  const [halfLife, setHalfLife] = useState(3); // seconds
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [atoms, setAtoms] = useState<boolean[]>(() => Array(GRID * GRID).fill(true));
  const lastTickRef = useRef(performance.now());
  const intervalRef = useRef<number | null>(null);

  const remaining = atoms.filter(Boolean).length;
  const total = GRID * GRID;
  const fractionRemaining = remaining / total;

  useEffect(() => {
    if (!running) return;
    lastTickRef.current = performance.now();
    intervalRef.current = window.setInterval(() => {
      const now = performance.now();
      const dt = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;
      setTime((t) => t + dt);

      // probability per atom = 1 - 0.5^(dt/halfLife)
      const p = 1 - Math.pow(0.5, dt / halfLife);
      setAtoms((prev) => {
        const next = prev.slice();
        for (let i = 0; i < next.length; i++) {
          if (next[i] && Math.random() < p) next[i] = false;
        }
        return next;
      });
    }, 100);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running, halfLife]);

  useEffect(() => {
    if (running && remaining === 0) {
      setRunning(false);
      sounds.celebrate();
      onMiyarSay?.(`تحلّلت كل العينة! بعد كل ${halfLife}ث يتحلل نصف ما تبقى تقريباً ☢️`, "celebrate");
    }
  }, [remaining, running, halfLife, onMiyarSay]);

  function reset() {
    setRunning(false);
    setTime(0);
    setAtoms(Array(GRID * GRID).fill(true));
    sounds.click();
  }

  const halvesPassed = (time / halfLife).toFixed(1);
  const theoretical = Math.pow(0.5, time / halfLife) * 100;

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px]">
        <div className="grid gap-1 mb-4" style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}>
          {atoms.map((alive, i) => (
            <div
              key={i}
              className={`aspect-square rounded transition-all ${alive ? "bg-primary shadow-[0_0_4px_hsl(var(--primary))]" : "bg-muted opacity-40"}`}
            />
          ))}
        </div>

        {/* Decay curve */}
        <div className="bg-card/80 rounded-2xl p-3">
          <div className="text-xs font-bold mb-2">منحنى التحلّل</div>
          <div className="relative h-20 bg-muted/40 rounded-lg overflow-hidden">
            <div
              className="absolute bottom-0 left-0 bg-primary/40 transition-all"
              style={{ width: `${Math.min(100, (time / (halfLife * 5)) * 100)}%`, height: `${fractionRemaining * 100}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-xs font-mono">
              {(fractionRemaining * 100).toFixed(0)}% متبقّي
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-4">
        <h4 className="font-display font-extrabold">☢️ عمر النصف</h4>
        <Ctrl label="عمر النصف" unit="ث" value={halfLife} min={1} max={10} step={0.5} onChange={setHalfLife} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>الزمن: {time.toFixed(1)} ث</div>
          <div>أعمار النصف: {halvesPassed}</div>
          <div>متبقّي فعلي: {remaining}/{total}</div>
          <div>متبقّي نظري: {theoretical.toFixed(1)}%</div>
        </div>

        <div className="flex gap-2">
          {!running ? (
            <button
              onClick={() => { setRunning(true); sounds.launch(); }}
              disabled={remaining === 0}
              className="flex-1 bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Play className="h-4 w-4 fill-current" /> ابدئي
            </button>
          ) : (
            <button onClick={() => setRunning(false)} className="flex-1 bg-deep text-deep-foreground rounded-full py-2 font-bold text-sm flex items-center justify-center gap-2">
              <Pause className="h-4 w-4 fill-current" /> إيقاف
            </button>
          )}
          <button onClick={reset} className="bg-card border border-border rounded-full px-4 py-2 hover:bg-muted">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          N(t) = N₀ · (½)^(t / T½) — في كل عمر نصف يتحلّل نصف ما تبقى عشوائياً.
        </p>
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
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => { onChange(v[0]); sounds.click(); }} dir="ltr" />
    </div>
  );
}
