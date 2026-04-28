import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";

export function CircularLab() {
  const [r, setR] = useState(80); // px display
  const [omega, setOmega] = useState(2); // rad/s
  const [m, setM] = useState(2);
  const [angle, setAngle] = useState(0);
  const lastRef = useRef(performance.now());

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const now = performance.now();
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      setAngle((a) => a + omega * dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [omega]);

  const cx = 200;
  const cy = 180;
  const px = cx + r * Math.cos(angle);
  const py = cy + r * Math.sin(angle);

  // physical r in meters (assume px/30)
  const R = r / 30;
  const v = omega * R;
  const ac = (v * v) / R;
  const Fc = m * ac;

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky p-6 min-h-[460px] flex flex-col shadow-card border border-border">
        <div className="text-sm font-bold text-foreground mb-2">جسم في حركة دائرية منتظمة</div>
        <svg viewBox="0 0 400 360" className="w-full bg-card rounded-2xl border border-border">
          {/* path circle */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="oklch(0.85 0.10 230)" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx={cx} cy={cy} r="4" fill="oklch(0.22 0.10 255)" />
          {/* string */}
          <line x1={cx} y1={cy} x2={px} y2={py} stroke="oklch(0.50 0.05 250)" strokeWidth="1.5" />
          {/* centripetal force arrow (toward center) */}
          <line x1={px} y1={py} x2={px - (px - cx) * 0.4} y2={py - (py - cy) * 0.4} stroke="oklch(0.62 0.22 25)" strokeWidth="3" markerEnd="url(#cm1)" />
          {/* tangential velocity arrow */}
          <line x1={px} y1={py} x2={px - Math.sin(angle) * 35} y2={py + Math.cos(angle) * 35} stroke="oklch(0.55 0.20 252)" strokeWidth="3" markerEnd="url(#cm2)" />
          {/* ball */}
          <circle cx={px} cy={py} r="14" fill="oklch(0.55 0.20 252)" stroke="oklch(0.22 0.10 255)" strokeWidth="2" />
          <defs>
            <marker id="cm1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="oklch(0.62 0.22 25)" />
            </marker>
            <marker id="cm2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="oklch(0.55 0.20 252)" />
            </marker>
          </defs>
        </svg>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <Stat label="السرعة v" value={`${v.toFixed(2)} م/ث`} />
          <Stat label="التسارع المركزي aₒ" value={`${ac.toFixed(2)} م/ث²`} />
          <Stat label="القوة المركزية Fₒ" value={`${Fc.toFixed(2)} N`} />
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground">🎛️ التحكم</h4>
        <Ctl label="نصف القطر" unit="px" value={r} min={40} max={140} step={10} onChange={setR} />
        <Ctl label="السرعة الزاوية ω" unit="rad/s" value={omega} min={0.5} max={6} step={0.5} onChange={setOmega} />
        <Ctl label="الكتلة" unit="كجم" value={m} min={0.5} max={10} step={0.5} onChange={setM} />
        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1">
          <div className="font-bold mb-1">📐 المعادلات</div>
          <div className="font-mono">v = ω·r</div>
          <div className="font-mono">aₒ = v²/r</div>
          <div className="font-mono">Fₒ = m·aₒ</div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card rounded-2xl p-3 text-center shadow-soft">
      <div className="text-[10px] text-muted-foreground">{label}</div>
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
