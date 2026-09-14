import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

import { AdminShell, adminBtn, adminCard, adminInput, adminLabel } from "@/components/AdminShell";
import { store, useAppData, type Vehicle, type VehicleCategory } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/vehicules")({
  head: () => ({
    meta: [
      { title: "Véhicules — Admin ALLAOUA Location" },
      { name: "robots", content: "noindex" },
      { name: "description", content: "Gestion de la flotte de véhicules ALLAOUA Location." },
    ],
  }),
  component: VehiclesAdmin,
});

const CATEGORIES: VehicleCategory[] = ["Minibus", "Berline", "Citadine", "Utilitaire"];

const emptyForm: Omit<Vehicle, "id"> = {
  name: "",
  category: "Minibus",
  image: "",
  transmission: "Manuelle",
  fuel: "Diesel",
  seats: 5,
  doors: 5,
  mileage: "",
  pricePerDay: 0,
  available: true,
};

function VehiclesAdmin() {
  const { vehicles } = useAppData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Vehicle, "id">>(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const startEdit = (v: Vehicle) => {
    const { id, ...rest } = v;
    setEditingId(id);
    setForm(rest);
    setShowForm(true);
  };

  const reset = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(false);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) store.updateVehicle(editingId, form);
    else store.addVehicle(form);
    reset();
  };

  const remove = (v: Vehicle) => {
    if (window.confirm(`Supprimer définitivement « ${v.name} » ?`)) store.deleteVehicle(v.id);
  };

  return (
    <AdminShell title="Gestion des véhicules">
      {!showForm && (
        <button onClick={() => setShowForm(true)} className={`${adminBtn} mb-6`}>
          <Plus className="h-4 w-4" /> Ajouter un véhicule
        </button>
      )}

      {showForm && (
        <form onSubmit={submit} className={`${adminCard} mb-6`}>
          <h2 className="font-display text-lg font-bold text-foreground">
            {editingId ? "Modifier le véhicule" : "Nouveau véhicule"}
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={adminLabel} htmlFor="name">Nom du véhicule</label>
              <input id="name" required className={adminInput} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className={adminLabel} htmlFor="cat">Catégorie</label>
              <select id="cat" className={adminInput} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as VehicleCategory })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={adminLabel} htmlFor="img">Image (URL)</label>
              <input id="img" className={adminInput} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://…" />
            </div>
            <div>
              <label className={adminLabel} htmlFor="box">Boîte</label>
              <select id="box" className={adminInput} value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value as Vehicle["transmission"] })}>
                <option>Manuelle</option>
                <option>Automatique</option>
              </select>
            </div>
            <div>
              <label className={adminLabel} htmlFor="fuel">Carburant</label>
              <select id="fuel" className={adminInput} value={form.fuel} onChange={(e) => setForm({ ...form, fuel: e.target.value as Vehicle["fuel"] })}>
                <option>Diesel</option>
                <option>Essence</option>
              </select>
            </div>
            <div>
              <label className={adminLabel} htmlFor="seats">Nombre de places</label>
              <input id="seats" type="number" min={1} className={adminInput} value={form.seats} onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })} />
            </div>
            <div>
              <label className={adminLabel} htmlFor="doors">Nombre de portes</label>
              <input id="doors" type="number" min={1} className={adminInput} value={form.doors} onChange={(e) => setForm({ ...form, doors: Number(e.target.value) })} />
            </div>
            <div>
              <label className={adminLabel} htmlFor="km">Kilométrage inclus</label>
              <input id="km" className={adminInput} value={form.mileage} onChange={(e) => setForm({ ...form, mileage: e.target.value })} placeholder="Ex : 500 Km/jour" />
            </div>
            <div>
              <label className={adminLabel} htmlFor="price">Prix par jour (DA)</label>
              <input id="price" type="number" min={0} className={adminInput} value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: Number(e.target.value) })} />
            </div>
            <div>
              <label className={adminLabel} htmlFor="status">Statut</label>
              <select id="status" className={adminInput} value={form.available ? "1" : "0"} onChange={(e) => setForm({ ...form, available: e.target.value === "1" })}>
                <option value="1">Disponible</option>
                <option value="0">Indisponible</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button type="submit" className={adminBtn}>{editingId ? "Enregistrer" : "Ajouter"}</button>
            <button type="button" onClick={reset} className="rounded-lg border border-input px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted">
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className={`${adminCard} overflow-x-auto p-0`}>
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Véhicule</th>
              <th className="px-5 py-3">Catégorie</th>
              <th className="px-5 py-3">Prix / jour</th>
              <th className="px-5 py-3">Statut</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium text-foreground">{v.name}</td>
                <td className="px-5 py-3 text-muted-foreground">{v.category}</td>
                <td className="px-5 py-3 text-muted-foreground">{v.pricePerDay > 0 ? `${v.pricePerDay.toLocaleString("fr-FR")} DA` : "Sur demande"}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${v.available ? "bg-whatsapp/15 text-whatsapp" : "bg-destructive/15 text-destructive"}`}>
                    {v.available ? "Disponible" : "Indisponible"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => startEdit(v)} aria-label={`Modifier ${v.name}`} className="grid h-9 w-9 place-items-center rounded-lg border border-input text-foreground hover:bg-muted">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(v)} aria-label={`Supprimer ${v.name}`} className="grid h-9 w-9 place-items-center rounded-lg border border-input text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">Aucun véhicule.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
