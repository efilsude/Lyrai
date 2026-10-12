import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type ChangeEvent } from "react";
import { Btn, Check, PageHead } from "@/components/kr";
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

type Field = { k: keyof Profile; label: string; ph: string; area?: boolean };

const IDENTITY: Field[] = [
  { k: "name", label: "Ad Soyad", ph: "Örn. Zeynep Yılmaz" },
  { k: "university", label: "Üniversite", ph: "Örn. Hacettepe Üniversitesi" },
  { k: "department", label: "Bölüm", ph: "Örn. Elektrik-Elektronik Mühendisliği" },
  { k: "year", label: "Sınıf", ph: "Örn. 3. sınıf / Yeni mezun" },
];
const EXPERIENCE: Field[] = [
  { k: "skills", label: "Beceriler (zorunlu)", ph: "Virgülle ayır: Python, Excel, İngilizce (B2)…", area: true },
  { k: "projects", label: "Projeler", ph: "Örn. TEKNOFEST İHA takımı, bitirme projesi…", area: true },
  { k: "certificates", label: "Sertifikalar", ph: "Örn. Google Proje Yönetimi, IELTS 7.0…", area: true },
  { k: "volunteering", label: "Gönüllülük", ph: "Örn. TEGV gönüllüsü, AIESEC…", area: true },
  { k: "international", label: "Uluslararası deneyim", ph: "Örn. Erasmus — Politecnico di Milano", area: true },
];

const inputCls =
  "mt-1 w-full rounded-sm border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring";

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
  const filled = (Object.keys(p) as (keyof Profile)[]).filter((k) => p[k].trim()).length;

  const renderField = (f: Field) => (
    <label key={f.k} className={f.area ? "block sm:col-span-2" : "block"}>
      <span className="text-sm font-semibold">{f.label}</span>
      {f.area ? (
        <textarea rows={2} value={p[f.k]} placeholder={f.ph} onChange={(e) => upd(f.k, e.target.value)} className={inputCls} />
      ) : (
        <input value={p[f.k]} placeholder={f.ph} onChange={(e) => upd(f.k, e.target.value)} className={inputCls} />
      )}
    </label>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <PageHead
        eyebrow="Adım 1"
        title="Hedefini seç, profilini oluştur"
        desc="Analiz, girdiğin bilgilere göre şeffaf kurallarla hesaplanır. Bilgilerin yalnızca tarayıcında saklanır."
      />

      <fieldset>
        <legend className="tag mb-3 text-muted-foreground">1 · Hedef pozisyon</legend>
        <div className="grid border md:grid-cols-2">
          {(Object.keys(TARGETS) as TargetId[]).map((id, i) => {
            const t = TARGETS[id];
            const sel = store.target === id;
            return (
              <label
                key={id}
                className={`relative block cursor-pointer p-6 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[-2px] has-[:focus-visible]:outline-ring ${
                  i > 0 ? "border-t md:border-l md:border-t-0" : ""
                } ${sel ? "bg-card shadow-[inset_0_3px_0_var(--color-teal)]" : "hover:bg-muted/60"}`}
              >
                <input
                  type="radio"
                  name="target"
                  value={id}
                  checked={sel}
                  onChange={() => store.set({ target: id, analyzed: false, completed: [] })}
                  className="sr-only"
                />
                <div className="flex items-center justify-between">
                  <span className="tag text-muted-foreground">{t.company}</span>
                  <span aria-hidden className={`grid h-5 w-5 place-items-center border ${sel ? "border-teal bg-teal text-navy-foreground" : "border-input"}`}>
                    {sel && <Check className="h-3 w-3" />}
                  </span>
                </div>
                <div className="mt-2 font-display text-2xl">{t.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{t.short}</p>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">Beklenen yetkinlikler:</span>{" "}
                  {t.skills.map((s) => s.name.split(" (")[0]).join(" · ")}
                </p>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="tag text-muted-foreground">2 · Profil bilgileri · {filled}/9 alan dolu</h2>
        <Btn variant="outline" onClick={() => store.set({ profile: DEMO_PROFILE, analyzed: false })}>
          Örnek profili doldur
        </Btn>
      </div>

      <label className="mt-4 flex cursor-pointer flex-col gap-1 border border-dashed bg-muted/40 p-5 hover:border-primary/50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring">
        <input type="file" accept=".pdf,.doc,.docx,.txt" className="sr-only" onChange={onFile} />
        <span className="font-semibold">{cvName ? `Yüklendi: ${cvName}` : "CV yükle (PDF, DOCX, TXT)"}</span>
        <span className="text-xs text-muted-foreground">
          Otomatik CV ayrıştırma henüz yok: yalnızca TXT içeriği becerilere eklenir. Lütfen aşağıdaki alanları doldur.
        </span>
      </label>

      <div className="mt-8 grid gap-8">
        <fieldset>
          <legend className="mb-3 font-display text-xl">Kimlik ve eğitim</legend>
          <div className="grid gap-4 sm:grid-cols-2">{IDENTITY.map(renderField)}</div>
        </fieldset>
        <fieldset>
          <legend className="mb-3 font-display text-xl">Deneyim ve beceriler</legend>
          <div className="grid gap-4 sm:grid-cols-2">{EXPERIENCE.map(renderField)}</div>
        </fieldset>
      </div>

      <div className="mt-8 flex flex-col items-start gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm text-muted-foreground" aria-live="polite">
          {canGo ? "Hazırsın." : "Devam etmek için bir hedef seç ve en az bir beceri gir."}
        </span>
        <Btn disabled={!canGo} onClick={() => nav({ to: "/analiz" })} className="px-6 py-3">
          Analize Geç →
        </Btn>
      </div>
    </div>
  );
}
