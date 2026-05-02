import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Anchor } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function BuoyancyLab({ onMiyarSay }: Props) {
  const [objectDensity, setObjectDensity] = useState(800); // كغ/م³
  const [volume, setVolume] = useState(0.5); // م³ (مكعب 0.79م تقريباً)
  const fluidDensity = 1000; // ماء
  const g = 9.8;

  const weight = objectDensity * volume * g; // N
  const buoyancy = fluidDensity * volume * g; // إذا كان مغموراً كاملاً
  const floats = objectDensity < fluidDensity;
  // كم نسبة الجسم المغمورة عند الطفو:
  const submergedFraction = floats ? objectDensity / fluidDensity : 1;

  // بصرياً: مكعب
  const cubeSize = 60 + volume * 40;
  // موضع المكعب رأسياً: عند الطفو، الجزء العلوي يبرز
  const topOffset = floats ? (1 - submergedFraction) * cubeSize : 10;

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden">
        {/* container */}
        <div className="absolute inset-x-8 top-12 bottom-6 rounded-b-2xl border-4 border-deep border-t-0 overflow-hidden bg-card/30">
          {/* water */}
          <div className="absolute bottom-0 left-0 right-0 h-[75%] bg-gradient-to-b from-sky/70 to-primary/40" />
          {/* water surface line */}
          <div className="absolute left-0 right-0 bg-card/40 h-0.5" style={{ bottom: "75%" }} />

          {/* الجسم */}
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-md border-2 border-deep flex items-center justify-center text-xs font-bold text-deep-foreground transition-all duration-700"
            style={{
              width: cubeSize,
              height: cubeSize,
              bottom: floats
                ? `calc(75% - ${cubeSize * submergedFraction}px)`
                : `${topOffset}px`,
              background: `hsl(${30 + objectDensity / 100} 70% 60%)`,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            {objectDensity} كغ/م³
          </div>

          {/* السهام: الوزن لأسفل، الطفو لأعلى */}
          <div className="absolute top-2 right-2 text-[10px] bg-card/90 rounded-md px-2 py-1 space-y-1 font-mono">
            <div className="text-destructive">⬇️ الوزن: {weight.toFixed(0)} N</div>
            <div className="text-primary">⬆️ الطفو: {(buoyancy * submergedFraction).toFixed(0)} N</div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <Anchor className="h-4 w-4 text-primary" /> الطفو وأرخميدس
        </h4>

        <Ctrl label="كثافة الجسم ρ" unit="كغ/م³" value={objectDensity} min={200} max={2500} step={50} onChange={(v) => { setObjectDensity(v); sounds.click(); }} />
        <Ctrl label="حجم الجسم V" unit="م³" value={volume} min={0.1} max={1.5} step={0.05} onChange={(v) => { setVolume(v); sounds.click(); }} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>F_b = ρ_سائل · V_غمر · g</div>
          <div>كثافة الماء = 1000 كغ/م³</div>
          <div className="text-base mt-1">
            {floats ? "🟢 الجسم يطفو" : "🔴 الجسم يغرق"}
          </div>
        </div>

        <button
          onClick={() => {
            sounds.success();
            onMiyarSay?.(
              `إذا كانت كثافة الجسم أقل من كثافة السائل ⇒ يطفو، وإلا يغرق. هذا مبدأ أرخميدس! 🛟`,
              "celebrate",
            );
          }}
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
