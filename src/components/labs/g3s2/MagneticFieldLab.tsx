import { useState } from "react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

type Compass = { id: number; x: number; y: number };

export function MagneticFieldLab({ onMiyarSay }: Props) {
  const [polarity, setPolarity] = useState<"NS" | "SN">("NS");
  const [showField, setShowField] = useState(true);
  const [compasses, setCompasses] = useState<Compass[]>([
    { id: 1, x: 30, y: 30 },
    { id: 2, x: 70, y: 30 },
    { id: 3, x: 50, y: 70 },
  ]);
  const [dragging, setDragging] = useState<number | null>(null);

  const magnetX = 50;
  const magnetY = 50;
  // North pole at left half if NS, else right
  const northX = polarity === "NS" ? magnetX - 12 : magnetX + 12;
  const southX = polarity === "NS" ? magnetX + 12 : magnetX - 12;

  function angleAt(x: number, y: number): number {
    // Simple dipole field approximation
    const dxN = x - northX, dyN = y - magnetY;
    const dxS = x - southX, dyS = y - magnetY;
    const rN = Math.max(2, Math.hypot(dxN, dyN));
    const rS = Math.max(2, Math.hypot(dxS, dyS));
    // Field from N points away, into S points inward
    const fx = dxN / (rN ** 3) - dxS / (rS ** 3);
    const fy = dyN / (rN ** 3) - dyS / (rS ** 3);
    return Math.atan2(fy, fx) * (180 / Math.PI);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (dragging == null) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCompasses((prev) => prev.map((c) => (c.id === dragging ? { ...c, x: clamp(x), y: clamp(y) } : c)));
  }

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div
        className="relative rounded-3xl bg-gradient-sky border border-border shadow-card min-h-[460px] overflow-hidden touch-none select-none"
        onPointerMove={onPointerMove}
        onPointerUp={() => setDragging(null)}
      >
        {/* Field lines */}
        {showField && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {[15, 25, 35, 45, 55, 65, 75, 85].map((y) => {
              // Curve between two poles
              const d = `M ${northX} ${magnetY} C ${northX - 20} ${y}, ${southX + 20} ${y}, ${southX} ${magnetY}`;
              const dMirror = `M ${northX} ${magnetY} C ${northX - 20} ${100 - y}, ${southX + 20} ${100 - y}, ${southX} ${magnetY}`;
              return (
                <g key={y} stroke="hsl(var(--primary))" strokeWidth="0.3" fill="none" opacity="0.5">
                  <path d={d} />
                  <path d={dMirror} />
                </g>
              );
            })}
          </svg>
        )}

        {/* Magnet bar */}
        <div className="absolute" style={{ left: `${magnetX - 16}%`, top: `${magnetY - 5}%`, width: "32%", height: "10%" }}>
          <div className="w-full h-full flex shadow-deep rounded-md overflow-hidden border-2 border-deep">
            <div className={`w-1/2 flex items-center justify-center font-display font-extrabold text-white text-lg ${polarity === "NS" ? "bg-rose-600" : "bg-blue-600"}`}>
              {polarity === "NS" ? "N" : "S"}
            </div>
            <div className={`w-1/2 flex items-center justify-center font-display font-extrabold text-white text-lg ${polarity === "NS" ? "bg-blue-600" : "bg-rose-600"}`}>
              {polarity === "NS" ? "S" : "N"}
            </div>
          </div>
        </div>

        {/* Compasses */}
        {compasses.map((c) => {
          const ang = angleAt(c.x, c.y);
          return (
            <div
              key={c.id}
              onPointerDown={(e) => { e.preventDefault(); setDragging(c.id); sounds.pop(); }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            >
              <div className="w-12 h-12 rounded-full bg-card border-2 border-deep shadow-soft flex items-center justify-center relative">
                <div className="w-1 h-9 origin-center" style={{ transform: `rotate(${ang + 90}deg)` }}>
                  <div className="w-1 h-1/2 bg-rose-600 mx-auto rounded-t-full" />
                  <div className="w-1 h-1/2 bg-blue-600 mx-auto rounded-b-full" />
                </div>
                <div className="absolute -top-2 text-[8px] font-bold text-rose-600">N</div>
              </div>
            </div>
          );
        })}

        <div className="absolute bottom-3 right-3 bg-card/90 rounded-full px-3 py-1.5 text-[10px] text-muted-foreground">
          اسحبي البوصلات وراقبي اتجاهها
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-4">
        <h4 className="font-display font-extrabold">🧲 المغناطيس</h4>
        <button
          onClick={() => { setPolarity((p) => (p === "NS" ? "SN" : "NS")); sounds.click(); }}
          className="w-full bg-secondary border-2 border-border hover:border-primary rounded-2xl py-3 font-bold text-sm transition-colors"
        >
          🔄 اقلبي القطبية
        </button>
        <label className="flex items-center justify-between bg-muted/50 rounded-2xl p-3 cursor-pointer">
          <span className="text-sm font-bold">إظهار خطوط المجال</span>
          <input type="checkbox" checked={showField} onChange={(e) => setShowField(e.target.checked)} />
        </label>
        <button
          onClick={() => { sounds.pop(); setCompasses((p) => [...p, { id: Date.now(), x: 50, y: 50 }]); }}
          className="w-full bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow"
        >
          ➕ أضيفي بوصلة
        </button>
        <button
          onClick={() => { sounds.success(); onMiyarSay?.("الإبرة المغناطيسية تتجه دائماً مع خطوط المجال من N إلى S 🧭", "celebrate"); }}
          className="w-full text-xs text-primary underline"
        >
          ما الذي يحدث؟
        </button>
      </div>
    </div>
  );
}

function clamp(v: number) { return Math.max(0, Math.min(100, v)); }
