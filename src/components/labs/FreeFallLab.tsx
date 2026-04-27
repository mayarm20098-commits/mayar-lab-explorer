import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

type Props = {
  onMiyarSay?: (text: string, mood?: "happy" | "thinking" | "celebrate" | "encourage") => void;
};

const PIXELS_PER_METER = 18;

export function FreeFallLab({ onMiyarSay }: Props) {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const ballRef = useRef<Matter.Body | null>(null);
  const startTimeRef = useRef<number>(0);
  const groundYRef = useRef<number>(0);
  const startYRef = useRef<number>(0);

  const [gravity, setGravity] = useState(9.8);
  const [height, setHeight] = useState(20); // meters
  const [mass, setMass] = useState(1);
  const [airResistance, setAirResistance] = useState(false);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [landed, setLanded] = useState(false);

  // Build engine
  useEffect(() => {
    if (!canvasContainerRef.current) return;
    const container = canvasContainerRef.current;
    const width = container.clientWidth;
    const heightPx = container.clientHeight;

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
    const render = Matter.Render.create({
      element: container,
      engine,
      options: {
        width,
        height: heightPx,
        wireframes: false,
        background: "transparent",
      },
    });
    const runner = Matter.Runner.create();

    // Ground
    const groundThickness = 30;
    const groundY = heightPx - groundThickness / 2 - 6;
    groundYRef.current = groundY;
    const ground = Matter.Bodies.rectangle(width / 2, groundY, width, groundThickness, {
      isStatic: true,
      render: { fillStyle: "#1e3a8a" },
    });
    Matter.Composite.add(engine.world, ground);

    engineRef.current = engine;
    renderRef.current = render;
    runnerRef.current = runner;

    Matter.Render.run(render);
    Matter.Runner.run(runner, engine);

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  // Reset ball when params change
  useEffect(() => {
    resetBall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, mass]);

  function resetBall() {
    const engine = engineRef.current;
    const render = renderRef.current;
    if (!engine || !render) return;

    if (ballRef.current) {
      Matter.Composite.remove(engine.world, ballRef.current);
      ballRef.current = null;
    }
    const width = render.options.width ?? 600;
    const startY = groundYRef.current - height * PIXELS_PER_METER - 20;
    startYRef.current = Math.max(20, startY);
    const radius = 10 + Math.min(20, mass * 4);
    const ball = Matter.Bodies.circle(width / 2, startYRef.current, radius, {
      density: mass / (Math.PI * radius * radius * 0.001),
      frictionAir: airResistance ? 0.05 : 0,
      restitution: 0.2,
      render: {
        fillStyle: "#ec4899",
        strokeStyle: "#ffffff",
        lineWidth: 3,
      },
    });
    ballRef.current = ball;
    Matter.Body.setStatic(ball, true);
    Matter.Composite.add(engine.world, ball);
    setElapsed(0);
    setVelocity(0);
    setLanded(false);
    engine.gravity.y = 0;
  }

  // Live update air resistance
  useEffect(() => {
    if (ballRef.current) {
      ballRef.current.frictionAir = airResistance ? 0.05 : 0;
    }
  }, [airResistance]);

  function start() {
    const engine = engineRef.current;
    const ball = ballRef.current;
    if (!engine || !ball) return;
    Matter.Body.setStatic(ball, false);
    Matter.Body.setVelocity(ball, { x: 0, y: 0 });
    // Matter uses scaled gravity; convert m/s² → world units
    engine.gravity.y = gravity / 9.8;
    engine.gravity.scale = 0.001;
    startTimeRef.current = performance.now();
    setRunning(true);
    setLanded(false);
    onMiyarSay?.("راقبي كيف يسقط الجسم! الجاذبية تجذبه نحو الأرض ⬇️", "thinking");
  }

  function pause() {
    setRunning(false);
    if (ballRef.current) Matter.Body.setStatic(ballRef.current, true);
  }

  function reset() {
    setRunning(false);
    resetBall();
  }

  // Tick: track elapsed and velocity, detect landing
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const tick = () => {
      const ball = ballRef.current;
      if (ball) {
        const t = (performance.now() - startTimeRef.current) / 1000;
        setElapsed(t);
        const vy = ball.velocity.y; // px per step
        // approximate m/s using world scale; show theoretical value too
        const vMs = Math.abs(vy) * 60 / PIXELS_PER_METER; // 60 ticks/s default
        setVelocity(vMs);

        if (!landed && ball.position.y >= groundYRef.current - 20) {
          setLanded(true);
          setRunning(false);
          Matter.Body.setStatic(ball, true);
          const theoreticalT = Math.sqrt((2 * height) / gravity);
          const theoreticalV = gravity * theoreticalT;
          onMiyarSay?.(
            `وصل الجسم! الزمن النظري ≈ ${theoreticalT.toFixed(2)}ث، السرعة النهائية ≈ ${theoreticalV.toFixed(1)} م/ث. لاحظي أن الكتلة لم تؤثر على زمن السقوط ✨`,
            "celebrate",
          );
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, gravity, height, landed, onMiyarSay]);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      {/* Canvas */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-sky shadow-card border border-border min-h-[460px]">
        <div ref={canvasContainerRef} className="w-full h-[460px]" />
        {/* Height marker */}
        <div className="absolute top-3 right-3 bg-card/90 backdrop-blur rounded-2xl px-3 py-2 shadow-soft text-xs font-bold text-foreground">
          ارتفاع: {height} م
        </div>
        <div className="absolute top-3 left-3 bg-deep text-deep-foreground rounded-2xl px-3 py-2 shadow-soft text-xs font-mono">
          <div>⏱ الزمن: {elapsed.toFixed(2)} ث</div>
          <div>⬇ السرعة: {velocity.toFixed(1)} م/ث</div>
        </div>
        {/* Controls overlay */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {!running ? (
            <button
              onClick={start}
              disabled={landed}
              className="bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground px-5 py-2.5 rounded-full font-bold text-sm shadow-glow flex items-center gap-2 transition-all"
            >
              <Play className="h-4 w-4 fill-current" /> ابدئي
            </button>
          ) : (
            <button
              onClick={pause}
              className="bg-deep text-deep-foreground px-5 py-2.5 rounded-full font-bold text-sm shadow-glow flex items-center gap-2"
            >
              <Pause className="h-4 w-4 fill-current" /> إيقاف
            </button>
          )}
          <button
            onClick={reset}
            className="bg-card text-foreground border border-border px-4 py-2.5 rounded-full font-bold text-sm shadow-soft flex items-center gap-2 hover:bg-muted"
          >
            <RotateCcw className="h-4 w-4" /> إعادة
          </button>
        </div>
      </div>

      {/* Dashboard */}
      <div className="rounded-3xl bg-card border border-border p-5 shadow-card space-y-5">
        <h4 className="font-display font-extrabold text-foreground flex items-center gap-2">
          🎛️ لوحة التحكم
        </h4>

        <ControlSlider
          label="الجاذبية (g)"
          unit="م/ث²"
          value={gravity}
          min={1}
          max={25}
          step={0.1}
          onChange={setGravity}
          hint="الأرض ≈ 9.8، القمر ≈ 1.6"
        />
        <ControlSlider
          label="ارتفاع السقوط"
          unit="م"
          value={height}
          min={5}
          max={50}
          step={1}
          onChange={setHeight}
        />
        <ControlSlider
          label="كتلة الجسم"
          unit="كجم"
          value={mass}
          min={0.5}
          max={10}
          step={0.5}
          onChange={setMass}
          hint="جربي: هل تؤثر الكتلة على زمن السقوط؟"
        />

        <div className="flex items-center justify-between bg-muted/50 rounded-2xl p-3">
          <div>
            <div className="text-sm font-bold text-foreground">مقاومة الهواء</div>
            <div className="text-xs text-muted-foreground">عند تفعيلها تتباطأ الكرة</div>
          </div>
          <Switch checked={airResistance} onCheckedChange={setAirResistance} />
        </div>

        <div className="rounded-2xl bg-gradient-deep text-deep-foreground p-3 text-xs space-y-1">
          <div className="font-bold mb-1">📐 المعادلات النظرية:</div>
          <div className="font-mono">t = √(2h / g) = {Math.sqrt((2 * height) / gravity).toFixed(2)} ث</div>
          <div className="font-mono">v = g × t = {(gravity * Math.sqrt((2 * height) / gravity)).toFixed(1)} م/ث</div>
        </div>
      </div>
    </div>
  );
}

function ControlSlider({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
  hint,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-bold text-foreground">{label}</label>
        <span className="text-sm font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-md">
          {value} {unit}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0])}
        dir="ltr"
      />
      {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}
