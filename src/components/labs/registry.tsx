import type { ComponentType } from "react";
import { FreeFallLab } from "./FreeFallLab";
import { ProjectileLab } from "./ProjectileLab";
import { UnitConverterLab } from "./UnitConverterLab";
import { MeasurementLab } from "./MeasurementLab";
import { MotionDiagramLab } from "./MotionDiagramLab";
import { PositionTimeLab } from "./PositionTimeLab";
import { VelocityLab } from "./VelocityLab";
import { AccelerationLab } from "./AccelerationLab";
import { NewtonSecondLab } from "./NewtonSecondLab";
import { ActionReactionLab } from "./ActionReactionLab";
import { VectorsLab } from "./VectorsLab";
import { FrictionLab } from "./FrictionLab";
import { InclineLab } from "./InclineLab";
import { CircularLab } from "./CircularLab";
import { RelativeVelocityLab } from "./RelativeVelocityLab";

type LabMeta = {
  title: string;
  goal: string;
  conclusion: string;
  Component: ComponentType<{ onMiyarSay?: (t: string, m?: "happy" | "thinking" | "celebrate" | "encourage") => void }>;
};

export const labRegistry: Record<string, LabMeta> = {
  "free-fall": {
    title: "السقوط الحر",
    goal: "اكتشفي كيف تؤثر الجاذبية على الأجسام، وأن الكتلة لا تغيّر زمن السقوط بدون مقاومة الهواء.",
    conclusion: "تسارع الأجسام في السقوط الحر = g (≈9.8 م/ث²).\n• h = ½ g t²\n• v = g t",
    Component: FreeFallLab,
  },
  projectile: {
    title: "حركة المقذوف",
    goal: "أصيبي الهدف! اكتشفي تأثير الزاوية والسرعة على المسار.",
    conclusion: "حركة المقذوف = أفقية ثابتة + رأسية متسارعة.\nالمدى الأقصى عند زاوية 45°.",
    Component: ProjectileLab,
  },
  "unit-converter": {
    title: "محوّل الوحدات والترميز العلمي",
    goal: "تدرّبي على تحويل الوحدات في النظام الدولي SI واستخدام الترميز العلمي.",
    conclusion: "كل وحدة لها معامل تحويل إلى الوحدة الأساسية. الترميز العلمي يبسّط الأعداد الكبيرة والصغيرة جداً.",
    Component: UnitConverterLab,
  },
  measurement: {
    title: "الدقة والضبط في القياس",
    goal: "كرّري قياس طول القلم لاحظي الفرق بين الدقة والضبط.",
    conclusion: "الدقة = القرب من القيمة الحقيقية. الضبط = اتساق القراءات.\nمتوسط عدة قراءات يقلل الخطأ العشوائي.",
    Component: MeasurementLab,
  },
  "motion-diagram": {
    title: "مخطط الحركة",
    goal: "ارسمي حركة جسم بفترات زمنية متساوية وحلّلي تباعد النقاط.",
    conclusion: "نقاط متباعدة بانتظام = سرعة ثابتة.\nنقاط متباعدة أكثر فأكثر = تسارع.",
    Component: MotionDiagramLab,
  },
  "position-time": {
    title: "منحنى الموقع/الزمن",
    goal: "حلّلي ميل المنحنى لتعرفي السرعة.",
    conclusion: "ميل منحنى الموقع/الزمن = السرعة.\nخط أفقي = جسم ساكن. ميل سالب = حركة معاكسة.",
    Component: PositionTimeLab,
  },
  velocity: {
    title: "السرعة المتوسطة واللحظية",
    goal: "حرّكي السيارة وراقبي السرعة المتوسطة.",
    conclusion: "v = d/t. السرعة كمية متجهة (مقدار + اتجاه).",
    Component: VelocityLab,
  },
  acceleration: {
    title: "التسارع والحركة بتسارع ثابت",
    goal: "غيّري التسارع وراقبي تغير السرعة والموقع مع الزمن.",
    conclusion: "v = v₀ + a·t\nx = v₀·t + ½·a·t²\nالتسارع السالب = تباطؤ.",
    Component: AccelerationLab,
  },
  "newton-second": {
    title: "قانون نيوتن الثاني (F=ma)",
    goal: "غيّري القوة والكتلة وراقبي تأثيرهما على التسارع.",
    conclusion: "F = m × a. التسارع يتناسب طرداً مع القوة، عكسياً مع الكتلة.",
    Component: NewtonSecondLab,
  },
  "action-reaction": {
    title: "الفعل ورد الفعل",
    goal: "ادفعي الجدار وراقبي القوتين المتساويتين والمتعاكستين.",
    conclusion: "كل فعل له رد فعل مساوٍ في المقدار ومعاكس في الاتجاه. القوتان تؤثران على جسمين مختلفين.",
    Component: ActionReactionLab,
  },
  vectors: {
    title: "جامع المتجهات",
    goal: "اجمعي متجهين بصرياً واحسبي محصلتهما وزاويتهما.",
    conclusion: "محصلة متجهين متعامدين: |R| = √(A² + B²).\nالزاوية: θ = tan⁻¹(Aᵧ/Aₓ).",
    Component: VectorsLab,
  },
  friction: {
    title: "قوى الاحتكاك",
    goal: "غيّري معامل الاحتكاك واكتشفي متى يبدأ الجسم بالحركة.",
    conclusion: "f = μ × N. الاحتكاك السكوني أكبر من الحركي.\nالاحتكاك يعتمد على القوة العمودية ونوع السطحين.",
    Component: FrictionLab,
  },
  incline: {
    title: "القوى على سطح مائل",
    goal: "حلّلي وزن الجسم إلى مركبتين على المنحدر.",
    conclusion: "W∥ = mg·sin(θ) (موازية للسطح)\nW⊥ = mg·cos(θ) (عمودية)\na = g·sin(θ).",
    Component: InclineLab,
  },
  circular: {
    title: "الحركة الدائرية المنتظمة",
    goal: "غيّري السرعة الزاوية ونصف القطر، وراقبي القوة المركزية.",
    conclusion: "aₒ = v²/r، Fₒ = m·v²/r.\nالقوة المركزية تتجه دائماً نحو مركز الدائرة.",
    Component: CircularLab,
  },
  "relative-velocity": {
    title: "السرعة النسبية",
    goal: "غيّري سرعة القارب والتيار، واكتشفي السرعة الفعلية.",
    conclusion: "السرعة النسبية = حاصل جمع المتجهات.\nمع التيار: v_eff = v + v_t. عكسه: v_eff = v − v_t.",
    Component: RelativeVelocityLab,
  },
};
