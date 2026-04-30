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
import { OhmLab } from "./g3s2/OhmLab";
import { ResistorColorLab } from "./g3s2/ResistorColorLab";
import { SeriesParallelLab } from "./g3s2/SeriesParallelLab";
import { MagneticFieldLab } from "./g3s2/MagneticFieldLab";
import { InductionLab } from "./g3s2/InductionLab";
import { TransformerLab } from "./g3s2/TransformerLab";
import { PhotoelectricLab } from "./g3s2/PhotoelectricLab";
import { BohrLab } from "./g3s2/BohrLab";
import { SemiconductorLab } from "./g3s2/SemiconductorLab";
import { HalfLifeLab } from "./g3s2/HalfLifeLab";

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

  // ===== ثالث ثانوي - الفصل الدراسي الثاني =====
  "g3s2-ohm": {
    title: "قانون أوم والدائرة الكهربائية",
    goal: "اكتشفي العلاقة بين الجهد V والمقاومة R وشدة التيار I من خلال دائرة تفاعلية.",
    conclusion: "V = I × R\nزيادة الجهد ترفع التيار، وزيادة المقاومة تخفّضه.\nالقدرة P = V × I.",
    Component: OhmLab,
  },
  "g3s2-resistor-color": {
    title: "ألوان المقاومات وقراءتها",
    goal: "تعرّفي على الترميز اللوني للمقاومات (4 حلقات) واحسبي قيمة المقاومة بنفسك.",
    conclusion: "كل لون يمثل رقماً (0-9). الحلقتان الأوليان أرقام، والثالثة معامل ضرب (10^n)، والرابعة دقّة الصنع.",
    Component: ResistorColorLab,
  },
  "g3s2-series-parallel": {
    title: "دوائر التوالي والتوازي",
    goal: "قارني بين توصيل المقاومات على التوالي والتوازي وتأثير ذلك على إضاءة المصابيح.",
    conclusion: "توالي: R_eq = R1 + R2 (تيار ثابت).\nتوازي: 1/R_eq = 1/R1 + 1/R2 (جهد ثابت).",
    Component: SeriesParallelLab,
  },
  "g3s2-magnetic-field": {
    title: "المجال المغناطيسي وخطوطه",
    goal: "اسحبي البوصلات حول مغناطيس واكتشفي اتجاه خطوط المجال من N إلى S.",
    conclusion: "خطوط المجال تخرج من القطب الشمالي وتدخل القطب الجنوبي.\nاتجاه إبرة البوصلة = اتجاه المجال في تلك النقطة.",
    Component: MagneticFieldLab,
  },
  "g3s2-induction": {
    title: "الحث الكهرومغناطيسي",
    goal: "حركي المغناطيس داخل الملف وراقبي توليد القوة الدافعة الكهربائية.",
    conclusion: "EMF = −N · dΦ/dt (قانون فاراداي).\nاتجاه التيار المستحث يعارض التغيّر (قانون لنز).",
    Component: InductionLab,
  },
  "g3s2-transformer": {
    title: "المحوّل الكهربائي",
    goal: "غيّري عدد لفّات الملفّين الابتدائي والثانوي وراقبي تغيّر الجهد الناتج.",
    conclusion: "Vs/Vp = Ns/Np\nمحوّل رافع: Ns > Np. خافض: Ns < Np.",
    Component: TransformerLab,
  },
  "g3s2-photoelectric": {
    title: "التأثير الكهروضوئي",
    goal: "سلّطي ضوءاً بترددات وشدّات مختلفة واكتشفي شرط انبعاث الإلكترونات.",
    conclusion: "KE = h·f − φ.\nيجب أن تكون h·f > φ للانبعاث.\nزيادة الشدة تزيد عدد الإلكترونات لا طاقتها.",
    Component: PhotoelectricLab,
  },
  "g3s2-bohr": {
    title: "نموذج بور وأطياف الذرة",
    goal: "حركي الإلكترون بين مستويات الطاقة وشاهدي الفوتون المنبعث وطول موجته.",
    conclusion: "E_n = −13.6/n² eV\nانتقال الإلكترون من n عالٍ إلى منخفض ⇒ انبعاث فوتون بطول موجة محدّد.",
    Component: BohrLab,
  },
  "g3s2-semiconductor": {
    title: "الثنائي وأشباه الموصلات",
    goal: "اختبري توصيل الثنائي في الانحياز الأمامي والعكسي.",
    conclusion: "الثنائي يوصّل التيار في اتجاه واحد فقط بعد تجاوز جهد العتبة (~0.7V للسيليكون).",
    Component: SemiconductorLab,
  },
  "g3s2-half-life": {
    title: "النشاط الإشعاعي وعمر النصف",
    goal: "حاكِي تحلّل عينة مشعة وارسمي منحنى التحلّل.",
    conclusion: "N(t) = N₀ · (½)^(t/T½)\nفي كل عمر نصف يتحلل نصف ما تبقى عشوائياً.",
    Component: HalfLifeLab,
  },
};
