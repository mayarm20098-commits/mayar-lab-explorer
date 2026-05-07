import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function RefractionLab({ onMiyarSay }: Props) {
  const [n1, setN1] = useState(1.0);
  const [n2, setN2] = useState(1.5);
  const [theta1, setTheta1] = useState(30);
  const sin2 = (n1 / n2) * Math.sin((theta1 * Math.PI) / 180);
  const tir = Math.abs(sin2) > 1;
  const theta2 = tir ? 0 : (Math.asin(sin2) * 180) / Math.PI;
  const critical = n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : null;
  const cx = 250, cy = 200;
  const len = 150;
  const r1 = (theta1 * Math.PI) / 180;
  const r2 = (theta2 * Math.PI) / 180;
  const ix = cx - len * Math.sin(r1);
  const iy = cy - len * Math.cos(r1);
  const rx = cx + len * Math.sin(r2);
  const ry = cy + len * Math.cos(r2);
  // reflected (TIR or partial)
  const reflX = cx + len * Math.sin(r1);
  const reflY = cy - len * Math.cos(r1);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-3 shadow-card min-h-[460px] flex items-center justify-center">
        <svg viewBox="0 0 500 380" className="w-full h-full">
          <rect x={0} y={0} width={500} height={200} fill="hsl(200 80% 92%)" opacity={0.4} />
          <rect x={0} y={200} width={500} height={180} fill="hsl(220 70% 70%)" opacity={0.4} />
          <line x1={0} y1={200} x2={500} y2={200} stroke="hsl(var(--deep))" strokeWidth={2} />
          <line x1={cx} y1={50} x2={cx} y2={350} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 4" strokeWidth={1} />
          <line x1={ix} y1={iy} x2={cx} y2={cy} stroke="hsl(0 70% 55%)" strokeWidth={3} />
          {!tir && <line x1={cx} y1={cy} x2={rx} y2={ry} stroke="hsl(140 60% 45%)" strokeWidth={3} />}
          {tir && <line x1={cx} y1={cy} x2={reflX} y2={reflY} stroke="hsl(280 60% 50%)" strokeWidth={3} />}
          <text x={20} y={30} fontSize={14} fontWeight="bold" fill="hsl(var(--foreground))">n₁ = {n1.toFixed(2)}</text>
          <text x={20} y={230} fontSize={14} fontWeight="bold" fill="hsl(var(--foreground))">n₂ = {n2.toFixed(2)}</text>
          <text x={cx - 90} y={cy - 10} fontSize={13} fill="hsl(0 70% 45%)" fontWeight="bold">θ₁={theta1}°</text>
          {!tir && <text x={cx + 10} y={cy + 25} fontSize={13} fill="hsl(140 60% 35%)" fontWeight="bold">θ₂={theta2.toFixed(1)}°</text>}
          {tir && <text x={cx + 10} y={cy - 10} fontSize={12} fill="hsl(280 60% 40%)" fontWeight="bold">انعكاس كلي ⚡</text>}
        </svg>
      </div>
      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold">🌊 انكسار الضوء (سنل)</h4>
        <Ctrl label="معامل n₁" unit="" value={n1} min={1} max={2.5} step={0.05} onChange={setN1} />
        <Ctrl label="معامل n₂" unit="" value={n2} min={1} max={2.5} step={0.05} onChange={setN2} />
        <Ctrl label="زاوية السقوط θ₁" unit="°" value={theta1} min={0} max={89} step={1} onChange={setTheta1} />
        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs font-mono space-y-1">
          <div>n₁ sinθ₁ = n₂ sinθ₂</div>
          {critical && <div>الزاوية الحرجة: <b>{critical.toFixed(1)}°</b></div>}
        </div>
        <button onClick={() => { sounds.success(); onMiyarSay?.("عند المرور من وسط أكثف إلى أقل كثافة، إذا تجاوزت الزاوية الحرجة يحدث انعكاس كلي داخلي! 💎", "celebrate"); }} className="w-full bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow">القاعدة؟</button>
      </div>
    </div>
  );
}

function Ctrl({ label, unit, value, min, max, step, onChange }: { label: string; unit: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-bold">{label}</label>
        <span className="text-sm font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-md">{value}{unit}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => { onChange(v[0]); sounds.click(); }} dir="ltr" />
    </div>
  );
}
