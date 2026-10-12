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
};

export const EMPTY_PROFILE: Profile = { name: "", university: "", department: "", year: "", skills: "", projects: "", certificates: "", volunteering: "", international: "" };

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

export function buildRoadmap(analysis: Analysis, targetId: TargetId): Task[] {
  const skillTasks: Task[] = analysis.missing.map((s, i) => ({
    id: `skill-${s.id}`,
    phase: i < 2 ? "0–3. Ay" : i < 4 ? "3–6. Ay" : "6–12. Ay",
    title: LEARN[s.id]?.title ?? `${s.name} becerisini geliştir`,
    type: "Beceri",
    duration: LEARN[s.id]?.duration ?? "4 hafta",
    priority: s.priority,
    why: s.why,
    points: s.weight,
  }));
  const extras: Task[] =
    targetId === "aselsan-pm"
      ? [
          { id: "x-proj", phase: "3–6. Ay", title: "TEKNOFEST takımında proje planlama sorumluluğu al", type: "Proje", duration: "1 dönem", priority: "Yüksek", why: "Savunma sanayii odaklı yarışma deneyimi ASELSAN işe alımında doğrudan görünür bir referanstır.", points: 0 },
          { id: "x-intern", phase: "6–12. Ay", title: "ASELSAN / STM / ROKETSAN yaz stajı başvurusu yap", type: "Proje", duration: "Başvuru: Şubat–Mart", priority: "Yüksek", why: "Savunma firmaları yeni mezun alımlarında stajyerlerine öncelik verir.", points: 0 },
          { id: "x-aiesec", phase: "0–3. Ay", title: "AIESEC'te proje ekibi liderliği (OC/Team Leader) rolüne başvur", type: "Gönüllülük", duration: "6 ay", priority: "Orta", why: "Bütçe, takvim ve ekip yönetimini gerçek bir organizasyonda deneyimletir.", points: 0 },
          { id: "x-erasmus", phase: "6–12. Ay", title: "Erasmus+ öğrenim veya staj hareketliliğine başvur", type: "Uluslararası", duration: "1 dönem", priority: "Orta", why: "Uluslararası ortaklı projelerde çok kültürlü çalışma deneyimi bir artı.", points: 0 },
        ]
      : [
          { id: "x-proj", phase: "3–6. Ay", title: "Uçtan uca bir Kaggle projesi: EDA → model → rapor", type: "Proje", duration: "4 hafta", priority: "Yüksek", why: "Portföy projesi, veri bilimi mülakatlarında CV'den daha çok konuşulur.", points: 0 },
          { id: "x-cert", phase: "3–6. Ay", title: "Google Data Analytics veya IBM Data Science sertifikası", type: "Sertifika", duration: "6 hafta", priority: "Orta", why: "Yapılandırılmış öğrenme ve ATS anahtar kelimesi sağlar.", points: 0 },
          { id: "x-vol", phase: "0–3. Ay", title: "Bir STK için gönüllü veri analizi (ör. Tohum Otizm, TEGV raporları)", type: "Gönüllülük", duration: "2 ay", priority: "Orta", why: "Gerçek veriyle sosyal etki yaratan proje hem portföyü hem hikâyeni güçlendirir.", points: 0 },
          { id: "x-erasmus", phase: "6–12. Ay", title: "Erasmus+ staj veya AIESEC Global Talent ile yurt dışı veri stajı", type: "Uluslararası", duration: "2–6 ay", priority: "Düşük", why: "Global teknoloji ekiplerinde çalışma deneyimi kazandırır.", points: 0 },
        ];
  const all = [...skillTasks, ...extras];
  const phaseOrder = ["0–3. Ay", "3–6. Ay", "6–12. Ay"];
  return all.sort((a, b) => phaseOrder.indexOf(a.phase) - phaseOrder.indexOf(b.phase));
}

export function projectedScore(analysis: Analysis, extraPoints: number) {
  return Math.min(97, analysis.score + extraPoints);
}
