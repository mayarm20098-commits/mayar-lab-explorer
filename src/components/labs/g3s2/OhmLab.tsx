import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Zap } from "lucide-react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function OhmLab({ onMiyarSay }: Props) {
  const [voltage, setVoltage] = useState(6); // V
  const [resistance, setResistance] = useState(3); // Ω
  const current = voltage / resistance; // A
  const power = voltage * current;

  // animate electrons speed by current
  const speed = Math.min(8, Math.max(0.4, current));

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="rounded-3xl bg-gradient-sky border border-border p-5 shadow-card min-h-[460px] relative overflow-hidden">
        {/* Battery */}
        <div className="absolute top-1/2 right-6 -translate-y-1/2 flex items-center gap-1">
          <div className="w-3 h-10 bg-deep rounded-sm" />
          <div className="w-10 h-16 bg-card border-2 border-deep rounded-md flex flex-col items-center justify-center text-[10px] font-bold">
            <span>+</span>
            <span className="text-primary">{voltage}V</span>
            <span>−</span>
          </div>
        </div>
        {/* Wire path - top */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 12 50 L 12 15 L 88 15 L 88 50 M 88 50 L 88 85 L 12 85 L 12 50" stroke="hsl(var(--deep))" strokeWidth="0.6" fill="none" />
        </svg>
        {/* Resistor in series */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 bg-card border-2 border-deep rounded-md px-4 py-1.5 text-xs font-bold shadow-soft">
          مقاومة: {resistance} Ω
        </div>
        {/* Bulb at bottom */}
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all"
            style={{
              background: `radial-gradient(circle, rgba(253,224,71,${Math.min(1, current / 4)}) 0%, rgba(253,224,71,${Math.min(0.4, current / 8)}) 50%, transparent 80%)`,
              boxShadow: current > 0.5 ? `0 0 ${current * 8}px rgba(253,224,71,0.7)` : "none",
            }}
          >
            💡
          </div>
          <div className="text-[10px] font-mono mt-1 bg-card/80 px-2 py-0.5 rounded-full">{(current).toFixed(2)} A</div>
        </div>
        {/* Electrons animated dots on wire */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-primary shadow-glow"
            style={{
              animation: `flow ${4 / speed}s linear ${i * (4 / speed) / 6}s infinite`,
              offsetPath: `path('M 50 220 L 50 60 L 360 60 L 360 220 L 360 380 L 50 380 L 50 220')`,
            }}
          />
        ))}
        <style>{`
          @keyframes flow { from { offset-distance: 0%; } to { offset-distance: 100%; } }
        `}</style>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" /> قانون أوم
        </h4>
        <Ctrl label="الجهد V" unit="فولت" value={voltage} min={0} max={24} step={0.5} onChange={(v) => { setVoltage(v); sounds.click(); }} />
        <Ctrl label="المقاومة R" unit="أوم" value={resistance} min={0.5} max={20} step={0.5} onChange={(v) => { setResistance(v); sounds.click(); }} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>I = V / R = <b>{current.toFixed(2)} A</b></div>
          <div>P = V × I = <b>{power.toFixed(2)} W</b></div>
        </div>

        <button
          onClick={() => {
            sounds.success();
            onMiyarSay?.(
              `عندما يزداد الجهد يزداد التيار، وعندما تزداد المقاومة يقل التيار. هذا قانون أوم! V = I × R 💡`,
              "celebrate",
            );
          }}
          className="w-full bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow hover:scale-105 transition-transform"
        >
          أين المعادلة؟
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
