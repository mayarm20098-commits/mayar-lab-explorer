import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Scale } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function EquilibriumLab({ onMiyarSay }: Props) {
  const [m1, setM1] = useState(5);
  const [d1, setD1] = useState(2);
  const [m2, setM2] = useState(4);
  const [d2, setD2] = useState(2.5);
  const g = 9.8;

  const t1 = m1 * g * d1; // عزم يسار (CCW)
  const t2 = m2 * g * d2; // عزم يمين (CW)
  const net = t2 - t1;
  const tilt = Math.max(-15, Math.min(15, net * 0.05));
  const balanced = Math.abs(net) < 0.5;

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden flex items-center justify-center">
        <svg viewBox="-200 -120 400 240" className="w-full max-w-md h-full">
          {/* القاعدة */}
          <polygon points="-20,80 20,80 0,40" fill="hsl(var(--deep))" />
          <g transform={`rotate(${tilt})`}>
            <line x1={-180} y1={40} x2={180} y2={40} stroke="hsl(var(--primary))" strokeWidth={6} strokeLinecap="round" />
            {/* كتلة 1 */}
            <rect x={-d1 * 60 - 18} y={4} width={36} height={36} fill="hsl(var(--primary))" rx={4} />
            <text x={-d1 * 60} y={28} textAnchor="middle" fontSize={12} fill="white" fontWeight="bold">{m1}كغ</text>
            {/* كتلة 2 */}
            <rect x={d2 * 60 - 18} y={4} width={36} height={36} fill="hsl(var(--accent))" rx={4} />
            <text x={d2 * 60} y={28} textAnchor="middle" fontSize={12} fill="white" fontWeight="bold">{m2}كغ</text>
          </g>
        </svg>
        <div className="absolute top-3 right-3 bg-card/90 rounded-xl px-3 py-2 text-[11px] font-mono space-y-0.5 shadow-soft">
          <div>τ يسار = <b>{t1.toFixed(1)}</b></div>
          <div>τ يمين = <b>{t2.toFixed(1)}</b></div>
          <div className={balanced ? "text-primary font-bold" : "text-destructive"}>
            {balanced ? "✓ متّزن" : `Δτ = ${net.toFixed(1)} N·م`}
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <Scale className="h-4 w-4 text-primary" /> الاتزان والعزم
        </h4>
        <Ctrl label="كتلة 1" unit="كغ" value={m1} min={1} max={10} step={0.5} onChange={(v) => { setM1(v); sounds.click(); }} />
        <Ctrl label="مسافة 1" unit="م" value={d1} min={0.5} max={3} step={0.1} onChange={(v) => { setD1(v); sounds.click(); }} />
        <Ctrl label="كتلة 2" unit="كغ" value={m2} min={1} max={10} step={0.5} onChange={(v) => { setM2(v); sounds.click(); }} />
        <Ctrl label="مسافة 2" unit="م" value={d2} min={0.5} max={3} step={0.1} onChange={(v) => { setD2(v); sounds.click(); }} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>الاتزان: Στ = 0</div>
          <div>m₁·d₁ = m₂·d₂</div>
        </div>

        <button
          onClick={() => { sounds.success(); onMiyarSay?.(`الميزان يتّزن عندما يتساوى عزما الجانبين. هذا أساس عمل الميزان ذي الكفّتين! ⚖️`, "celebrate"); }}
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
