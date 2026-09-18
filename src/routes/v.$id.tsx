import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Phone,
  MessageCircle,
  Users,
  DoorOpen,
  Gauge,
  Fuel,
  Settings2,
  ChevronLeft,
} from "lucide-react";
import { useAppData, waLink, telLink } from "@/lib/admin-store";

export const Route = createFileRoute("/v/$id")({
  head: () => ({
    meta: [{ title: "Véhicule — ALLAOUA Location" }],
  }),
  component: VehiclePage,
});

function VehiclePage() {
  const { id } = Route.useParams();
  const { vehicles, agency } = useAppData();
  const [selectedImage, setSelectedImage] = useState(0);

  const vehicle = vehicles.find((v) => v.id === id);

  if (!vehicle) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <h1 className="text-2xl font-bold text-foreground">Véhicule introuvable</h1>
        <p className="mt-2 text-muted-foreground">Ce véhicule n'existe pas ou a été retiré.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> Retour à l'accueil
        </Link>
      </div>
    );
  }

  // Use fallback if images array is empty
  const images = vehicle.images?.length > 0 ? vehicle.images : [vehicle.image];

  const specs = [
    { icon: Settings2, label: vehicle.transmission },
    { icon: Fuel, label: vehicle.fuel },
    { icon: Users, label: `${vehicle.seats} Sièges` },
    { icon: DoorOpen, label: `${vehicle.doors} Portes` },
  ];

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-accent/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-accent"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Retour aux véhicules</span>
            <span className="sm:hidden">Retour</span>
          </Link>
          <div className="font-display font-bold text-primary sm:text-lg">{vehicle.name}</div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted">
              <img
                src={images[selectedImage]}
                alt={vehicle.name}
                className="h-full w-full object-cover"
              />
              {!vehicle.available && (
                <span className="absolute right-4 top-4 rounded-full bg-destructive px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-destructive-foreground">
                  Indisponible
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl border-2 sm:w-full ${selectedImage === i ? "border-primary" : "border-transparent"} transition-all`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              {vehicle.name}
            </h1>
            <div className="mt-4 border-b border-border pb-4">
              <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                Prix par jour
              </p>
              <p className="mt-1 font-display text-4xl font-bold text-primary">
                {vehicle.pricePerDay > 0
                  ? `${vehicle.pricePerDay.toLocaleString("fr-FR")} DA`
                  : "Sur demande"}
              </p>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-foreground">Caractéristiques</h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm border border-border"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
                      <spec.icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium text-foreground">{spec.label}</span>
                  </div>
                ))}
                {vehicle.mileage && (
                  <div className="col-span-2 flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm border border-border">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
                      <Gauge className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium text-foreground">{vehicle.mileage}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href={waLink(
                  agency.phone1,
                  `Bonjour, je suis intéressé(e) par le véhicule ${vehicle.name}. Est-il disponible ?`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-[#25D366] px-6 py-4 font-semibold text-white shadow-lg transition-transform hover:scale-[1.02]"
              >
                <MessageCircle className="h-6 w-6" />
                WhatsApp
              </a>
              <a
                href={telLink(agency.phone1)}
                className="flex flex-1 items-center justify-center gap-3 rounded-xl border border-input bg-card px-6 py-4 font-semibold text-foreground shadow-sm transition-transform hover:scale-[1.02] hover:bg-accent/5"
              >
                <Phone className="h-6 w-6" />
                Appeler
              </a>
            </div>

            {!vehicle.available && (
              <p className="mt-6 text-center text-sm font-medium text-destructive">
                Attention : Ce véhicule est actuellement indisponible à la location.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
