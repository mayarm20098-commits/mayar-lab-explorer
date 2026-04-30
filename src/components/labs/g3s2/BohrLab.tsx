import { useState } from "react";
import { sounds } from "@/lib/sounds";

type Props = { onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void };

// Energy levels for hydrogen (eV) E_n = -13.6 / n^2
const LEVELS = [1, 2, 3, 4, 5];
function energy(n: number) { return -13.6 / (n * n); }
const H = 4.136e-15; // eV·s
const C = 3e8;

function wavelength(n1: number, n2: number) {
  // photon emitted when going from high n1 to low n2 (n1 > n2)
  const dE = energy(n1) - energy(n2); // negative for emission... use |dE|
  const E = Math.abs(dE);
  return (H * C) / E; // meters
}

function colorFor(lambdaNm: number) {
  if (lambdaNm < 380) return "#7c3aed"; // UV → violet
  if (lambdaNm < 450) return "#6366f1";
  if (lambdaNm < 495) return "#0ea5e9";
  if (lambdaNm < 570) return "#22c55e";
  if (lambdaNm < 590) return "#facc15";
  if (lambdaNm < 620) return "#f97316";
  if (lambdaNm < 750) return "#ef4444";
  return "#7f1d1d"; // IR
}

export function BohrLab({ onMiyarSay }: Props) {
  const [n, setN] = useState(1);
  const [photon, setPhoton] = useState<{ from: number; to: number; lambda: number } | null>(null);
  const [animating, setAnimating] = useState(false);

  function jump(target: number) {
    if (target === n || animating) return;
    sounds.pop();
    if (target < n) {
      // emission
      const lam = wavelength(n, target);
      setPhoton({ from: n, to: target, lambda: lam * 1e9 });
      sounds.celebrate();
      onMiyarSay?.(`انبعاث فوتون! الإلكترون انتقل من n=${n} → n=${target}، طول موجة ≈ ${(lam * 1e9).toFixed(0)} nm`, "celebrate");
    } else {
      // absorption
      onMiyarSay?.(`امتصاص! يحتاج الإلكترون طاقة لينتقل إلى مستوى أعلى ⬆️`, "thinking");
    }
    setAnimating(true);
    setTimeout(() => { setN(target); setAnimating(false); }, 600);
  }

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="relative rounded-3xl bg-gradient-deep border border-border shadow-card min-h-[460px] overflow-hidden">
        {/* Nucleus */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.7)] flex items-center justify-center text-xs font-bold text-white">+</div>
        {/* Orbits */}
        {LEVELS.map((lvl) => {
          const r = 30 + lvl * 28;
          return (
            <button
              key={lvl}
              onClick={() => jump(lvl)}
              className="absolute left-1/2 top-1/2 rounded-full border border-white/30 hover:border-primary cursor-pointer transition-colors"
              style={{ width: r * 2, height: r * 2, transform: `translate(-50%, -50%)` }}
              title={`n=${lvl} · E=${energy(lvl).toFixed(2)} eV`}
            >
              <span className="absolute -top-2 right-2 text-[10px] font-bold text-white/70 bg-deep px-1 rounded">n={lvl}</span>
            </button>
          );
        })}
        {/* Electron */}
        <div
          className="absolute left-1/2 top-1/2 w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)] transition-all duration-500"
          style={{
            transform: `translate(calc(-50% + ${30 + n * 28}px), -50%)`,
          }}
        />

        {/* Photon emission animation */}
        {photon && (
          <div
            key={photon.from + "-" + photon.to + "-" + Date.now()}
            className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full"
            style={{
              background: colorFor(photon.lambda),
              boxShadow: `0 0 14px ${colorFor(photon.lambda)}`,
              animation: "photonOut 1.2s ease-out forwards",
            }}
          />
        )}

        {/* Spectrum bar */}
        {photon && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-card/90 rounded-full px-4 py-1.5 text-xs font-mono flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: colorFor(photon.lambda) }} />
            <span>λ ≈ {photon.lambda.toFixed(0)} nm</span>
          </div>
        )}

        <style>{`
          @keyframes photonOut { from { transform: translate(-50%, -50%) scale(1); opacity: 1; } to { transform: translate(120px, -50%) scale(0.4); opacity: 0; } }
        `}</style>

        <div className="absolute top-3 right-3 bg-card/90 rounded-full px-3 py-1 text-[11px] font-bold">
          ⚛️ اضغطي على أي مدار لتحريك الإلكترون
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-4">
        <h4 className="font-display font-extrabold">⚛️ نموذج بور</h4>
        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1 font-mono">
          <div>المستوى الحالي: <b>n = {n}</b></div>
          <div>الطاقة: <b>{energy(n).toFixed(2)} eV</b></div>
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed">
          • انتقال من مستوى أعلى → أدنى = <b className="text-foreground">انبعاث فوتون</b>
          <br />
          • انتقال من مستوى أدنى → أعلى = <b className="text-foreground">امتصاص فوتون</b>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => jump(l)}
              className={`py-2 rounded-lg font-bold text-sm border-2 transition-all ${n === l ? "border-primary bg-primary/10" : "border-border"}`}
            >
              n={l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
