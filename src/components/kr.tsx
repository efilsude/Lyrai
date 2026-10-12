import { Link } from "@tanstack/react-router";
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
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-navy text-navy-foreground">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M4 18c4 0 4-12 8-12s4 12 8 12" strokeLinecap="round" /><circle cx="20" cy="18" r="1.6" fill="currentColor" /></svg>
          </span>
          <span className="font-display text-lg font-bold">Kariyer<span className="text-teal">Rota</span></span>
        </Link>
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

const btnBase = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50";
const btnVariants = {
  primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
  outline: "border bg-card text-foreground hover:bg-muted",
  teal: "bg-teal text-navy-foreground hover:opacity-90",
};
export function Btn({ to, onClick, children, variant = "primary", className = "", disabled }: { to?: string; onClick?: () => void; children: ReactNode; variant?: keyof typeof btnVariants; className?: string; disabled?: boolean }) {
  const cls = `${btnBase} ${btnVariants[variant]} ${className}`;
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  return <button type="button" onClick={onClick} disabled={disabled} className={cls}>{children}</button>;
}

export function PriorityBadge({ p }: { p: Priority }) {
  const c = p === "Yüksek" ? "bg-destructive-soft text-destructive" : p === "Orta" ? "bg-warning-soft text-warning" : "bg-muted text-muted-foreground";
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${c}`}>{p}</span>;
}

export function DemoNote({ children }: { children?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed bg-warning-soft px-3 py-2 text-xs text-warning">
      <strong>Demo tahmini:</strong> {children ?? "Bu skorlar şeffaf, kural tabanlı bir demo hesaplamasıdır; bilimsel olarak doğrulanmış bir işe alım öngörüsü değildir."}
    </div>
  );
}

export function Ring({ value, size = 140, label }: { value: number; size?: number; label?: string }) {
  const r = size / 2 - 10, c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-muted)" strokeWidth="10" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-primary)" strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-display text-3xl font-bold">%{value}</div>
          {label && <div className="text-xs text-muted-foreground">{label}</div>}
        </div>
      </div>
    </div>
  );
}

export function Bar({ value, tone = "primary" }: { value: number; tone?: "primary" | "teal" }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div className={`h-full rounded-full ${tone === "teal" ? "bg-teal" : "bg-primary"}`} style={{ width: `${value}%`, transition: "width .8s ease" }} />
    </div>
  );
}

export function PageHead({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <div className="mb-8">
      <div className="text-xs font-bold uppercase tracking-widest text-teal">{eyebrow}</div>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h1>
      {desc && <p className="mt-2 max-w-2xl text-muted-foreground">{desc}</p>}
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
