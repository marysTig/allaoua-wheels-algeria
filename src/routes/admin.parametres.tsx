import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AdminShell, adminBtn, adminCard, adminInput, adminLabel } from "@/components/AdminShell";
import { store, useAppData, type AgencyInfo } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/parametres")({
  head: () => ({
    meta: [
      { title: "Informations agence — Admin ALLAOUA Location" },
      { name: "robots", content: "noindex" },
      { name: "description", content: "Modification des coordonnées de l'agence ALLAOUA Location." },
    ],
  }),
  component: SettingsAdmin,
});

const FIELDS: { key: keyof AgencyInfo; label: string }[] = [
  { key: "name", label: "Nom de l'agence" },
  { key: "address", label: "Adresse" },
  { key: "hours", label: "Horaires" },
  { key: "phone1", label: "Téléphone / WhatsApp 1 (Allaoua)" },
  { key: "phone2", label: "Téléphone / WhatsApp 2 (Idir)" },
  { key: "mapsUrl", label: "Lien Google Maps (URL d'intégration)" },
];

function SettingsAdmin() {
  const { agency } = useAppData();
  const [form, setForm] = useState<AgencyInfo>(agency);
  const [saved, setSaved] = useState(false);

  return (
    <AdminShell title="Informations agence">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          store.saveAgency(form);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }}
        className={`${adminCard} max-w-2xl`}
      >
        <div className="grid gap-4">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className={adminLabel} htmlFor={f.key}>{f.label}</label>
              <input
                id={f.key}
                className={adminInput}
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-3">
          <button type="submit" className={adminBtn}>Enregistrer</button>
          {saved && <span className="text-sm font-medium text-whatsapp">Modifications enregistrées</span>}
        </div>
      </form>
    </AdminShell>
  );
}
