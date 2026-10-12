import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Btn, NeedsSetup, PageHead } from "@/components/kr";
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
  const a = useMemo(() => (s.target ? analyzeProfile(s.profile, s.target) : null), [s.profile, s.target]);
  if (!s.target || !a || !s.profile.skills.trim()) return <div className="px-4 py-16"><NeedsSetup what="CV asistanı" /></div>;
  const t = TARGETS[s.target];
  const text = Object.values(s.profile).join(" ").toLocaleLowerCase("tr-TR");
  const kw = t.atsKeywords.map((k) => ({ k, ok: text.includes(k.toLocaleLowerCase("tr-TR")) }));
  const cv = buildCv(s.profile, s.target, a.strengths.map((x) => x.name.split(" (")[0] ?? x.name));

  const copy = async () => { await navigator.clipboard.writeText(cv); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  const download = () => {
    const url = URL.createObjectURL(new Blob([cv], { type: "text/plain;charset=utf-8" }));
    const el = document.createElement("a"); el.href = url; el.download = "KariyerRota_CV.txt"; el.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHead eyebrow="Adım 4" title="ATS CV asistanı" desc="CV'ni hedef pozisyonun anahtar kelimelerine göre güçlendir. ATS'den geçiş garanti edilmez; amaç okunabilirliği ve uyumu artırmaktır." />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="card-surface p-6">
            <h3 className="font-bold">Anahtar kelime uyumu <span className="text-sm font-normal text-muted-foreground">({kw.filter((x) => x.ok).length}/{kw.length})</span></h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {kw.map(({ k, ok }) => (
                <span key={k} className={`tag px-2 py-1 ${ok ? "bg-teal-soft text-teal" : "bg-destructive-soft text-destructive"}`}>{ok ? "✓" : "✕"} {k}</span>
              ))}
            </div>
            {a.missing.length > 0 && <p className="mt-4 text-sm text-muted-foreground"><span className="font-semibold text-foreground">Eksik beceriler:</span> {a.missing.slice(0, 4).map((m) => m.name).join(", ")}</p>}
          </div>

          <div className="card-surface p-6">
            <h3 className="font-bold">Önce / Sonra madde örnekleri</h3>
            <div className="mt-4 space-y-4">
              {BEFORE_AFTER[s.target].map((x) => (
                <div key={x.b} className="grid gap-2 text-sm">
                  <div className="rounded-sm bg-destructive-soft p-3"><span className="font-semibold text-destructive">Önce: </span>{x.b}</div>
                  <div className="rounded-sm bg-teal-soft p-3"><span className="font-semibold text-teal">Sonra: </span>{x.a}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-surface p-6">
            <h3 className="font-bold">Biçim önerileri</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {["Tek sütunlu, tablo ve görsel içermeyen bir düzen kullan.", "Standart başlıklar: Eğitim, Deneyim, Projeler, Beceriler.", "Her maddeye eylem fiili + ölçülebilir sonuç ekle.", "Dosyayı PDF olarak, metin seçilebilir şekilde kaydet.", "İlan metnindeki anahtar kelimeleri doğal biçimde kullan."].map((x) => <li key={x}>• {x}</li>)}
            </ul>
          </div>
        </div>

        <div className="card-surface flex flex-col p-6 lg:sticky lg:top-20 lg:self-start">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold">Optimize CV önizlemesi</h3>
            <div className="flex gap-2">
              <Btn variant="outline" onClick={copy}>{copied ? "Kopyalandı ✓" : "Kopyala"}</Btn>
              <Btn onClick={download}>İndir (.txt)</Btn>
            </div>
          </div>
          <pre className="mt-4 max-h-[640px] overflow-auto whitespace-pre-wrap rounded-sm border bg-background p-5 font-sans text-sm leading-relaxed">{cv}</pre>
          <p className="mt-3 text-xs text-muted-foreground">Profilindeki bilgilerden şablonla oluşturuldu. Göndermeden önce gözden geçir ve gerçek dışı bilgi ekleme.</p>
        </div>
      </div>
    </div>
  );
}
