export type G2Lesson = {
  id: string;
  title: string;
  lab?: string;
  summary: string;
};

export type G2Chapter = {
  id: string;
  number: number;
  title: string;
  description: string;
  emoji: string;
  lessons: G2Lesson[];
};

// منهج ثاني ثانوي - ٦ فصول مع تجارب متعددة لكل فصل
export const grade2Chapters: G2Chapter[] = [
  {
    id: "g2-ch1",
    number: 1,
    title: "الجاذبية",
    description: "قوانين كبلر، قانون نيوتن للجاذبية، انعدام الوزن، مبدأ التكافؤ",
    emoji: "🪐",
    lessons: [
      { id: "1-1", title: "قانون نيوتن للجاذبية الكونية", lab: "g2-gravity",
        summary: "غيّري كتلتي الجسمين والمسافة بينهما واحسبي قوة الجاذبية F = G·m₁·m₂/r²" },
      { id: "1-2", title: "قوانين كبلر للحركة الكوكبية", lab: "g2-kepler",
        summary: "اكتشفي العلاقة بين نصف المحور وزمن الدوران T² ∝ a³" },
      { id: "1-3", title: "انعدام الوزن والمصاعد", lab: "g2-weightless",
        summary: "غيّري تسارع المصعد وراقبي الوزن الظاهري وشرط انعدام الوزن" },
    ],
  },
  {
    id: "g2-ch2",
    number: 2,
    title: "الحركة الدورانية",
    description: "الإزاحة والسرعة والتسارع الزاوي، العزم، الاتزان",
    emoji: "🌀",
    lessons: [
      { id: "2-1", title: "الإزاحة والسرعة الزاوية", lab: "g2-angular",
        summary: "حركي جسماً في مسار دائري واكتشفي العلاقة v = ω·r" },
      { id: "2-2", title: "العزم والقوة المؤثرة", lab: "g2-rotation",
        summary: "غيّري ذراع العزم وراقبي العلاقة τ = r · F" },
      { id: "2-3", title: "اتزان الميزان والعزوم", lab: "g2-equilibrium",
        summary: "حقّقي اتزان الميزان عبر تساوي العزوم على الجانبين" },
    ],
  },
  {
    id: "g2-ch3",
    number: 3,
    title: "الزخم وحفظه",
    description: "الزخم، الدفع-الزخم، التصادمات المرنة وغير المرنة وحفظ الزخم",
    emoji: "🎱",
    lessons: [
      { id: "3-1", title: "الزخم وحفظه", lab: "g2-momentum",
        summary: "حاكي تصادم كرتين وتحقّقي من حفظ الزخم في النظام المعزول" },
      { id: "3-2", title: "الدفع وتغير الزخم", lab: "g2-impulse",
        summary: "غيّري القوة وزمن التأثير وراقبي J = F·Δt = ΔP" },
      { id: "3-3", title: "أنواع التصادمات", lab: "g2-collision-type",
        summary: "قارني بين التصادم المرن وغير المرن وحفظ KE" },
    ],
  },
  {
    id: "g2-ch4",
    number: 4,
    title: "الشغل والآلات البسيطة",
    description: "الشغل، القدرة، الآلات البسيطة، البكرات، الفائدة الميكانيكية والكفاءة",
    emoji: "⚙️",
    lessons: [
      { id: "4-1", title: "الشغل والقدرة", lab: "g2-work-power",
        summary: "احسبي الشغل بزوايا مختلفة والقدرة الناتجة W = F·d·cos(θ)" },
      { id: "4-2", title: "الآلات البسيطة", lab: "g2-machines",
        summary: "جرّبي الرافعة وقارني بين MA و IMA والكفاءة" },
      { id: "4-3", title: "البكرات المركبة", lab: "g2-pulley",
        summary: "غيّري عدد الحبال الداعمة لتقليل قوة الجهد المطلوبة" },
    ],
  },
  {
    id: "g2-ch5",
    number: 5,
    title: "الطاقة وحفظها",
    description: "طاقة الوضع، الطاقة الحركية، طاقة الزنبرك، حفظ الطاقة الميكانيكية",
    emoji: "🎢",
    lessons: [
      { id: "5-1", title: "حفظ الطاقة الميكانيكية", lab: "g2-energy",
        summary: "أسقطي الكرة وراقبي تحوّل PE إلى KE مع بقاء المجموع ثابتاً" },
      { id: "5-2", title: "طاقة الوضع المرنة (الزنبرك)", lab: "g2-spring",
        summary: "اضغطي الزنبرك واطلقيه وراقبي PE = ½·k·x²" },
      { id: "5-3", title: "الأفعوانية وتحوّل الطاقة", lab: "g2-coaster",
        summary: "اضبطي ارتفاع البداية وراقبي تبادل الطاقة على المسار" },
    ],
  },
  {
    id: "g2-ch6",
    number: 6,
    title: "الطاقة الحرارية",
    description: "درجة الحرارة، الحرارة النوعية، التمدد الحراري، تغيرات الحالة",
    emoji: "🔥",
    lessons: [
      { id: "6-1", title: "الحرارة النوعية", lab: "g2-heat",
        summary: "سخّني مواد مختلفة واحسبي Q = m·C·ΔT" },
      { id: "6-2", title: "التمدد الحراري", lab: "g2-expansion",
        summary: "اختاري المادة واكتشفي مقدار التمدد ΔL = α·L₀·ΔT" },
      { id: "6-3", title: "تغيرات الحالة", lab: "g2-phase",
        summary: "حوّلي الجليد إلى بخار وراقبي الحرارة الكامنة Q = m·L" },
    ],
  },
];

export function findG2Lesson(chapterId: string, lessonId: string) {
  const chapter = grade2Chapters.find((c) => c.id === chapterId);
  if (!chapter) return null;
  const lesson = chapter.lessons.find((l) => l.id === lessonId);
  if (!lesson) return null;
  return { chapter, lesson };
}

export function getAllG2LabIds(): string[] {
  const set = new Set<string>();
  for (const c of grade2Chapters) for (const l of c.lessons) if (l.lab) set.add(`g2:${l.lab}`);
  return Array.from(set);
}
