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

export type G2Semester = {
  id: "s1" | "s2";
  title: string;
  subtitle: string;
  emoji: string;
  enabled: boolean;
  chapters: G2Chapter[];
};

// منهج ثاني ثانوي - الفصل الدراسي الأول
export const grade2Sem1Chapters: G2Chapter[] = [
  {
    id: "g2s1-ch1",
    number: 1,
    title: "ميكانيكا الموائع",
    description: "الضغط، قاعدة باسكال، قوة الطفو، مبدأ أرخميدس",
    emoji: "🌊",
    lessons: [
      { id: "1-1", title: "الضغط في الموائع وقاعدة باسكال", lab: "g2s1-pressure", summary: "غيّري العمق وكثافة السائل وراقبي تغيّر الضغط مباشرةً" },
      { id: "1-2", title: "قوة الطفو ومبدأ أرخميدس", lab: "g2s1-buoyancy", summary: "اغمري أجساماً بكثافات مختلفة واكتشفي متى تطفو أو تغرق" },
    ],
  },
  {
    id: "g2s1-ch2",
    number: 2,
    title: "الديناميكا الحرارية",
    description: "الحرارة، درجة الحرارة، قوانين الغازات، التمدّد",
    emoji: "🔥",
    lessons: [
      { id: "2-1", title: "قانون الغاز المثالي", lab: "g2s1-gas-law", summary: "اضغطي المكبس وغيّري الحرارة وحلّلي العلاقة بين P و V و T" },
    ],
  },
  {
    id: "g2s1-ch3",
    number: 3,
    title: "الاهتزازات والحركة الدورية",
    description: "البندول البسيط، الزنبرك، الحركة التوافقية البسيطة",
    emoji: "🎯",
    lessons: [
      { id: "3-1", title: "البندول البسيط والحركة التوافقية", lab: "g2s1-pendulum", summary: "غيّري طول البندول والجاذبية وقيسي الزمن الدوري" },
    ],
  },
];

// منهج ثاني ثانوي - الفصل الدراسي الثاني
export const grade2Sem2Chapters: G2Chapter[] = [
  {
    id: "g2s2-ch1",
    number: 1,
    title: "الموجات الميكانيكية",
    description: "أنواع الموجات، الطول الموجي، التردد، السرعة",
    emoji: "🌀",
    lessons: [
      { id: "1-1", title: "خصائص الموجات وحركتها", lab: "g2s2-wave", summary: "غيّري التردد والسعة وراقبي شكل الموجة المتحركة" },
    ],
  },
  {
    id: "g2s2-ch2",
    number: 2,
    title: "الصوت",
    description: "انتشار الصوت، شدّة الصوت، تأثير دوبلر",
    emoji: "🔊",
    lessons: [
      { id: "2-1", title: "تأثير دوبلر للصوت", lab: "g2s2-doppler", summary: "حرّكي مصدر الصوت واسمعي تغيّر التردد بالنسبة للمراقب" },
    ],
  },
  {
    id: "g2s2-ch3",
    number: 3,
    title: "الضوء والمرايا",
    description: "انعكاس الضوء، المرايا المستوية والكروية، تكوّن الصور",
    emoji: "🪞",
    lessons: [
      { id: "3-1", title: "انعكاس الضوء وقوانينه", lab: "g2s2-reflection", summary: "وجّهي شعاع الليزر على المرآة وتحقّقي أن زاوية السقوط = زاوية الانعكاس" },
    ],
  },
];

export const grade2Semesters: G2Semester[] = [
  {
    id: "s1",
    title: "الفصل الدراسي الأول",
    subtitle: "3 فصول • متاح الآن",
    emoji: "📘",
    enabled: true,
    chapters: grade2Sem1Chapters,
  },
  {
    id: "s2",
    title: "الفصل الدراسي الثاني",
    subtitle: "3 فصول • متاح الآن",
    emoji: "📗",
    enabled: true,
    chapters: grade2Sem2Chapters,
  },
];

export function findG2Lesson(semesterId: string, chapterId: string, lessonId: string) {
  const semester = grade2Semesters.find((s) => s.id === semesterId);
  if (!semester) return null;
  const chapter = semester.chapters.find((c) => c.id === chapterId);
  if (!chapter) return null;
  const lesson = chapter.lessons.find((l) => l.id === lessonId);
  if (!lesson) return null;
  return { semester, chapter, lesson };
}

export function getAllG2LabIds(): string[] {
  const set = new Set<string>();
  for (const sem of grade2Semesters) {
    for (const c of sem.chapters) for (const l of c.lessons) if (l.lab) set.add(`g2:${l.lab}`);
  }
  return Array.from(set);
}
