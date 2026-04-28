import { useState } from "react";
import { Slider } from "@/components/ui/slider";

export function NewtonSecondLab() {
  const [F, setF] = useState(20);
  const [m, setM] = useState(4);
  const a = F / m;

  // arrow length
  const arrowLen = Math.min(150, Math.abs(F) * 4);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky p-6 min-h-[460px] flex flex-col items-center justify-center shadow-card border border-border">
        <div className="text-sm font-bold text-foreground mb-4">قانون نيوتن الثاني: F = m × a</div>
        <svg viewBox="0 0 400 200" className="w-full max-w-md bg-card rounded-2xl border border-border">
          {/* ground */}
          <line x1="20" y1="160" x2="380" y2="160" stroke="oklch(0.22 0.10 255)" strokeWidth="2" />
          {/* box */}
          <rect x="170" y="110" width={20 + m * 10} height={20 + m * 10} fill="oklch(0.55 0.20 252)" stroke="oklch(0.22 0.10 255)" strokeWidth="2" rx="4" />
          <text x={180 + m * 5} y={140 + m * 5} fontSize="14" textAnchor="middle" fill="white" fontWeight="bold">{m} كجم</text>
          {/* force arrow */}
          <line x1={170} y1={130 + m * 5} x2={170 - arrowLen} y2={130 + m * 5} stroke="oklch(0.62 0.22 25)" strokeWidth="4" markerEnd="url(#arr)" />
          <text x={170 - arrowLen / 2} y={120 + m * 5} fontSize="12" textAnchor="middle" fill="oklch(0.62 0.22 25)" fontWeight="bold">F = {F} N</text>
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="oklch(0.62 0.22 25)" />
            </marker>
          </defs>
          {/* acceleration label */}
          <text x="200" y="40" fontSize="20" textAnchor="middle" fill="oklch(0.55 0.20 252)" fontWeight="bold">
            a = {a.toFixed(2)} م/ث²
          </text>
        </svg>

        <div className="mt-4 grid grid-cols-3 gap-3 w-full max-w-md">
          <Stat label="القوة" value={`${F} N`} color="text-destructive" />
          <Stat label="الكتلة" value={`${m} كجم`} color="text-foreground" />
          <Stat label="التسارع" value={`${a.toFixed(2)} م/ث²`} color="text-primary" />
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground">🎛️ التحكم</h4>
        <Ctl label="القوة المؤثرة" unit="N" value={F} min={0} max={50} step={1} onChange={setF} />
        <Ctl label="كتلة الجسم" unit="كجم" value={m} min={1} max={20} step={1} onChange={setM} />
        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs">
          <div className="font-bold mb-1">📐 جربي</div>
          <div>ضاعفي القوة، يتضاعف التسارع</div>
          <div>ضاعفي الكتلة، ينصف التسارع</div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-card rounded-2xl p-3 text-center shadow-soft">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`font-bold ${color}`}>{value}</div>
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
