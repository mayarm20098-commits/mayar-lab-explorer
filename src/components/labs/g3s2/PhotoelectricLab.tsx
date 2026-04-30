import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

// Work functions in eV
const METALS: Record<string, { name: string; phi: number; color: string }> = {
  Cs: { name: "سيزيوم", phi: 2.1, color: "#fbbf24" },
  Na: { name: "صوديوم", phi: 2.3, color: "#fb923c" },
  Ca: { name: "كالسيوم", phi: 2.9, color: "#a3a3a3" },
  Zn: { name: "زنك", phi: 4.3, color: "#94a3b8" },
};

const H = 4.136e-15; // eV·s

export function PhotoelectricLab({ onMiyarSay }: Props) {
  const [metal, setMetal] = useState("Na");
  const [freq, setFreq] = useState(8); // ×10^14 Hz
  const [intensity, setIntensity] = useState(50);

  const phi = METALS[metal].phi;
  const photonE = H * freq * 1e14; // eV
  const ke = Math.max(0, photonE - phi);
  const emits = ke > 0;
  const electronCount = emits ? Math.round((intensity / 100) * 8) : 0;

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-4">
      <div className="relative rounded-3xl bg-gradient-deep border border-border shadow-card min-h-[460px] overflow-hidden">
        {/* Light source */}
        <div className="absolute top-1/2 -translate-y-1/2 right-4 flex flex-col items-center gap-1">
          <div
            className="w-14 h-14 rounded-full"
            style={{
              background: `radial-gradient(circle, hsl(${260 - freq * 12} 90% 60%), transparent 70%)`,
              boxShadow: `0 0 ${intensity * 0.4}px hsl(${260 - freq * 12} 90% 60%)`,
            }}
          />
          <div className="text-[10px] text-deep-foreground/80">مصدر ضوء</div>
        </div>
        {/* Photon beams */}
        {Array.from({ length: Math.max(2, Math.round(intensity / 15)) }).map((_, i) => (
          <div
            key={i}
            className="absolute h-0.5 rounded-full"
            style={{
              top: `${30 + i * 8}%`,
              right: 80,
              width: "40%",
              background: `hsl(${260 - freq * 12} 90% 70%)`,
              animation: `beam 1.4s linear ${i * 0.15}s infinite`,
              boxShadow: `0 0 6px hsl(${260 - freq * 12} 90% 70%)`,
            }}
          />
        ))}
        {/* Metal plate */}
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
          <div
            className="w-6 h-44 rounded-md shadow-deep"
            style={{ background: METALS[metal].color }}
          />
          <div className="text-[10px] text-deep-foreground/80 text-center mt-1">{METALS[metal].name}</div>
        </div>
        {/* Ejected electrons */}
        {emits && Array.from({ length: electronCount }).map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
            style={{
              left: "calc(50% - 30px)",
              top: `${30 + i * 6}%`,
              animation: `eject ${1.5 / Math.max(0.4, ke)}s linear ${i * 0.2}s infinite`,
            }}
          />
        ))}
        <style>{`
          @keyframes beam { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-100%); opacity: 0.3; } }
          @keyframes eject { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-260px); opacity: 0; } }
        `}</style>

        {/* Status overlay */}
        <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur rounded-2xl px-3 py-2 text-xs font-mono space-y-0.5">
          <div>E_فوتون = h·f = {photonE.toFixed(2)} eV</div>
          <div>دالة الشغل φ = {phi} eV</div>
          <div className={emits ? "text-green-600 font-bold" : "text-rose-500 font-bold"}>
            KE = {ke.toFixed(2)} eV {emits ? "✓ ينبعث" : "✗ لا انبعاث"}
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-4">
        <h4 className="font-display font-extrabold">💡 التأثير الكهروضوئي</h4>
        <div>
          <label className="text-xs font-bold mb-1 block">المعدن</label>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.entries(METALS).map(([k, m]) => (
              <button
                key={k}
                onClick={() => { setMetal(k); sounds.pop(); }}
                className={`text-xs py-2 rounded-xl border-2 font-bold transition-all ${metal === k ? "border-primary bg-primary/10 scale-105" : "border-border"}`}
              >
                {m.name} <span className="text-muted-foreground">φ={m.phi}</span>
              </button>
            ))}
          </div>
        </div>
        <Ctrl label="تردد الضوء" unit="×10¹⁴ Hz" value={freq} min={3} max={15} step={0.5} onChange={setFreq} />
        <Ctrl label="شدة الضوء" unit="%" value={intensity} min={10} max={100} step={5} onChange={setIntensity} />

        <button
          onClick={() => {
            sounds.success();
            onMiyarSay?.(
              emits
                ? `الفوتون يحمل طاقة كافية (h·f > φ)، فأفلت إلكترونات بطاقة حركة ${ke.toFixed(2)} eV. زيادة الشدة تزيد العدد لا الطاقة!`
                : `طاقة الفوتون أقل من دالة الشغل، لذا لا تنبعث إلكترونات مهما زادت الشدة. ارفعي التردد!`,
              emits ? "celebrate" : "encourage",
            );
          }}
          className="w-full bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow"
        >
          ماذا يحدث الآن؟
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
