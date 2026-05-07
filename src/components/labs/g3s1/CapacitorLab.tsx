import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function CapacitorLab({ onMiyarSay }: Props) {
  const [A, setA] = useState(0.02); // m²
  const [d, setD] = useState(2); // mm
  const [k, setK] = useState(1); // dielectric
  const [V, setV] = useState(12); // V
  const eps0 = 8.854e-12;
  const C = (k * eps0 * A) / (d * 1e-3); // F
  const Q = C * V; // C
  const U = 0.5 * C * V * V; // J

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-4 shadow-card min-h-[460px] flex items-center justify-center">
        <svg viewBox="0 0 480 320" className="w-full h-full">
          <rect x={120} y={80} width={20} height={160} fill="hsl(0 70% 55%)" stroke="hsl(var(--deep))" strokeWidth={2} />
          <rect x={140 + d * 25} y={80} width={20} height={160} fill="hsl(220 70% 55%)" stroke="hsl(var(--deep))" strokeWidth={2} />
          {k > 1 && <rect x={140} y={85} width={d * 25} height={150} fill="hsl(40 80% 70%)" opacity={0.4} />}
          {/* field lines */}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={i} x1={140} y1={100 + i * 24} x2={140 + d * 25} y2={100 + i * 24} stroke="hsl(220 50% 40%)" strokeWidth={1.2} markerEnd="url(#cap)" />
          ))}
          <text x={130} y={70} fontSize={14} fontWeight="bold" fill="hsl(0 70% 45%)" textAnchor="middle">+</text>
          <text x={150 + d * 25} y={70} fontSize={14} fontWeight="bold" fill="hsl(220 70% 45%)" textAnchor="middle">−</text>
          <line x1={130} y1={250} x2={150 + d * 25} y2={250} stroke="hsl(var(--muted-foreground))" />
          <text x={140 + d * 12} y={270} fontSize={12} textAnchor="middle">d = {d} مم</text>
          {/* battery */}
          <g transform={`translate(${320},160)`}>
            <rect x={-30} y={-30} width={60} height={60} fill="hsl(var(--card))" stroke="hsl(var(--deep))" strokeWidth={2} rx={6} />
            <text x={0} y={5} fontSize={14} textAnchor="middle" fontWeight="bold">{V}V</text>
          </g>
          <defs>
            <marker id="cap" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="hsl(220 50% 40%)" /></marker>
          </defs>
        </svg>
      </div>
      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold">🔋 المكثّف ذو اللوحين</h4>
        <Ctrl label="مساحة اللوحين A" unit="م²" value={A} min={0.005} max={0.1} step={0.005} onChange={setA} />
        <Ctrl label="المسافة d" unit="مم" value={d} min={0.5} max={6} step={0.5} onChange={setD} />
        <Ctrl label="ثابت العزل κ" unit="" value={k} min={1} max={10} step={0.5} onChange={setK} />
        <Ctrl label="جهد البطارية V" unit="V" value={V} min={1} max={48} step={1} onChange={setV} />
        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs font-mono space-y-1">
          <div>C = κ·ε₀·A/d = <b>{(C * 1e12).toFixed(2)} pF</b></div>
          <div>Q = CV = <b>{(Q * 1e9).toFixed(2)} nC</b></div>
          <div>U = ½CV² = <b>{(U * 1e9).toFixed(2)} nJ</b></div>
        </div>
        <button onClick={() => { sounds.success(); onMiyarSay?.("زيادة المساحة أو ثابت العزل تزيد السعة، أما زيادة المسافة بين اللوحين فتقلّلها. 🔋", "celebrate"); }} className="w-full bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow">القاعدة؟</button>
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
