import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { Play, RotateCcw, Target } from "lucide-react";
import { Slider } from "@/components/ui/slider";

type Props = {
  onMiyarSay?: (text: string, mood?: "happy" | "thinking" | "celebrate" | "encourage") => void;
};

const PIXELS_PER_METER = 6;

export function ProjectileLab({ onMiyarSay }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const projectileRef = useRef<Matter.Body | null>(null);
  const targetRef = useRef<Matter.Body | null>(null);
  const trailRef = useRef<{ x: number; y: number }[]>([]);

  const [angle, setAngle] = useState(45);
  const [speed, setSpeed] = useState(40); // m/s
  const [gravity, setGravity] = useState(9.8);
  const [targetDist, setTargetDist] = useState(100); // meters
  const [running, setRunning] = useState(false);
  const [hit, setHit] = useState<null | "yes" | "no">(null);
  const [maxHeight, setMaxHeight] = useState(0);

  const cannonX = 60;
  const groundYRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const w = container.clientWidth;
    const h = container.clientHeight;

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
    const render = Matter.Render.create({
      element: container,
      engine,
      options: { width: w, height: h, wireframes: false, background: "transparent" },
    });
    const runner = Matter.Runner.create();

    const groundY = h - 30;
    groundYRef.current = groundY;
    const ground = Matter.Bodies.rectangle(w / 2, groundY + 10, w * 2, 20, {
      isStatic: true,
      render: { fillStyle: "#14532d" },
    });
    Matter.Composite.add(engine.world, ground);

    engineRef.current = engine;
    renderRef.current = render;
    runnerRef.current = runner;

    Matter.Render.run(render);
    Matter.Runner.run(runner, engine);

    // Draw trail and HUD on after-render
    Matter.Events.on(render, "afterRender", () => {
      const ctx = render.context;
      // Trail
      if (trailRef.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trailRef.current[0].x, trailRef.current[0].y);
        for (let i = 1; i < trailRef.current.length; i++) {
          ctx.lineTo(trailRef.current[i].x, trailRef.current[i].y);
        }
        ctx.strokeStyle = "rgba(236, 72, 153, 0.7)";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      // Cannon
      const cannonY = groundYRef.current - 15;
      ctx.save();
      ctx.translate(cannonX, cannonY);
      ctx.rotate((-angle * Math.PI) / 180);
      ctx.fillStyle = "#1e3a8a";
      ctx.fillRect(0, -8, 40, 16);
      ctx.restore();
      ctx.beginPath();
      ctx.fillStyle = "#0f172a";
      ctx.arc(cannonX, cannonY, 16, 0, Math.PI * 2);
      ctx.fill();
    });

    spawnTarget();

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function spawnTarget() {
    const engine = engineRef.current;
    if (!engine) return;
    if (targetRef.current) Matter.Composite.remove(engine.world, targetRef.current);
    const x = cannonX + targetDist * PIXELS_PER_METER;
    const target = Matter.Bodies.rectangle(x, groundYRef.current - 25, 40, 50, {
      isStatic: true,
      isSensor: true,
      render: { fillStyle: "#dc2626", strokeStyle: "#fbbf24", lineWidth: 4 },
    });
    targetRef.current = target;
    Matter.Composite.add(engine.world, target);
  }

  // Re-spawn target when distance changes
  useEffect(() => {
    if (!running) spawnTarget();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDist]);

  function fire() {
    const engine = engineRef.current;
    if (!engine) return;
    if (projectileRef.current) {
      Matter.Composite.remove(engine.world, projectileRef.current);
      projectileRef.current = null;
    }
    trailRef.current = [];
    setHit(null);
    setMaxHeight(0);

    const ball = Matter.Bodies.circle(cannonX + 20, groundYRef.current - 25, 8, {
      restitution: 0.3,
      frictionAir: 0,
      render: { fillStyle: "#fbbf24", strokeStyle: "#ffffff", lineWidth: 2 },
    });
    projectileRef.current = ball;
    Matter.Composite.add(engine.world, ball);

    const rad = (angle * Math.PI) / 180;
    // Convert m/s to Matter velocity (px/step). At 60 fps step ≈ 1/60 s.
    const vx = (speed * Math.cos(rad) * PIXELS_PER_METER) / 60;
    const vy = -(speed * Math.sin(rad) * PIXELS_PER_METER) / 60;
    Matter.Body.setVelocity(ball, { x: vx, y: vy });

    engine.gravity.y = gravity / 9.8;
    engine.gravity.scale = 0.001 * (PIXELS_PER_METER / 18); // tuned
    setRunning(true);
    onMiyarSay?.(`أطلقتِ بزاوية ${angle}° وسرعة ${speed} م/ث. ركّزي على المسار المنحني!`, "thinking");
  }

  function reset() {
    const engine = engineRef.current;
    if (engine && projectileRef.current) {
      Matter.Composite.remove(engine.world, projectileRef.current);
      projectileRef.current = null;
    }
    trailRef.current = [];
    setRunning(false);
    setHit(null);
    setMaxHeight(0);
    spawnTarget();
  }

  // Tracking
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const tick = () => {
      const ball = projectileRef.current;
      const target = targetRef.current;
      const render = renderRef.current;
      if (ball && target && render) {
        trailRef.current.push({ x: ball.position.x, y: ball.position.y });
        if (trailRef.current.length > 200) trailRef.current.shift();

        const heightM = (groundYRef.current - 25 - ball.position.y) / PIXELS_PER_METER;
        if (heightM > maxHeight) setMaxHeight(heightM);

        // Hit detection
        const dx = ball.position.x - target.position.x;
        const dy = ball.position.y - target.position.y;
        if (Math.abs(dx) < 25 && Math.abs(dy) < 30) {
          setHit("yes");
          setRunning(false);
          onMiyarSay?.("🎯 إصابة دقيقة! أحسنتِ، تمكنتِ من الهدف!", "celebrate");
          return;
        }
        // Out of bounds / landed
        if (
          ball.position.y >= groundYRef.current - 5 ||
          ball.position.x > (render.options.width ?? 600) + 20 ||
          ball.position.x < -20
        ) {
          setHit("no");
          setRunning(false);
          onMiyarSay?.("لم تصيبي الهدف 😅 جربي تعديل الزاوية أو السرعة. تذكّري: 45° تعطي أقصى مدى!", "encourage");
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, maxHeight, onMiyarSay]);

  // Theoretical range
  const theoreticalRange = (speed ** 2 * Math.sin((2 * angle * Math.PI) / 180)) / gravity;
  const theoreticalMaxH = (speed ** 2 * Math.sin((angle * Math.PI) / 180) ** 2) / (2 * gravity);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-sky shadow-card border border-border min-h-[460px]">
        <div ref={containerRef} className="w-full h-[460px]" />
        <div className="absolute top-3 left-3 bg-deep text-deep-foreground rounded-2xl px-3 py-2 shadow-soft text-xs font-mono">
          <div>📏 المسافة للهدف: {targetDist} م</div>
          <div>⛰ أقصى ارتفاع: {maxHeight.toFixed(1)} م</div>
        </div>
        {hit === "yes" && (
          <div className="absolute top-3 right-3 bg-success text-white rounded-2xl px-4 py-2 font-bold shadow-glow animate-pop-in flex items-center gap-2">
            <Target className="h-4 w-4" /> هدف!
          </div>
        )}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          <button
            onClick={fire}
            disabled={running}
            className="bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground px-5 py-2.5 rounded-full font-bold text-sm shadow-glow flex items-center gap-2"
          >
            <Play className="h-4 w-4 fill-current" /> أطلقي
          </button>
          <button
            onClick={reset}
            className="bg-card text-foreground border border-border px-4 py-2.5 rounded-full font-bold text-sm shadow-soft flex items-center gap-2 hover:bg-muted"
          >
            <RotateCcw className="h-4 w-4" /> إعادة
          </button>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          🎯 لوحة التحكم
        </h4>

        <ControlSlider label="زاوية الإطلاق" unit="°" value={angle} min={10} max={85} step={1} onChange={setAngle} hint="جربي 45° لأقصى مدى" />
        <ControlSlider label="السرعة الابتدائية" unit="م/ث" value={speed} min={10} max={80} step={1} onChange={setSpeed} />
        <ControlSlider label="الجاذبية" unit="م/ث²" value={gravity} min={1} max={25} step={0.1} onChange={setGravity} />
        <ControlSlider label="مسافة الهدف" unit="م" value={targetDist} min={30} max={200} step={5} onChange={setTargetDist} />

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1">
          <div className="font-bold mb-1">📐 القيم النظرية:</div>
          <div className="font-mono">المدى R = {theoreticalRange.toFixed(1)} م</div>
          <div className="font-mono">أقصى ارتفاع = {theoreticalMaxH.toFixed(1)} م</div>
        </div>
      </div>
    </div>
  );
}

function ControlSlider({
  label, unit, value, min, max, step, onChange, hint,
}: {
  label: string; unit: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; hint?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-bold text-foreground">{label}</label>
        <span className="text-sm font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-md">
          {value} {unit}
        </span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} dir="ltr" />
      {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}
