import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { AdminShell, adminBtn, adminCard, adminInput, adminLabel } from "@/components/AdminShell";
import { store, useAppData } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/services")({
  head: () => ({
    meta: [
      { title: "Services — Admin ALLAOUA Location" },
      { name: "robots", content: "noindex" },
      { name: "description", content: "Gestion des services proposés par ALLAOUA Location." },
    ],
  }),
  component: ServicesAdmin,
});

function ServicesAdmin() {
  const { services } = useAppData();
  const [draft, setDraft] = useState({ title: "", description: "" });

  return (
    <AdminShell title="Gestion des services">
      <div className="grid gap-4">
        {services.map((s) => (
          <ServiceRow key={s.id} id={s.id} title={s.title} description={s.description} />
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          store.addService(draft);
          setDraft({ title: "", description: "" });
        }}
        className={`${adminCard} mt-6`}
      >
        <h2 className="font-display text-lg font-bold text-foreground">Ajouter un service</h2>
        <div className="mt-4 grid gap-4">
          <div>
            <label className={adminLabel} htmlFor="nt">Titre</label>
            <input id="nt" required className={adminInput} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </div>
          <div>
            <label className={adminLabel} htmlFor="nd">Description</label>
            <textarea id="nd" rows={3} required className={adminInput} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </div>
        </div>
        <button type="submit" className={`${adminBtn} mt-4`}>
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </form>
    </AdminShell>
  );
}

function ServiceRow({ id, title, description }: { id: string; title: string; description: string }) {
  const [form, setForm] = useState({ title, description });
  const [saved, setSaved] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        store.updateService(id, form);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }}
      className={adminCard}
    >
      <div className="grid gap-4">
        <div>
          <label className={adminLabel} htmlFor={`t-${id}`}>Titre</label>
          <input id={`t-${id}`} className={adminInput} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div>
          <label className={adminLabel} htmlFor={`d-${id}`}>Description</label>
          <textarea id={`d-${id}`} rows={3} className={adminInput} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button type="submit" className={adminBtn}>Enregistrer</button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Supprimer le service « ${title} » ?`)) store.deleteService(id);
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-input px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" /> Supprimer
        </button>
        {saved && <span className="text-sm font-medium text-whatsapp">Enregistré</span>}
      </div>
    </form>
  );
}
