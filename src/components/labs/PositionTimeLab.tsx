import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";

export function PositionTimeLab() {
  const [v, setV] = useState(3);
  const [x0, setX0] = useState(0);

  const points = useMemo(() => {
    return Array.from({ length: 11 }, (_, i) => ({ t: i, x: x0 + v * i }));
  }, [v, x0]);

  const maxX = Math.max(...points.map(p => Math.abs(p.x)), 10);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky p-6 min-h-[460px] flex flex-col shadow-card border border-border">
        <div className="text-sm font-bold text-foreground mb-2">منحنى الموقع/الزمن</div>
        <svg viewBox="0 0 500 360" className="w-full bg-card rounded-2xl border border-border">
          {/* axes */}
          <line x1="50" y1="20" x2="50" y2="320" stroke="oklch(0.22 0.10 255)" strokeWidth="2" />
          <line x1="50" y1="170" x2="480" y2="170" stroke="oklch(0.22 0.10 255)" strokeWidth="2" />
          <text x="490" y="175" fontSize="12" fill="oklch(0.22 0.10 255)" fontWeight="bold">t</text>
          <text x="55" y="20" fontSize="12" fill="oklch(0.22 0.10 255)" fontWeight="bold">x (م)</text>

          {/* grid */}
          {[0, 2, 4, 6, 8, 10].map((tick) => (
            <g key={tick}>
              <line x1={50 + tick * 43} y1="170" x2={50 + tick * 43} y2="175" stroke="oklch(0.22 0.10 255)" />
              <text x={50 + tick * 43} y="190" fontSize="10" textAnchor="middle" fill="oklch(0.50 0.05 250)">{tick}</text>
            </g>
          ))}

          {/* line */}
          <polyline
            points={points.map(p => `${50 + p.t * 43},${170 - (p.x / maxX) * 140}`).join(" ")}
            fill="none"
            stroke="oklch(0.55 0.20 252)"
            strokeWidth="3"
          />
          {points.map((p, i) => (
            <circle key={i} cx={50 + p.t * 43} cy={170 - (p.x / maxX) * 140} r="4" fill="oklch(0.55 0.20 252)" />
          ))}
        </svg>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="bg-card rounded-2xl p-3 text-center shadow-soft">
            <div className="text-xs text-muted-foreground">الميل = السرعة</div>
            <div className="font-bold text-primary">{v} م/ث</div>
          </div>
          <div className="bg-card rounded-2xl p-3 text-center shadow-soft">
            <div className="text-xs text-muted-foreground">الموقع الابتدائي</div>
            <div className="font-bold text-primary">{x0} م</div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground">🎛️ المتغيرات</h4>
        <Ctl label="السرعة" unit="م/ث" value={v} min={-5} max={10} step={0.5} onChange={setV} hint="ميل سالب = حركة معاكسة" />
        <Ctl label="الموقع الابتدائي" unit="م" value={x0} min={-10} max={10} step={1} onChange={setX0} />
        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs">
          <div className="font-bold mb-1">💡 المعادلة</div>
          <div className="font-mono">x = x₀ + v·t = {x0} + {v}·t</div>
        </div>
      </div>
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
