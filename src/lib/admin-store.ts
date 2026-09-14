import { useSyncExternalStore } from "react";

import vanH1 from "@/assets/van-h1.jpg";
import vanTrafic from "@/assets/van-trafic.jpg";
import vanVito from "@/assets/van-vito.jpg";
import vanDucato from "@/assets/van-ducato.jpg";
import vanTraveller from "@/assets/van-traveller.jpg";
import vanTransit from "@/assets/van-transit.jpg";

export const ADMIN_USERNAME = "alloua";
export const ADMIN_PASSWORD = "alloua123";

const AUTH_KEY = "allaoua.admin.session";
const DATA_KEY = "allaoua.data.v1";

export type VehicleCategory = "Minibus" | "Berline" | "Citadine" | "Utilitaire";

export interface Vehicle {
  id: string;
  name: string;
  category: VehicleCategory;
  image: string;
  transmission: "Manuelle" | "Automatique";
  fuel: "Diesel" | "Essence";
  seats: number;
  doors: number;
  mileage: string;
  pricePerDay: number;
  available: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
}

export interface Message {
  id: string;
  name: string;
  phone: string;
  dates: string;
  message: string;
  createdAt: string;
  handled: boolean;
}

export interface AgencyInfo {
  name: string;
  address: string;
  hours: string;
  phone1: string;
  phone2: string;
  mapsUrl: string;
}

export interface AppData {
  vehicles: Vehicle[];
  services: Service[];
  messages: Message[];
  agency: AgencyInfo;
}

const baseVehicle = {
  transmission: "Manuelle" as const,
  fuel: "Diesel" as const,
  seats: 9,
  doors: 5,
  mileage: "Limité à 500 Km/jour — illimité à partir de 6 jours",
  pricePerDay: 8000,
  available: true,
};

export const defaultData: AppData = {
  vehicles: [
    { id: "v1", name: "Hyundai H1", category: "Minibus", image: vanH1, ...baseVehicle },
    { id: "v2", name: "Renault Trafic", category: "Minibus", image: vanTrafic, ...baseVehicle },
    { id: "v3", name: "Mercedes Vito", category: "Minibus", image: vanVito, ...baseVehicle },
    { id: "v4", name: "Fiat Ducato", category: "Utilitaire", image: vanDucato, ...baseVehicle },
    { id: "v5", name: "Peugeot Traveller", category: "Berline", image: vanTraveller, ...baseVehicle },
    { id: "v6", name: "Ford Transit Custom", category: "Utilitaire", image: vanTransit, ...baseVehicle },
  ],
  services: [
    {
      id: "s1",
      title: "Location avec chauffeur",
      description:
        "Un chauffeur expérimenté vous conduit où vous le souhaitez, en toute sécurité et sans souci de conduite.",
    },
    {
      id: "s2",
      title: "Location sans chauffeur",
      description:
        "Prenez le volant vous-même et profitez d'une totale liberté de déplacement, à votre rythme.",
    },
  ],
  messages: [],
  agency: {
    name: "ALLAOUA Location (Ets ACHOURI)",
    address: "Cité 50 logements, Seddouk 06011, Algérie",
    hours: "Ouvert 24h/24 — 7j/7",
    phone1: "0770646557",
    phone2: "0540845843",
    mapsUrl: "https://maps.google.com/maps?q=GMWP%2BPM%20Seddouk%2C%20Alg%C3%A9rie&z=15&output=embed",
  },
};

let current: AppData = defaultData;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(current));
  } catch {
    /* ignore */
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppData>;
      current = {
        vehicles: parsed.vehicles ?? defaultData.vehicles,
        services: parsed.services ?? defaultData.services,
        messages: parsed.messages ?? [],
        agency: { ...defaultData.agency, ...(parsed.agency ?? {}) },
      };
    }
  } catch {
    /* ignore */
  }
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): AppData {
  hydrate();
  return current;
}

function getServerSnapshot(): AppData {
  return defaultData;
}

export function useAppData(): AppData {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function update(next: Partial<AppData>) {
  current = { ...current, ...next };
  persist();
  emit();
}

const newId = () => Math.random().toString(36).slice(2, 10);

export const store = {
  get data() {
    return getSnapshot();
  },
  addVehicle(v: Omit<Vehicle, "id">) {
    update({ vehicles: [...current.vehicles, { ...v, id: newId() }] });
  },
  updateVehicle(id: string, v: Omit<Vehicle, "id">) {
    update({ vehicles: current.vehicles.map((x) => (x.id === id ? { ...v, id } : x)) });
  },
  deleteVehicle(id: string) {
    update({ vehicles: current.vehicles.filter((x) => x.id !== id) });
  },
  addService(s: Omit<Service, "id">) {
    update({ services: [...current.services, { ...s, id: newId() }] });
  },
  updateService(id: string, s: Omit<Service, "id">) {
    update({ services: current.services.map((x) => (x.id === id ? { ...s, id } : x)) });
  },
  deleteService(id: string) {
    update({ services: current.services.filter((x) => x.id !== id) });
  },
  addMessage(m: Omit<Message, "id" | "createdAt" | "handled">) {
    hydrate();
    update({
      messages: [
        { ...m, id: newId(), createdAt: new Date().toISOString(), handled: false },
        ...current.messages,
      ],
    });
  },
  toggleMessage(id: string) {
    update({
      messages: current.messages.map((m) => (m.id === id ? { ...m, handled: !m.handled } : m)),
    });
  },
  deleteMessage(id: string) {
    update({ messages: current.messages.filter((m) => m.id !== id) });
  },
  saveAgency(a: AgencyInfo) {
    update({ agency: a });
  },
};

/* ---------- Auth ---------- */

let authState = false;
let authHydrated = false;
const authListeners = new Set<() => void>();

function hydrateAuth() {
  if (authHydrated || typeof window === "undefined") return;
  authHydrated = true;
  try {
    authState = localStorage.getItem(AUTH_KEY) === "1";
  } catch {
    /* ignore */
  }
}

export function useIsAuthenticated() {
  return useSyncExternalStore(
    (l) => {
      hydrateAuth();
      authListeners.add(l);
      return () => authListeners.delete(l);
    },
    () => {
      hydrateAuth();
      return authState;
    },
    () => false,
  );
}

export function login(username: string, password: string) {
  if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    authState = true;
    authHydrated = true;
    try {
      localStorage.setItem(AUTH_KEY, "1");
    } catch {
      /* ignore */
    }
    authListeners.forEach((l) => l());
    return true;
  }
  return false;
}

export function logout() {
  authState = false;
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {
    /* ignore */
  }
  authListeners.forEach((l) => l());
}

export const waLink = (number: string, message: string) =>
  `https://wa.me/213${number.replace(/\D/g, "").replace(/^0/, "")}?text=${encodeURIComponent(message)}`;

export const telLink = (number: string) => `tel:+213${number.replace(/\D/g, "").replace(/^0/, "")}`;

export const formatPhone = (number: string) =>
  number.replace(/\D/g, "").replace(/(\d{4})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4");
