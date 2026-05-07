import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function ElectricFieldLab({ onMiyarSay }: Props) {
  const [q, setQ] = useState(3); // µC
  const k = 8.99e9;
  const W = 480, H = 320;
  const cx = W / 2, cy = H / 2;
  const grid: { x: number; y: number; ex: number; ey: number; mag: number }[] = [];
  const step = 30;
  for (let x = step / 2; x < W; x += step) {
    for (let y = step / 2; y < H; y += step) {
      const dx = x - cx, dy = y - cy;
      const r2 = dx * dx + dy * dy;
      if (r2 < 200) continue;
      const r = Math.sqrt(r2);
      const E = (k * q * 1e-6) / (r2 * 1e-4); // N/C arbitrary scale
      const sign = q >= 0 ? 1 : -1;
      grid.push({ x, y, ex: (sign * dx) / r, ey: (sign * dy) / r, mag: Math.min(20, Math.abs(E) * 1e-9) });
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-3 shadow-card min-h-[460px] flex items-center justify-center">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
          {grid.map((g, i) => {
            const len = 12 + g.mag;
            const x2 = g.x + g.ex * len;
            const y2 = g.y + g.ey * len;
            return <line key={i} x1={g.x} y1={g.y} x2={x2} y2={y2} stroke="hsl(220 70% 55%)" strokeWidth={1.2} markerEnd="url(#fa)" />;
          })}
          <circle cx={cx} cy={cy} r={20} fill={q >= 0 ? "hsl(0 70% 55%)" : "hsl(220 70% 55%)"} stroke="hsl(var(--deep))" strokeWidth={2} />
          <text x={cx} y={cy + 6} fontSize={20} fill="white" textAnchor="middle" fontWeight="bold">{q >= 0 ? "+" : "−"}</text>
          <defs>
            <marker id="fa" markerWidth="6" markerHeight="6" refX="4" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4 Z" fill="hsl(220 70% 55%)" /></marker>
          </defs>
        </svg>
      </div>
      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold">🌐 المجال الكهربائي</h4>
        <Ctrl label="الشحنة q" unit="μC" value={q} min={-5} max={5} step={0.5} onChange={setQ} />
        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs font-mono space-y-1">
          <div>E = k·q / r² (N/C)</div>
          <div>E = F/q₀</div>
          <div>الخطوط تخرج من + وتدخل في −</div>
        </div>
        <button onClick={() => { sounds.success(); onMiyarSay?.("اتجاه المجال = اتجاه القوة على شحنة اختبار موجبة. المجال يضعف بسرعة مع البعد! 🌐", "celebrate"); }} className="w-full bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow">القاعدة؟</button>
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
