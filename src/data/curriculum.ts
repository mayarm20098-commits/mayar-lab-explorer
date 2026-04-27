export type Lesson = {
  id: string;
  title: string;
  /** which lab simulation, if any, is attached */
  lab?: "free-fall" | "projectile";
  summary: string;
};

export type Chapter = {
  id: string;
  number: number;
  title: string;
  description: string;
  emoji: string;
  lessons: Lesson[];
};

export const grade1Chapters: Chapter[] = [
  {
    id: "ch1",
    number: 1,
    title: "مدخل إلى علم الفيزياء",
    description: "الرياضيات والفيزياء، والقياس",
    emoji: "📐",
    lessons: [
      { id: "1-1", title: "الرياضيات والفيزياء", summary: "أساسيات الترميز العلمي والوحدات" },
      { id: "1-2", title: "القياس", summary: "الدقة والضبط وعرض البيانات" },
    ],
  },
  {
    id: "ch2",
    number: 2,
    title: "تمثيل الحركة",
    description: "تصوير الحركة، الموقع والزمن، السرعة",
    emoji: "🏃‍♀️",
    lessons: [
      { id: "2-1", title: "تصوير الحركة", summary: "المخططات الزمنية والمتجهات" },
      { id: "2-2", title: "الموقع والزمن", summary: "الإزاحة وتحديد الموقع" },
      { id: "2-3", title: "منحنى الموقع/الزمن", summary: "قراءة المنحنيات وتحليلها" },
      { id: "2-4", title: "السرعة", summary: "السرعة المتوسطة واللحظية" },
    ],
  },
  {
    id: "ch3",
    number: 3,
    title: "الحركة المتسارعة",
    description: "التسارع، الحركة بتسارع ثابت، السقوط الحر",
    emoji: "🚀",
    lessons: [
      { id: "3-1", title: "التسارع", summary: "تعريف التسارع وحسابه" },
      { id: "3-2", title: "الحركة بتسارع ثابت", summary: "معادلات الحركة الأساسية" },
      { id: "3-3", title: "السقوط الحر", lab: "free-fall", summary: "تجربة محاكاة السقوط تحت تأثير الجاذبية" },
    ],
  },
  {
    id: "ch4",
    number: 4,
    title: "القوى في بُعد واحد",
    description: "القوة والحركة، قوانين نيوتن، التأثر المتبادل",
    emoji: "⚖️",
    lessons: [
      { id: "4-1", title: "القوة والحركة", summary: "العلاقة بين القوة وحركة الأجسام" },
      { id: "4-2", title: "قوانين نيوتن", summary: "القوانين الثلاثة وتطبيقاتها" },
      { id: "4-3", title: "قوى التأثر المتبادل", summary: "الفعل ورد الفعل" },
    ],
  },
  {
    id: "ch5",
    number: 5,
    title: "القوى في بُعدين",
    description: "المتجهات، الاحتكاك، القوة في بُعدين",
    emoji: "🧲",
    lessons: [
      { id: "5-1", title: "المتجهات", summary: "جمع المتجهات وتحليلها" },
      { id: "5-2", title: "الاحتكاك", summary: "أنواع الاحتكاك ومعاملاته" },
      { id: "5-3", title: "القوة والحركة في بُعدين", summary: "تحليل القوى على المنحدر" },
    ],
  },
  {
    id: "ch6",
    number: 6,
    title: "الحركة في بُعدين",
    description: "حركة المقذوف، الحركة الدائرية، السرعة النسبية",
    emoji: "🎯",
    lessons: [
      { id: "6-1", title: "حركة المقذوف", lab: "projectile", summary: "تجربة محاكاة المدفع وإصابة الهدف" },
      { id: "6-2", title: "الحركة الدائرية", summary: "السرعة الزاوية والقوة المركزية" },
      { id: "6-3", title: "السرعة النسبية", summary: "الحركة بالنسبة لمراجع مختلفة" },
    ],
  },
];

export function findLesson(chapterId: string, lessonId: string) {
  const chapter = grade1Chapters.find((c) => c.id === chapterId);
  if (!chapter) return null;
  const lesson = chapter.lessons.find((l) => l.id === lessonId);
  if (!lesson) return null;
  return { chapter, lesson };
}
