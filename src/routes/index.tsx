import { createFileRoute } from "@tanstack/react-router";
import { Btn, Ring, Bar } from "@/components/kr";

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
  { n: "01", t: "Hedefini seç", d: "ASELSAN Proje Yöneticisi veya Veri Bilimci gibi somut bir pozisyon belirle." },
  { n: "02", t: "Profilini gir", d: "Bölüm, beceri, proje, sertifika ve gönüllülük deneyimlerini ekle." },
  { n: "03", t: "Açıklarını gör", d: "Uyum skorunu, güçlü yönlerini ve öncelikli eksik becerilerini incele." },
  { n: "04", t: "Yol haritanı izle", d: "Adım adım görevleri tamamla, ilerlemeni ve CV'ni güncelle." },
];

function Index() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" /> Öğrenciler ve yeni mezunlar için
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">Hedefindeki kariyere giden yolu keşfet.</h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Hedef pozisyonuna göre beceri açıklarını belirle, sana özel bir kariyer planı oluştur ve CV'ni ATS'ye uygun hale getir.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Btn to="/hedef" className="px-6 py-3 text-base">Yol Haritamı Oluştur →</Btn>
              <Btn to="/etki" variant="outline" className="px-6 py-3 text-base">Sosyal etki modeli</Btn>
            </div>
          </div>
          <div className="card-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Hedef</div>
                <div className="font-display font-bold">ASELSAN · Proje Yöneticisi</div>
              </div>
              <span className="rounded-full bg-teal-soft px-2 py-1 text-xs font-semibold text-teal">Örnek</span>
            </div>
            <div className="mt-6 flex items-center gap-6">
              <Ring value={62} label="uyum" size={120} />
              <div className="flex-1 space-y-3 text-sm">
                {[["Yönetim", 55], ["İletişim", 80], ["Teknik", 40], ["Araçlar", 70]].map(([k, v]) => (
                  <div key={k}><div className="mb-1 flex justify-between"><span>{k}</span><span className="text-muted-foreground">%{v}</span></div><Bar value={v as number} /></div>
                ))}
              </div>
            </div>
            <div className="mt-6 rounded-sm bg-muted p-3 text-sm">
              <span className="font-semibold">Sıradaki adım:</span> Risk kaydı ve EVM tablosu hazırla · <span className="text-teal">+8 puan</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold">Nasıl çalışır?</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="card-surface p-5">
              <div className="font-display text-sm font-bold text-teal">{s.n}</div>
              <div className="mt-3 font-display text-lg font-semibold">{s.t}</div>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 rounded-sm bg-navy p-8 text-navy-foreground md:grid-cols-[1.4fr_1fr] md:p-12">
          <div>
            <div className="eyebrow">Sosyal etki modeli</div>
            <h2 className="mt-3 text-3xl font-bold">Kurumlar öder, dezavantajlı öğrenciler ücretsiz kullanır.</h2>
            <p className="mt-4 opacity-80">Üniversite kariyer merkezleri ve işverenlerden gelen kurumsal gelir, burs alan ve dezavantajlı öğrencilere premium erişimi ücretsiz sağlar.</p>
            <Btn to="/etki" variant="teal" className="mt-6">Modeli incele</Btn>
          </div>
          <div className="grid grid-cols-2 gap-3 self-center">
            {[["1 kurum lisansı", "≈ 200 ücretsiz öğrenci*"], ["Hedef kitle", "Burslu & ilk kuşak üniversiteliler"]].map(([a, b]) => (
              <div key={a} className="rounded-sm border border-navy-foreground/15 p-4">
                <div className="text-xs opacity-70">{a}</div>
                <div className="mt-1 font-display font-semibold">{b}</div>
              </div>
            ))}
            <p className="col-span-2 text-xs opacity-60">*Örnek gösterim amaçlı varsayım.</p>
          </div>
        </div>
      </section>
    </>
  );
}
