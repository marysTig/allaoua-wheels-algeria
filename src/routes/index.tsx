import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Phone,
  MessageCircle,
  Menu,
  X,
  Users,
  DoorOpen,
  Gauge,
  Fuel,
  Settings2,
  BadgeCheck,
  Clock,
  Zap,
  Wallet,
  UserRound,
  KeyRound,
  MapPin,
  Car,
} from "lucide-react";

import heroImg from "@/assets/hero.jpg";
import {
  store,
  useAppData,
  waLink,
  telLink,
  formatPhone,
  type Vehicle,
  type AgencyInfo,
} from "@/lib/admin-store";

const NAV = [
  { label: "Accueil", href: "#accueil" },
  { label: "Véhicules", href: "#vehicules" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ALLAOUA Location — Location de voitures à Seddouk, 24h/24" },
      {
        name: "description",
        content:
          "ALLAOUA Location (Ets ACHOURI) : location de voitures avec ou sans chauffeur à Seddouk, Algérie. Minibus 9 places diesel, disponibles 24h/24. Appelez le 0770 64 65 57.",
      },
      { property: "og:title", content: "ALLAOUA Location — Location de voitures à Seddouk" },
      {
        property: "og:description",
        content: "Location de voitures avec ou sans chauffeur à Seddouk, disponible 24h/24.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Header({ agency }: { agency: AgencyInfo }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href="#accueil" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Car className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            ALLAOUA <span className="text-accent">Location</span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={telLink(agency.phone1)}
            className="hidden items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm transition-transform hover:scale-[1.03] sm:inline-flex"
          >
            <Phone className="h-4 w-4" />
            Appeler maintenant
          </a>
          <button
            onClick={() => setOpen(!open)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-border text-foreground md:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-card px-4 py-3 md:hidden">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              {item.label}
            </a>
          ))}
          <a
            href={telLink(agency.phone1)}
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground"
          >
            <Phone className="h-4 w-4" />
            Appeler maintenant
          </a>
        </nav>
      )}
    </header>
  );
}

function Hero({ agency }: { agency: AgencyInfo }) {
  return (
    <section id="accueil" className="relative overflow-hidden">
      <img
        src={heroImg}
        alt="Minibus de location ALLAOUA Location à Seddouk"
        className="absolute inset-0 h-full w-full object-cover"
        width={1920}
        height={1088}
      />
      <div className="absolute inset-0 bg-navy-deep/80" />
      <div className="relative mx-auto flex min-h-[560px] max-w-6xl flex-col items-start justify-center px-4 py-24">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
          <Clock className="h-3.5 w-3.5 text-accent" />
          {agency.hours}
        </span>
        <h1 className="max-w-2xl font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl">
          Location de voitures à Seddouk,{" "}
          <span className="text-accent">avec ou sans chauffeur</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-white/85">
          Des véhicules fiables, récents et entretenus, disponibles à toute heure.
          ALLAOUA Location vous accompagne partout en Algérie, de jour comme de nuit.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={telLink(agency.phone1)}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-semibold text-accent-foreground shadow-lg transition-transform hover:scale-[1.03]"
          >
            <Phone className="h-5 w-5" />
            Appeler
          </a>
          <a
            href={waLink(agency.phone1, "Bonjour, je souhaite louer un véhicule. Pouvez-vous me donner plus d'informations ?")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-6 py-3.5 font-semibold text-whatsapp-foreground shadow-lg transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp
          </a>
          <a
            href="#vehicules"
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <Car className="h-5 w-5" />
            Voir les véhicules
          </a>
        </div>
      </div>
    </section>
  );
}

function VehicleCard({ vehicle, agency }: { vehicle: Vehicle; agency: AgencyInfo }) {
  const specs = [
    { icon: Settings2, label: vehicle.transmission },
    { icon: Fuel, label: vehicle.fuel },
    { icon: Users, label: `${vehicle.seats} Sièges` },
    { icon: DoorOpen, label: `${vehicle.doors} Portes` },
  ];
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative overflow-hidden">
        <img
          src={vehicle.image}
          alt={`${vehicle.name} en location chez ALLAOUA Location`}
          loading="lazy"
          width={1024}
          height={768}
          className="aspect-[4/3] w-full bg-muted object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">
          {vehicle.category}
        </span>
        {!vehicle.available && (
          <span className="absolute right-3 top-3 rounded-full bg-destructive px-3 py-1 text-xs font-bold uppercase tracking-wide text-destructive-foreground">
            Indisponible
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-bold text-foreground">{vehicle.name}</h3>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {specs.map((spec) => (
            <div key={spec.label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <spec.icon className="h-4 w-4 shrink-0 text-primary" />
              {spec.label}
            </div>
          ))}
        </div>
        {vehicle.mileage && (
          <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
            <Gauge className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{vehicle.mileage}</span>
          </div>
        )}
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Prix / jour</p>
            <p className="font-display font-bold text-primary">
              {vehicle.pricePerDay > 0
                ? `${vehicle.pricePerDay.toLocaleString("fr-FR")} DA`
                : "Prix sur demande"}
            </p>
          </div>
          <a
            href={waLink(
              agency.phone1,
              `Bonjour, je souhaite réserver le véhicule ${vehicle.name}, merci de me donner plus d'informations.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-navy-deep"
          >
            <MessageCircle className="h-4 w-4" />
            Réserver
          </a>
        </div>
      </div>
    </article>
  );
}

function Vehicles({ vehicles, agency }: { vehicles: Vehicle[]; agency: AgencyInfo }) {
  return (
    <section id="vehicules" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
      <div className="mb-10 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-accent">Notre flotte</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
          Nos véhicules
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Minibus et utilitaires diesel 9 places, parfaits pour les familles, les groupes et les professionnels.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((v) => (
          <VehicleCard key={v.id} vehicle={v} agency={agency} />
        ))}
      </div>
    </section>
  );
}

function Services({ services }: { services: { id: string; title: string; description: string }[] }) {
  const icons = [UserRound, KeyRound, Car, BadgeCheck];
  return (
    <section id="services" className="scroll-mt-20 bg-primary py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-accent">Nos services</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-primary-foreground sm:text-4xl">
            Une formule pour chaque besoin
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((s, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div
                key={s.id}
                className="flex flex-col items-start gap-4 rounded-2xl bg-white/10 p-8 backdrop-blur transition-colors hover:bg-white/15"
              >
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="font-display text-2xl font-bold text-primary-foreground">{s.title}</h3>
                <p className="text-primary-foreground/80">{s.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const points = [
    { icon: Wallet, title: "Prix compétitifs", text: "Des tarifs justes et transparents, sans surprise." },
    { icon: BadgeCheck, title: "Véhicules récents et entretenus", text: "Une flotte contrôlée et révisée régulièrement." },
    { icon: Zap, title: "Service rapide", text: "Réservation simple et remise du véhicule sans attente." },
    { icon: Clock, title: "Disponibilité 24h/24", text: "Joignables à toute heure, 7 jours sur 7." },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="mb-10 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-accent">Nos engagements</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
          Pourquoi nous choisir
        </h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {points.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent/15 text-accent">
              <p.icon className="h-7 w-7" />
            </span>
            <h3 className="mt-4 font-display text-lg font-bold text-foreground">{p.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact({ agency }: { agency: AgencyInfo }) {
  const [form, setForm] = useState({ name: "", phone: "", dates: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    store.addMessage(form);
    const text = `Bonjour, je suis ${form.name} (${form.phone}). Dates souhaitées : ${form.dates}. ${form.message}`;
    window.open(waLink(agency.phone1, text), "_blank");
    setForm({ name: "", phone: "", dates: "", message: "" });
  };

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30";

  return (
    <section id="contact" className="scroll-mt-20 bg-muted py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-accent">Contact</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Réservez votre véhicule
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <h3 className="font-display font-bold text-foreground">Adresse</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {agency.address}
                    <br />
                    <span className="text-xs">(à 100 m de la protection civile — Plus Code : GMWP+PM Seddouk)</span>
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-3 border-t border-border pt-5">
                <a href={telLink(agency.phone1)} className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-primary">
                  <Phone className="h-4 w-4 text-accent" /> Allaoua : {formatPhone(agency.phone1)}
                </a>
                <a href={telLink(agency.phone2)} className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-primary">
                  <Phone className="h-4 w-4 text-accent" /> Idir : {formatPhone(agency.phone2)}
                </a>
                <p className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-accent" /> {agency.hours}
                </p>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <a
                  href={waLink(agency.phone1, "Bonjour, je souhaite louer un véhicule.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-whatsapp px-4 py-2.5 text-sm font-semibold text-whatsapp-foreground"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp Allaoua
                </a>
                <a
                  href={waLink(agency.phone2, "Bonjour, je souhaite louer un véhicule.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-whatsapp px-4 py-2.5 text-sm font-semibold text-whatsapp-foreground"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp Idir
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
              <iframe
                title="ALLAOUA Location sur Google Maps"
                src={agency.mapsUrl}
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h3 className="font-display text-xl font-bold text-foreground">Demande de réservation</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Remplissez ce formulaire, votre demande sera envoyée directement sur WhatsApp.
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">Nom complet</label>
                <input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Votre nom" />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-foreground">Téléphone</label>
                <input id="phone" required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="Ex : 0770 00 00 00" />
              </div>
              <div>
                <label htmlFor="dates" className="mb-1.5 block text-sm font-medium text-foreground">Dates souhaitées</label>
                <input id="dates" required value={form.dates} onChange={(e) => setForm({ ...form, dates: e.target.value })} className={inputClass} placeholder="Ex : du 20 au 25 septembre" />
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">Message</label>
                <textarea id="message" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputClass} placeholder="Précisez le véhicule, la durée, avec ou sans chauffeur…" />
              </div>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-semibold text-accent-foreground shadow-md transition-transform hover:scale-[1.02]"
              >
                <MessageCircle className="h-5 w-5" />
                Envoyer via WhatsApp
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer({ agency }: { agency: AgencyInfo }) {
  return (
    <footer className="bg-navy-deep py-12 text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground">
              <Car className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold">
              ALLAOUA <span className="text-accent">Location</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-primary-foreground/70">
            Location de voitures avec ou sans chauffeur à Seddouk. Ets ACHOURI — Seddouk.
          </p>
        </div>
        <div>
          <h4 className="font-display font-bold">Liens rapides</h4>
          <nav className="mt-3 space-y-2">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="block text-sm text-primary-foreground/70 hover:text-accent">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div>
          <h4 className="font-display font-bold">Coordonnées</h4>
          <div className="mt-3 space-y-2 text-sm text-primary-foreground/70">
            <p>{agency.address}</p>
            <a href={telLink(agency.phone1)} className="block hover:text-accent">Allaoua : {formatPhone(agency.phone1)}</a>
            <a href={telLink(agency.phone2)} className="block hover:text-accent">Idir : {formatPhone(agency.phone2)}</a>
            <p>{agency.hours}</p>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 px-4 pt-6 text-center text-xs text-primary-foreground/50">
        © {new Date().getFullYear()} Ets ACHOURI — ALLAOUA Location, Seddouk. Tous droits réservés.
      </div>
    </footer>
  );
}

function FloatingWhatsApp({ agency }: { agency: AgencyInfo }) {
  return (
    <a
      href={waLink(agency.phone1, "Bonjour, je souhaite louer un véhicule. Pouvez-vous me donner plus d'informations ?")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous contacter sur WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-xl transition-transform hover:scale-110"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}

function Index() {
  const { vehicles, services, agency } = useAppData();
  return (
    <div className="font-sans">
      <Header agency={agency} />
      <main>
        <Hero agency={agency} />
        <Vehicles vehicles={vehicles} agency={agency} />
        <Services services={services} />
        <WhyUs />
        <Contact agency={agency} />
      </main>
      <Footer agency={agency} />
      <FloatingWhatsApp agency={agency} />
    </div>
  );
}
