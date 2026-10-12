import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bar, Btn, Check, NeedsSetup, PageHead } from "@/components/kr";
import { useStore } from "@/lib/store";
import { TARGETS, analyzeProfile, type Profile, type TargetId } from "@/lib/career-data";

export const Route = createFileRoute("/cv")({
  head: () => ({
    meta: [
      { title: "ATS CV Asistanı — KariyerRota" },
      { name: "description", content: "Anahtar kelime analizi, önce/sonra madde örnekleri ve optimize CV önizlemesi." },
      { property: "og:title", content: "ATS CV Asistanı — KariyerRota" },
      { property: "og:description", content: "CV'ni hedef pozisyonun anahtar kelimelerine göre güçlendir." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CvPage,
});

const BEFORE_AFTER: Record<TargetId, { b: string; a: string }[]> = {
  "aselsan-pm": [
    { b: "Kulüpte etkinlik düzenledim.", a: "IEEE öğrenci kolunda 12 kişilik ekibi koordine ederek 300 katılımcılı teknik zirveyi 45.000 TL bütçeyle planlandığı tarihte tamamladım." },
    { b: "Bitirme projesinde çalıştım.", a: "Üretim hattı darboğaz analizinde risk kaydı ve Gantt planı hazırlayarak çevrim süresinde %14 iyileştirme önerisi sundum." },
    { b: "Jira biliyorum.", a: "Jira ile 4 sprintlik kulüp yazılım projesinin iş takibini yöneterek görev tamamlama oranını %90'a çıkardım." },
  ],
  "tech-ds": [
    { b: "Python ile veri analizi yaptım.", a: "Python (pandas, scikit-learn) ile 50.000 satırlık müşteri verisinde churn modeli geliştirerek F1 skorunu 0,71'den 0,83'e yükselttim." },
    { b: "SQL biliyorum.", a: "PostgreSQL'de window fonksiyonlarıyla haftalık kohort analizi sorguları yazıp Tableau paneline aktardım." },
    { b: "Kaggle'da yarışmaya katıldım.", a: "Kaggle House Prices yarışmasında XGBoost ve özellik mühendisliğiyle ilk %15'e girdim; kodu GitHub'da belgeledim." },
  ],
};

const TIPS = [
  "Tek sütunlu, tablo ve görsel içermeyen bir düzen kullan.",
  "Standart başlıklar: Eğitim, Deneyim, Projeler, Beceriler.",
  "Her maddeye eylem fiili + ölçülebilir sonuç ekle.",
  "Dosyayı PDF olarak, metin seçilebilir şekilde kaydet.",
  "İlan metnindeki anahtar kelimeleri doğal biçimde kullan.",
];

function buildCv(p: Profile, target: TargetId, has: string[]) {
  const t = TARGETS[target];
  const line = (s: string) => s.split(/[;\n]/).map((x) => x.trim()).filter(Boolean);
  return [
    p.name || "Ad Soyad",
    `${t.title} Adayı | ${p.department || "Bölüm"} — ${p.university || "Üniversite"} (${p.year || "Sınıf"})`,
    "",
    "PROFESYONEL ÖZET",
    `${p.department || "Mühendislik"} öğrencisi; ${has.slice(0, 3).join(", ") || "analitik düşünme"} alanlarında deneyimli. ${t.company} ${t.title} rolüne yönelik ${t.atsKeywords.slice(0, 3).join(", ")} yetkinliklerini geliştiriyor.`,
    "",
    "BECERİLER",
    p.skills || "-",
    "",
    "PROJELER",
    ...line(p.projects).map((x) => `• ${x}`),
    "",
    "SERTİFİKALAR",
    ...line(p.certificates).map((x) => `• ${x}`),
    "",
    "GÖNÜLLÜLÜK VE LİDERLİK",
    ...line(p.volunteering).map((x) => `• ${x}`),
    ...(p.international.trim() ? ["", "ULUSLARARASI DENEYİM", ...line(p.international).map((x) => `• ${x}`)] : []),
  ].join("\n");
}

function CvPage() {
  const s = useStore();
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const a = useMemo(() => (s.target ? analyzeProfile(s.profile, s.target) : null), [s.profile, s.target]);
  if (!s.target || !a || !s.profile.skills.trim())
    return (
      <div className="px-4 py-16">
        <NeedsSetup what="CV asistanı" />
      </div>
    );
  const t = TARGETS[s.target];
  const text = Object.values(s.profile).join(" ").toLocaleLowerCase("tr-TR");
  const kw = t.atsKeywords.map((k) => ({ k, ok: text.includes(k.toLocaleLowerCase("tr-TR")) }));
  const hit = kw.filter((x) => x.ok).length;
  const kwPct = Math.round((hit / kw.length) * 100);
  const cv = buildCv(s.profile, s.target, a.strengths.map((x) => x.name.split(" (")[0] ?? x.name));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cv);
      setCopyFailed(false);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopyFailed(true);
    }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([cv], { type: "text/plain;charset=utf-8" }));
    const el = document.createElement("a");
    el.href = url;
    el.download = "KariyerRota_CV.txt";
    el.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHead
        eyebrow="Adım 4"
        title="ATS CV asistanı"
        desc="CV'ni hedef pozisyonun anahtar kelimelerine göre güçlendir. ATS'den geçiş garanti edilmez; amaç okunabilirliği ve uyumu artırmaktır."
      />

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-10">
          <section aria-labelledby="kw">
            <h2 id="kw" className="text-2xl">Anahtar kelime uyumu</h2>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex-1"><Bar value={kwPct} tone="teal" /></div>
              <span className="text-sm tabular-nums text-muted-foreground">{hit}/{kw.length} kelime profilinde geçiyor</span>
            </div>
            <ul className="mt-4 flex flex-wrap gap-2">
              {kw.map(({ k, ok }) => (
                <li
                  key={k}
                  className={`inline-flex items-center gap-1.5 border px-2 py-1 text-xs ${
                    ok ? "border-teal/40 text-teal" : "border-dashed border-destructive/50 text-destructive"
                  }`}
                >
                  {ok ? <Check className="h-3 w-3" /> : <span aria-hidden>+</span>}
                  {k}
                  <span className="sr-only">{ok ? " (var)" : " (eksik)"}</span>
                </li>
              ))}
            </ul>
            {a.missing.length > 0 && (
              <p className="mt-4 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Eksik yetkinlikler:</span>{" "}
                {a.missing.slice(0, 4).map((m) => m.name).join(", ")}
              </p>
            )}
          </section>

          <section aria-labelledby="ba">
            <h2 id="ba" className="text-2xl">Önce / Sonra madde örnekleri</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Örnek dönüşümlerdir; rakamlar ve kurum adları uydurmadır. Kendi gerçek deneyimin ve sonuçlarınla değiştir.
            </p>
            <ul className="mt-4 divide-y border-y">
              {BEFORE_AFTER[s.target].map((x) => (
                <li key={x.b} className="grid gap-2 py-4 text-sm">
                  <p className="text-muted-foreground"><span className="tag mr-2 text-destructive">Önce</span>{x.b}</p>
                  <p><span className="tag mr-2 text-teal">Sonra</span>{x.a}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="tips">
            <h2 id="tips" className="text-2xl">Biçim önerileri</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground marker:text-teal">
              {TIPS.map((x) => <li key={x}>{x}</li>)}
            </ol>
          </section>
        </div>

        <section aria-labelledby="onizleme" className="flex flex-col lg:sticky lg:top-20 lg:self-start">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="onizleme" className="text-2xl">Optimize CV önizlemesi</h2>
            <div className="flex gap-2">
              <Btn variant="outline" onClick={copy}>{copied ? "Kopyalandı" : "Kopyala"}</Btn>
              <Btn onClick={download}>İndir (.txt)</Btn>
            </div>
          </div>
          {copyFailed && (
            <p role="alert" className="mt-2 text-xs text-destructive">Kopyalama tarayıcı tarafından engellendi; metni seçip elle kopyalayabilirsin.</p>
          )}
          <pre className="mt-4 max-h-[640px] overflow-auto whitespace-pre-wrap border bg-card p-6 font-sans text-sm leading-relaxed" tabIndex={0} aria-label="CV önizleme metni">
            {cv}
          </pre>
          <p className="mt-3 text-xs text-muted-foreground">
            Profilindeki bilgilerden şablonla oluşturuldu. Göndermeden önce gözden geçir ve gerçek dışı bilgi ekleme.
          </p>
        </section>
      </div>
    </div>
  );
}
