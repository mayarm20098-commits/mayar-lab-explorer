import { useState } from "react";
import { Slider } from "@/components/ui/slider";

export function InclineLab() {
  const [angle, setAngle] = useState(30);
  const [m, setM] = useState(5);
  const g = 9.8;

  const rad = (angle * Math.PI) / 180;
  const Wparallel = m * g * Math.sin(rad);
  const Wperp = m * g * Math.cos(rad);
  const a = g * Math.sin(rad);

  // Geometry
  const baseY = 250;
  const length = 280;
  const startX = 60;
  const endX = startX + length;
  const peakY = baseY - length * Math.sin(rad);
  const peakX = startX + length * Math.cos(rad);
  // box mid
  const t = 0.4;
  const boxX = startX + length * t * Math.cos(rad);
  const boxY = baseY - length * t * Math.sin(rad);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky p-6 min-h-[460px] flex flex-col shadow-card border border-border">
        <div className="text-sm font-bold text-foreground mb-2">جسم على سطح مائل بزاوية {angle}°</div>
        <svg viewBox="0 0 400 280" className="w-full bg-card rounded-2xl border border-border">
          {/* triangle */}
          <polygon points={`${startX},${baseY} ${endX},${baseY} ${peakX},${peakY}`} fill="oklch(0.92 0.06 230)" stroke="oklch(0.22 0.10 255)" strokeWidth="2" />
          <line x1={startX} y1={baseY + 10} x2={endX} y2={baseY + 10} stroke="oklch(0.22 0.10 255)" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x={(startX + peakX) / 2 + 20} y={baseY - 10} fontSize="11" fill="oklch(0.55 0.20 252)" fontWeight="bold">θ = {angle}°</text>
          {/* box (rotated) */}
          <g transform={`translate(${boxX},${boxY}) rotate(${-angle})`}>
            <rect x="-15" y="-30" width="30" height="30" fill="oklch(0.55 0.20 252)" stroke="oklch(0.22 0.10 255)" strokeWidth="2" />
            <text x="0" y="-12" fontSize="11" textAnchor="middle" fill="white" fontWeight="bold">{m}kg</text>
          </g>
          {/* weight arrow (down) */}
          <line x1={boxX} y1={boxY - 15} x2={boxX} y2={boxY + 50} stroke="oklch(0.62 0.22 25)" strokeWidth="3" markerEnd="url(#in1)" />
          <text x={boxX + 8} y={boxY + 30} fontSize="10" fill="oklch(0.62 0.22 25)" fontWeight="bold">W=mg</text>
          <defs>
            <marker id="in1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="oklch(0.62 0.22 25)" />
            </marker>
          </defs>
        </svg>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat label="W∥ (موازية)" value={`${Wparallel.toFixed(1)} N`} />
          <Stat label="W⊥ (عمودية)" value={`${Wperp.toFixed(1)} N`} />
          <Stat label="التسارع" value={`${a.toFixed(2)} م/ث²`} />
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground">🎛️ المتغيرات</h4>
        <Ctl label="زاوية الميل" unit="°" value={angle} min={0} max={75} step={5} onChange={setAngle} />
        <Ctl label="كتلة الجسم" unit="كجم" value={m} min={1} max={20} step={1} onChange={setM} />
        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1">
          <div className="font-bold mb-1">📐 المعادلات</div>
          <div className="font-mono">W∥ = mg·sin(θ)</div>
          <div className="font-mono">W⊥ = mg·cos(θ)</div>
          <div className="font-mono">a = g·sin(θ)</div>
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
