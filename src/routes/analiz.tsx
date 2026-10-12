import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bar, Btn, Check, DemoNote, NeedsSetup, PageHead, PriorityBadge, Ring } from "@/components/kr";
import { useStore } from "@/lib/store";
import { TARGETS, analyzeProfile, buildRoadmap, projectedScore } from "@/lib/career-data";

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

  if (!s.target || !a || !s.profile.skills.trim())
    return (
      <div className="px-4 py-16">
        <NeedsSetup what="Analiz" />
      </div>
    );
  const t = TARGETS[s.target];
  const sel = picked ?? a.missing.filter((m) => m.priority === "Yüksek").map((m) => m.id);
  const gain = a.missing.filter((m) => sel.includes(m.id)).reduce((x, m) => x + m.weight, 0);
  const proj = projectedScore(a, gain);
  const nextStep = buildRoadmap(a, s.target).find((x) => x.type === "Beceri");
  const skillPts = a.strengths.reduce((x, k) => x + k.weight, 0);

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      s.set({ analyzed: true });
      setLoading(false);
    }, 900);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHead eyebrow="Adım 2" title={`${t.company} · ${t.title}`} desc={t.description} />

      {!s.analyzed ? (
        <div className="max-w-xl border-l-2 border-teal py-2 pl-6">
          <h2 className="text-2xl">{s.profile.name || "Profilin"} hazır.</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Profilindeki ifadeler, {t.title} pozisyonunun {t.skills.length} temel yetkinliğiyle anahtar kelime
            eşleştirmesi ve ağırlıklı puanlama ile karşılaştırılacak.
          </p>
          <Btn onClick={run} disabled={loading} className="mt-5 px-6 py-3">
            {loading ? "Analiz ediliyor…" : "Kariyer Uyumumu Analiz Et"}
          </Btn>
        </div>
      ) : (
        <div className="space-y-12">
          <DemoNote />

          <section aria-labelledby="skor" className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 id="skor" className="tag text-muted-foreground">Tahmini uyum skoru</h2>
              <div className="mt-4">
                <Ring value={a.score} label="demo verisiyle hesaplanmıştır" />
              </div>
              <dl className="mt-6 divide-y border-y text-sm">
                <div className="flex justify-between py-2"><dt>Taban puan</dt><dd className="tabular-nums">18</dd></div>
                <div className="flex justify-between py-2"><dt>Eşleşen yetkinlikler ({a.strengths.length}/{a.skills.length})</dt><dd className="tabular-nums">+{skillPts}</dd></div>
                {a.bonuses.map((b) => (
                  <div key={b.label} className="flex justify-between py-2"><dt>{b.label}</dt><dd className="tabular-nums">+{b.points}</dd></div>
                ))}
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Bu sayı işe alım olasılığı değildir; profilindeki ifadelerin pozisyonun yetkinlik listesiyle ne kadar
                örtüştüğünü gösterir. Anahtar kelime eşleşir, deneyimin derinliği ölçülmez.
              </p>
            </div>

            <div className="md:col-span-7">
              <h3 className="tag text-muted-foreground">Yetkinlik kategorilerine göre karşılama</h3>
              <ul className="mt-4 space-y-4">
                {a.categories.map((c) => (
                  <li key={c.name}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium">{c.name}</span>
                      <span className="tabular-nums text-muted-foreground">%{c.pct}</span>
                    </div>
                    <Bar value={c.pct} tone={c.pct >= 60 ? "teal" : "primary"} />
                  </li>
                ))}
              </ul>
              {nextStep && (
                <div className="mt-8 border-l-2 border-teal pl-4">
                  <div className="tag text-teal">Önerilen sonraki adım</div>
                  <p className="mt-1 font-medium">{nextStep.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Süre: {nextStep.duration} · {nextStep.priority} öncelik
                  </p>
                </div>
              )}
            </div>
          </section>

          <section aria-labelledby="guclu">
            <h2 id="guclu" className="text-2xl">Profilinde bulunan yetkinlikler</h2>
            {a.strengths.length ? (
              <ul className="mt-4 divide-y border-y">
                {a.strengths.map((k) => (
                  <li key={k.id} className="flex items-center gap-3 py-3 text-sm">
                    <span className="grid h-5 w-5 shrink-0 place-items-center bg-teal text-navy-foreground"><Check className="h-3 w-3" /></span>
                    <span className="flex-1 font-medium">{k.name}</span>
                    <span className="hidden text-xs text-muted-foreground sm:inline">{k.category}</span>
                    <span className="tabular-nums text-teal">+{k.weight}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">Henüz eşleşen yetkinlik yok. Profilindeki beceri ve proje ifadelerini ayrıntılandır.</p>
            )}
          </section>

          <section aria-labelledby="eksik">
            <h2 id="eksik" className="text-2xl">Geliştirmen gereken yetkinlikler</h2>
            <p className="mt-1 text-sm text-muted-foreground">Üzerinde çalışmayı planladıklarını işaretle; tahmini skor değişimini aşağıda gör.</p>
            <ul className="mt-4 divide-y border-y">
              {a.missing.map((m) => (
                <li key={m.id}>
                  <label className="flex cursor-pointer items-start gap-3 py-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[-2px] has-[:focus-visible]:outline-ring">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 accent-[var(--color-primary)]"
                      checked={sel.includes(m.id)}
                      onChange={() => setPicked(sel.includes(m.id) ? sel.filter((x) => x !== m.id) : [...sel, m.id])}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span className="font-semibold">{m.name}</span>
                        <PriorityBadge p={m.priority} />
                        <span className="text-xs text-muted-foreground">{m.category}</span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{m.why}</p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-teal">+{m.weight}</span>
                  </label>
                </li>
              ))}
            </ul>
            {!a.missing.length && <p className="mt-3 text-sm text-muted-foreground">Tüm temel yetkinlikler eşleşti.</p>}
          </section>

          <section className="grid items-end gap-6 border-t pt-8 md:grid-cols-[1fr_1fr_auto]" aria-label="Skor projeksiyonu">
            <div>
              <div className="text-sm text-muted-foreground">Şu an</div>
              <div className="font-display text-4xl tabular-nums">%{a.score}</div>
              <Bar value={a.score} />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Seçilenler tamamlanınca (tahmini)</div>
              <div className="font-display text-4xl tabular-nums text-teal">%{proj}</div>
              <Bar value={proj} tone="teal" />
            </div>
            <Btn to="/yol-haritasi">Yol Haritamı Gör →</Btn>
          </section>
        </div>
      )}
    </div>
  );
}
