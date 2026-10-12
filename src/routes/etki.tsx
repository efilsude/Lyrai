import { createFileRoute } from "@tanstack/react-router";
import { Btn, PageHead } from "@/components/kr";

export const Route = createFileRoute("/etki")({
  head: () => ({
    meta: [
      { title: "Sosyal Etki Modeli — KariyerRota" },
      { name: "description", content: "Kurumsal gelirle dezavantajlı öğrencilere ücretsiz premium erişim sağlayan sosyal girişim modeli." },
      { property: "og:title", content: "Sosyal Etki Modeli — KariyerRota" },
      { property: "og:description", content: "Kurumlar öder, dezavantajlı öğrenciler ücretsiz kullanır." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EtkiPage,
});

const flow = [
  { t: "Kurumsal gelir", d: "Üniversite kariyer merkezleri, belediyeler ve işverenler yıllık lisans satın alır." },
  { t: "Çapraz sübvansiyon", d: "Gelirin bir kısmı ücretsiz premium erişim havuzuna aktarılır." },
  { t: "Ücretsiz erişim", d: "Burslu, ilk kuşak üniversiteli ve dezavantajlı bölgelerden öğrenciler premium özellikleri ücretsiz kullanır." },
  { t: "Ölçülebilir etki", d: "Görev tamamlama, staj başvurusu ve işe yerleşme verileri anonim olarak raporlanır." },
];

const metrics = [
  ["Kurum lisansı başına ücretsiz öğrenci", "200"],
  ["Hedef ilk yıl ücretsiz kullanıcı", "5.000"],
  ["Ortaklık hedeflenen üniversite", "15"],
  ["Gelirin etki havuzuna oranı", "%30"],
];

function EtkiPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHead eyebrow="Sosyal etki" title="Fırsat eşitliği için kariyer rehberliği" desc="Kariyer koçluğu ve mentorluk çoğu zaman büyük şehirlerdeki ve imkânı olan öğrencilere ulaşıyor. KariyerRota, kurumsal gelirle bu erişimi herkese açmayı hedefliyor." />

      <div className="grid gap-4 md:grid-cols-4">
        {flow.map((f, i) => (
          <div key={f.t} className="card-surface relative p-5">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">{i + 1}</div>
            <div className="mt-3 font-display font-semibold">{f.t}</div>
            <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-sm bg-navy p-8 text-navy-foreground">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-bold">Örnek etki hedefleri</h2>
          <span className="rounded-full border border-navy-foreground/20 px-3 py-1 text-xs">Gösterim amaçlı — gerçek sonuç değildir</span>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map(([l, v]) => (
            <div key={l} className="rounded-sm border border-navy-foreground/15 p-5">
              <div className="font-display text-3xl font-bold text-teal">{v}</div>
              <div className="mt-2 text-sm opacity-80">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="card-surface p-6">
          <h3 className="font-bold">Ücretsiz katman (herkes)</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground"><li>• Hedef seçimi ve uyum analizi</li><li>• Temel yol haritası</li><li>• Anahtar kelime kontrolü</li></ul>
        </div>
        <div className="card-surface p-6 ring-2 ring-teal">
          <h3 className="font-bold">Premium (dezavantajlı öğrencilere ücretsiz)</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground"><li>• Sınırsız hedef ve detaylı yol haritası</li><li>• Optimize CV ve mülakat hazırlığı</li><li>• Mentor eşleştirme (planlanan)</li></ul>
        </div>
      </div>

      <div className="mt-10 text-center"><Btn to="/hedef" className="px-6 py-3 text-base">Yol Haritamı Oluştur →</Btn></div>
    </div>
  );
}
