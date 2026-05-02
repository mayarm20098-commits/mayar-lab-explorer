import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Flame } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

// محاكاة قانون الغاز المثالي PV = nRT
// نُثبّت n=1 mole و R=8.314
// المتغيران الحرّان: V (لتر) و T (كلفن) ⇒ نحسب P
export function GasLawLab({ onMiyarSay }: Props) {
  const [volumeL, setVolumeL] = useState(10); // لتر
  const [tempK, setTempK] = useState(300); // كلفن
  const n = 1;
  const R = 8.314;
  const V_m3 = volumeL / 1000;
  const pressure = (n * R * tempK) / V_m3; // Pa
  const kPa = pressure / 1000;

  // عدد جزيئات لمحاكاة بصرية (سرعتهم تعتمد على T)
  const particleSpeed = Math.sqrt(tempK / 300) * 2;
  const particles = Array.from({ length: 14 }, (_, i) => i);
  // ارتفاع المكبس: عكس الحجم (حجم أقل = مكبس أوطأ)
  const pistonHeight = 60 + (volumeL / 30) * 280; // px

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden flex items-end justify-center">
        {/* الإسطوانة */}
        <div className="relative w-48 mb-4" style={{ height: 380 }}>
          {/* الجدار */}
          <div className="absolute inset-x-0 bottom-0 border-x-4 border-b-4 border-deep rounded-b-2xl" style={{ height: pistonHeight }}>
            {/* الجزيئات */}
            {particles.map((i) => {
              const left = (i * 37) % 80 + 5;
              const bottom = ((i * 23) % Math.max(20, pistonHeight - 20)) + 8;
              return (
                <div
                  key={i}
                  className="absolute h-2.5 w-2.5 rounded-full bg-primary shadow-glow"
                  style={{
                    left: `${left}%`,
                    bottom: `${bottom}px`,
                    animation: `jiggle ${2 / particleSpeed}s ease-in-out ${i * 0.1}s infinite`,
                  }}
                />
              );
            })}
            {/* لون احترار */}
            <div
              className="absolute inset-0 transition-colors duration-500 rounded-b-xl"
              style={{
                background: `hsl(${Math.max(0, 240 - (tempK - 100) / 4)} 70% 50% / 0.15)`,
              }}
            />
          </div>
          {/* المكبس */}
          <div
            className="absolute left-0 right-0 h-4 bg-deep rounded-t-md transition-all duration-500 shadow-soft flex items-center justify-center"
            style={{ bottom: pistonHeight }}
          >
            <div className="text-[10px] text-deep-foreground font-bold">المكبس</div>
          </div>
          {/* قاعدة + اللهب */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-3xl">
            {tempK > 350 ? "🔥" : tempK > 200 ? "🌡️" : "❄️"}
          </div>
        </div>

        <style>{`
          @keyframes jiggle {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(8px, -6px); }
            50% { transform: translate(-6px, 8px); }
            75% { transform: translate(6px, 6px); }
          }
        `}</style>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <Flame className="h-4 w-4 text-primary" /> قانون الغاز المثالي
        </h4>

        <Ctrl label="الحجم V" unit="لتر" value={volumeL} min={1} max={30} step={0.5} onChange={(v) => { setVolumeL(v); sounds.click(); }} />
        <Ctrl label="الحرارة T" unit="كلفن" value={tempK} min={100} max={600} step={10} onChange={(v) => { setTempK(v); sounds.click(); }} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>PV = nRT (n=1 mol)</div>
          <div>P = nRT/V = <b>{kPa.toFixed(1)} kPa</b></div>
          <div className="opacity-80">سرعة الجزيئات ∝ √T</div>
        </div>

        <button
          onClick={() => {
            sounds.success();
            onMiyarSay?.(
              `بثبات الكمية: زيادة الحرارة ⇧ الضغط، وزيادة الحجم ⇩ الضغط. هذا قانون الغاز المثالي! 🔥`,
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
