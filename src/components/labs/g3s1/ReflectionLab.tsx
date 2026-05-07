import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function ReflectionLab({ onMiyarSay }: Props) {
  const [angle, setAngle] = useState(35); // angle of incidence from normal
  const rad = (angle * Math.PI) / 180;
  const cx = 250, cy = 250;
  const len = 180;
  // incident comes from upper-left
  const ix = cx - len * Math.sin(rad);
  const iy = cy - len * Math.cos(rad);
  // reflected goes upper-right
  const rx = cx + len * Math.sin(rad);
  const ry = cy - len * Math.cos(rad);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-3 shadow-card min-h-[460px] flex items-center justify-center">
        <svg viewBox="0 0 500 320" className="w-full h-full">
          {/* mirror */}
          <line x1={50} y1={250} x2={450} y2={250} stroke="hsl(var(--deep))" strokeWidth={4} />
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={i} x1={60 + i * 20} y1={250} x2={50 + i * 20} y2={265} stroke="hsl(var(--deep))" strokeWidth={1.5} />
          ))}
          {/* normal */}
          <line x1={cx} y1={50} x2={cx} y2={250} stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="6 4" />
          {/* incident ray */}
          <line x1={ix} y1={iy} x2={cx} y2={cy} stroke="hsl(0 70% 55%)" strokeWidth={3} markerEnd="url(#arrI)" />
          {/* reflected */}
          <line x1={cx} y1={cy} x2={rx} y2={ry} stroke="hsl(140 60% 45%)" strokeWidth={3} markerEnd="url(#arrR)" />
          {/* angle arcs */}
          <path d={`M ${cx - 40 * Math.sin(rad)} ${cy - 40 * Math.cos(rad)} A 40 40 0 0 1 ${cx} ${cy - 40}`} fill="none" stroke="hsl(0 70% 55%)" strokeWidth={2} />
          <path d={`M ${cx} ${cy - 40} A 40 40 0 0 1 ${cx + 40 * Math.sin(rad)} ${cy - 40 * Math.cos(rad)}`} fill="none" stroke="hsl(140 60% 45%)" strokeWidth={2} />
          <text x={cx - 20} y={cy - 50} fontSize={14} fill="hsl(0 70% 45%)" fontWeight="bold">θᵢ={angle}°</text>
          <text x={cx + 5} y={cy - 50} fontSize={14} fill="hsl(140 60% 35%)" fontWeight="bold">θᵣ={angle}°</text>
          <defs>
            <marker id="arrI" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="hsl(0 70% 55%)" /></marker>
            <marker id="arrR" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="hsl(140 60% 45%)" /></marker>
          </defs>
        </svg>
      </div>
      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold">🪞 قانون انعكاس الضوء</h4>
        <Ctrl label="زاوية السقوط" unit="°" value={angle} min={0} max={80} step={1} onChange={setAngle} />
        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs font-mono space-y-1">
          <div>القانون: θᵢ = θᵣ</div>
          <div>الشعاع الساقط، العمودي، والمنعكس في مستوى واحد.</div>
        </div>
        <button onClick={() => { sounds.success(); onMiyarSay?.("زاوية السقوط دائماً = زاوية الانعكاس بالنسبة للعمود المُقام على السطح! 🪞", "celebrate"); }} className="w-full bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow">القاعدة؟</button>
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
