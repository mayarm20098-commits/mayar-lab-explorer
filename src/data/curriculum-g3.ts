export type G3Lesson = {
  id: string;
  title: string;
  lab?: string; // key into labRegistry (without prefix)
  summary: string;
};

export type G3Chapter = {
  id: string;
  number: number;
  title: string;
  description: string;
  emoji: string;
  lessons: G3Lesson[];
};

export type G3Semester = {
  id: "s1" | "s2";
  title: string;
  subtitle: string;
  emoji: string;
  enabled: boolean;
  chapters: G3Chapter[];
};

// ===== الفصل الدراسي الأول (السعودي 2026) =====
// الاهتزازات والموجات • الصوت • الضوء (انعكاس/مرايا • انكسار/عدسات • تداخل وحيود) • الكهرباء الساكنة (كولوم • مجال • سعة)
export const grade3Sem1Chapters: G3Chapter[] = [
  {
    id: "g3s1-ch1",
    number: 1,
    title: "الاهتزازات والموجات",
    description: "الحركة التوافقية البسيطة، البندول، خصائص الموجات",
    emoji: "🌊",
    lessons: [
      { id: "1-1", title: "البندول البسيط والحركة التوافقية", lab: "g3s1-pendulum", summary: "غيّري طول البندول والجاذبية واكتشفي علاقة الزمن الدوري T = 2π√(L/g)" },
    ],
  },
  {
    id: "g3s1-ch2",
    number: 2,
    title: "الصوت",
    description: "موجات الصوت، شدته، أثر دوبلر",
    emoji: "🔊",
    lessons: [
      { id: "2-1", title: "خصائص الصوت وأثر دوبلر", lab: "g3s1-sound", summary: "حركي مصدراً صوتياً وراقبي تغيّر التردد المسموع عند الراصد" },
    ],
  },
  {
    id: "g3s1-ch3",
    number: 3,
    title: "انعكاس الضوء والمرايا",
    description: "قانون الانعكاس، المرايا المستوية والكروية",
    emoji: "🪞",
    lessons: [
      { id: "3-1", title: "انعكاس الضوء", lab: "g3s1-reflection", summary: "غيّري زاوية السقوط وتحقّقي من قانون θᵢ = θᵣ" },
      { id: "3-2", title: "المرايا الكروية وتكوين الصور", lab: "g3s1-mirror", summary: "حرّكي الجسم أمام مرآة مقعّرة/محدّبة وتتبّعي أشعة الصورة" },
    ],
  },
  {
    id: "g3s1-ch4",
    number: 4,
    title: "انكسار الضوء والعدسات",
    description: "قانون سنل، الانعكاس الكلي الداخلي، العدسات",
    emoji: "🔍",
    lessons: [
      { id: "4-1", title: "انكسار الضوء وقانون سنل", lab: "g3s1-refraction", summary: "اضبطي معاملي الانكسار واكتشفي الزاوية الحرجة والانعكاس الكلي" },
      { id: "4-2", title: "العدسات الرقيقة وتكوين الصور", lab: "g3s1-lens", summary: "حركي الجسم أمام عدسة محدّبة/مقعّرة وتتبّعي مسار الأشعة" },
    ],
  },
  {
    id: "g3s1-ch5",
    number: 5,
    title: "التداخل والحيود",
    description: "تجربة يونغ، الهدب الضوئية، خصائص موجية للضوء",
    emoji: "✨",
    lessons: [
      { id: "5-1", title: "تجربة يونغ للشقّين", lab: "g3s1-diffraction", summary: "غيّري الطول الموجي والمسافة بين الشقوق وراقبي تباعد الهدب" },
    ],
  },
  {
    id: "g3s1-ch6",
    number: 6,
    title: "الكهرباء الساكنة",
    description: "الشحنة، قانون كولوم، المجال الكهربائي، السعة",
    emoji: "⚡",
    lessons: [
      { id: "6-1", title: "قانون كولوم", lab: "g3s1-coulomb", summary: "غيّري الشحنتين والمسافة وشاهدي قوة التجاذب/التنافر" },
      { id: "6-2", title: "المجال الكهربائي وخطوطه", lab: "g3s1-field", summary: "ارسمي خطوط المجال حول شحنة موجبة وسالبة" },
      { id: "6-3", title: "السعة الكهربائية والمكثّفات", lab: "g3s1-capacitor", summary: "غيّري مساحة اللوحين والمسافة وثابت العزل لحساب C و Q و U" },
    ],
  },
];

// منهج ثالث ثانوي - الفصل الدراسي الثاني (السعودي 2026)
export const grade3Sem2Chapters: G3Chapter[] = [
  {
    id: "g3s2-ch1",
    number: 1,
    title: "الكهرباء التيارية",
    description: "التيار الكهربائي، فرق الجهد، قانون أوم، المقاومة",
    emoji: "⚡",
    lessons: [
      { id: "1-1", title: "التيار الكهربائي وفرق الجهد", lab: "g3s2-ohm", summary: "ابني دائرة وغيّري الجهد والمقاومة لاكتشاف قانون أوم تفاعلياً" },
      { id: "1-2", title: "قانون أوم والمقاومة", lab: "g3s2-resistor-color", summary: "تعرّفي على ألوان المقاومات واحسبي قيمتها بالسحب التفاعلي" },
    ],
  },
  {
    id: "g3s2-ch2",
    number: 2,
    title: "دوائر التوالي والتوازي",
    description: "تركيب المقاومات، توزع التيار والجهد",
    emoji: "🔌",
    lessons: [
      { id: "2-1", title: "دوائر التوالي والتوازي", lab: "g3s2-series-parallel", summary: "بدّلي بين توصيل التوالي والتوازي وشاهدي تأثير ذلك على شدّة المصابيح" },
    ],
  },
  {
    id: "g3s2-ch3",
    number: 3,
    title: "المجالات المغناطيسية",
    description: "المغناطيس، خطوط المجال، قاعدة اليد اليمنى",
    emoji: "🧲",
    lessons: [
      { id: "3-1", title: "المغناطيسات والمجال المغناطيسي", lab: "g3s2-magnetic-field", summary: "حرّكي بوصلات حول مغناطيس وارسمي خطوط المجال بنفسك" },
    ],
  },
  {
    id: "g3s2-ch4",
    number: 4,
    title: "الحث الكهرومغناطيسي",
    description: "قانون فاراداي، قانون لنز، التيار المستحث",
    emoji: "🔄",
    lessons: [
      { id: "4-1", title: "الحث الكهرومغناطيسي وقانون فاراداي", lab: "g3s2-induction", summary: "حرّكي المغناطيس داخل الملف وراقبي توليد التيار الكهربائي مباشرةً" },
    ],
  },
  {
    id: "g3s2-ch5",
    number: 5,
    title: "الكهرومغناطيسية",
    description: "التيار المتردد، المحوّلات، الموجات الكهرومغناطيسية",
    emoji: "📡",
    lessons: [
      { id: "5-1", title: "المحوّل الكهربائي والتيار المتردد", lab: "g3s2-transformer", summary: "غيّري عدد لفّات الملف الابتدائي والثانوي وحلّلي الجهد الناتج" },
    ],
  },
  {
    id: "g3s2-ch6",
    number: 6,
    title: "نظرية الكم",
    description: "إشعاع الجسم الأسود، الفوتون، التأثير الكهروضوئي",
    emoji: "💡",
    lessons: [
      { id: "6-1", title: "التأثير الكهروضوئي", lab: "g3s2-photoelectric", summary: "سلّطي ضوءاً بترددات مختلفة على معدن وراقبي إفلات الإلكترونات" },
    ],
  },
  {
    id: "g3s2-ch7",
    number: 7,
    title: "الذرة",
    description: "نموذج بور، طيف الهيدروجين، انتقال الإلكترونات",
    emoji: "⚛️",
    lessons: [
      { id: "7-1", title: "نموذج بور للذرة وأطياف الانبعاث", lab: "g3s2-bohr", summary: "حرّكي الإلكترون بين مستويات الطاقة وشاهدي الفوتون المنبعث" },
    ],
  },
  {
    id: "g3s2-ch8",
    number: 8,
    title: "إلكترونات الحالة الصلبة",
    description: "الموصلات وأشباه الموصلات، الثنائي، الترانزستور",
    emoji: "🔋",
    lessons: [
      { id: "8-1", title: "أشباه الموصلات والثنائي", lab: "g3s2-semiconductor", summary: "افحصي توصيل الثنائي في اتجاهين وشاهدي خاصية تيار الانحياز" },
    ],
  },
  {
    id: "g3s2-ch9",
    number: 9,
    title: "الفيزياء النووية",
    description: "النواة، النشاط الإشعاعي، عمر النصف، الانشطار والاندماج",
    emoji: "☢️",
    lessons: [
      { id: "9-1", title: "النشاط الإشعاعي وعمر النصف", lab: "g3s2-half-life", summary: "حاكِ تحلل عينة مشعة وارسمي منحنى التحلل عبر الزمن" },
    ],
  },
];

export const grade3Semesters: G3Semester[] = [
  {
    id: "s1",
    title: "الفصل الدراسي الأول",
    subtitle: "6 فصول • متاح الآن",
    emoji: "📘",
    enabled: true,
    chapters: grade3Sem1Chapters,
  },
  {
    id: "s2",
    title: "الفصل الدراسي الثاني",
    subtitle: "9 فصول • متاح الآن",
    emoji: "📗",
    enabled: true,
    chapters: grade3Sem2Chapters,
  },
];

export function findG3S2Lesson(chapterId: string, lessonId: string) {
  const chapter = grade3Sem2Chapters.find((c) => c.id === chapterId);
  if (!chapter) return null;
  const lesson = chapter.lessons.find((l) => l.id === lessonId);
  if (!lesson) return null;
  return { chapter, lesson };
}

export function findG3S1Lesson(chapterId: string, lessonId: string) {
  const chapter = grade3Sem1Chapters.find((c) => c.id === chapterId);
  if (!chapter) return null;
  const lesson = chapter.lessons.find((l) => l.id === lessonId);
  if (!lesson) return null;
  return { chapter, lesson };
}

export function findG3Lesson(semesterId: string, chapterId: string, lessonId: string) {
  if (semesterId === "s1") return findG3S1Lesson(chapterId, lessonId);
  if (semesterId === "s2") return findG3S2Lesson(chapterId, lessonId);
  return null;
}

export function getAllG3S2LabIds(): string[] {
  const set = new Set<string>();
  for (const c of grade3Sem2Chapters) for (const l of c.lessons) if (l.lab) set.add(`g3s2:${l.lab}`);
  return Array.from(set);
}
