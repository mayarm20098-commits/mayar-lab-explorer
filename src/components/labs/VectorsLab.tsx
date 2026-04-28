import { useState } from "react";
import { Slider } from "@/components/ui/slider";

export function VectorsLab() {
  const [a, setA] = useState({ x: 4, y: 0 });
  const [b, setB] = useState({ x: 0, y: 3 });

  const sum = { x: a.x + b.x, y: a.y + b.y };
  const mag = Math.sqrt(sum.x ** 2 + sum.y ** 2);
  const angle = (Math.atan2(sum.y, sum.x) * 180) / Math.PI;

  // SVG coords: center 200,200; scale 25 px per unit; y inverted
  const C = 200;
  const S = 25;
  const tip = (v: { x: number; y: number }) => `${C + v.x * S},${C - v.y * S}`;

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky p-6 min-h-[460px] flex flex-col shadow-card border border-border">
        <div className="text-sm font-bold text-foreground mb-2">جامع المتجهات (طريقة المتوازي)</div>
        <svg viewBox="0 0 400 400" className="w-full bg-card rounded-2xl border border-border">
          {/* grid */}
          {Array.from({ length: 17 }).map((_, i) => (
            <g key={i}>
              <line x1={i * 25} y1="0" x2={i * 25} y2="400" stroke="oklch(0.92 0.03 240)" strokeWidth="0.5" />
              <line x1="0" y1={i * 25} x2="400" y2={i * 25} stroke="oklch(0.92 0.03 240)" strokeWidth="0.5" />
            </g>
          ))}
          {/* axes */}
          <line x1="0" y1={C} x2="400" y2={C} stroke="oklch(0.50 0.05 250)" strokeWidth="1.5" />
          <line x1={C} y1="0" x2={C} y2="400" stroke="oklch(0.50 0.05 250)" strokeWidth="1.5" />
          {/* A */}
          <line x1={C} y1={C} x2={`${C + a.x * S}`} y2={`${C - a.y * S}`} stroke="oklch(0.62 0.22 25)" strokeWidth="3" markerEnd="url(#m1)" />
          <text x={C + a.x * S + 8} y={C - a.y * S - 4} fontSize="14" fill="oklch(0.62 0.22 25)" fontWeight="bold">A</text>
          {/* B */}
          <line x1={C} y1={C} x2={`${C + b.x * S}`} y2={`${C - b.y * S}`} stroke="oklch(0.55 0.20 252)" strokeWidth="3" markerEnd="url(#m2)" />
          <text x={C + b.x * S + 8} y={C - b.y * S - 4} fontSize="14" fill="oklch(0.55 0.20 252)" fontWeight="bold">B</text>
          {/* sum */}
          <line x1={C} y1={C} x2={tip(sum).split(",")[0]} y2={tip(sum).split(",")[1]} stroke="oklch(0.70 0.17 155)" strokeWidth="4" markerEnd="url(#m3)" />
          <text x={C + sum.x * S + 8} y={C - sum.y * S + 14} fontSize="14" fill="oklch(0.70 0.17 155)" fontWeight="bold">R</text>
          {/* dashed parallels */}
          <line x1={`${C + a.x * S}`} y1={`${C - a.y * S}`} x2={tip(sum).split(",")[0]} y2={tip(sum).split(",")[1]} stroke="oklch(0.55 0.20 252)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
          <line x1={`${C + b.x * S}`} y1={`${C - b.y * S}`} x2={tip(sum).split(",")[0]} y2={tip(sum).split(",")[1]} stroke="oklch(0.62 0.22 25)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
          <defs>
            {["m1", "m2", "m3"].map((id, i) => (
              <marker key={id} id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={["oklch(0.62 0.22 25)", "oklch(0.55 0.20 252)", "oklch(0.70 0.17 155)"][i]} />
              </marker>
            ))}
          </defs>
        </svg>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="bg-card rounded-2xl p-3 text-center shadow-soft">
            <div className="text-xs text-muted-foreground">المحصلة</div>
            <div className="font-bold text-success">|R| = {mag.toFixed(2)}</div>
          </div>
          <div className="bg-card rounded-2xl p-3 text-center shadow-soft">
            <div className="text-xs text-muted-foreground">الزاوية</div>
            <div className="font-bold text-success">{angle.toFixed(1)}°</div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-4">
        <h4 className="font-display font-extrabold text-foreground">🎛️ المتجهات</h4>
        <div className="space-y-2">
          <div className="text-xs font-bold text-destructive">المتجه A</div>
          <Ctl label="Aₓ" value={a.x} onChange={(v) => setA({ ...a, x: v })} />
          <Ctl label="Aᵧ" value={a.y} onChange={(v) => setA({ ...a, y: v })} />
        </div>
        <div className="space-y-2">
          <div className="text-xs font-bold text-primary">المتجه B</div>
          <Ctl label="Bₓ" value={b.x} onChange={(v) => setB({ ...b, x: v })} />
          <Ctl label="Bᵧ" value={b.y} onChange={(v) => setB({ ...b, y: v })} />
        </div>
        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs">
          <div className="font-bold mb-1">📐 المحصلة</div>
          <div className="font-mono">Rₓ = {sum.x}, Rᵧ = {sum.y}</div>
          <div className="font-mono">|R| = √(Rₓ² + Rᵧ²)</div>
        </div>
      </div>
    </div>
  );
}

function Ctl({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-bold text-foreground">{label}</label>
        <span className="text-xs font-mono bg-muted px-2 rounded">{value}</span>
      </div>
      <Slider value={[value]} min={-6} max={6} step={1} onValueChange={(v) => onChange(v[0])} dir="ltr" />
    </div>
  );
}
