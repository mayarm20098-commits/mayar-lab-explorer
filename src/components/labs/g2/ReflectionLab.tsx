import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Sun } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function ReflectionLab({ onMiyarSay }: Props) {
  const [angle, setAngle] = useState(30); // درجة من العمودي

  const W = 480, H = 460;
  const cx = W / 2;
  const cy = H - 80; // نقطة السقوط على المرآة
  const len = 220;
  const rad = (angle * Math.PI) / 180;

  // الشعاع الساقط: قادم من اليمين
  const inX = cx + len * Math.sin(rad);
  const inY = cy - len * Math.cos(rad);
  // الشعاع المنعكس: نحو اليسار
  const outX = cx - len * Math.sin(rad);
  const outY = cy - len * Math.cos(rad);
  // العمودي
  const normalY = cy - 200;

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
          {/* المرآة */}
          <rect x={40} y={cy} width={W - 80} height={20} fill="url(#mirror)" stroke="hsl(var(--deep))" strokeWidth={2} />
          {/* خطوط هاش تحت المرآة */}
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={i} x1={50 + i * 22} y1={cy + 20} x2={42 + i * 22} y2={cy + 32} stroke="hsl(var(--deep))" strokeWidth={1} />
          ))}
          <defs>
            <linearGradient id="mirror" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(200 80% 90%)" />
              <stop offset="100%" stopColor="hsl(200 60% 70%)" />
            </linearGradient>
          </defs>

          {/* العمودي (متقطع) */}
          <line x1={cx} y1={cy} x2={cx} y2={normalY} stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="6 4" />
          <text x={cx + 6} y={normalY + 12} fontSize="11" fill="hsl(var(--muted-foreground))" fontWeight="bold">العمودي</text>

          {/* الشعاع الساقط */}
          <line x1={inX} y1={inY} x2={cx} y2={cy} stroke="hsl(var(--destructive))" strokeWidth={3} markerEnd="url(#arrow1)" />
          <text x={inX - 50} y={inY - 8} fontSize="11" fill="hsl(var(--destructive))" fontWeight="bold">شعاع ساقط</text>

          {/* الشعاع المنعكس */}
          <line x1={cx} y1={cy} x2={outX} y2={outY} stroke="hsl(var(--primary))" strokeWidth={3} markerEnd="url(#arrow2)" />
          <text x={outX - 30} y={outY - 8} fontSize="11" fill="hsl(var(--primary))" fontWeight="bold">شعاع منعكس</text>

          {/* أقواس الزاوية */}
          <path d={`M ${cx + 30 * Math.sin(rad / 2)} ${cy - 30 * Math.cos(rad / 2)} A 30 30 0 0 1 ${cx} ${cy - 30}`} stroke="hsl(var(--destructive))" strokeWidth={1.5} fill="none" />
          <path d={`M ${cx} ${cy - 30} A 30 30 0 0 1 ${cx - 30 * Math.sin(rad / 2)} ${cy - 30 * Math.cos(rad / 2)}`} stroke="hsl(var(--primary))" strokeWidth={1.5} fill="none" />
          <text x={cx + 16} y={cy - 32} fontSize="11" fill="hsl(var(--destructive))" fontWeight="bold">{angle}°</text>
          <text x={cx - 28} y={cy - 32} fontSize="11" fill="hsl(var(--primary))" fontWeight="bold">{angle}°</text>

          <defs>
            <marker id="arrow1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--destructive))" />
            </marker>
            <marker id="arrow2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--primary))" />
            </marker>
          </defs>
        </svg>

        <div className="absolute top-3 right-3 bg-card/90 rounded-xl px-3 py-2 text-[11px] font-mono space-y-0.5 shadow-soft">
          <div>زاوية السقوط: <b>{angle}°</b></div>
          <div>زاوية الانعكاس: <b className="text-success">{angle}°</b></div>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <Sun className="h-4 w-4 text-primary" /> انعكاس الضوء
        </h4>

        <Ctrl label="زاوية السقوط θᵢ" unit="°" value={angle} min={0} max={80} step={1} onChange={(v) => { setAngle(v); sounds.click(); }} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>θᵢ = θᵣ</div>
          <div>الشعاعان والعمودي في مستوى واحد</div>
        </div>

        <button
          onClick={() => {
            sounds.success();
            onMiyarSay?.(
              `قانون الانعكاس: زاوية السقوط = زاوية الانعكاس، وكلاهما مع العمودي في مستوى واحد ✨`,
              "celebrate",
            );
          }}
          className="w-full bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow hover:scale-105 transition-transform"
        >
          ما القانون؟
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
