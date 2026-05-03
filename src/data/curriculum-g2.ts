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

// منهج ثاني ثانوي - الفصل الدراسي الأول (3 فصول)
export const grade2Sem1Chapters: G2Chapter[] = [
  {
    id: "g2-ch1",
    number: 1,
    title: "الجاذبية",
    description: "قوانين كبلر، قانون نيوتن للجاذبية، انعدام الوزن، مبدأ التكافؤ",
    emoji: "🪐",
    lessons: [
      {
        id: "1-1",
        title: "قانون نيوتن للجاذبية الكونية",
        lab: "g2-gravity",
        summary: "غيّري كتلتي الجسمين والمسافة بينهما واحسبي قوة الجاذبية F = G·m₁·m₂/r²",
      },
    ],
  },
  {
    id: "g2-ch2",
    number: 2,
    title: "الحركة الدورانية",
    description: "الإزاحة والسرعة والتسارع الزاوي، العزم، الاتزان",
    emoji: "🌀",
    lessons: [
      {
        id: "2-1",
        title: "الحركة الدورانية والعزم",
        lab: "g2-rotation",
        summary: "غيّري نقطة تأثير القوة وذراع العزم وراقبي الدوران τ = r · F",
      },
    ],
  },
  {
    id: "g2-ch3",
    number: 3,
    title: "الزخم وحفظه",
    description: "الزخم، نظرية الدفع-الزخم، التصادمات وحفظ الزخم",
    emoji: "🎱",
    lessons: [
      {
        id: "3-1",
        title: "الزخم والتصادمات",
        lab: "g2-momentum",
        summary: "حاكي تصادم كرتين بسرعتين وكتلتين مختلفتين وتحقّقي من حفظ الزخم",
      },
    ],
  },
];

// منهج ثاني ثانوي - الفصل الدراسي الثاني (3 فصول)
export const grade2Sem2Chapters: G2Chapter[] = [
  {
    id: "g2-ch4",
    number: 4,
    title: "الشغل والطاقة والآلات البسيطة",
    description: "الشغل، الطاقة الحركية، الآلات البسيطة، الفائدة الميكانيكية والكفاءة",
    emoji: "⚙️",
    lessons: [
      {
        id: "4-1",
        title: "الآلات البسيطة والفائدة الميكانيكية",
        lab: "g2-machines",
        summary: "جرّبي الرافعة والبكرة وغيّري المسافات وقارني MA و IMA والكفاءة",
      },
    ],
  },
  {
    id: "g2-ch5",
    number: 5,
    title: "الطاقة وحفظها",
    description: "طاقة الوضع، الطاقة الحركية، حفظ الطاقة الميكانيكية، التصادمات",
    emoji: "🎢",
    lessons: [
      {
        id: "5-1",
        title: "حفظ الطاقة الميكانيكية",
        lab: "g2-energy",
        summary: "أسقطي الكرة من ارتفاعات مختلفة وراقبي تحوّل PE إلى KE مع بقاء المجموع ثابتاً",
      },
    ],
  },
  {
    id: "g2-ch6",
    number: 6,
    title: "الطاقة الحرارية",
    description: "درجة الحرارة، الحرارة النوعية، الانتقال الحراري، الانتروبي",
    emoji: "🔥",
    lessons: [
      {
        id: "6-1",
        title: "الحرارة والحرارة النوعية",
        lab: "g2-heat",
        summary: "سخّني مواد مختلفة واحسبي كمية الحرارة Q = m·C·ΔT",
      },
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
