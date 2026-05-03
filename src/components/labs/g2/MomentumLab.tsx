import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Target } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function MomentumLab({ onMiyarSay }: Props) {
  const [m1, setM1] = useState(2);
  const [m2, setM2] = useState(3);
  const [v1, setV1] = useState(4);
  const [v2, setV2] = useState(-2);
  const [running, setRunning] = useState(false);
  const [x1, setX1] = useState(80);
  const [x2, setX2] = useState(380);
  const [vv1, setVv1] = useState(v1);
  const [vv2, setVv2] = useState(v2);
  const rafRef = useRef<number | null>(null);

  const p_before = m1 * v1 + m2 * v2;
  // تصادم مرن تماماً (1D)
  const v1f = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
  const v2f = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
  const p_after = m1 * v1f + m2 * v2f;

  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setX1((x) => {
        const newX = x + vv1 * 30 * dt;
        return newX;
      });
      setX2((x) => x + vv2 * 30 * dt);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [running, vv1, vv2]);

  // كشف التصادم
  useEffect(() => {
    if (!running) return;
    const r1 = 12 + m1 * 4;
    const r2 = 12 + m2 * 4;
    if (Math.abs((x1 + r1) - (x2 - r2)) < 4 && vv1 > vv2) {
      setVv1(v1f);
      setVv2(v2f);
      sounds.success();
    }
  }, [x1, x2, running, vv1, vv2, m1, m2, v1f, v2f]);

  function reset() {
    setRunning(false);
    setX1(80); setX2(380); setVv1(v1); setVv2(v2);
  }

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden">
        <div className="absolute inset-x-4 top-1/2 h-1 bg-deep/40 rounded" />
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 border-2 border-deep flex items-center justify-center text-xs font-bold text-white shadow-glow"
          style={{ left: x1, width: 24 + m1 * 8, height: 24 + m1 * 8 }}
        >
          {m1}
        </div>
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 border-2 border-deep flex items-center justify-center text-xs font-bold text-white shadow-glow"
          style={{ left: x2, width: 24 + m2 * 8, height: 24 + m2 * 8 }}
        >
          {m2}
        </div>
        <div className="absolute top-3 right-3 bg-card/90 rounded-xl px-3 py-2 text-[11px] font-mono space-y-0.5 shadow-soft">
          <div>p₁ = {(m1 * vv1).toFixed(2)} kg·m/s</div>
          <div>p₂ = {(m2 * vv2).toFixed(2)} kg·m/s</div>
          <div className="text-primary font-bold">Σp = {(m1 * vv1 + m2 * vv2).toFixed(2)}</div>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex gap-2">
          <button onClick={() => { setRunning(true); sounds.click(); }} className="flex-1 bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm">▶ تشغيل</button>
          <button onClick={reset} className="flex-1 bg-muted text-foreground rounded-full py-2 font-bold text-sm">إعادة</button>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-4">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" /> الزخم والتصادم
        </h4>
        <Ctrl label="m₁" unit="كغ" value={m1} min={1} max={8} step={0.5} onChange={(v) => { setM1(v); reset(); }} />
        <Ctrl label="v₁" unit="م/ث" value={v1} min={-6} max={6} step={0.5} onChange={(v) => { setV1(v); setVv1(v); }} />
        <Ctrl label="m₂" unit="كغ" value={m2} min={1} max={8} step={0.5} onChange={(v) => { setM2(v); reset(); }} />
        <Ctrl label="v₂" unit="م/ث" value={v2} min={-6} max={6} step={0.5} onChange={(v) => { setV2(v); setVv2(v); }} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>p = m·v</div>
          <div>قبل: Σp = {p_before.toFixed(2)}</div>
          <div>بعد: Σp = {p_after.toFixed(2)}</div>
          <div className="text-base mt-1">✅ الزخم محفوظ</div>
        </div>

        <button
          onClick={() => {
            onMiyarSay?.(`الزخم الكلي قبل التصادم = الزخم الكلي بعده، هذا قانون حفظ الزخم! 🎱`, "celebrate");
          }}
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
