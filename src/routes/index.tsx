import { createFileRoute } from "@tanstack/react-router";
import { Btn, Check, scoreBand } from "@/components/kr";
import { DEMO_PROFILE, TARGETS, analyzeProfile, buildRoadmap } from "@/lib/career-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KariyerRota — Hedefindeki kariyere giden yolu keşfet" },
      { name: "description", content: "Üniversite öğrencileri ve yeni mezunlar için beceri açığı analizi ve kişisel kariyer yol haritası." },
      { property: "og:title", content: "KariyerRota — Hedefindeki kariyere giden yolu keşfet" },
      { property: "og:description", content: "Beceri açıklarını gör, kişisel yol haritanı oluştur, CV'ni hedef pozisyona göre güçlendir." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const steps = [
  ["Hedefini somutlaştır", "“Savunma sanayiinde çalışmak” yerine “ASELSAN’da Proje Yöneticisi” gibi tek bir pozisyon seç."],
  ["Bugünkü durumunu yaz", "Dersler, kulüp görevleri, sertifika, gönüllülük. Küçük görünen deneyimler çoğu zaman en güçlü kanıttır."],
  ["Açığı ölç", "Pozisyonun beklediği sekiz yetkinliğin hangilerini kanıtlayabildiğini, hangilerinin eksik olduğunu gör."],
  ["Dönem dönem ilerle", "Eksikleri 0–3, 3–6 ve 6–12 aylık görevlere çevir; tamamladıkça işaretle."],
];

function Index() {
  // Demo figures come from the same engine the product uses, so the landing page never drifts from it.
  const a = analyzeProfile(DEMO_PROFILE, "aselsan-pm");
  const t = TARGETS["aselsan-pm"];
  const gaps = buildRoadmap(a, "aselsan-pm").filter((x) => x.type === "Beceri").slice(0, 3);
  const skillPts = a.strengths.reduce((s, k) => s + k.weight, 0);
  const bonusPts = a.bonuses.reduce((s, b) => s + b.points, 0);

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 md:pt-20">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="eyebrow">Üniversite öğrencileri ve yeni mezunlar için</div>
            <h1 className="mt-5 text-5xl leading-[1.05] sm:text-6xl">
              Hedef pozisyonun ile bugünkü profilin arasındaki farkı ölç.
            </h1>
          </div>
          <div className="flex flex-col justify-end md:col-span-5">
            <p className="leading-relaxed text-muted-foreground">
              Bir şirket ve pozisyon seç; KariyerRota profilini o pozisyonun beklediği yetkinliklerle karşılaştırır,
              eksikleri öncelik sırasına koyar ve 12 aylık bir görev planı çıkarır.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Btn to="/hedef" className="px-6 py-3">Yol Haritamı Oluştur</Btn>
              <Btn to="/etki" variant="outline" className="px-6 py-3">Sosyal etki modeli</Btn>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-card" aria-labelledby="ornek">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="eyebrow">Örnek çıktı · demo verisi</div>
            <h2 id="ornek" className="mt-3 text-2xl leading-snug">
              {DEMO_PROFILE.department}, {DEMO_PROFILE.year}.<br />
              Hedef: {t.company} {t.title}
            </h2>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-7xl leading-none">{a.score}</span>
              <span className="text-sm text-muted-foreground">/ 100 · {scoreBand(a.score)}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {a.skills.length} yetkinlikten {a.strengths.length}’i profilde bulundu. Skor, demo profilinden kural
              tabanlı hesaplanır ve bir işe alım tahmini değildir.
            </p>
          </div>

          <div className="md:col-span-8">
            <h3 className="tag text-muted-foreground">Geliştirilecek 3 yetkinlik ve ilk adımları</h3>
            <ol className="mt-3 divide-y border-y">
              {gaps.map((g) => (
                <li key={g.id} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 py-4 sm:grid-cols-[1fr_auto_auto]">
                  <div className="text-sm font-medium sm:col-span-1">{g.title}</div>
                  <div className="text-sm tabular-nums text-muted-foreground sm:order-3">{g.duration}</div>
                  <div className="col-span-2 text-xs text-muted-foreground sm:order-2 sm:col-span-1 sm:text-right">
                    {g.priority} öncelik · +{g.points} puan
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              {a.strengths.map((s) => (
                <span key={s.id} className="inline-flex items-center gap-1.5 border border-teal/30 px-2 py-1 text-teal">
                  <Check className="h-3 w-3" /> {s.name.split(" (")[0]}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16" aria-labelledby="yontem">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="eyebrow">Yöntem</div>
            <h2 id="yontem" className="mt-3 text-3xl">Skor nasıl hesaplanıyor?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Hesaplama bir kara kutu değil. Aynı profil her zaman aynı sonucu verir ve her puanın kaynağı görünür.
            </p>
          </div>
          <div className="md:col-span-8">
            <dl className="divide-y border-y text-sm">
              <div className="flex justify-between gap-4 py-3"><dt>Taban puan</dt><dd className="tabular-nums">18</dd></div>
              <div className="flex justify-between gap-4 py-3">
                <dt>Eşleşen yetkinlikler <span className="text-muted-foreground">(her biri 4–9 puan ağırlıklı)</span></dt>
                <dd className="tabular-nums">+{skillPts}</dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt>Proje, sertifika, gönüllülük, uluslararası deneyim <span className="text-muted-foreground">(4–6 puan)</span></dt>
                <dd className="tabular-nums">+{bonusPts}</dd>
              </div>
              <div className="flex justify-between gap-4 py-3 font-semibold"><dt>Toplam (en çok 97)</dt><dd className="tabular-nums">{a.score}</dd></div>
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">
              Sınırlama: yetkinlikler profildeki anahtar kelimelerle eşleştirilir; kalite veya derinlik ölçülmez.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl">Dört adımda plan</h2>
          <ol className="mt-8 grid border-t md:grid-cols-4 md:border-l">
            {steps.map(([title, desc], i) => (
              <li key={title} className="border-b py-6 md:border-b-0 md:border-r md:px-6">
                <span className="font-display text-2xl text-teal">{i + 1}</span>
                <h3 className="mt-2 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-navy text-navy-foreground">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="eyebrow">Sosyal etki modeli</div>
            <h2 className="mt-3 text-3xl leading-tight">Kurumlar öder, imkânı kısıtlı öğrenciler ücretsiz kullanır.</h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-sm leading-relaxed opacity-80">
              Üniversite kariyer merkezlerinden ve işverenlerden gelen lisans geliri, burslu ve ilk kuşak üniversiteli
              öğrencilerin premium erişimini karşılamayı hedefler.
            </p>
            <Btn to="/etki" variant="teal" className="mt-5">Modelin ayrıntıları</Btn>
          </div>
        </div>
      </section>
    </>
  );
}
