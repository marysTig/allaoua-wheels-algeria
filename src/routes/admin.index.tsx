import { createFileRoute, Link } from "@tanstack/react-router";
import { Car, CheckCircle2, XCircle, Inbox } from "lucide-react";

import { AdminShell, adminCard } from "@/components/AdminShell";
import { useAppData } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Admin ALLAOUA Location" },
      { name: "robots", content: "noindex" },
      { name: "description", content: "Tableau de bord de gestion ALLAOUA Location." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { vehicles, messages } = useAppData();
  const available = vehicles.filter((v) => v.available).length;

  const stats = [
    { label: "Véhicules au total", value: vehicles.length, icon: Car, tone: "text-primary" },
    { label: "Disponibles", value: available, icon: CheckCircle2, tone: "text-whatsapp" },
    { label: "Indisponibles", value: vehicles.length - available, icon: XCircle, tone: "text-destructive" },
    { label: "Messages non traités", value: messages.filter((m) => !m.handled).length, icon: Inbox, tone: "text-accent" },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={adminCard}>
            <s.icon className={`h-6 w-6 ${s.tone}`} />
            <p className="mt-3 font-display text-3xl font-extrabold text-foreground">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/admin/vehicules" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-navy-deep">
          Gérer les véhicules
        </Link>
        <Link to="/admin/messages" className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground">
          Voir les demandes
        </Link>
      </div>
    </AdminShell>
  );
}
