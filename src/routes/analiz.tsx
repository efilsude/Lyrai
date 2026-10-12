import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bar, Btn, DemoNote, NeedsSetup, PageHead, PriorityBadge, Ring } from "@/components/kr";
import { useStore } from "@/lib/store";
import { TARGETS, analyzeProfile, projectedScore } from "@/lib/career-data";

export const Route = createFileRoute("/analiz")({
  head: () => ({
    meta: [
      { title: "Kariyer Uyum Analizi — KariyerRota" },
      { name: "description", content: "Hedef pozisyona uyum skorun, güçlü yönlerin ve eksik becerilerin." },
      { property: "og:title", content: "Kariyer Uyum Analizi — KariyerRota" },
      { property: "og:description", content: "Beceri açıklarını öncelik sırasıyla gör." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AnalizPage,
});

function AnalizPage() {
  const s = useStore();
  const [loading, setLoading] = useState(false);
  const a = useMemo(() => (s.target ? analyzeProfile(s.profile, s.target) : null), [s.profile, s.target]);
  const [picked, setPicked] = useState<string[] | null>(null);

  if (!s.target || !a || !s.profile.skills.trim()) return <div className="px-4 py-16"><NeedsSetup what="Analiz" /></div>;
  const t = TARGETS[s.target];
  const sel = picked ?? a.missing.filter((m) => m.priority === "Yüksek").map((m) => m.id);
  const gain = a.missing.filter((m) => sel.includes(m.id)).reduce((x, m) => x + m.weight, 0);
  const proj = projectedScore(a, gain);

  const run = () => { setLoading(true); setTimeout(() => { s.set({ analyzed: true }); setLoading(false); }, 900); };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHead eyebrow="Adım 2" title={`${t.company} · ${t.title}`} desc={t.description} />

      {!s.analyzed ? (
        <div className="card-surface flex flex-col items-center gap-4 p-10 text-center">
          <h2 className="text-xl font-bold">{s.profile.name || "Profilin"} hazır.</h2>
          <p className="max-w-md text-sm text-muted-foreground">Becerilerin, hedef pozisyonun gereksinimleriyle anahtar kelime eşleştirmesi ve ağırlıklı puanlama ile karşılaştırılacak.</p>
          <Btn onClick={run} disabled={loading} className="px-6 py-3 text-base">{loading ? "Analiz ediliyor…" : "Kariyer Uyumumu Analiz Et"}</Btn>
        </div>
      ) : (
        <div className="space-y-6">
          <DemoNote />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="card-surface flex flex-col items-center p-6 text-center">
              <div className="text-sm font-semibold text-muted-foreground">Mevcut uyum skoru</div>
              <div className="my-4"><Ring value={a.score} label="demo tahmini" size={160} /></div>
              <div className="w-full space-y-1 text-left text-xs text-muted-foreground">
                <div className="flex justify-between"><span>Taban puan</span><span>18</span></div>
                <div className="flex justify-between"><span>Eşleşen beceriler</span><span>+{a.strengths.reduce((x, k) => x + k.weight, 0)}</span></div>
                {a.bonuses.map((b) => <div key={b.label} className="flex justify-between"><span>{b.label}</span><span>+{b.points}</span></div>)}
              </div>
            </div>
            <div className="card-surface p-6 lg:col-span-2">
              <h3 className="font-bold">Beceri kategorileri</h3>
              <div className="mt-5 space-y-4">
                {a.categories.map((c) => (
                  <div key={c.name}><div className="mb-1 flex justify-between text-sm"><span className="font-medium">{c.name}</span><span className="text-muted-foreground">%{c.pct}</span></div><Bar value={c.pct} tone={c.pct >= 60 ? "teal" : "primary"} /></div>
                ))}
              </div>
              <h3 className="mt-8 font-bold">Güçlü yönlerin</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {a.strengths.length ? a.strengths.map((k) => <span key={k.id} className="rounded-full bg-teal-soft px-3 py-1 text-xs font-semibold text-teal">✓ {k.name}</span>) : <span className="text-sm text-muted-foreground">Henüz eşleşen beceri yok.</span>}
              </div>
            </div>
          </div>

          <div className="card-surface p-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="font-bold">Eksik beceriler ve öncelikler</h3>
                <p className="text-sm text-muted-foreground">Tamamlamak istediklerini seç; tahmini skor değişimini gör.</p>
              </div>
            </div>
            <div className="mt-4 divide-y">
              {a.missing.map((m) => (
                <label key={m.id} className="flex cursor-pointer items-start gap-3 py-3">
                  <input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--color-primary)]" checked={sel.includes(m.id)} onChange={() => setPicked(sel.includes(m.id) ? sel.filter((x) => x !== m.id) : [...sel, m.id])} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><span className="font-semibold">{m.name}</span><PriorityBadge p={m.priority} /><span className="text-xs text-muted-foreground">{m.category}</span></div>
                    <p className="mt-1 text-sm text-muted-foreground">{m.why}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-teal">+{m.weight}</span>
                </label>
              ))}
              {!a.missing.length && <p className="py-3 text-sm text-muted-foreground">Tüm temel beceriler eşleşti!</p>}
            </div>
          </div>

          <div className="card-surface grid items-center gap-6 p-6 md:grid-cols-[1fr_auto_1fr_auto]">
            <div><div className="text-sm text-muted-foreground">Şu an</div><div className="font-display text-4xl font-bold">%{a.score}</div><Bar value={a.score} /></div>
            <div className="hidden text-2xl text-muted-foreground md:block">→</div>
            <div><div className="text-sm text-muted-foreground">Seçilenler tamamlanınca (tahmini)</div><div className="font-display text-4xl font-bold text-teal">%{proj}</div><Bar value={proj} tone="teal" /></div>
            <Btn to="/yol-haritasi">Yol Haritamı Gör →</Btn>
          </div>
        </div>
      )}
    </div>
  );
}
