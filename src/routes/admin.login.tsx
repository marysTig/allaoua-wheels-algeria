import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

import { login, useIsAuthenticated } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Connexion admin — ALLAOUA Location" },
      { name: "robots", content: "noindex" },
      { name: "description", content: "Connexion à l'espace d'administration ALLAOUA Location." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const isAuth = useIsAuthenticated();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuth) navigate({ to: "/admin", replace: true });
  }, [isAuth, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      navigate({ to: "/admin", replace: true });
    } else {
      setError("Identifiant ou mot de passe incorrect.");
    }
  };

  const input =
    "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30";

  return (
    <div className="grid min-h-screen place-items-center bg-primary px-4 font-sans">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-card p-8 shadow-xl">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground">
          <Lock className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-center font-display text-xl font-extrabold text-foreground">
          Espace administrateur
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">ALLAOUA Location</p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="u" className="mb-1.5 block text-sm font-medium text-foreground">
              Adresse e-mail
            </label>
            <input
              id="u"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={input}
              required
              autoComplete="email"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label htmlFor="p" className="mb-1.5 block text-sm font-medium text-foreground">
              Mot de passe
            </label>
            <input
              id="p"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={input}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent px-4 py-3 font-semibold text-accent-foreground transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </div>
      </form>
    </div>
  );
}
