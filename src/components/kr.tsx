import { Link, type LinkProps } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useStore } from "@/lib/store";
import type { Priority } from "@/lib/career-data";

const NAV = [
  { to: "/hedef", label: "Hedef & Profil" },
  { to: "/analiz", label: "Analiz" },
  { to: "/yol-haritasi", label: "Yol Haritası" },
  { to: "/cv", label: "CV Asistanı" },
  { to: "/erasmus", label: "Erasmus & Hareketlilik" },
  { to: "/etki", label: "Sosyal Etki" },
] as const;

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className={`shrink-0 font-display text-2xl tracking-tight ${focusRing}`}>
          Kariyer<span className="italic text-teal">Rota</span>
        </Link>
        <nav aria-label="Ana gezinme" className="hidden items-center gap-6 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`border-b-2 border-transparent py-5 text-sm font-medium text-muted-foreground hover:text-foreground ${focusRing}`}
              activeProps={{ className: "border-teal! text-foreground!" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Btn to="/hedef" className="hidden sm:inline-flex">
          Yol Haritamı Oluştur
        </Btn>
      </div>
      <nav
        aria-label="Mobil gezinme"
        className="flex gap-4 overflow-x-auto border-t px-4 md:hidden"
      >
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className={`shrink-0 border-b-2 border-transparent py-3 text-xs font-medium text-muted-foreground ${focusRing}`}
            activeProps={{ className: "border-teal! text-foreground!" }}
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t">
      <div className="mx-auto grid max-w-6xl gap-3 px-4 py-8 text-sm text-muted-foreground md:grid-cols-2">
        <span>© 2026 KariyerRota · Sosyal girişimcilik hackathonu prototipi</span>
        <span className="md:text-right">
          Skorlar kural tabanlı demo hesaplamasıdır; işe alım sonucu öngörüsü değildir.
        </span>
      </div>
    </footer>
  );
}

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 " +
  focusRing;
const btnVariants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline: "border border-primary/30 bg-transparent text-foreground hover:bg-muted",
  teal: "bg-teal text-navy-foreground hover:opacity-90",
};
export function Btn({
  to,
  onClick,
  children,
  variant = "primary",
  className = "",
  disabled,
}: {
  to?: LinkProps["to"];
  onClick?: () => void;
  children: ReactNode;
  variant?: keyof typeof btnVariants;
  className?: string;
  disabled?: boolean;
}) {
  const cls = `${btnBase} ${btnVariants[variant]} ${className}`;
  if (to)
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

export function PriorityBadge({ p }: { p: Priority }) {
  const c = p === "Yüksek" ? "bg-destructive" : p === "Orta" ? "bg-warning" : "bg-muted-foreground/50";
  return (
    <span className="tag inline-flex items-center gap-1.5 text-muted-foreground">
      <span aria-hidden className={`h-2 w-2 ${c}`} /> {p} öncelik
    </span>
  );
}

export function DemoNote({ children }: { children?: ReactNode }) {
  return (
    <div className="border-l-2 border-warning bg-warning-soft px-4 py-3 text-xs leading-relaxed text-foreground">
      <strong className="text-warning">Demo verisi.</strong>{" "}
      {children ??
        "Bu skorlar şeffaf, kural tabanlı bir hesaplamadır; bilimsel olarak doğrulanmış bir işe alım öngörüsü değildir."}
    </div>
  );
}

export function scoreBand(v: number) {
  return v >= 70 ? "Güçlü uyum" : v >= 40 ? "Orta uyum" : "Düşük uyum";
}

/** Replaces the decorative ring: a 0–100 scale with labelled bands, so the number is read in context. */
export function Ring({ value, label }: { value: number; size?: number; label?: string }) {
  return (
    <div className="w-full text-left">
      <div className="flex items-baseline gap-2">
        <span className="font-display text-6xl leading-none">%{value}</span>
        <span className="text-sm font-semibold text-teal">{scoreBand(value)}</span>
      </div>
      {label && <div className="mt-1 text-xs text-muted-foreground">{label}</div>}
      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-label="Uyum skoru"
        className="relative mt-4 h-2 w-full bg-muted"
      >
        <div className="h-full bg-primary" style={{ width: `${value}%` }} />
        <span aria-hidden className="absolute -top-1 bottom-[-4px] w-px bg-foreground/40" style={{ left: "40%" }} />
        <span aria-hidden className="absolute -top-1 bottom-[-4px] w-px bg-foreground/40" style={{ left: "70%" }} />
      </div>
      <div className="relative mt-2 h-4 text-[0.65rem] text-muted-foreground">
        <span className="absolute left-0">0</span>
        <span className="absolute -translate-x-1/2" style={{ left: "40%" }}>40</span>
        <span className="absolute -translate-x-1/2" style={{ left: "70%" }}>70</span>
        <span className="absolute right-0">100</span>
      </div>
    </div>
  );
}

export function Bar({ value, tone = "primary" }: { value: number; tone?: "primary" | "teal" }) {
  return (
    <div className="h-1.5 w-full overflow-hidden bg-muted" aria-hidden>
      <div className={`h-full ${tone === "teal" ? "bg-teal" : "bg-primary"}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export function Check({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M3 8.5l3.2 3L13 4.5" strokeLinecap="square" />
    </svg>
  );
}

export function PageHead({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <div className="mb-10 grid gap-4 border-b pb-8 md:grid-cols-12">
      <div className="md:col-span-7">
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="mt-3 text-4xl leading-[1.1] sm:text-[2.75rem]">{title}</h1>
      </div>
      {desc && (
        <p className="self-end text-base leading-relaxed text-muted-foreground md:col-span-5">{desc}</p>
      )}
    </div>
  );
}

export function NeedsSetup({ what }: { what: string }) {
  const { ready } = useStore();
  if (!ready) return <div className="py-24 text-center text-muted-foreground">Yükleniyor…</div>;
  return (
    <div className="mx-auto max-w-lg border-l-2 border-teal py-2 pl-6">
      <h2 className="text-xl font-bold">{what} için önce hedef ve profil gerekli</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Hedef pozisyonunu seç, profilini doldur ve analizi başlat.
      </p>
      <Btn to="/hedef" className="mt-5">
        Hedef & Profile Git
      </Btn>
    </div>
  );
}
