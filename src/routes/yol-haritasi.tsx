import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Bar, Btn, DemoNote, NeedsSetup, PageHead, PriorityBadge } from "@/components/kr";
import { useStore } from "@/lib/store";
import { TARGETS, analyzeProfile, buildRoadmap, projectedScore } from "@/lib/career-data";

export const Route = createFileRoute("/yol-haritasi")({
  head: () => ({
    meta: [
      { title: "Kişisel Yol Haritası — KariyerRota" },
      { name: "description", content: "Hedef pozisyona göre adım adım görevler, süreler ve öncelikler." },
      { property: "og:title", content: "Kişisel Yol Haritası — KariyerRota" },
      { property: "og:description", content: "Proje, sertifika, gönüllülük, Erasmus ve AIESEC önerileriyle kariyer planın." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RoadmapPage,
});

function RoadmapPage() {
  const s = useStore();
  const a = useMemo(() => (s.target ? analyzeProfile(s.profile, s.target) : null), [s.profile, s.target]);
  if (!s.target || !a || !s.analyzed) return <div className="px-4 py-16"><NeedsSetup what="Yol haritası" /></div>;
  const tasks = buildRoadmap(a, s.target);
  const done = tasks.filter((t) => s.completed.includes(t.id));
  const pct = Math.round((done.length / tasks.length) * 100);
  const live = projectedScore(a, done.reduce((x, t) => x + t.points, 0));
  const phases = Array.from(new Set(tasks.map((t) => t.phase)));
  const t = TARGETS[s.target];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <PageHead eyebrow="Adım 3" title="Kişisel yol haritan" desc={`${t.company} · ${t.title} hedefi için öncelik sırasına göre planlanmış görevler.`} />

      <div className="card-surface sticky top-20 z-10 mb-8 grid gap-4 p-5 sm:grid-cols-3">
        <div><div className="text-xs text-muted-foreground">Tamamlanan</div><div className="font-display text-2xl font-bold">{done.length}/{tasks.length}</div></div>
        <div><div className="mb-1 text-xs text-muted-foreground">İlerleme %{pct}</div><Bar value={pct} tone="teal" /></div>
        <div><div className="text-xs text-muted-foreground">Güncel uyum (demo)</div><div className="font-display text-2xl font-bold">%{a.score} → <span className="text-teal">%{live}</span></div></div>
      </div>

      {phases.map((ph) => (
        <section key={ph} className="relative mb-10 border-l-2 pl-6 sm:pl-8">
          <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-4 border-background bg-primary" />
          <h2 className="mb-4 text-lg font-bold">{ph}</h2>
          <div className="space-y-3">
            {tasks.filter((x) => x.phase === ph).map((task) => {
              const ok = s.completed.includes(task.id);
              return (
                <div key={task.id} className={`card-surface p-5 transition ${ok ? "opacity-70" : ""}`}>
                  <div className="flex items-start gap-4">
                    <button type="button" aria-label={ok ? "Tamamlanmadı olarak işaretle" : "Tamamlandı olarak işaretle"} onClick={() => s.toggleTask(task.id)}
                      className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 text-xs font-bold ${ok ? "border-teal bg-teal text-navy-foreground" : "hover:border-primary"}`}>{ok && "✓"}</button>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">{task.type}</span>
                        <PriorityBadge p={task.priority} />
                        <span className="text-xs text-muted-foreground">⏱ {task.duration}</span>
                        {task.points > 0 && <span className="text-xs font-semibold text-teal">+{task.points} puan</span>}
                      </div>
                      <h3 className={`mt-2 font-semibold ${ok ? "line-through" : ""}`}>{task.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground"><span className="font-medium text-foreground">Neden önemli:</span> {task.why}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <DemoNote>Süreler ve puan artışları örnek tahminlerdir. Başvuru tarihlerini ilgili kurumların resmi sayfalarından teyit et.</DemoNote>
      <div className="mt-6 flex justify-end"><Btn to="/cv">CV Asistanına Geç →</Btn></div>
    </div>
  );
}
