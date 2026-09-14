import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import {
  LayoutDashboard,
  Car,
  Wrench,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";

import { logout, useIsAuthenticated } from "@/lib/admin-store";

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/vehicules", label: "Véhicules", icon: Car },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/messages", label: "Messages", icon: Inbox },
  { to: "/admin/parametres", label: "Informations agence", icon: Settings },
] as const;

export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  const isAuth = useIsAuthenticated();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) navigate({ to: "/admin/login", replace: true });
  }, [isAuth, navigate]);

  if (!isAuth) {
    return (
      <div className="grid min-h-screen place-items-center bg-muted text-sm text-muted-foreground">
        Redirection vers la connexion…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted font-sans md:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-border bg-primary text-primary-foreground md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="px-5 py-5">
          <p className="font-display text-lg font-bold">
            ALLAOUA <span className="text-accent">Admin</span>
          </p>
        </div>
        <nav className="flex flex-wrap gap-1 px-3 pb-4 md:flex-col md:flex-nowrap">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: "exact" in l ? l.exact : false }}
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              inactiveProps={{ className: "text-primary-foreground/75 hover:bg-white/10" }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => {
              logout();
              navigate({ to: "/admin/login", replace: true });
            }}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary-foreground/75 transition-colors hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </nav>
        <div className="mt-auto hidden px-3 pb-5 md:block">
          <a
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-primary-foreground/60 hover:text-accent"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Voir le site public
          </a>
        </div>
      </aside>

      <main className="flex-1 px-4 py-8 sm:px-8">
        <h1 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">{title}</h1>
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}

export const adminCard =
  "rounded-2xl border border-border bg-card p-6 shadow-sm";
export const adminInput =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30";
export const adminLabel = "mb-1.5 block text-sm font-medium text-foreground";
export const adminBtn =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-navy-deep";
