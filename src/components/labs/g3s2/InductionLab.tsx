import { useEffect, useRef, useState } from "react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

export function InductionLab({ onMiyarSay }: Props) {
  const [magnetY, setMagnetY] = useState(20);
  const [emf, setEmf] = useState(0);
  const lastY = useRef(20);
  const lastT = useRef(performance.now());
  const dragging = useRef(false);

  // emf ~ -dΦ/dt  → simulated by speed when near coil center (50%)
  useEffect(() => {
    const id = setInterval(() => {
      const now = performance.now();
      const dt = (now - lastT.current) / 1000;
      const dy = magnetY - lastY.current;
      const dist = Math.abs(magnetY - 50);
      const factor = Math.exp(-dist / 15); // strongest near center
      const newEmf = dt > 0 ? -(dy / dt) * factor * 0.6 : 0;
      setEmf(newEmf);
      lastY.current = magnetY;
      lastT.current = now;
    }, 60);
    return () => clearInterval(id);
  }, [magnetY]);

  function onPointerDown() { dragging.current = true; sounds.pop(); }
  function onPointerUp() { dragging.current = false; }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMagnetY(Math.max(5, Math.min(95, y)));
  }

  const direction = emf > 0.05 ? "→" : emf < -0.05 ? "←" : "—";
  const intensity = Math.min(1, Math.abs(emf) * 1.2);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div
        className="relative rounded-3xl bg-gradient-sky border border-border shadow-card min-h-[460px] overflow-hidden touch-none select-none"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* Coil */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-32 flex flex-col gap-1 items-center justify-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-full h-3 border-2 border-amber-700 rounded-full" />
          ))}
        </div>
        {/* Galvanometer */}
        <div className="absolute bottom-4 right-4 bg-card border-2 border-deep rounded-2xl p-3 shadow-deep w-36">
          <div className="text-[10px] text-muted-foreground mb-1 text-center">جلفانومتر</div>
          <div className="relative h-16">
            <div className="absolute bottom-0 left-1/2 w-1 bg-muted h-full" />
            <div
              className="absolute bottom-0 left-1/2 w-1 origin-bottom bg-primary transition-transform"
              style={{ height: "100%", transform: `translateX(-50%) rotate(${Math.max(-60, Math.min(60, emf * 80))}deg)` }}
            />
            <div className="absolute bottom-0 left-0 right-0 text-center text-[10px] text-muted-foreground">−   0   +</div>
          </div>
          <div className="text-xs font-mono text-center mt-1">EMF: {emf.toFixed(2)} V {direction}</div>
        </div>

        {/* Magnet (draggable) */}
        <div
          onPointerDown={onPointerDown}
          className="absolute left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing"
          style={{ top: `${magnetY}%`, transform: `translate(-50%, -50%)` }}
        >
          <div className="w-14 h-24 flex flex-col shadow-deep rounded-md overflow-hidden border-2 border-deep">
            <div className="flex-1 bg-rose-600 flex items-center justify-center text-white font-extrabold text-lg">N</div>
            <div className="flex-1 bg-blue-600 flex items-center justify-center text-white font-extrabold text-lg">S</div>
          </div>
        </div>

        {/* Induced field flash */}
        {intensity > 0.1 && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(56,189,248,${intensity * 0.3}) 0%, transparent 40%)`,
            }}
          />
        )}

        <div className="absolute top-3 right-3 bg-card/90 rounded-full px-3 py-1 text-[11px] font-bold">
          🖐️ اسحبي المغناطيس داخل وخارج الملف
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-4">
        <h4 className="font-display font-extrabold">🔄 قانون فاراداي</h4>
        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>EMF = −N · dΦ/dt</div>
          <div>القوة الدافعة المستحثة تتولد عند تغيّر التدفق المغناطيسي.</div>
        </div>
        <ul className="text-xs text-muted-foreground space-y-2 leading-relaxed">
          <li>• حركي المغناطيس بسرعة → EMF أكبر</li>
          <li>• اعكسي اتجاه الحركة → ينعكس اتجاه التيار</li>
          <li>• توقفي → EMF = 0 رغم وجود المغناطيس</li>
        </ul>
        <button
          onClick={() => { sounds.success(); onMiyarSay?.("الحركة فقط هي ما يولّد التيار! إذا توقف المغناطيس داخل الملف لا يوجد تيار. هذا قانون لنز ⚡", "celebrate"); }}
          className="w-full bg-primary text-primary-foreground rounded-full py-2 font-bold text-sm shadow-glow"
        >
          فسّري النتيجة
        </button>
      </div>
    </div>
  );
}
