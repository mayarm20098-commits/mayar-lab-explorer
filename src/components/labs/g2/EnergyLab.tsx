import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Mountain } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function EnergyLab({ onMiyarSay }: Props) {
  const [h0, setH0] = useState(20);
  const [mass, setMass] = useState(2);
  const [running, setRunning] = useState(false);
  const [y, setY] = useState(h0);
  const [v, setV] = useState(0);
  const rafRef = useRef<number | null>(null);
  const g = 9.8;

  useEffect(() => { setY(h0); setV(0); setRunning(false); }, [h0]);

  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setV((curV) => curV + g * dt);
      setY((curY) => {
        const ny = curY - v * dt;
        if (ny <= 0) { setRunning(false); sounds.success(); return 0; }
        return ny;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [running, v]);

  const PE = mass * g * y;
  const KE = 0.5 * mass * v * v;
  const total = PE + KE;
  const max = mass * g * h0;

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden">
        {/* الأرض */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-emerald-700 to-emerald-500" />
        {/* الكرة */}
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 border-2 border-deep shadow-glow transition-all"
          style={{ bottom: `${4 + (y / Math.max(h0, 1)) * 380}px`, width: 30 + mass * 4, height: 30 + mass * 4 }}
        />
        {/* أعمدة الطاقة */}
        <div className="absolute bottom-6 right-4 w-32 space-y-2">
          <div>
            <div className="flex justify-between text-[10px] font-bold mb-0.5"><span>PE</span><span>{PE.toFixed(0)} J</span></div>
            <div className="h-3 bg-card rounded-full overflow-hidden border border-border">
              <div className="h-full bg-blue-500 transition-all" style={{ width: `${(PE / Math.max(max, 1)) * 100}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] font-bold mb-0.5"><span>KE</span><span>{KE.toFixed(0)} J</span></div>
            <div className="h-3 bg-card rounded-full overflow-hidden border border-border">
              <div className="h-full bg-amber-500 transition-all" style={{ width: `${(KE / Math.max(max, 1)) * 100}%` }} />
            </div>
          </div>
          <div className="text-[10px] font-mono text-deep bg-card/90 rounded px-2 py-1">
            E = {total.toFixed(0)} J
          </div>
        </div>
        <div className="absolute bottom-3 left-3 flex gap-2">
          <button onClick={() => { setRunning(true); sounds.click(); }} className="bg-primary text-primary-foreground rounded-full px-4 py-2 font-bold text-sm">▶ أسقطي</button>
          <button onClick={() => { setY(h0); setV(0); setRunning(false); }} className="bg-muted rounded-full px-4 py-2 font-bold text-sm">إعادة</button>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-4">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <Mountain className="h-4 w-4 text-primary" /> حفظ الطاقة
        </h4>
        <Ctrl label="الارتفاع h" unit="م" value={h0} min={5} max={50} step={1} onChange={(v) => { setH0(v); sounds.click(); }} />
        <Ctrl label="الكتلة m" unit="كغ" value={mass} min={0.5} max={10} step={0.5} onChange={(v) => { setMass(v); sounds.click(); }} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>PE = m·g·h</div>
          <div>KE = ½·m·v²</div>
          <div className="text-base mt-1">E = PE + KE = ثابت</div>
        </div>

        <button
          onClick={() => onMiyarSay?.(`الطاقة لا تفنى ولا تستحدث، فقط تتحول من شكل لآخر! 🎢`, "celebrate")}
          className="w-full bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow"
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
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-bold">{label}</label>
        <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-md">{value} {unit}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} dir="ltr" />
    </div>
  );
}
