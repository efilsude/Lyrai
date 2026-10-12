// Deterministic, rule-based demo engine. Swap `analyzeProfile` for an LLM call later.
export type TargetId = "aselsan-pm" | "tech-ds";
export type Priority = "Yüksek" | "Orta" | "Düşük";

export interface Skill {
  id: string;
  name: string;
  category: string;
  weight: number; // score points
  keywords: string[];
  priority: Priority;
  why: string;
}

export interface Target {
  id: TargetId;
  company: string;
  title: string;
  short: string;
  description: string;
  skills: Skill[];
  atsKeywords: string[];
}

export const TARGETS: Record<TargetId, Target> = {
  "aselsan-pm": {
    id: "aselsan-pm",
    company: "ASELSAN",
    title: "Proje Yöneticisi",
    short: "Savunma sanayiinde çok disiplinli projeleri planla ve yönet.",
    description:
      "Mühendislik ekiplerini koordine eden, takvim-bütçe-risk yönetimini üstlenen ve paydaşlarla iletişimi yürüten rol.",
    atsKeywords: ["proje yönetimi", "risk yönetimi", "PMP", "Agile", "Scrum", "paydaş yönetimi", "MS Project", "sistem mühendisliği", "bütçe", "raporlama", "İngilizce", "takım liderliği"],
    skills: [
      { id: "pm-method", name: "Proje Yönetimi Metodolojileri (PMBOK, Waterfall)", category: "Yönetim", weight: 9, keywords: ["proje yönetimi", "pmbok", "waterfall", "pmp", "capm"], priority: "Yüksek", why: "ASELSAN projeleri faz kapılı, dokümantasyon ağırlıklı yürür; PMBOK bilgisi mülakatlarda doğrudan sorulur." },
      { id: "agile", name: "Agile / Scrum", category: "Yönetim", weight: 6, keywords: ["agile", "scrum", "kanban", "çevik"], priority: "Orta", why: "Yazılım yoğun alt sistemlerde hibrit çevik yaklaşımlar giderek yaygınlaşıyor." },
      { id: "risk", name: "Risk ve Bütçe Yönetimi", category: "Yönetim", weight: 8, keywords: ["risk", "bütçe", "maliyet", "earned value"], priority: "Yüksek", why: "Savunma projelerinde maliyet ve takvim sapmaları kritik; risk kaydı tutabilmek beklenen bir yetkinlik." },
      { id: "tools", name: "MS Project / Jira / Primavera", category: "Araçlar", weight: 5, keywords: ["ms project", "jira", "primavera", "trello", "asana"], priority: "Orta", why: "Gantt planlama ve iş takibi araçları günlük iş akışının parçası." },
      { id: "excel", name: "İleri Excel ve Raporlama", category: "Araçlar", weight: 5, keywords: ["excel", "power bi", "raporlama", "pivot"], priority: "Orta", why: "Yönetime durum raporu ve KPI sunumu sık yapılır." },
      { id: "syseng", name: "Sistem Mühendisliği Temelleri", category: "Teknik", weight: 7, keywords: ["sistem mühendisliği", "gereksinim", "v-model", "matlab", "elektronik", "gömülü"], priority: "Yüksek", why: "Teknik ekiplerle ortak dil kurmak için gereksinim yönetimi ve V-model bilgisi fark yaratır." },
      { id: "english", name: "İleri İngilizce (B2+)", category: "İletişim", weight: 6, keywords: ["ingilizce", "english", "ielts", "toefl", "yds", "b2", "c1"], priority: "Yüksek", why: "Uluslararası ortaklı projeler ve teknik dokümanlar İngilizce yürütülür." },
      { id: "leadership", name: "Takım Liderliği ve Paydaş İletişimi", category: "İletişim", weight: 7, keywords: ["liderlik", "kulüp", "başkan", "koordinatör", "aiesec", "takım", "organizasyon"], priority: "Yüksek", why: "Proje yöneticisi yetkiyle değil etkiyle yönetir; öğrenci kulübü liderliği somut kanıt sunar." },
    ],
  },
  "tech-ds": {
    id: "tech-ds",
    company: "Teknoloji Şirketi",
    title: "Veri Bilimci",
    short: "Veriden içgörü çıkar, makine öğrenmesi modelleri geliştir.",
    description:
      "Ürün ve iş ekipleri için veri analizi yapan, tahmin modelleri kuran ve sonuçları anlaşılır şekilde sunan rol.",
    atsKeywords: ["Python", "SQL", "makine öğrenmesi", "pandas", "scikit-learn", "istatistik", "A/B testi", "veri görselleştirme", "TensorFlow", "Git", "Tableau", "İngilizce"],
    skills: [
      { id: "python", name: "Python (pandas, NumPy)", category: "Programlama", weight: 9, keywords: ["python", "pandas", "numpy"], priority: "Yüksek", why: "Veri bilimi ilanlarının neredeyse tamamında temel gereklilik." },
      { id: "sql", name: "SQL ve Veri Tabanları", category: "Programlama", weight: 8, keywords: ["sql", "postgresql", "mysql", "veritabanı", "bigquery"], priority: "Yüksek", why: "Gerçek iş verisi tablolarda yaşar; teknik mülakatlarda SQL sorusu standarttır." },
      { id: "stats", name: "İstatistik ve Olasılık", category: "Matematik", weight: 8, keywords: ["istatistik", "olasılık", "hipotez", "regresyon", "a/b"], priority: "Yüksek", why: "Model sonuçlarını doğru yorumlamak ve A/B testleri tasarlamak için şart." },
      { id: "ml", name: "Makine Öğrenmesi (scikit-learn)", category: "Modelleme", weight: 9, keywords: ["makine öğrenmesi", "machine learning", "scikit", "sklearn", "xgboost", "model"], priority: "Yüksek", why: "Rolün çekirdek beklentisi: sınıflandırma, regresyon, model değerlendirme." },
      { id: "dl", name: "Derin Öğrenme (TensorFlow/PyTorch)", category: "Modelleme", weight: 5, keywords: ["derin öğrenme", "deep learning", "tensorflow", "pytorch", "keras", "nlp"], priority: "Düşük", why: "Her pozisyonda zorunlu değil ama NLP/görüntü projelerinde artı puan." },
      { id: "viz", name: "Veri Görselleştirme (Tableau, Power BI)", category: "İletişim", weight: 5, keywords: ["tableau", "power bi", "matplotlib", "seaborn", "görselleştirme", "dashboard"], priority: "Orta", why: "İçgörüyü teknik olmayan paydaşlara aktarmanın en etkili yolu." },
      { id: "git", name: "Git ve Yazılım Pratikleri", category: "Araçlar", weight: 4, keywords: ["git", "github", "docker"], priority: "Orta", why: "Ekip içinde kod paylaşımı ve tekrarlanabilir analiz için gerekli." },
      { id: "english", name: "Teknik İngilizce", category: "İletişim", weight: 5, keywords: ["ingilizce", "english", "ielts", "toefl", "yds", "b2", "c1"], priority: "Orta", why: "Dokümantasyon, makaleler ve global ekiplerle çalışma İngilizce yürür." },
    ],
  },
};

export interface Profile {
  name: string;
  university: string;
  department: string;
  year: string;
  skills: string;
  projects: string;
  certificates: string;
  volunteering: string;
  international: string;
  gpa?: string;
  languageLevel?: string;
}

export const DEMO_PROFILE: Profile = {
  name: "Zeynep Yılmaz",
  university: "Orta Doğu Teknik Üniversitesi",
  department: "Endüstri Mühendisliği",
  year: "3. sınıf",
  skills: "Excel, Python, SQL, İngilizce (B2), Jira, takım çalışması",
  projects: "Üretim hattı darboğaz analizi bitirme ön projesi; IEEE kulübü etkinlik planlama",
  certificates: "Google Proje Yönetimi Temelleri (Coursera)",
  volunteering: "AIESEC Ankara — Organizasyon Koordinatörü",
  international: "",
  gpa: "3.42",
  languageLevel: "B2 (IELTS 6.5)",
};

export const EMPTY_PROFILE: Profile = {
  name: "",
  university: "",
  department: "",
  year: "",
  skills: "",
  projects: "",
  certificates: "",
  volunteering: "",
  international: "",
  gpa: "",
  languageLevel: "",
};

export interface SkillResult extends Skill { has: boolean }
export interface Analysis {
  score: number;
  skills: SkillResult[];
  strengths: SkillResult[];
  missing: SkillResult[];
  bonuses: { label: string; points: number }[];
  categories: { name: string; pct: number }[];
}

const BASE = 18;

export function analyzeProfile(profile: Profile, targetId: TargetId): Analysis {
  const target = TARGETS[targetId];
  const text = Object.values(profile).join(" ").toLocaleLowerCase("tr-TR");
  const skills = target.skills.map((s) => ({ ...s, has: s.keywords.some((k) => text.includes(k.toLocaleLowerCase("tr-TR"))) }));
  const bonuses: { label: string; points: number }[] = [];
  if (profile.projects.trim()) bonuses.push({ label: "Proje deneyimi", points: 6 });
  if (profile.certificates.trim()) bonuses.push({ label: "Sertifika", points: 4 });
  if (profile.volunteering.trim()) bonuses.push({ label: "Gönüllülük", points: 4 });
  if (profile.international.trim()) bonuses.push({ label: "Uluslararası deneyim", points: 5 });
  const skillPts = skills.filter((s) => s.has).reduce((a, s) => a + s.weight, 0);
  const score = Math.min(97, BASE + skillPts + bonuses.reduce((a, b) => a + b.points, 0));
  const cats = Array.from(new Set(skills.map((s) => s.category)));
  const categories = cats.map((name) => {
    const inCat = skills.filter((s) => s.category === name);
    const tot = inCat.reduce((a, s) => a + s.weight, 0);
    const got = inCat.filter((s) => s.has).reduce((a, s) => a + s.weight, 0);
    return { name, pct: Math.round((got / tot) * 100) };
  });
  const order: Record<Priority, number> = { Yüksek: 0, Orta: 1, Düşük: 2 };
  return {
    score,
    skills,
    strengths: skills.filter((s) => s.has),
    missing: skills.filter((s) => !s.has).sort((a, b) => order[a.priority] - order[b.priority]),
    bonuses,
    categories,
  };
}

export interface Task {
  id: string;
  phase: string;
  title: string;
  type: "Beceri" | "Proje" | "Sertifika" | "Gönüllülük" | "Uluslararası";
  duration: string;
  priority: Priority;
  why: string;
  points: number;
  source?: "career" | "erasmus";
  meta?: string;
}

const LEARN: Record<string, { title: string; duration: string }> = {
  "pm-method": { title: "Google Proje Yönetimi sertifikasını tamamla, ardından CAPM sınavına hazırlan", duration: "8 hafta" },
  agile: { title: "Scrum.org PSM I içeriğini çalış ve bir kulüp projesini sprintlerle yönet", duration: "3 hafta" },
  risk: { title: "Bir örnek proje için risk kaydı ve kazanılmış değer (EVM) tablosu hazırla", duration: "2 hafta" },
  tools: { title: "MS Project ile 6 aylık bir proje Gantt planı oluştur", duration: "1 hafta" },
  excel: { title: "İleri Excel + Power BI ile KPI paneli hazırla", duration: "3 hafta" },
  syseng: { title: "INCOSE sistem mühendisliği giriş eğitimi ve gereksinim dokümanı çalışması", duration: "4 hafta" },
  english: { title: "IELTS/TOEFL hedef puanı için 10 haftalık çalışma planı uygula", duration: "10 hafta" },
  leadership: { title: "Öğrenci kulübünde koordinatör/başkan rolü üstlen", duration: "1 dönem" },
  python: { title: "Kaggle Python + Pandas mikro kurslarını bitir", duration: "3 hafta" },
  sql: { title: "SQL: SELECT'ten window fonksiyonlarına 50 soru çöz (LeetCode/HackerRank)", duration: "3 hafta" },
  stats: { title: "Khan Academy istatistik + bir A/B testi analiz notebook'u", duration: "4 hafta" },
  ml: { title: "Andrew Ng Machine Learning Specialization'ı tamamla", duration: "8 hafta" },
  dl: { title: "fast.ai Practical Deep Learning ilk 4 dersini bitir", duration: "4 hafta" },
  viz: { title: "Tableau Public'te 2 etkileşimli dashboard yayınla", duration: "2 hafta" },
  git: { title: "Tüm projelerini GitHub'a düzenli README'lerle taşı", duration: "1 hafta" },
};

export function buildRoadmap(analysis: Analysis, targetId: TargetId, erasmusTasks: Task[] = []): Task[] {
  const skillTasks: Task[] = analysis.missing.map((s, i) => ({
    id: `skill-${s.id}`,
    phase: i < 2 ? "0–3. Ay" : i < 4 ? "3–6. Ay" : "6–12. Ay",
    title: LEARN[s.id]?.title ?? `${s.name} becerisini geliştir`,
    type: "Beceri",
    duration: LEARN[s.id]?.duration ?? "4 hafta",
    priority: s.priority,
    why: s.why,
    points: s.weight,
    source: "career",
  }));
  const extras: Task[] =
    targetId === "aselsan-pm"
      ? [
          { id: "x-proj", phase: "3–6. Ay", title: "TEKNOFEST takımında proje planlama sorumluluğu al", type: "Proje", duration: "1 dönem", priority: "Yüksek", why: "Savunma sanayii odaklı yarışma deneyimi ASELSAN işe alımında doğrudan görünür bir referanstır.", points: 0, source: "career" },
          { id: "x-intern", phase: "6–12. Ay", title: "ASELSAN / STM / ROKETSAN yaz stajı başvurusu yap", type: "Proje", duration: "Başvuru: Şubat–Mart", priority: "Yüksek", why: "Savunma firmaları yeni mezun alımlarında stajyerlerine öncelik verir.", points: 0, source: "career" },
          { id: "x-aiesec", phase: "0–3. Ay", title: "AIESEC'te proje ekibi liderliği (OC/Team Leader) rolüne başvur", type: "Gönüllülük", duration: "6 ay", priority: "Orta", why: "Bütçe, takvim ve ekip yönetimini gerçek bir organizasyonda deneyimletir.", points: 0, source: "career" },
          { id: "x-erasmus", phase: "6–12. Ay", title: "Erasmus+ öğrenim veya staj hareketliliğine başvur", type: "Uluslararası", duration: "1 dönem", priority: "Orta", why: "Uluslararası ortaklı projelerde çok kültürlü çalışma deneyimi bir artı.", points: 0, source: "career" },
        ]
      : [
          { id: "x-proj", phase: "3–6. Ay", title: "Uçtan uca bir Kaggle projesi: EDA → model → rapor", type: "Proje", duration: "4 hafta", priority: "Yüksek", why: "Portföy projesi, veri bilimi mülakatlarında CV'den daha çok konuşulur.", points: 0, source: "career" },
          { id: "x-cert", phase: "3–6. Ay", title: "Google Data Analytics veya IBM Data Science sertifikası", type: "Sertifika", duration: "6 hafta", priority: "Orta", why: "Yapılandırılmış öğrenme ve ATS anahtar kelimesi sağlar.", points: 0, source: "career" },
          { id: "x-vol", phase: "0–3. Ay", title: "Bir STK için gönüllü veri analizi (ör. Tohum Otizm, TEGV raporları)", type: "Gönüllülük", duration: "2 ay", priority: "Orta", why: "Gerçek veriyle sosyal etki yaratan proje hem portföyü hem hikâyeni güçlendirir.", points: 0, source: "career" },
          { id: "x-erasmus", phase: "6–12. Ay", title: "Erasmus+ staj veya AIESEC Global Talent ile yurt dışı veri stajı", type: "Uluslararası", duration: "2–6 ay", priority: "Düşük", why: "Global teknoloji ekiplerinde çalışma deneyimi kazandırır.", points: 0, source: "career" },
        ];
  const all = [...skillTasks, ...extras, ...erasmusTasks];
  const phaseOrder = ["0–3. Ay", "3–6. Ay", "6–12. Ay"];
  return all.sort((a, b) => phaseOrder.indexOf(a.phase) - phaseOrder.indexOf(b.phase));
}

export function projectedScore(analysis: Analysis, extraPoints: number) {
  return Math.min(97, analysis.score + extraPoints);
}

export type LanguageLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface ErasmusUniversity {
  id: string;
  name: string;
  country: string;
  city: string;
  flag: string;
  minGpa: number;
  minLanguage: LanguageLevel;
  languageExamNote: string;
  departments: string[];
  monthlyGrant: number;
  quota: number;
  description: string;
  tags: string[];
}

export const ERASMUS_UNIVERSITIES: ErasmusUniversity[] = [
  {
    id: "tum",
    name: "TUM — Münih Teknik Üniversitesi",
    country: "Almanya",
    city: "Münih",
    flag: "🇩🇪",
    minGpa: 3.20,
    minLanguage: "C1",
    languageExamNote: "IELTS 7.0 / TOEFL 95 veya Kurum İçi C1 Sınavı",
    departments: ["Endüstri Mühendisliği", "Bilgisayar Mühendisliği", "Elektrik-Elektronik", "Makine Mühendisliği"],
    monthlyGrant: 600,
    quota: 2,
    description: "Avrupa'nın önde gelen teknik üniversitelerinden biri. İleri mühendislik ve inovasyon ekosistemi.",
    tags: ["Mühendislik", "Endüstri 4.0", "Yüksek Prestij"],
  },
  {
    id: "polimi",
    name: "Politecnico di Milano",
    country: "İtalya",
    city: "Milano",
    flag: "🇮🇹",
    minGpa: 3.00,
    minLanguage: "B2",
    languageExamNote: "IELTS 6.0 veya Üniversite B2 İngilizce Yeterlilik",
    departments: ["Endüstri Mühendisliği", "Yönetim Mühendisliği", "Tasarım", "Mimarlık", "Bilişim"],
    monthlyGrant: 600,
    quota: 3,
    description: "Tasarım, sistem modelleme ve yönetim mühendisliğinde İtalya'nın 1 numaralı teknik üniversitesi.",
    tags: ["Yönetim", "Tasarım", "Sistem Mühendisliği"],
  },
  {
    id: "tudelft",
    name: "TU Delft — Delft Teknik Üniversitesi",
    country: "Hollanda",
    city: "Delft",
    flag: "🇳🇱",
    minGpa: 3.30,
    minLanguage: "C1",
    languageExamNote: "IELTS 7.0 / TOEFL 100",
    departments: ["Veri Bilimi", "Havacılık", "Endüstri Mühendisliği", "Sistem Mühendisliği"],
    monthlyGrant: 600,
    quota: 2,
    description: "Havacılık, veri ve ileri robotik alanlarında küresel çapta tanınan öncü teknik enstitü.",
    tags: ["Veri Bilimi", "Havacılık", "Robotik"],
  },
  {
    id: "kth",
    name: "KTH Royal Institute of Technology",
    country: "İsveç",
    city: "Stockholm",
    flag: "🇸🇪",
    minGpa: 3.10,
    minLanguage: "B2",
    languageExamNote: "IELTS 6.5 / B2 Üniversite Dil Skoru",
    departments: ["Bilgisayar Mühendisliği", "Veri Bilimi", "Yapay Zeka", "Elektrik"],
    monthlyGrant: 600,
    quota: 2,
    description: "İskandinavya'nın en büyük teknik araştırma ve eğitim kurumu. Güçlü yapay zeka ve yazılım kültürü.",
    tags: ["Yapay Zeka", "Yazılım", "Sürdürülebilirlik"],
  },
  {
    id: "rwth",
    name: "RWTH Aachen University",
    country: "Almanya",
    city: "Aachen",
    flag: "🇩🇪",
    minGpa: 2.90,
    minLanguage: "B2",
    languageExamNote: "B2 İngilizce veya B2 Almanca belgesi",
    departments: ["Makine Mühendisliği", "Üretim Sistemleri", "Endüstri Mühendisliği", "Otomotiv"],
    monthlyGrant: 600,
    quota: 4,
    description: "Avrupa sanayisiyle en yoğun iş birliğine sahip teknik üniversitelerden biri. Proje tabanlı dersler.",
    tags: ["Üretim", "Sanayi İş Birliği", "Otomotiv"],
  },
  {
    id: "upm",
    name: "Universidad Politécnica de Madrid (UPM)",
    country: "İspanya",
    city: "Madrid",
    flag: "🇪🇸",
    minGpa: 2.80,
    minLanguage: "B1",
    languageExamNote: "B1 İngilizce veya B1 İspanyolca",
    departments: ["Tüm Mühendislikler", "Telekomünikasyon", "Bilişim", "Havacılık"],
    monthlyGrant: 550,
    quota: 4,
    description: "Geniş ders kataloğu ve esnek kredi transferi ile uluslararası öğrenciler için erişilebilir partner.",
    tags: ["Geniş Kontenjan", "Esnek Eşleşme", "Akdeniz"],
  },
];

export const LANG_RANKS: Record<LanguageLevel, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

export function parseGpa(val?: string): number {
  if (!val) return 0;
  const cleaned = val.replace(",", ".").match(/\d+(\.\d+)?/);
  return cleaned ? parseFloat(cleaned[0]) : 0;
}

export function parseLanguageLevel(val?: string): LanguageLevel {
  if (!val) return "B1";
  const upper = val.toUpperCase();
  if (upper.includes("C2")) return "C2";
  if (upper.includes("C1")) return "C1";
  if (upper.includes("B2")) return "B2";
  if (upper.includes("B1")) return "B1";
  if (upper.includes("A2")) return "A2";
  if (upper.includes("A1")) return "A1";
  return "B1";
}

export function calcErasmusScore(gpa: number, langScore: number): number {
  // Ulusal Ajans standart formülü: %50 Not Ortalaması (100'lük sistemde) + %50 Dil Sınavı Puanı
  const gpa100 = Math.min(100, Math.max(0, (gpa / 4.0) * 100));
  const normalizedLang = Math.min(100, Math.max(0, langScore));
  return Math.round((gpa100 * 0.5) + (normalizedLang * 0.5));
}

export function generateErasmusTasks(uni: ErasmusUniversity, userGpa: number, userLang: LanguageLevel): Task[] {
  const tasks: Task[] = [];
  const gpaGap = Number((uni.minGpa - userGpa).toFixed(2));
  const langRankGap = LANG_RANKS[uni.minLanguage] - LANG_RANKS[userLang];

  if (gpaGap > 0) {
    tasks.push({
      id: `erasmus-gpa-${uni.id}`,
      phase: "0–3. Ay",
      title: `Akademik ortalamanı (GPA) ${uni.minGpa.toFixed(2)} üzerine çıkar (Dönem derslerine odaklan)`,
      type: "Uluslararası",
      duration: "1 dönem",
      priority: "Yüksek",
      why: `${uni.name} asgari ${uni.minGpa.toFixed(2)} GPA barajı talep ediyor; mevcut ortalaman (${userGpa > 0 ? userGpa.toFixed(2) : "belirtilmemiş"}) hedefin ${gpaGap.toFixed(2)} puan gerisinde.`,
      points: 5,
      source: "erasmus",
      meta: uni.name,
    });
  }

  if (langRankGap > 0) {
    tasks.push({
      id: `erasmus-lang-${uni.id}`,
      phase: "0–3. Ay",
      title: `Yabancı dil seviyeni ${uni.minLanguage} düzeyine yükselt (${uni.languageExamNote})`,
      type: "Uluslararası",
      duration: "8–10 hafta",
      priority: "Yüksek",
      why: `${uni.name} partner kurum şartı olarak asgari ${uni.minLanguage} seviyesi (${uni.languageExamNote}) istemektedir.`,
      points: 6,
      source: "erasmus",
      meta: uni.name,
    });
  }

  tasks.push({
    id: `erasmus-la-${uni.id}`,
    phase: "3–6. Ay",
    title: `${uni.name} için Ders Saydırma (Learning Agreement) protokolünü bölüm koordinatörüyle hazırla`,
    type: "Uluslararası",
    duration: "2 hafta",
    priority: "Orta",
    why: "Dönem kaybı yaşamamak ve ECTS (AKTS) kredi aktarımını güvenceye almak için gitmeden önce koordinatör onayı şarttır.",
    points: 4,
    source: "erasmus",
    meta: uni.name,
  });

  tasks.push({
    id: `erasmus-cv-${uni.id}`,
    phase: "0–3. Ay",
    title: "Europass formatında İngilizce CV ve Akademik Niyet Mektubu (Motivation Letter) hazırla",
    type: "Sertifika",
    duration: "1 hafta",
    priority: "Yüksek",
    why: "Partner üniversite kabul ofisine sunulacak aday portföyünde niyet mektubunun kalitesi seçilme şansını doğrudan artırır.",
    points: 3,
    source: "erasmus",
    meta: uni.name,
  });

  tasks.push({
    id: `erasmus-grant-${uni.id}`,
    phase: "6–12. Ay",
    title: `Ulusal Ajans Erasmus+ hibe sözleşmesini (${uni.monthlyGrant}€/ay) ve vize başvuru evraklarını tamamla`,
    type: "Uluslararası",
    duration: "3 hafta",
    priority: "Yüksek",
    why: `Kabul belgesi sonrası aylık ${uni.monthlyGrant}€ Erasmus+ bursunun bağlanması ve vize onayı için zorunlu süreçtir.`,
    points: 4,
    source: "erasmus",
    meta: uni.name,
  });

  return tasks;
}
