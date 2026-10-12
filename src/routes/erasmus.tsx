import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bar, Btn, Check, PageHead } from "@/components/kr";
import { useStore } from "@/lib/store";
import {
  ERASMUS_UNIVERSITIES,
  LANG_RANKS,
  calcErasmusScore,
  generateErasmusTasks,
  parseGpa,
  parseLanguageLevel,
  type ErasmusUniversity,
  type LanguageLevel,
} from "@/lib/career-data";

export const Route = createFileRoute("/erasmus")({
  head: () => ({
    meta: [
      { title: "Erasmus & Uluslararası Hareketlilik — KariyerRota" },
      { name: "description", content: "Dil yeterliliği ve akademik ortalamana göre Avrupa partner üniversiteleriyle eşleş, eksik kriterleri yol haritana otomatik aktar." },
      { property: "og:title", content: "Erasmus & Uluslararası Hareketlilik — KariyerRota" },
      { property: "og:description", content: "Partner üniversite kriter eşleşmesi ve otomatik görev planı." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ErasmusPage,
});

function ErasmusPage() {
  const s = useStore();
  const [filter, setFilter] = useState<"all" | "eligible" | "conditional">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Derive GPA & Language Level from user profile, with local fallbacks
  const userGpa = parseGpa(s.profile.gpa) || 3.42;
  const userLang = parseLanguageLevel(s.profile.languageLevel) || "B2";
  const [langScore, setLangScore] = useState<number>(85); // 0-100 institutional or IELTS equivalent

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const erasmusScore = useMemo(() => {
    return calcErasmusScore(userGpa, langScore);
  }, [userGpa, langScore]);

  const updateProfileGpa = (val: string) => {
    s.set({ profile: { ...s.profile, gpa: val } });
  };

  const updateProfileLang = (val: LanguageLevel) => {
    s.set({ profile: { ...s.profile, languageLevel: val } });
  };

  const handleApplyTasks = (uni: ErasmusUniversity) => {
    const tasks = generateErasmusTasks(uni, userGpa, userLang);
    s.setErasmusPlan(uni.id, tasks);
    showToast(`"${uni.name}" için ${tasks.length} eksik yetkinlik ve hazırlık görevi ana yol haritana otomatik eklendi!`);
  };

  const handleRemoveTasks = () => {
    s.setErasmusPlan(null, []);
    showToast("Erasmus görevleri yol haritasından kaldırıldı.");
  };

  // Evaluate matches
  const evaluations = useMemo(() => {
    return ERASMUS_UNIVERSITIES.map((uni) => {
      const gpaPass = userGpa >= uni.minGpa;
      const langPass = LANG_RANKS[userLang] >= LANG_RANKS[uni.minLanguage];
      const gpaDiff = Number((userGpa - uni.minGpa).toFixed(2));
      const isSelected = s.erasmusUniId === uni.id;

      let status: "eligible" | "conditional" | "unqualified" = "eligible";
      if (gpaPass && langPass) {
        status = "eligible";
      } else if (gpaPass || langPass) {
        status = "conditional";
      } else {
        status = "unqualified";
      }

      return {
        uni,
        gpaPass,
        langPass,
        gpaDiff,
        status,
        isSelected,
      };
    });
  }, [userGpa, userLang, s.erasmusUniId]);

  const filteredUnis = evaluations.filter((e) => {
    if (filter === "eligible") return e.status === "eligible";
    if (filter === "conditional") return e.status === "conditional" || e.status === "unqualified";
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHead
        eyebrow="Uluslararası Hareketlilik Modülü"
        title="Erasmus & Partner Üniversite Eşleşmesi"
        desc="Akademik not ortalaman (GPA) ve yabancı dil yeterliliğin ile Avrupa'daki anlaşmalı üniversite kriterlerini karşılaştır; eksik yetkinlikleri tek tıkla ana kariyer yol haritana aktar."
      />

      {/* Floating Toast Notification */}
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

      {/* Student Metrics & Calculator Dashboard */}
      <section aria-labelledby="calc-sec" className="mb-12 border bg-card p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4 border-b pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
            <span className="tag text-teal font-semibold">Ulusal Ajans Erasmus Puanı</span>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-display text-6xl tabular-nums leading-none">{erasmusScore}</span>
              <span className="text-sm font-semibold text-muted-foreground">/ 100 Puan</span>
            </div>
            <div className="mt-3">
              <Bar value={erasmusScore} tone="teal" />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Formül: <strong>%50 Genel Not Ortalaması</strong> + <strong>%50 Yabancı Dil Sınav Skoru</strong>. Üniversite içi seçim sıralamasında bu puan esas alınır.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-8">
            {/* GPA Input */}
            <div className="border bg-background p-4">
              <label htmlFor="gpa-input" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Akademik Ortalama (GPA)
              </label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="gpa-input"
                  type="number"
                  step="0.01"
                  min="0.00"
                  max="4.00"
                  value={s.profile.gpa || "3.42"}
                  onChange={(e) => updateProfileGpa(e.target.value)}
                  className="w-full rounded-sm border bg-card px-3 py-1.5 font-display text-xl outline-none focus:border-teal"
                />
                <span className="text-xs text-muted-foreground font-mono">/4.00</span>
              </div>
              <span className="mt-2 block text-[0.7rem] text-muted-foreground">Profilinle otomatik senkronizedir.</span>
            </div>

            {/* Language Level Select */}
            <div className="border bg-background p-4">
              <label htmlFor="lang-select" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                CEFR Dil Seviyesi
              </label>
              <div className="mt-2">
                <select
                  id="lang-select"
                  value={userLang}
                  onChange={(e) => updateProfileLang(e.target.value as LanguageLevel)}
                  className="w-full rounded-sm border bg-card px-3 py-2 font-display text-base outline-none focus:border-teal"
                >
                  <option value="A2">A2 — Temel</option>
                  <option value="B1">B1 — Orta</option>
                  <option value="B2">B2 — İyi (Standart)</option>
                  <option value="C1">C1 — İleri (Akademik)</option>
                  <option value="C2">C2 — Yetkin (Anadili Gibi)</option>
                </select>
              </div>
              <span className="mt-2 block text-[0.7rem] text-muted-foreground">Hedef okulların asgari koşuluyla eşleşir.</span>
            </div>

            {/* Dil Puanı Slider */}
            <div className="border bg-background p-4">
              <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <label htmlFor="lang-slider">Dil Sınavı</label>
                <span className="font-mono text-foreground font-bold">{langScore}/100</span>
              </div>
              <input
                id="lang-slider"
                type="range"
                min="40"
                max="100"
                step="1"
                value={langScore}
                onChange={(e) => setLangScore(Number(e.target.value))}
                className="mt-3 w-full accent-teal cursor-pointer"
              />
              <span className="mt-2 block text-[0.7rem] text-muted-foreground">Kurum içi veya IELTS/TOEFL denklik puanı.</span>
            </div>
          </div>
        </div>

        {s.erasmusUniId && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-xs">
            <div className="flex items-center gap-2 text-teal font-medium">
              <Check className="h-4 w-4" />
              <span>
                Aktif Yol Haritası Hedefi: <strong>{ERASMUS_UNIVERSITIES.find((u) => u.id === s.erasmusUniId)?.name}</strong> ({s.erasmusTasks.length} görev eklendi)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Btn to="/yol-haritasi" variant="teal" className="text-xs py-1.5 px-3">
                Yol Haritasında İncele →
              </Btn>
              <button
                type="button"
                onClick={handleRemoveTasks}
                className="border border-destructive/40 px-3 py-1.5 text-xs text-destructive hover:bg-destructive hover:text-white transition-colors cursor-pointer"
              >
                Hedefi Kaldır
              </button>
            </div>
          </div>
        )}
      </section>

      {/* University Directory Filters & List */}
      <section aria-labelledby="uni-heading">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
          <div>
            <h2 id="uni-heading" className="text-2xl">Avrupa Partner Üniversite Kataloğu</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Bölümüne ve kriterlerine göre eşleşen güncel Erasmus+ anlaşmalı kurumlar:
            </p>
          </div>

          <div className="flex gap-1 border p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 transition-colors ${filter === "all" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
            >
              Tüm Üniversiteler ({ERASMUS_UNIVERSITIES.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("eligible")}
              className={`px-3 py-1.5 transition-colors ${filter === "eligible" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
            >
              Tam Eşleşenler ({evaluations.filter((e) => e.status === "eligible").length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("conditional")}
              className={`px-3 py-1.5 transition-colors ${filter === "conditional" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
            >
              Geliştirilmesi Gerekenler ({evaluations.filter((e) => e.status !== "eligible").length})
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {filteredUnis.map(({ uni, gpaPass, langPass, gpaDiff, status, isSelected }) => {
            const hasGpaGap = !gpaPass;
            const hasLangGap = !langPass;

            return (
              <div
                key={uni.id}
                className={`relative flex flex-col justify-between border bg-card p-6 transition-all ${
                  isSelected ? "ring-2 ring-teal shadow-md" : "hover:border-primary/40"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl" role="img" aria-label={uni.country}>
                        {uni.flag}
                      </span>
                      <div>
                        <span className="tag text-muted-foreground">{uni.city}, {uni.country}</span>
                        <h3 className="font-display text-xl leading-tight">{uni.name}</h3>
                      </div>
                    </div>

                    <span
                      className={`tag shrink-0 font-semibold ${
                        status === "eligible"
                          ? "border border-teal/40 bg-teal/10 text-teal"
                          : status === "conditional"
                          ? "border border-warning/40 bg-warning/10 text-warning"
                          : "border border-destructive/40 bg-destructive/10 text-destructive"
                      }`}
                    >
                      {status === "eligible" ? "✓ Tam Eşleşme" : status === "conditional" ? "▲ Koşullu / Geliştirilebilir" : "× Kriter Altı"}
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {uni.description}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 border-y py-3 text-xs">
                    <div>
                      <span className="text-muted-foreground">Asgari GPA Şartı:</span>
                      <div className="mt-0.5 flex items-center gap-1 font-semibold">
                        <span>{uni.minGpa.toFixed(2)}</span>
                        {gpaPass ? (
                          <span className="text-teal font-medium">(+{gpaDiff > 0 ? gpaDiff.toFixed(2) : "0.00"})</span>
                        ) : (
                          <span className="text-destructive font-medium">({gpaDiff.toFixed(2)})</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-muted-foreground">Asgari Dil Şartı:</span>
                      <div className="mt-0.5 flex items-center gap-1 font-semibold">
                        <span>{uni.minLanguage}</span>
                        {langPass ? (
                          <span className="text-teal font-medium">(Uygun)</span>
                        ) : (
                          <span className="text-destructive font-medium">({userLang} yetersiz)</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-muted-foreground">Erasmus+ Aylık Hibe:</span>
                      <div className="mt-0.5 font-semibold text-foreground">{uni.monthlyGrant} € / ay</div>
                    </div>

                    <div>
                      <span className="text-muted-foreground">Dönem Kontenjanı:</span>
                      <div className="mt-0.5 font-semibold text-foreground">{uni.quota} Öğrenci</div>
                    </div>
                  </div>

                  {/* Missing Criteria Feedback */}
                  {(hasGpaGap || hasLangGap) && (
                    <div className="mt-3 rounded-sm bg-muted/40 p-3 text-xs leading-relaxed">
                      <div className="font-semibold text-foreground mb-1">Geliştirilmesi Gereken Kriterler:</div>
                      <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                        {hasGpaGap && (
                          <li>
                            GPA açığı: Ortalamanı en az <strong className="text-foreground">{uni.minGpa.toFixed(2)}</strong> seviyesine yükseltmelisin.
                          </li>
                        )}
                        {hasLangGap && (
                          <li>
                            Dil seviyesi: Üniversite <strong className="text-foreground">{uni.minLanguage}</strong> seviyesi talep ediyor ({uni.languageExamNote}).
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* University tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {uni.tags.map((tag) => (
                      <span key={tag} className="tag bg-muted text-muted-foreground text-[0.7rem]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                  <span className="text-[0.7rem] text-muted-foreground">
                    {uni.departments.slice(0, 2).join(", ")} vb.
                  </span>

                  {isSelected ? (
                    <div className="flex items-center gap-2">
                      <span className="tag text-teal font-semibold">✓ Yol Haritasında Aktif</span>
                      <Btn to="/yol-haritasi" variant="outline" className="text-xs py-1.5 px-3">
                        Görüntüle →
                      </Btn>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleApplyTasks(uni)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-sm bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                    >
                      <span>Eksik Kriterleri Yol Haritama Ekle</span>
                      <span>(+{generateErasmusTasks(uni, userGpa, userLang).length} Görev)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cross link to Career Roadmap */}
      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
        <div>
          <h3 className="font-display text-xl">Hedefin Netleşti mi?</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Erasmus hazırlık görevlerini ve teknik kariyer adımlarını tek bir zaman çizelgesinde takip et.
          </p>
        </div>
        <Btn to="/yol-haritasi" className="px-6 py-2.5">
          Ana Yol Haritasına Git →
        </Btn>
      </div>
    </div>
  );
}
