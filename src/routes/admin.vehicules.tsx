import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Pencil, Trash2, Plus, UploadCloud, X, AlertCircle, Loader2 } from "lucide-react";

import { AdminShell, adminBtn, adminCard, adminInput, adminLabel } from "@/components/AdminShell";
import { store, useAppData, isExpiringSoon, uploadImageToCloudinary, type Vehicle } from "@/lib/admin-store";

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

const emptyForm: Omit<Vehicle, "id"> = {
  name: "",
  image: "",
  transmission: "Manuelle",
  fuel: "Diesel",
  seats: 5,
  doors: 5,
  mileage: "",
  pricePerDay: 0,
  available: true,
  images: [],
  insuranceStart: "",
  insuranceEnd: "",
  vignetteStart: "",
  vignetteEnd: "",
};

function VehiclesAdmin() {
  const { vehicles } = useAppData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Vehicle, "id">>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startEdit = (v: Vehicle) => {
    const { id, ...rest } = v;
    setEditingId(id);
    setForm({
      ...rest,
      images: rest.images || (rest.image ? [rest.image] : []),
    });
    setShowForm(true);
  };

  const reset = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(false);
    setSubmitError("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      if (editingId) await store.updateVehicle(editingId, form);
      else await store.addVehicle(form);
      reset();
    } catch (err) {
      setSubmitError("Erreur lors de l'enregistrement. Vérifiez votre connexion Supabase.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const currentImages = form.images || [];
    if (currentImages.length >= 6) return;
    const remaining = 6 - currentImages.length;
    const newFiles = Array.from(files).slice(0, remaining);

    setUploading(true);
    try {
      const urls = await Promise.all(newFiles.map((file) => uploadImageToCloudinary(file)));
      const newImages = [...currentImages, ...urls];
      setForm((f) => ({ ...f, images: newImages, image: newImages[0] || f.image }));
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      alert("Échec de l'upload. Vérifiez votre configuration Cloudinary dans .env");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...(form.images || [])];
    newImages.splice(index, 1);
    setForm({ ...form, images: newImages, image: newImages[0] || "" });
  };

  const remove = async (v: Vehicle) => {
    if (window.confirm(`Supprimer définitivement « ${v.name} » ?`)) {
      try {
        await store.deleteVehicle(v.id);
      } catch (err) {
        alert("Erreur lors de la suppression.");
        console.error(err);
      }
    }
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
              <label className={adminLabel}>Assurance</label>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <span className="mb-1 block text-xs text-muted-foreground">Début</span>
                  <input type="date" className={adminInput} value={form.insuranceStart} onChange={(e) => setForm({ ...form, insuranceStart: e.target.value })} />
                </div>
                <div className="w-1/2">
                  <span className="mb-1 block text-xs text-muted-foreground">Fin</span>
                  <input type="date" className={adminInput} value={form.insuranceEnd} onChange={(e) => setForm({ ...form, insuranceEnd: e.target.value })} />
                </div>
              </div>
            </div>
            <div>
              <label className={adminLabel}>Vignette</label>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <span className="mb-1 block text-xs text-muted-foreground">Début</span>
                  <input type="date" className={adminInput} value={form.vignetteStart} onChange={(e) => setForm({ ...form, vignetteStart: e.target.value })} />
                </div>
                <div className="w-1/2">
                  <span className="mb-1 block text-xs text-muted-foreground">Fin</span>
                  <input type="date" className={adminInput} value={form.vignetteEnd} onChange={(e) => setForm({ ...form, vignetteEnd: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className={adminLabel}>Images du véhicule (Max 6)</label>
              <div
                className={`mt-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-8 text-center transition-colors hover:border-foreground/30 hover:bg-muted/50 ${uploading ? "cursor-wait opacity-60" : "cursor-pointer"}`}
                onClick={() => !uploading && fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (!uploading) handleFiles(e.dataTransfer.files);
                }}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Upload en cours…</p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="mb-3 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-foreground">
                      Glissez-déposez vos images ici ou{" "}
                      <span className="text-primary hover:underline">parcourez</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">PNG, JPG jusqu'à 5MB · max 6 photos</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    handleFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </div>

              {(form.images?.length || 0) > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {form.images?.map((img, i) => (
                    <div key={i} className="group relative aspect-video overflow-hidden rounded-lg border border-border">
                      <img src={img} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-black group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
          <div className="mt-6 flex flex-col gap-3">
            {submitError && <p className="text-sm font-medium text-destructive">{submitError}</p>}
            <div className="flex gap-3">
              <button type="submit" disabled={submitting || uploading} className={`${adminBtn} disabled:opacity-60`}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {editingId ? "Enregistrer" : "Ajouter"}
              </button>
              <button type="button" onClick={reset} disabled={submitting} className="rounded-lg border border-input px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-60">
                Annuler
              </button>
            </div>
          </div>
        </form>
      )}

      <div className={`${adminCard} overflow-x-auto p-0`}>
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Véhicule</th>
              <th className="px-5 py-3">Assurance</th>
              <th className="px-5 py-3">Vignette</th>
              <th className="px-5 py-3">Prix / jour</th>
              <th className="px-5 py-3">Statut</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    {v.name}
                    {(isExpiringSoon(v.insuranceEnd) || isExpiringSoon(v.vignetteEnd)) && (
                      <AlertCircle className="h-4 w-4 text-destructive" title="Assurance ou vignette expire bientôt !" />
                    )}
                  </div>
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {v.insuranceStart && v.insuranceEnd ? (
                    <span className={isExpiringSoon(v.insuranceEnd) ? "text-destructive font-semibold" : ""}>
                      {new Date(v.insuranceStart).toLocaleDateString("fr-FR")} - {new Date(v.insuranceEnd).toLocaleDateString("fr-FR")}
                    </span>
                  ) : "-"}
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {v.vignetteStart && v.vignetteEnd ? (
                    <span className={isExpiringSoon(v.vignetteEnd) ? "text-destructive font-semibold" : ""}>
                      {new Date(v.vignetteStart).toLocaleDateString("fr-FR")} - {new Date(v.vignetteEnd).toLocaleDateString("fr-FR")}
                    </span>
                  ) : "-"}
                </td>
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
              <tr><td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">Aucun véhicule.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
