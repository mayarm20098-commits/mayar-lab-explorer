import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function SemiconductorLab({ onMiyarSay }: Props) {
  const [polarity, setPolarity] = useState<"forward" | "reverse">("forward");
  const [voltage, setVoltage] = useState(2);

  // Forward: starts conducting after ~0.7V threshold (silicon)
  const conducts = polarity === "forward" && voltage >= 0.7;
  const current = conducts ? (voltage - 0.7) * 0.5 : 0; // simplified mA

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-6 shadow-card min-h-[460px] flex flex-col items-center justify-center gap-6">
        {/* Battery */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="w-16 h-12 bg-card border-2 border-deep rounded-md flex items-center justify-center font-bold">{voltage.toFixed(1)}V</div>
            <div className="text-[10px] text-muted-foreground mt-1">{polarity === "forward" ? "+ ← →" : "− ← →"}</div>
          </div>
        </div>

        {/* Diode symbol */}
        <div className="flex items-center gap-2">
          <div className="h-1 w-20 bg-deep" />
          <div className={`relative ${polarity === "reverse" ? "rotate-180" : ""}`}>
            <div className="w-0 h-0 border-y-[18px] border-y-transparent border-l-[26px] border-l-amber-600" />
            <div className="absolute top-0 left-[26px] h-[36px] w-1.5 bg-deep" />
          </div>
          <div className="h-1 w-20 bg-deep" />
        </div>

        {/* Bulb / current indicator */}
        <div className="flex flex-col items-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all"
            style={{
              background: conducts ? `radial-gradient(circle, rgba(253,224,71,${Math.min(1, current * 0.6)}), transparent)` : "transparent",
              boxShadow: conducts ? `0 0 ${current * 12}px rgba(253,224,71,0.7)` : "none",
            }}
          >
            💡
          </div>
          <div className="text-xs font-mono mt-1 bg-card/80 px-2 py-0.5 rounded-full">
            I = {current.toFixed(2)} mA {conducts ? "✓" : "✗"}
          </div>
        </div>

        <div className="bg-card/90 rounded-2xl px-4 py-2 text-xs text-center">
          {polarity === "forward"
            ? voltage < 0.7
              ? "الجهد أقل من 0.7V — الثنائي ما زال مغلقاً"
              : "✅ الانحياز الأمامي — الثنائي يوصّل التيار"
            : "❌ الانحياز العكسي — الثنائي يمنع مرور التيار"}
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold">🔌 الثنائي (Diode)</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => { setPolarity("forward"); sounds.click(); }}
            className={`py-2 rounded-xl font-bold text-sm border-2 ${polarity === "forward" ? "border-primary bg-primary/10" : "border-border"}`}
          >
            انحياز أمامي
          </button>
          <button
            onClick={() => { setPolarity("reverse"); sounds.click(); }}
            className={`py-2 rounded-xl font-bold text-sm border-2 ${polarity === "reverse" ? "border-primary bg-primary/10" : "border-border"}`}
          >
            انحياز عكسي
          </button>
        </div>
        <Ctrl label="جهد البطارية" unit="V" value={voltage} min={0} max={6} step={0.1} onChange={setVoltage} />
        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1">
          <div className="font-bold">📌 خاصيّة الثنائي:</div>
          <div>يسمح بمرور التيار في اتجاه واحد فقط بعد تجاوز جهد العتبة (≈ 0.7V للسيليكون).</div>
        </div>
        <button
          onClick={() => {
            sounds.success();
            onMiyarSay?.(
              `الثنائي مكوّن من شبه موصل n + p. في الانحياز الأمامي تتدفق الإلكترونات، وفي العكسي تنشأ منطقة استنفاد تمنع التيار.`,
              "celebrate",
            );
          }}
          className="w-full bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow"
        >
          لماذا في اتجاه واحد؟
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
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => { onChange(v[0]); sounds.click(); }} dir="ltr" />
    </div>
  );
}
