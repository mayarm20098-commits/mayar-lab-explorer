import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Droplets } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

// قيم للماء
const C_ice = 2090;
const C_water = 4186;
const C_steam = 2010;
const Lf = 334000; // J/kg انصهار
const Lv = 2260000; // J/kg تبخر

export function PhaseChangeLab({ onMiyarSay }: Props) {
  const [m, setM] = useState(0.1);
  const [Q, setQ] = useState(50000);

  // محاكاة بسيطة: نبدأ من -10°C
  let energy = Q;
  let T = -10;
  let phase = "جليد";
  const stages = [
    { dT: 10, c: C_ice, label: "تسخين الجليد" }, // -10 → 0
    { dT: 0, latent: Lf, label: "انصهار" },
    { dT: 100, c: C_water, label: "تسخين الماء" }, // 0 → 100
    { dT: 0, latent: Lv, label: "تبخر" },
    { dT: 100, c: C_steam, label: "تسخين البخار" },
  ];

  let stageIdx = 0;
  for (const s of stages) {
    if (s.c) {
      const need = m * s.c * s.dT;
      if (energy >= need) { energy -= need; T += s.dT; stageIdx++; }
      else { T += energy / (m * s.c); energy = 0; break; }
    } else if (s.latent) {
      const need = m * s.latent;
      if (energy >= need) { energy -= need; stageIdx++; }
      else { phase = s.label; energy = 0; break; }
    }
  }

  if (T < 0) phase = "جليد ❄️";
  else if (T === 0 && stageIdx === 1) phase = "انصهار 💧";
  else if (T < 100) phase = "ماء سائل 💧";
  else if (T === 100 && stageIdx === 3) phase = "تبخر 💨";
  else phase = "بخار 💨";

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden flex flex-col items-center justify-center gap-6">
        <div className="text-7xl">{T < 0 ? "🧊" : T < 100 ? "💧" : "💨"}</div>
        <div className="text-center">
          <div className="text-3xl font-display font-extrabold text-primary">{T.toFixed(1)}°C</div>
          <div className="text-sm text-muted-foreground mt-1">{phase}</div>
        </div>
        {/* مخطط مبسط */}
        <svg viewBox="0 0 300 80" className="w-full max-w-sm bg-card rounded-xl border border-border">
          <line x1={0} y1={50} x2={300} y2={50} stroke="hsl(var(--deep))" strokeWidth={1} />
          <path d="M 0 70 L 50 50 L 80 50 L 130 30 L 160 30 L 210 20 L 300 10"
            fill="none" stroke="hsl(var(--primary))" strokeWidth={2} />
          <text x={5} y={48} fontSize={9} fill="hsl(var(--muted-foreground))">جليد</text>
          <text x={90} y={48} fontSize={9} fill="hsl(var(--muted-foreground))">ماء</text>
          <text x={220} y={18} fontSize={9} fill="hsl(var(--muted-foreground))">بخار</text>
        </svg>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <Droplets className="h-4 w-4 text-primary" /> تغير الحالة
        </h4>
        <Ctrl label="كتلة الماء m" unit="كغ" value={m} min={0.05} max={0.5} step={0.05} onChange={(v) => { setM(v); sounds.click(); }} />
        <Ctrl label="الحرارة المضافة Q" unit="J" value={Q} min={0} max={400000} step={5000} onChange={(v) => { setQ(v); sounds.click(); }} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>Q = m·L (تغير حالة)</div>
          <div>L_f(ماء) = 334 kJ/kg</div>
          <div>L_v(ماء) = 2260 kJ/kg</div>
        </div>

        <button
          onClick={() => { sounds.success(); onMiyarSay?.(`أثناء تغير الحالة لا ترتفع الحرارة، الطاقة كلها تكسر روابط الجزيئات! ❄️→💧→💨`, "celebrate"); }}
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
