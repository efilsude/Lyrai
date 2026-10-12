import { Link, type LinkProps } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useStore } from "@/lib/store";
import type { Priority } from "@/lib/career-data";

const NAV = [
  { to: "/hedef", label: "Hedef & Profil" },
  { to: "/analiz", label: "Analiz" },
  { to: "/yol-haritasi", label: "Yol Haritası" },
  { to: "/cv", label: "CV Asistanı" },
  { to: "/etki", label: "Sosyal Etki" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="shrink-0 font-display text-2xl tracking-tight">Kariyer<span className="italic text-teal">Rota</span></Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground" activeProps={{ className: "bg-accent text-accent-foreground" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <Btn to="/hedef" className="hidden sm:inline-flex">Yol Haritamı Oluştur</Btn>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t px-3 py-2 md:hidden">
        {NAV.map((n) => (
          <Link key={n.to} to={n.to} className="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground" activeProps={{ className: "bg-accent text-accent-foreground" }}>
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
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <span>© 2026 KariyerRota — Sosyal girişimcilik hackathonu demosu</span>
        <span>Tüm skorlar demo tahminidir, bilimsel olarak doğrulanmış öngörü değildir.</span>
      </div>
    </footer>
  );
}

const btnBase = "inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50";
const btnVariants = {
  primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
  outline: "border bg-card text-foreground hover:bg-muted",
  teal: "bg-teal text-navy-foreground hover:opacity-90",
};
export function Btn({ to, onClick, children, variant = "primary", className = "", disabled }: { to?: LinkProps["to"]; onClick?: () => void; children: ReactNode; variant?: keyof typeof btnVariants; className?: string; disabled?: boolean }) {
  const cls = `${btnBase} ${btnVariants[variant]} ${className}`;
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  return <button type="button" onClick={onClick} disabled={disabled} className={cls}>{children}</button>;
}

export function PriorityBadge({ p }: { p: Priority }) {
  const c = p === "Yüksek" ? "bg-destructive" : p === "Orta" ? "bg-warning" : "bg-muted-foreground/50";
  return (
    <span className="tag inline-flex items-center gap-1.5 text-muted-foreground">
      <span className={`h-2 w-2 ${c}`} /> {p} öncelik
    </span>
  );
}

export function DemoNote({ children }: { children?: ReactNode }) {
  return (
    <div className="border-l-2 border-warning bg-warning-soft px-4 py-3 text-xs leading-relaxed text-foreground">
      <strong className="text-warning">Demo verisi.</strong> {children ?? "Bu skorlar şeffaf, kural tabanlı bir demo hesaplamasıdır; bilimsel olarak doğrulanmış bir işe alım öngörüsü değildir."}
    </div>
  );
}

export function Ring({ value, size = 140, label }: { value: number; size?: number; label?: string }) {
  const r = size / 2 - 10, c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-muted)" strokeWidth="6" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-primary)" strokeWidth="6" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-display text-4xl">%{value}</div>
          {label && <div className="text-xs text-muted-foreground">{label}</div>}
        </div>
      </div>
    </div>
  );
}

export function Bar({ value, tone = "primary" }: { value: number; tone?: "primary" | "teal" }) {
  return (
    <div className="h-1.5 w-full overflow-hidden bg-muted">
      <div className={`h-full ${tone === "teal" ? "bg-teal" : "bg-primary"}`} style={{ width: `${value}%`, transition: "width .8s ease" }} />
    </div>
  );
}

export function PageHead({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <div className="mb-12 border-b pb-10">
      <div className="eyebrow">{eyebrow}</div>
      <h1 className="mt-3 text-4xl leading-[1.1] sm:text-5xl">{title}</h1>
      {desc && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{desc}</p>}
    </div>
  );
}

export function NeedsSetup({ what }: { what: string }) {
  const { ready } = useStore();
  if (!ready) return <div className="py-24 text-center text-muted-foreground">Yükleniyor…</div>;
  return (
    <div className="card-surface mx-auto max-w-lg p-8 text-center">
      <h2 className="text-xl font-bold">{what} için önce hedef ve profil gerekli</h2>
      <p className="mt-2 text-sm text-muted-foreground">Hedef pozisyonunu seç, profilini doldur ve analizi başlat.</p>
      <Btn to="/hedef" className="mt-5">Hedef & Profile Git</Btn>
    </div>
  );
}
