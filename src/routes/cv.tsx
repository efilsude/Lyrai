import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bar, Btn, Check, NeedsSetup, PageHead } from "@/components/kr";
import { useStore } from "@/lib/store";
import { TARGETS, analyzeProfile, type Profile, type TargetId } from "@/lib/career-data";

export const Route = createFileRoute("/cv")({
  head: () => ({
    meta: [
      { title: "ATS CV Optimizasyon Asistanı — KariyerRota" },
      { name: "description", content: "Anahtar kelime kapsama analizi, ATS uyumluluk göstergeleri, metrikli önce/sonra örnekleri ve optimize CV." },
      { property: "og:title", content: "ATS CV Optimizasyon Asistanı — KariyerRota" },
      { property: "og:description", content: "CV'ni hedef pozisyonun anahtar kelimelerine ve ATS kriterlerine göre güçlendir." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CvPage,
});

interface BeforeAfterItem {
  id: string;
  category: string;
  before: string;
  after: string;
  metrics: string[];
}

const BEFORE_AFTER_DATA: Record<TargetId, BeforeAfterItem[]> = {
  "aselsan-pm": [
    {
      id: "pm-1",
      category: "Organizasyon & Bütçe",
      before: "Kulüpte teknik etkinlikler düzenledim ve koordinasyon sağladım.",
      after: "IEEE bünyesinde 14 kişilik organizasyon ekibini koordine ederek 420 katılımcılı Savunma Sanayii Zirvesi'ni 55.000 TL bütçe ve 0 gün takvim sapmasıyla başarıyla tamamladım.",
      metrics: ["14 kişilik ekip", "420 katılımcı", "55.000 TL bütçe", "0 gün sapma"],
    },
    {
      id: "pm-2",
      category: "Mühendislik & Metodoloji",
      before: "Bitirme projesinde montaj hattında darboğaz analizi ve takvim yaptım.",
      after: "Savunma alt sistemi montaj hattı simülasyonunda risk matrisi ve WBS Gantt takvimi uygulayarak çevrim süresinde %18 düşüş ve 3 kritik darboğazın eliminasyonunu sağladım.",
      metrics: ["%18 çevrim süresi düşüşü", "3 darboğaz eliminasyonu", "WBS & Risk Matrisi"],
    },
    {
      id: "pm-3",
      category: "Çevik Yönetim & Araçlar",
      before: "Jira ve MS Project ile öğrenci projesinde görev takibi yaptım.",
      after: "Jira üzerinde 6 sprintlik yazılım teslimat sürecinde çevik iş kırılımı kurgulayarak takımın sprint teslim oranını (velocity) %32 artırdım ve raporlama süresini yarıya indirdim.",
      metrics: ["6 sprint", "%32 hız artışı (velocity)", "%50 raporlama tasarrufu"],
    },
    {
      id: "pm-4",
      category: "Uluslararası Takım & Liderlik",
      before: "AIESEC ekibinde takım lideri olarak çalıştım.",
      after: "AIESEC bünyesinde 8 kişilik çok kültürlü ekiple 12 farklı uluslararası stajyer eşleşmesini yöneterek 3 aylık dönem hedeflerini %115 oranında aştım.",
      metrics: ["8 kişilik ekip", "12 eşleşme", "%115 hedef başarısı"],
    },
  ],
  "tech-ds": [
    {
      id: "ds-1",
      category: "Makine Öğrenmesi & Doğruluk",
      before: "Python ile müşteri verisinde makine öğrenmesi modeli geliştirdim.",
      after: "Python (pandas, scikit-learn, XGBoost) ile 75.000 satırlık veri setinde müşteri kaybı (churn) modeli kurarak F1 skorunu 0,68'den 0,84'e çıkardım; potansiyel gelir kaybını %15 azalttım.",
      metrics: ["75.000 satır veri", "0,68 → 0,84 F1 skoru", "%15 kayıp azaltımı"],
    },
    {
      id: "ds-2",
      category: "Büyük Veri & SQL Sorgu Hızı",
      before: "SQL sorguları yazarak veritabanından kohort raporları çektim.",
      after: "PostgreSQL'de window fonksiyonları ve CTE ile 1.2M işlem kaydında 6 aylık kullanıcı tutundurma sorgularını yeniden modelledim; sorgu çalıştırma süresini 4 dakikadan 18 saniyeye indirdim.",
      metrics: ["1.2M işlem kaydı", "4 dk → 18 sn optimizasyon"],
    },
    {
      id: "ds-3",
      category: "A/B Testi & Hipotez",
      before: "Web sitesi kullanıcı kayıt akışı için A/B testi yaptık.",
      after: "Yeni kayıt akışı için 10.000+ tekil kullanıcıda çift taraflı hipotez testi (t-test) kurgulayarak dönüşüm oranında (CR) p < 0.01 istatistiksel anlamlılıkla %8.4 artış doğruladım.",
      metrics: ["10.000+ tekil kullanıcı", "p < 0.01 anlamlılık", "%8.4 dönüşüm artışı"],
    },
    {
      id: "ds-4",
      category: "İş Zekası & Otomasyon",
      before: "Tableau ile ekipler için KPI panelleri tasarladım.",
      after: "Yönetim ekibi için haftalık canlı beslenen 4 etkileşimli Tableau gösterge paneli geliştirerek operasyonel raporlama yükünü haftada 12 saat azalttım.",
      metrics: ["4 canlı KPI panosu", "Haftada 12 saat tasarruf"],
    },
  ],
};

const TIPS = [
  "Tek sütunlu, tablo, simge ve karmaşık grafik içermeyen düz bir sayfa düzeni kullan.",
  "Standart ATS başlıkları kullan: Profesyonel Özet, Eğitim, Beceriler, Projeler, Sertifikalar.",
  "Her maddeyi Güçlü Eylem Fiili + Görev Kapsamı + Sayısal/Metrik Sonuç (STAR yöntemi) ile bitir.",
  "Dosyayı düz metin içeren aranabilir PDF veya .docx olarak kaydet; taranmış görsel formatlar ATS tarafından okunamaz.",
  "İlan metninde geçen kritik teknik anahtar kelimeleri kısaltmalarıyla birlikte (örn. 'Doğal Dil İşleme (NLP)') kullan.",
];

function buildCv(p: Profile, target: TargetId, has: string[]) {
  const t = TARGETS[target];
  const line = (s: string) => s.split(/[;\n]/).map((x) => x.trim()).filter(Boolean);
  return [
    p.name || "Ad Soyad",
    `${t.title} Adayı | ${p.department || "Bölüm"} — ${p.university || "Üniversite"} (${p.year || "Sınıf"})`,
    p.gpa ? `Akademik Not Ortalaması (GPA): ${p.gpa} / 4.00` : "",
    p.languageLevel ? `Yabancı Dil Yeterliliği: ${p.languageLevel}` : "",
    "",
    "PROFESYONEL ÖZET",
    `${p.department || "Mühendislik"} öğrencisi; ${has.slice(0, 3).join(", ") || "analitik düşünme"} alanlarında deneyimli. ${t.company} ${t.title} rolüne yönelik ${t.atsKeywords.slice(0, 4).join(", ")} yetkinliklerini projeler ve uygulamalı çalışmalarla geliştirmektedir.`,
    "",
    "BECERİLER & YETKİNLİKLER",
    p.skills || "-",
    "",
    "PROJELER & UYGULAMALI ÇALIŞMALAR",
    ...(line(p.projects).length ? line(p.projects).map((x) => `• ${x}`) : ["• Henüz proje eklenmedi."]),
    "",
    "SERTİFİKALAR & EĞİTİMLER",
    ...(line(p.certificates).length ? line(p.certificates).map((x) => `• ${x}`) : ["• Henüz sertifika eklenmedi."]),
    "",
    "GÖNÜLLÜLÜK & LİDERLİK DENEYİMİ",
    ...(line(p.volunteering).length ? line(p.volunteering).map((x) => `• ${x}`) : ["• Henüz gönüllülük deneyimi eklenmedi."]),
    ...(p.international.trim() ? ["", "ULUSLARARASI DENEYİM & HAREKETLİLİK", ...line(p.international).map((x) => `• ${x}`)] : []),
  ].filter((l, idx, arr) => !(l === "" && arr[idx - 1] === "")).join("\n");
}

function CvPage() {
  const s = useStore();
  const [copiedCv, setCopiedCv] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [keywordFilter, setKeywordFilter] = useState<"all" | "missing" | "matched">("all");

  const a = useMemo(() => (s.target ? analyzeProfile(s.profile, s.target) : null), [s.profile, s.target]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!s.target || !a || !s.profile.skills.trim()) {
    return (
      <div className="px-4 py-16">
        <NeedsSetup what="CV asistanı" />
      </div>
    );
  }

  const t = TARGETS[s.target];
  const allProfileText = Object.values(s.profile).join(" ").toLocaleLowerCase("tr-TR");

  // Keyword Matching
  const kwList = t.atsKeywords.map((k) => {
    const term = k.toLocaleLowerCase("tr-TR");
    const ok = allProfileText.includes(term);
    return { k, ok };
  });

  const hitCount = kwList.filter((x) => x.ok).length;
  const kwPct = Math.round((hitCount / kwList.length) * 100);

  // ATS Scorecard calculations
  const hasMetrics = /%\d+|\d+\s*(?:TL|€|\$|kişilik|kullanıcı|satır|saat|gün|sprint)/i.test(allProfileText);
  const metricRatio = hasMetrics ? 95 : 45;
  const sectionsComplete = [s.profile.skills, s.profile.projects, s.profile.certificates, s.profile.volunteering].filter((x) => x.trim()).length;
  const sectionScore = Math.round((sectionsComplete / 4) * 100);
  const formatScore = 100; // Flat single-column text structure
  const atsReadiness = Math.round((kwPct * 0.4) + (sectionScore * 0.3) + (metricRatio * 0.15) + (formatScore * 0.15));

  const cvText = buildCv(s.profile, s.target, a.strengths.map((x) => x.name.split(" (")[0] ?? x.name));

  // Copy full CV
  const copyFullCv = async () => {
    try {
      await navigator.clipboard.writeText(cvText);
      setCopyFailed(false);
      setCopiedCv(true);
      showToast("Tüm optimize CV panoya kopyalandı.");
      setTimeout(() => setCopiedCv(false), 2000);
    } catch {
      setCopyFailed(true);
    }
  };

  // Download CV text
  const downloadTxt = () => {
    const url = URL.createObjectURL(new Blob([cvText], { type: "text/plain;charset=utf-8" }));
    const el = document.createElement("a");
    el.href = url;
    el.download = `KariyerRota_${s.profile.name ? s.profile.name.replace(/\s+/g, "_") : "Aday"}_CV.txt`;
    el.click();
    URL.revokeObjectURL(url);
    showToast("CV metin dosyası (.txt) indirildi.");
  };

  // Copy single before/after example
  const copyItemText = async (item: BeforeAfterItem) => {
    try {
      await navigator.clipboard.writeText(item.after);
      setCopiedItemId(item.id);
      showToast(`"${item.category}" örnek ifadesi panoya kopyalandı!`);
      setTimeout(() => setCopiedItemId(null), 2200);
    } catch {
      showToast("Panoya kopyalama başarısız oldu.");
    }
  };

  // Append keyword to profile skills
  const addKeywordToSkills = (keyword: string) => {
    const current = s.profile.skills.trim();
    if (current.toLocaleLowerCase("tr-TR").includes(keyword.toLocaleLowerCase("tr-TR"))) {
      showToast(`"${keyword}" zaten becerilerinde yer alıyor.`);
      return;
    }
    const updated = current ? `${current}, ${keyword}` : keyword;
    s.set({ profile: { ...s.profile, skills: updated } });
    showToast(`"${keyword}" becerilerine eklendi ve ATS skoru güncellendi!`);
  };

  // Append before/after item to profile projects
  const addExampleToProjects = (item: BeforeAfterItem) => {
    const current = s.profile.projects.trim();
    const updated = current ? `${current}\n${item.after}` : item.after;
    s.set({ profile: { ...s.profile, projects: updated } });
    showToast(`"${item.category}" ifadesi profilindeki projelere eklendi!`);
  };

  const filteredKeywords = kwList.filter((item) => {
    if (keywordFilter === "missing") return !item.ok;
    if (keywordFilter === "matched") return item.ok;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHead
        eyebrow="Adım 4"
        title="ATS CV Optimizasyon Asistanı"
        desc="CV'ni hedef pozisyonun anahtar kelimelerine göre güçlendir, ATS robotlarının filtreleme kriterlerini karşıla ve deneyimlerini metriklerle dönüştür."
      />

      {/* Floating Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-sm border border-teal/40 bg-navy px-4 py-3 text-sm text-white shadow-xl animate-in fade-in slide-in-from-bottom-3"
        >
          <span className="grid h-5 w-5 place-items-center rounded-full bg-teal text-navy text-xs font-bold">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top ATS Score Summary Bar */}
      <section aria-labelledby="ats-summary" className="mb-12 border bg-card p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-12 md:items-center">
          <div className="md:col-span-4 border-b pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-6">
            <span className="tag text-teal font-semibold">ATS Hazırlık Değerlendirmesi</span>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-display text-5xl tabular-nums leading-none">%{atsReadiness}</span>
              <span className={`text-sm font-semibold ${atsReadiness >= 75 ? "text-teal" : atsReadiness >= 50 ? "text-warning" : "text-destructive"}`}>
                {atsReadiness >= 75 ? "Güçlü ATS Uyumu" : atsReadiness >= 50 ? "Orta Düzey Uyum" : "Kritik Eksikler Var"}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Bu skor anahtar kelime sıklığı, bölüm eksiksizliği, metrik kullanımı ve biçim kurallarından ağırlıklandırılarak üretilir.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:col-span-8">
            <div className="border p-3">
              <span className="text-[0.7rem] uppercase tracking-wider text-muted-foreground">Kelime Kapsamı</span>
              <div className="mt-1 font-display text-xl tabular-nums">%{kwPct}</div>
              <div className="mt-1 text-xs text-muted-foreground">{hitCount}/{kwList.length} eşleşti</div>
            </div>
            <div className="border p-3">
              <span className="text-[0.7rem] uppercase tracking-wider text-muted-foreground">Bölüm Doluluğu</span>
              <div className="mt-1 font-display text-xl tabular-nums">%{sectionScore}</div>
              <div className="mt-1 text-xs text-muted-foreground">{sectionsComplete}/4 standart alan</div>
            </div>
            <div className="border p-3">
              <span className="text-[0.7rem] uppercase tracking-wider text-muted-foreground">Metrik Göstergesi</span>
              <div className={`mt-1 font-display text-xl tabular-nums ${hasMetrics ? "text-teal" : "text-warning"}`}>
                {hasMetrics ? "%95" : "%45"}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{hasMetrics ? "Sayısal veri var" : "Metrik eksik"}</div>
            </div>
            <div className="border p-3">
              <span className="text-[0.7rem] uppercase tracking-wider text-muted-foreground">ATS Düzeni</span>
              <div className="mt-1 font-display text-xl tabular-nums text-teal">%100</div>
              <div className="mt-1 text-xs text-muted-foreground">Tek sütun metin</div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-12">
          {/* Keyword Coverage Section */}
          <section aria-labelledby="kw" className="border-b pb-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 id="kw" className="text-2xl">Anahtar kelime kapsamı</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Pozisyon ilanında beklenen terimler. Eksik olanları (+) tıklayarak doğrudan profiline ekleyebilirsin.
                </p>
              </div>
              <div className="flex gap-1 border p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setKeywordFilter("all")}
                  className={`px-2 py-1 transition-colors ${keywordFilter === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Tümü ({kwList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setKeywordFilter("missing")}
                  className={`px-2 py-1 transition-colors ${keywordFilter === "missing" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Eksikler ({kwList.length - hitCount})
                </button>
                <button
                  type="button"
                  onClick={() => setKeywordFilter("matched")}
                  className={`px-2 py-1 transition-colors ${keywordFilter === "matched" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Eşleşen ({hitCount})
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex-1"><Bar value={kwPct} tone="teal" /></div>
              <span className="text-sm tabular-nums text-muted-foreground font-medium">{hitCount}/{kwList.length} kelime var</span>
            </div>

            <ul className="mt-4 flex flex-wrap gap-2">
              {filteredKeywords.map(({ k, ok }) => (
                <li key={k}>
                  {ok ? (
                    <span className="inline-flex items-center gap-1.5 border border-teal/40 bg-teal/5 px-2.5 py-1 text-xs text-teal font-medium">
                      <Check className="h-3 w-3" />
                      {k}
                      <span className="sr-only">(profilinde mevcut)</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addKeywordToSkills(k)}
                      title={`Tıkla: '${k}' ifadesini becerilerine ekle`}
                      className="group inline-flex items-center gap-1.5 border border-dashed border-destructive/60 bg-destructive/5 px-2.5 py-1 text-xs text-destructive hover:border-destructive hover:bg-destructive hover:text-white transition-all cursor-pointer"
                    >
                      <span className="font-bold text-sm leading-none transition-transform group-hover:scale-125">+</span>
                      <span>{k}</span>
                      <span className="ml-0.5 text-[0.65rem] opacity-70 group-hover:opacity-100 font-semibold">(Ekle)</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {a.missing.length > 0 && (
              <div className="mt-5 rounded-sm border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Öncelikli Eksik Yetkinlikler:</span>{" "}
                {a.missing.slice(0, 4).map((m) => m.name).join(", ")}. Bu becerileri CV'de gerçek projelerinle ilişkilendirerek vurgula.
              </div>
            )}
          </section>

          {/* ATS Compatibility Checklist */}
          <section aria-labelledby="ats-checklist" className="border-b pb-10">
            <h2 id="ats-checklist" className="text-2xl">ATS uyumluluk kontrol listesi</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Aday Takip Sistemleri (Workday, Taleo, Greenhouse vb.) tarafından doğru ayrıştırılmak için kurallar:
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3 border p-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center bg-teal text-navy text-xs font-bold">✓</span>
                <div>
                  <div className="font-medium">Tek Sütunlu Sayfa Düzeni</div>
                  <div className="text-xs text-muted-foreground">Çok sütunlu ve tablolardan oluşan CV'ler robotlar tarafından sıklıkla yanlış okunur.</div>
                </div>
              </li>
              <li className="flex items-start gap-3 border p-3">
                <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center text-xs font-bold ${kwPct >= 60 ? "bg-teal text-navy" : "bg-warning text-navy"}`}>
                  {kwPct >= 60 ? "✓" : "!"}
                </span>
                <div>
                  <div className="font-medium">Anahtar Kelime Yoğunluğu (%{kwPct})</div>
                  <div className="text-xs text-muted-foreground">
                    {kwPct >= 60 ? "Anahtar kelimeler pozisyon gereksinimlerini tatmin edici düzeyde karşılıyor." : "Hedef rolün anahtar kelimelerinden eksik olanları deneyimlerine ekle."}
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3 border p-3">
                <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center text-xs font-bold ${hasMetrics ? "bg-teal text-navy" : "bg-destructive text-white"}`}>
                  {hasMetrics ? "✓" : "!"}
                </span>
                <div>
                  <div className="font-medium">Ölçülebilir Başarı Göstergeleri (Metrikler)</div>
                  <div className="text-xs text-muted-foreground">
                    {hasMetrics ? "Profilinde sayısal veya yüzdesel çıktılar tespit edildi." : "Eksik: Cümlelerine yüzde (%), bütçe veya kişi sayısı gibi ölçülebilir sonuçlar ekle."}
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3 border p-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center bg-teal text-navy text-xs font-bold">✓</span>
                <div>
                  <div className="font-medium">Standart UTF-8 ve Okunabilir Metin</div>
                  <div className="text-xs text-muted-foreground">Türkçe karakter uyumlu, taranmış resim içermeyen düz metin formatı.</div>
                </div>
              </li>
            </ul>
          </section>

          {/* Illustrative Before/After Section */}
          <section aria-labelledby="ba" className="border-b pb-10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 id="ba" className="text-2xl">Önce / Sonra deneyim ifadeleri</h2>
              <span className="tag text-teal font-semibold">STAR Metodu ile Güçlendirilmiş</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Her örneğin sağındaki <strong>Kopyala</strong> düğmesini kullanarak ifadeyi panoya kopyalayabilir veya <strong>Profilime Ekle</strong> ile projelerine dahil edebilirsin.
            </p>

            <ul className="mt-6 space-y-5">
              {BEFORE_AFTER_DATA[s.target].map((item) => {
                const isItemCopied = copiedItemId === item.id;
                return (
                  <li key={item.id} className="border bg-card p-5 transition-shadow hover:shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 text-xs">
                      <span className="tag font-semibold text-muted-foreground">{item.category}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => copyItemText(item)}
                          className={`inline-flex items-center gap-1 border px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                            isItemCopied ? "border-teal bg-teal text-navy" : "border-border hover:bg-muted"
                          }`}
                        >
                          {isItemCopied ? (
                            <>
                              <Check className="h-3 w-3" />
                              <span>Kopyalandı</span>
                            </>
                          ) : (
                            <span>Panoya Kopyala</span>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => addExampleToProjects(item)}
                          className="inline-flex items-center gap-1 border border-primary/30 px-2.5 py-1 text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                        >
                          <span>+ Profilime Ekle</span>
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 space-y-3 text-sm">
                      <div className="rounded-sm bg-muted/40 p-3">
                        <span className="tag mr-2 text-destructive font-semibold">Önce (Zayıf)</span>
                        <span className="text-muted-foreground">{item.before}</span>
                      </div>
                      <div className="rounded-sm border border-teal/30 bg-teal/5 p-3">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="tag text-teal font-bold">Sonra (Metrikli & ATS Uyumlu)</span>
                        </div>
                        <p className="leading-relaxed font-medium">{item.after}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-teal/20">
                          <span className="text-[0.7rem] text-muted-foreground font-semibold">Ölçülebilir Metrikler:</span>
                          {item.metrics.map((m) => (
                            <span key={m} className="tag border border-teal/40 bg-background px-1.5 py-0.5 text-[0.7rem] text-teal font-semibold">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Formatting Tips */}
          <section aria-labelledby="tips">
            <h2 id="tips" className="text-2xl">ATS biçim önerileri</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground marker:text-teal">
              {TIPS.map((x) => <li key={x}>{x}</li>)}
            </ol>
          </section>
        </div>

        {/* Live Preview Panel */}
        <section aria-labelledby="onizleme" className="flex flex-col lg:sticky lg:top-20 lg:self-start">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 id="onizleme" className="text-2xl">Optimize CV önizlemesi</h2>
              <span className="text-xs text-muted-foreground">Düz metin formatında ATS dostu şablon</span>
            </div>
            <div className="flex gap-2">
              <Btn variant="outline" onClick={copyFullCv}>
                {copiedCv ? "Kopyalandı ✓" : "Tümünü Kopyala"}
              </Btn>
              <Btn onClick={downloadTxt}>İndir (.txt)</Btn>
            </div>
          </div>

          {copyFailed && (
            <p role="alert" className="mt-2 text-xs text-destructive">
              Kopyalama tarayıcı tarafından engellendi; metni seçip elle kopyalayabilirsin.
            </p>
          )}

          <pre
            className="mt-4 max-h-[660px] overflow-auto whitespace-pre-wrap border bg-card p-6 font-mono text-xs leading-relaxed selection:bg-teal selection:text-navy"
            tabIndex={0}
            aria-label="CV önizleme metni"
          >
            {cvText}
          </pre>

          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Profilindeki güncel bilgilerle anlık senkronizedir.</span>
            <span className="tabular-nums font-semibold">{cvText.split("\n").length} satır</span>
          </div>
        </section>
      </div>
    </div>
  );
}
