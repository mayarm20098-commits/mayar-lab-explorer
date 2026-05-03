import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Flame } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

const materials = [
  { name: "النحاس", c: 385, color: "from-orange-600 to-amber-700" },
  { name: "الحديد", c: 450, color: "from-zinc-500 to-zinc-700" },
  { name: "الألومنيوم", c: 897, color: "from-slate-300 to-slate-500" },
  { name: "الماء", c: 4186, color: "from-sky-400 to-blue-600" },
];

export function HeatLab({ onMiyarSay }: Props) {
  const [matIdx, setMatIdx] = useState(0);
  const [mass, setMass] = useState(2.3);
  const [t1, setT1] = useState(20);
  const [t2, setT2] = useState(80);
  const mat = materials[matIdx];
  const dT = t2 - t1;
  const Q = mass * mat.c * dT;
  const tempPercent = Math.max(0, Math.min(100, ((t2 - 0) / 120) * 100));

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden flex items-center justify-center">
        {/* وعاء */}
        <div className="relative">
          <div className={`w-40 h-40 rounded-3xl bg-gradient-to-b ${mat.color} border-4 border-deep shadow-glow flex items-center justify-center text-white font-bold`}>
            <div className="text-center">
              <div className="text-3xl">{t2.toFixed(0)}°C</div>
              <div className="text-sm mt-1">{mat.name}</div>
              <div className="text-xs opacity-80">{mass.toFixed(1)} kg</div>
            </div>
          </div>
          {/* نار */}
          <div className="flex justify-center gap-1 mt-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-3 h-6 rounded-full bg-gradient-to-t from-red-600 to-yellow-400 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
        {/* مقياس */}
        <div className="absolute top-6 left-6 w-6 h-72 rounded-full bg-card border-2 border-deep overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-500 to-orange-400 transition-all" style={{ height: `${tempPercent}%` }} />
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-4">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <Flame className="h-4 w-4 text-primary" /> الحرارة النوعية
        </h4>
        <div>
          <label className="text-xs font-bold mb-1.5 block">المادة</label>
          <div className="grid grid-cols-2 gap-2">
            {materials.map((m, i) => (
              <button
                key={m.name}
                onClick={() => { setMatIdx(i); sounds.click(); }}
                className={`text-xs font-bold py-2 rounded-lg border-2 transition-all ${i === matIdx ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
              >
                {m.name}<br /><span className="text-[10px] font-mono">C={m.c}</span>
              </button>
            ))}
          </div>
        </div>
        <Ctrl label="الكتلة m" unit="كغ" value={mass} min={0.1} max={10} step={0.1} onChange={(v) => { setMass(v); sounds.click(); }} />
        <Ctrl label="درجة الابتدائية T₁" unit="°C" value={t1} min={0} max={50} step={1} onChange={(v) => { setT1(v); sounds.click(); }} />
        <Ctrl label="درجة النهائية T₂" unit="°C" value={t2} min={t1} max={120} step={1} onChange={(v) => { setT2(v); sounds.click(); }} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>Q = m · C · ΔT</div>
          <div>ΔT = {dT}°C</div>
          <div className="text-base mt-1">Q = <b>{Q.toFixed(0)} J</b></div>
        </div>

        <button
          onClick={() => onMiyarSay?.(`المواد المختلفة تحتاج كميات حرارة مختلفة لتسخين 1 كغ منها بـ 1°C، وهذا ما يسمى الحرارة النوعية! 🔥`, "celebrate")}
          className="w-full bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow"
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
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-bold">{label}</label>
        <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-md">{value} {unit}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} dir="ltr" />
    </div>
  );
}
