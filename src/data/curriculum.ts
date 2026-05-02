export type Lesson = {
  id: string;
  title: string;
  /** which lab simulation, if any, is attached. Use any string lab key. */
  lab?: string;
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
      { id: "1-1", title: "الرياضيات والفيزياء", lab: "unit-converter", summary: "محوّل وحدات تفاعلي مع الترميز العلمي" },
      { id: "1-2", title: "القياس", lab: "measurement", summary: "تجربة الدقة والضبط بالمسطرة والميزان" },
    ],
  },
  {
    id: "ch2",
    number: 2,
    title: "تمثيل الحركة",
    description: "تصوير الحركة، الموقع والزمن، السرعة",
    emoji: "🏃‍♀️",
    lessons: [
      { id: "2-1", title: "تصوير الحركة", lab: "motion-diagram", summary: "مخططات حركة بفترات زمنية متساوية" },
      { id: "2-2", title: "الموقع والزمن", lab: "position-time", summary: "بناء منحنى الموقع/الزمن" },
      { id: "2-3", title: "السرعة المتوسطة واللحظية", lab: "velocity", summary: "تحليل السرعة المتوسطة واللحظية ومنحنى السرعة/الزمن" },
    ],
  },
  {
    id: "ch3",
    number: 3,
    title: "الحركة المتسارعة",
    description: "التسارع، الحركة بتسارع ثابت، السقوط الحر",
    emoji: "🚀",
    lessons: [
      { id: "3-1", title: "التسارع والحركة بتسارع ثابت", lab: "acceleration", summary: "غيّري التسارع وراقبي تغيّر السرعة والموقع مع الزمن" },
      { id: "3-2", title: "السقوط الحر", lab: "free-fall", summary: "تجربة محاكاة السقوط تحت تأثير الجاذبية" },
    ],
  },
  {
    id: "ch4",
    number: 4,
    title: "القوى في بُعد واحد",
    description: "القوة والحركة، قوانين نيوتن، التأثر المتبادل",
    emoji: "⚖️",
    lessons: [
      { id: "4-1", title: "قوانين نيوتن (F = ma)", lab: "newton-second", summary: "غيّري القوة والكتلة وراقبي التسارع" },
      { id: "4-2", title: "قوى التأثر المتبادل", lab: "action-reaction", summary: "محاكاة الفعل ورد الفعل" },
    ],
  },
  {
    id: "ch5",
    number: 5,
    title: "القوى في بُعدين",
    description: "المتجهات، الاحتكاك، القوة في بُعدين",
    emoji: "🧲",
    lessons: [
      { id: "5-1", title: "المتجهات", lab: "vectors", summary: "جامع متجهات تفاعلي بصرياً" },
      { id: "5-2", title: "الاحتكاك", lab: "friction", summary: "أنواع الاحتكاك ومعاملاته" },
      { id: "5-3", title: "القوة والحركة في بُعدين", lab: "incline", summary: "تحليل القوى على المنحدر" },
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
      { id: "6-2", title: "الحركة الدائرية", lab: "circular", summary: "السرعة الزاوية والقوة المركزية" },
      { id: "6-3", title: "السرعة النسبية", lab: "relative-velocity", summary: "الحركة بالنسبة لمراجع مختلفة" },
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

/** Total number of unique labs across grade 1 (used for progress %) */
export function getAllGrade1LabIds(): string[] {
  const set = new Set<string>();
  for (const c of grade1Chapters) for (const l of c.lessons) if (l.lab) set.add(`g1:${l.lab}`);
  return Array.from(set);
}
