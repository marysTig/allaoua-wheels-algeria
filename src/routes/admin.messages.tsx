import { createFileRoute } from "@tanstack/react-router";
import { Check, RotateCcw, Trash2 } from "lucide-react";

import { AdminShell, adminCard } from "@/components/AdminShell";
import { store, useAppData } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/messages")({
  head: () => ({
    meta: [
      { title: "Demandes de réservation — Admin ALLAOUA Location" },
      { name: "robots", content: "noindex" },
      { name: "description", content: "Demandes de réservation reçues via le formulaire de contact." },
    ],
  }),
  component: MessagesAdmin,
});

function MessagesAdmin() {
  const { messages } = useAppData();
  const sorted = [...messages].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <AdminShell title="Demandes de réservation">
      {sorted.length === 0 && (
        <div className={`${adminCard} text-center text-muted-foreground`}>
          Aucune demande pour le moment.
        </div>
      )}
      <div className="grid gap-4">
        {sorted.map((m) => (
          <div key={m.id} className={adminCard}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display font-bold text-foreground">{m.name}</p>
                <a href={`tel:${m.phone}`} className="text-sm text-primary hover:underline">{m.phone}</a>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${m.handled ? "bg-whatsapp/15 text-whatsapp" : "bg-accent/15 text-accent"}`}>
                {m.handled ? "Traité" : "Non traité"}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              <strong className="text-foreground">Dates souhaitées :</strong> {m.dates || "—"}
            </p>
            {m.message && <p className="mt-2 text-sm text-muted-foreground">{m.message}</p>}
            <p className="mt-3 text-xs text-muted-foreground">
              Reçu le {new Date(m.createdAt).toLocaleString("fr-FR")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => store.toggleMessage(m.id)}
                className="inline-flex items-center gap-2 rounded-lg border border-input px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
              >
                {m.handled ? <RotateCcw className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                {m.handled ? "Marquer non traité" : "Marquer traité"}
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Supprimer cette demande ?")) store.deleteMessage(m.id);
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-input px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" /> Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
