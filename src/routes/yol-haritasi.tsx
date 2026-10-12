import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Bar, Btn, Check, DemoNote, NeedsSetup, PageHead, PriorityBadge } from "@/components/kr";
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
  if (!s.target || !a || !s.analyzed)
    return (
      <div className="px-4 py-16">
        <NeedsSetup what="Yol haritası" />
      </div>
    );
  const tasks = buildRoadmap(a, s.target);
  const done = tasks.filter((t) => s.completed.includes(t.id));
  const pct = Math.round((done.length / tasks.length) * 100);
  const live = projectedScore(a, done.reduce((x, t) => x + t.points, 0));
  const phases = Array.from(new Set(tasks.map((t) => t.phase)));
  const t = TARGETS[s.target];
  const nextId = tasks.find((x) => !s.completed.includes(x.id))?.id;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <PageHead
        eyebrow="Adım 3"
        title="Kişisel yol haritan"
        desc={`${t.company} · ${t.title} hedefi için öncelik sırasına göre planlanmış görevler.`}
      />

      <div className="sticky top-[6.75rem] z-10 -mx-4 mb-10 grid items-center gap-x-8 gap-y-2 border-y bg-background/95 px-4 py-3 sm:grid-cols-[auto_1fr_auto] md:top-16">
        <div className="text-sm">
          <span className="font-display text-2xl tabular-nums">{done.length}/{tasks.length}</span>{" "}
          <span className="text-muted-foreground">görev tamamlandı</span>
        </div>
        <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Görev ilerlemesi">
          <Bar value={pct} tone="teal" />
        </div>
        <div className="text-sm text-muted-foreground">
          Uyum skoru (demo): <span className="tabular-nums text-foreground">%{a.score}</span> →{" "}
          <span className="font-semibold tabular-nums text-teal">%{live}</span>
        </div>
      </div>

      {phases.map((ph) => {
        const inPhase = tasks.filter((x) => x.phase === ph);
        const doneIn = inPhase.filter((x) => s.completed.includes(x.id)).length;
        return (
          <section key={ph} className="mb-12 grid gap-4 md:grid-cols-[10rem_1fr] md:gap-8" aria-label={ph}>
            <div className="md:sticky md:top-40 md:self-start">
              <h2 className="text-2xl">{ph}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {doneIn}/{inPhase.length} tamamlandı
              </p>
            </div>
            <ul className="divide-y border-y">
              {inPhase.map((task) => {
                const ok = s.completed.includes(task.id);
                return (
                  <li key={task.id} className={`flex items-start gap-4 py-5 ${ok ? "opacity-60" : ""}`}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={ok}
                      aria-label={`${task.title} — ${ok ? "tamamlandı" : "tamamlanmadı"}`}
                      onClick={() => s.toggleTask(task.id)}
                      className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center border-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                        ok ? "border-teal bg-teal text-navy-foreground" : "border-input hover:border-primary"
                      }`}
                    >
                      {ok && <Check />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="tag text-foreground">{task.type}</span>
                        <PriorityBadge p={task.priority} />
                        <span>Süre: {task.duration}</span>
                        {task.points > 0 && <span className="font-semibold text-teal">+{task.points} puan</span>}
                        {task.id === nextId && <span className="tag text-teal">Sıradaki adım</span>}
                      </div>
                      <h3 className={`mt-2 font-semibold leading-snug ${ok ? "line-through" : ""}`}>{task.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        <span className="font-medium text-foreground">Neden önemli:</span> {task.why}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <DemoNote>
        Süreler ve puan artışları örnek tahminlerdir. Başvuru tarihlerini ilgili kurumların resmi sayfalarından teyit et.
      </DemoNote>
      <div className="mt-6 flex justify-end">
        <Btn to="/cv">CV Asistanına Geç →</Btn>
      </div>
    </div>
  );
}
