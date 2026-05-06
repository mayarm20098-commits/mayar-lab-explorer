import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Rocket } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function WeightlessLab({ onMiyarSay }: Props) {
  const [mass, setMass] = useState(60); // كتلة الشخص
  const [a, setA] = useState(0); // تسارع المصعد
  const g = 9.8;
  const apparent = mass * (g + a); // الوزن الظاهري
  const isWeightless = Math.abs(g + a) < 0.5;

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden flex items-center justify-center">
        <div className="relative w-44 h-80 bg-card border-4 border-deep rounded-2xl flex flex-col items-center justify-end p-4 shadow-glow">
          <div className="text-2xl mb-2 transition-transform" style={{ transform: `translateY(${isWeightless ? -20 : 0}px)` }}>🧑‍🚀</div>
          <div className="w-full h-2 bg-deep rounded" />
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-mono bg-deep text-deep-foreground px-2 py-0.5 rounded">
            {a > 0 ? "↑ صاعد" : a < 0 ? "↓ هابط" : "ثابت"}
          </div>
        </div>
        <div className="absolute bottom-3 left-3 bg-card/90 rounded-xl px-3 py-2 text-xs font-mono shadow-soft">
          الوزن الظاهري: <b className={isWeightless ? "text-destructive" : "text-primary"}>{apparent.toFixed(1)} N</b>
          {isWeightless && <div className="text-destructive text-[10px] mt-1">⚠️ انعدام الوزن!</div>}
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <Rocket className="h-4 w-4 text-primary" /> انعدام الوزن
        </h4>
        <Ctrl label="كتلة الراكب" unit="كغ" value={mass} min={20} max={120} step={5} onChange={(v) => { setMass(v); sounds.click(); }} />
        <Ctrl label="تسارع المصعد a" unit="م/ث²" value={a} min={-9.8} max={5} step={0.2} onChange={(v) => { setA(v); sounds.click(); }} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>F_app = m·(g + a)</div>
          <div>عند a = −g ⇒ سقوط حر ⇒ انعدام وزن</div>
        </div>

        <button
          onClick={() => { sounds.success(); onMiyarSay?.(`عندما يسقط المصعد بتسارع g يصبح وزنك الظاهري صفراً، تماماً كرواد الفضاء! 🚀`, "celebrate"); }}
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
