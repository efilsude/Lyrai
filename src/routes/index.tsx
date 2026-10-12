import { createFileRoute } from "@tanstack/react-router";
import { Btn } from "@/components/kr";

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
  { t: "Hedefini somutlaştır", d: "\"Savunma sanayiinde çalışmak\" yerine \"ASELSAN'da Proje Yöneticisi\" gibi tek bir pozisyon seç. Plan ancak hedef netse işe yarar." },
  { t: "Bugünkü durumunu yaz", d: "Dersler, kulüp görevleri, staj, sertifika ve gönüllülük. Küçük görünen deneyimler çoğu zaman en güçlü kanıttır." },
  { t: "Açığı ölç", d: "Pozisyonun beklediği sekiz temel yetkinliğe karşı hangilerini kanıtlayabildiğini, hangilerinin eksik olduğunu gör." },
  { t: "Dönem dönem ilerle", d: "Eksikleri 0–3, 3–6 ve 6–12 aylık dilimlere bölünmüş somut görevlere çevir; tamamladıkça işaretle." },
];

const sample = [
  ["Risk ve bütçe yönetimi", "Yüksek", "Örnek bir proje için risk kaydı ve EVM tablosu hazırla", "2 hafta"],
  ["Sistem mühendisliği", "Yüksek", "INCOSE giriş eğitimi ve gereksinim dokümanı çalışması", "4 hafta"],
  ["Agile / Scrum", "Orta", "Kulüp projesini iki haftalık sprintlerle yönet", "3 hafta"],
];

function Index() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-20 md:pt-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="eyebrow">Üniversite öğrencileri ve yeni mezunlar için</div>
            <h1 className="mt-6 text-5xl leading-[1.05] sm:text-6xl">Hedefindeki kariyere giden yolu keşfet.</h1>
          </div>
          <div className="flex flex-col justify-end md:col-span-5">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Hangi pozisyonu istediğini biliyorsun, ama oraya hangi beceriler, stajlar ve projelerle varacağını bilmiyorsan KariyerRota açığı ölçer ve dönem dönem bir plan çıkarır.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Btn to="/hedef" className="px-6 py-3">Yol Haritamı Oluştur</Btn>
              <Btn to="/etki" variant="outline" className="px-6 py-3">Sosyal etki modeli</Btn>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="eyebrow">Örnek çıktı</div>
            <h2 className="mt-3 text-3xl">Endüstri Mühendisliği 3. sınıf öğrencisi, ASELSAN Proje Yöneticisi hedefi</h2>
            <div className="mt-8 flex items-baseline gap-3">
              <span className="font-display text-7xl">62</span>
              <span className="text-sm text-muted-foreground">/ 100 uyum<br />(demo tahmini)</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Sekiz temel yetkinlikten beşi kanıtlanmış. En büyük açık: teknik ekiplerle ortak dil.</p>
          </div>
          <div className="md:col-span-8">
            <div className="grid grid-cols-[1fr_auto] border-b pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:grid-cols-[180px_1fr_auto]">
              <span className="hidden sm:block">Eksik yetkinlik</span><span>Önerilen eylem</span><span>Süre</span>
            </div>
            {sample.map(([s, p, a, d]) => (
              <div key={s} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-b py-4 sm:grid-cols-[180px_1fr_auto]">
                <div className="col-span-2 sm:col-span-1">
                  <div className="font-semibold">{s}</div>
                  <div className="text-xs text-muted-foreground">{p} öncelik</div>
                </div>
                <div className="text-sm">{a}</div>
                <div className="text-sm tabular-nums text-muted-foreground">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-10 md:grid-cols-12">
          <h2 className="text-3xl md:col-span-4">Dört adımda, tahmin değil plan.</h2>
          <ol className="md:col-span-8">
            {steps.map((s, i) => (
              <li key={s.t} className="grid grid-cols-[3rem_1fr] border-t py-6">
                <span className="font-display text-2xl text-teal">{i + 1}</span>
                <div>
                  <h3 className="text-lg font-semibold">{s.t}</h3>
                  <p className="mt-1 max-w-xl text-muted-foreground">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-navy text-navy-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="eyebrow">Sosyal etki modeli</div>
            <h2 className="mt-3 text-4xl leading-tight">Kurumlar öder, imkânı kısıtlı öğrenciler ücretsiz kullanır.</h2>
          </div>
          <div className="md:col-span-5">
            <p className="leading-relaxed opacity-80">Üniversite kariyer merkezleri ve işverenlerden gelen lisans geliri, burslu ve ilk kuşak üniversiteli öğrencilerin premium erişimini karşılar. Kariyer rehberliği büyük şehirdeki birkaç kampüsün ayrıcalığı olmamalı.</p>
            <Btn to="/etki" variant="teal" className="mt-6">Modelin ayrıntıları</Btn>
          </div>
        </div>
      </section>
    </>
  );
}
