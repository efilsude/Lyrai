import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useStore } from "@/lib/store";
import { Btn, PageHead } from "@/components/kr";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Giriş Yap & Kayıt Ol — KariyerRota" },
      { name: "description", content: "KariyerRota hesabına giriş yap veya yeni profil oluştur." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { user, login, logout } = useStore();
  const nav = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      login({
        id: "google-101",
        name: "Zeynep Yılmaz",
        email: "zeynep.yilmaz@metu.edu.tr",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
        provider: "google",
      });
      setLoading(false);
      nav({ to: "/hedef" });
    }, 400);
  };

  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => {
      login({
        id: `user-${Date.now()}`,
        name: name.trim() || email.split("@")[0],
        email: email.trim(),
        provider: "email",
      });
      setLoading(false);
      nav({ to: "/hedef" });
    }, 400);
  };

  if (user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="border bg-card p-8">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal text-navy text-2xl font-bold">
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <h1 className="mt-4 text-2xl font-display">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="mt-2 tag text-teal font-semibold">Oturum Açık ({user.provider})</div>

          <div className="mt-6 flex flex-col gap-2">
            <Btn to="/hedef">Hedef ve Profilime Git →</Btn>
            <button
              type="button"
              onClick={logout}
              className="mt-2 border py-2 text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="border bg-card p-6 sm:p-8 shadow-sm">
        <div className="text-center">
          <div className="eyebrow">Hesap Erişimi</div>
          <h1 className="mt-2 text-3xl font-display">
            {mode === "login" ? "KariyerRota'ya Giriş Yap" : "Yeni Hesap Oluştur"}
          </h1>
          <p className="mt-2 text-xs text-muted-foreground">
            {mode === "login"
              ? "Kişisel kariyer yol haritanı ve başvuru analizlerini sakla."
              : "Tüm analizlerini tek bir profil altında güvenceye al."}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 border p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`py-2 transition-colors ${
              mode === "login" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`py-2 transition-colors ${
              mode === "register" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Kayıt Ol
          </button>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 border bg-background py-2.5 px-4 text-sm font-semibold transition-colors hover:bg-muted cursor-pointer"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.87c2.26-2.09 3.675-5.17 3.675-9.14z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.04c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.13C3.26 21.31 7.32 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.25c-.25-.72-.39-1.49-.39-2.25s.14-1.53.39-2.25V6.62H1.28C.46 8.24 0 10.06 0 12s.46 3.76 1.28 5.38l3.99-3.13z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.26 2.69 1.28 6.62l3.99 3.13c.95-2.85 3.6-4.96 6.73-4.96z"
              />
            </svg>
            <span>Google ile Giriş Yap</span>
          </button>
        </div>

        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <span className="relative bg-card px-2 text-[0.7rem] uppercase tracking-wider text-muted-foreground">
            veya e-posta ile
          </span>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-3">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-semibold">Ad Soyad</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn. Zeynep Yılmaz"
                className="mt-1 w-full rounded-sm border bg-background px-3 py-2 text-sm outline-none focus:border-teal"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold">E-posta</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@universite.edu.tr"
              className="mt-1 w-full rounded-sm border bg-background px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold">Şifre</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-sm border bg-background px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-sm bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
          >
            {loading ? "İşleniyor…" : mode === "login" ? "Giriş Yap" : "Hesap Oluştur"}
          </button>
        </form>
      </div>
    </div>
  );
}
