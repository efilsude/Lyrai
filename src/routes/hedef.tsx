import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type ChangeEvent } from "react";
import { Btn, PageHead } from "@/components/kr";
import { useStore } from "@/lib/store";
import { DEMO_PROFILE, TARGETS, type Profile, type TargetId } from "@/lib/career-data";

export const Route = createFileRoute("/hedef")({
  head: () => ({
    meta: [
      { title: "Hedef ve Profil — KariyerRota" },
      { name: "description", content: "Hedef pozisyonunu seç ve eğitim, beceri ve deneyimlerini gir." },
      { property: "og:title", content: "Hedef ve Profil — KariyerRota" },
      { property: "og:description", content: "Kariyer hedefini seç, profilini oluştur." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HedefPage,
});

const FIELDS: { k: keyof Profile; label: string; ph: string; area?: boolean }[] = [
  { k: "name", label: "Ad Soyad", ph: "Örn. Zeynep Yılmaz" },
  { k: "university", label: "Üniversite", ph: "Örn. Hacettepe Üniversitesi" },
  { k: "department", label: "Bölüm", ph: "Örn. Elektrik-Elektronik Mühendisliği" },
  { k: "year", label: "Sınıf", ph: "Örn. 3. sınıf / Yeni mezun" },
  { k: "skills", label: "Beceriler", ph: "Virgülle ayır: Python, Excel, İngilizce (B2)…", area: true },
  { k: "projects", label: "Projeler", ph: "Örn. TEKNOFEST İHA takımı, bitirme projesi…", area: true },
  { k: "certificates", label: "Sertifikalar", ph: "Örn. Google Proje Yönetimi, IELTS 7.0…", area: true },
  { k: "volunteering", label: "Gönüllülük", ph: "Örn. TEGV gönüllüsü, AIESEC…", area: true },
  { k: "international", label: "Uluslararası Deneyim", ph: "Örn. Erasmus — Politecnico di Milano", area: true },
];

function HedefPage() {
  const store = useStore();
  const nav = useNavigate();
  const [cvName, setCvName] = useState<string | null>(null);
  const p = store.profile;
  const upd = (k: keyof Profile, v: string) => store.set({ profile: { ...p, [k]: v }, analyzed: false });

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setCvName(f.name);
    if (f.type.startsWith("text/") || f.name.endsWith(".txt")) {
      f.text().then((t) => upd("skills", [p.skills, t.slice(0, 600)].filter(Boolean).join(", ")));
    }
  };

  const canGo = !!store.target && p.skills.trim().length > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <PageHead eyebrow="Adım 1" title="Hedefini seç, profilini oluştur" desc="Analiz, girdiğin bilgilere göre şeffaf kurallarla hesaplanır. Bilgilerin yalnızca tarayıcında saklanır." />

      <div className="grid gap-4 sm:grid-cols-2">
        {(Object.keys(TARGETS) as TargetId[]).map((id) => {
          const t = TARGETS[id];
          const sel = store.target === id;
          return (
            <button key={id} type="button" onClick={() => store.set({ target: id, analyzed: false, completed: [] })}
              className={`card-surface p-6 text-left transition ${sel ? "ring-2 ring-primary" : "hover:border-primary/40"}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.company}</span>
                <span className={`grid h-5 w-5 place-items-center rounded-full border ${sel ? "border-primary bg-primary text-primary-foreground" : ""}`}>{sel && "✓"}</span>
              </div>
              <div className="mt-2 font-display text-xl font-bold">{t.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{t.short}</p>
            </button>
          );
        })}
      </div>

      <div className="card-surface mt-8 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold">Profil bilgileri</h2>
          <Btn variant="outline" onClick={() => store.set({ profile: DEMO_PROFILE, analyzed: false })}>Örnek profili doldur</Btn>
        </div>

        <label className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed bg-muted/50 p-6 text-center hover:border-primary/40">
          <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={onFile} />
          <span className="font-semibold">{cvName ? `Yüklendi: ${cvName}` : "CV yükle (PDF, DOCX, TXT)"}</span>
          <span className="text-xs text-muted-foreground">Demo: Otomatik CV ayrıştırma henüz yok — TXT içeriği becerilere eklenir. Lütfen aşağıdaki alanları manuel doldur.</span>
        </label>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <label key={f.k} className={f.area ? "sm:col-span-2" : ""}>
              <span className="text-sm font-semibold">{f.label}</span>
              {f.area ? (
                <textarea rows={2} value={p[f.k]} placeholder={f.ph} onChange={(e) => upd(f.k, e.target.value)} className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              ) : (
                <input value={p[f.k]} placeholder={f.ph} onChange={(e) => upd(f.k, e.target.value)} className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              )}
            </label>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-muted-foreground">{canGo ? "Hazırsın!" : "Devam etmek için bir hedef seç ve en az bir beceri gir."}</span>
          <Btn disabled={!canGo} onClick={() => nav({ to: "/analiz" })} className="px-6 py-3">Analize Geç →</Btn>
        </div>
      </div>
    </div>
  );
}
