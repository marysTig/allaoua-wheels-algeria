import { useSyncExternalStore, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/* ─────────────────────────────────────────
   Utility
───────────────────────────────────────── */

export const isExpiringSoon = (dateStr: string) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  const now = new Date();
  const inOneMonth = new Date();
  inOneMonth.setMonth(now.getMonth() + 1);
  return d <= inOneMonth;
};

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */

export interface Vehicle {
  id: string;
  name: string;
  image: string;
  images?: string[];
  transmission: "Manuelle" | "Automatique";
  fuel: "Diesel" | "Essence";
  seats: number;
  doors: number;
  mileage: string;
  pricePerDay: number;
  available: boolean;
  insuranceStart: string;
  insuranceEnd: string;
  vignetteStart: string;
  vignetteEnd: string;
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

/* ─────────────────────────────────────────
   Row ↔ Domain mappers
───────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToVehicle(r: any): Vehicle {
  return {
    id: r.id,
    name: r.name,
    image: r.image,
    images: r.images ?? [],
    transmission: r.transmission,
    fuel: r.fuel,
    seats: r.seats,
    doors: r.doors,
    mileage: r.mileage,
    pricePerDay: r.price_per_day,
    available: r.available,
    insuranceStart: r.insurance_start ?? "",
    insuranceEnd: r.insurance_end ?? "",
    vignetteStart: r.vignette_start ?? "",
    vignetteEnd: r.vignette_end ?? "",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToService(r: any): Service {
  return { id: r.id, title: r.title, description: r.description };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToMessage(r: any): Message {
  return {
    id: r.id,
    name: r.name,
    phone: r.phone,
    dates: r.dates,
    message: r.message,
    createdAt: r.created_at,
    handled: r.handled,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToAgency(r: any): AgencyInfo {
  return {
    name: r.name,
    address: r.address,
    hours: r.hours,
    phone1: r.phone1,
    phone2: r.phone2,
    mapsUrl: r.maps_url,
  };
}

/* ─────────────────────────────────────────
   Default / Fallback data (shown on first load or when Supabase is unconfigured)
───────────────────────────────────────── */

import vanH1 from "@/assets/van-h1.jpg";
import vanTrafic from "@/assets/van-trafic.jpg";
import vanVito from "@/assets/van-vito.jpg";
import vanDucato from "@/assets/van-ducato.jpg";
import vanTraveller from "@/assets/van-traveller.jpg";
import vanTransit from "@/assets/van-transit.jpg";

const baseVehicle = {
  transmission: "Manuelle" as const,
  fuel: "Diesel" as const,
  seats: 9,
  doors: 5,
  mileage: "Limité à 500 Km/jour — illimité à partir de 6 jours",
  pricePerDay: 8000,
  available: true,
  insuranceStart: "",
  insuranceEnd: "",
  vignetteStart: "",
  vignetteEnd: "",
  images: [],
};

export const defaultData: AppData = {
  vehicles: [
    { id: "v1", name: "Hyundai H1", image: vanH1, ...baseVehicle },
    { id: "v2", name: "Renault Trafic", image: vanTrafic, ...baseVehicle },
    { id: "v3", name: "Mercedes Vito", image: vanVito, ...baseVehicle },
    { id: "v4", name: "Fiat Ducato", image: vanDucato, ...baseVehicle },
    { id: "v5", name: "Peugeot Traveller", image: vanTraveller, ...baseVehicle },
    { id: "v6", name: "Ford Transit Custom", image: vanTransit, ...baseVehicle },
  ],
  services: [
    {
      id: "s1",
      title: "Location avec chauffeur",
      description: "Un chauffeur expérimenté vous conduit où vous le souhaitez, en toute sécurité et sans souci de conduite.",
    },
    {
      id: "s2",
      title: "Location sans chauffeur",
      description: "Prenez le volant vous-même et profitez d'une totale liberté de déplacement, à votre rythme.",
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

/* ─────────────────────────────────────────
   In-memory store + listeners
───────────────────────────────────────── */

let current: AppData = defaultData;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function setData(next: Partial<AppData>) {
  current = { ...current, ...next };
  emit();
}

/* ─────────────────────────────────────────
   Load all data from Supabase
───────────────────────────────────────── */

export async function loadAllData() {
  try {
    const [{ data: vRows }, { data: sRows }, { data: mRows }, { data: aRows }] = await Promise.all([
      supabase.from("vehicles").select("*").order("created_at"),
      supabase.from("services").select("*").order("created_at"),
      supabase.from("messages").select("*").order("created_at", { ascending: false }),
      supabase.from("agency").select("*").limit(1),
    ]);

    setData({
      vehicles: vRows?.map(rowToVehicle) ?? defaultData.vehicles,
      services: sRows?.map(rowToService) ?? defaultData.services,
      messages: mRows?.map(rowToMessage) ?? [],
      agency: aRows?.[0] ? rowToAgency(aRows[0]) : defaultData.agency,
    });
  } catch (err) {
    console.error("Supabase load error:", err);
  }
}

/* ─────────────────────────────────────────
   useSyncExternalStore hook
───────────────────────────────────────── */

/* ─────────────────────────────────────────
   Module-level realtime subscription (singleton — created once)
───────────────────────────────────────── */

let realtimeStarted = false;

function startRealtime() {
  if (realtimeStarted || typeof window === "undefined") return;
  realtimeStarted = true;

  supabase
    .channel("realtime-all")
    .on("postgres_changes", { event: "*", schema: "public", table: "vehicles" }, loadAllData)
    .on("postgres_changes", { event: "*", schema: "public", table: "services" }, loadAllData)
    .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, loadAllData)
    .on("postgres_changes", { event: "*", schema: "public", table: "agency" }, loadAllData)
    .subscribe();
}

/* ─────────────────────────────────────────
   useSyncExternalStore hook
───────────────────────────────────────── */

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): AppData {
  return current;
}

function getServerSnapshot(): AppData {
  return defaultData;
}

export function useAppData(): AppData {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    loadAllData();
    startRealtime();
  }, []);

  return data;
}

/* ─────────────────────────────────────────
   Store — CRUD operations
───────────────────────────────────────── */

export const store = {
  get data() {
    return getSnapshot();
  },

  /* Vehicles */
  async addVehicle(v: Omit<Vehicle, "id">) {
    const { error } = await supabase.from("vehicles").insert({
      name: v.name,
      image: v.image,
      images: v.images ?? [],
      transmission: v.transmission,
      fuel: v.fuel,
      seats: v.seats,
      doors: v.doors,
      mileage: v.mileage,
      price_per_day: v.pricePerDay,
      available: v.available,
      insurance_start: v.insuranceStart || null,
      insurance_end: v.insuranceEnd || null,
      vignette_start: v.vignetteStart || null,
      vignette_end: v.vignetteEnd || null,
    });
    if (error) throw error;
    await loadAllData();
  },

  async updateVehicle(id: string, v: Omit<Vehicle, "id">) {
    const { error } = await supabase
      .from("vehicles")
      .update({
        name: v.name,
        image: v.image,
        images: v.images ?? [],
        transmission: v.transmission,
        fuel: v.fuel,
        seats: v.seats,
        doors: v.doors,
        mileage: v.mileage,
        price_per_day: v.pricePerDay,
        available: v.available,
        insurance_start: v.insuranceStart || null,
        insurance_end: v.insuranceEnd || null,
        vignette_start: v.vignetteStart || null,
        vignette_end: v.vignetteEnd || null,
      })
      .eq("id", id);
    if (error) throw error;
    await loadAllData();
  },

  async deleteVehicle(id: string) {
    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) throw error;
    await loadAllData();
  },

  /* Services */
  async addService(s: Omit<Service, "id">) {
    const { error } = await supabase.from("services").insert({ title: s.title, description: s.description });
    if (error) throw error;
    await loadAllData();
  },

  async updateService(id: string, s: Omit<Service, "id">) {
    const { error } = await supabase.from("services").update({ title: s.title, description: s.description }).eq("id", id);
    if (error) throw error;
    await loadAllData();
  },

  async deleteService(id: string) {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) throw error;
    await loadAllData();
  },

  /* Messages */
  async addMessage(m: Omit<Message, "id" | "createdAt" | "handled">) {
    const { error } = await supabase.from("messages").insert({
      name: m.name,
      phone: m.phone,
      dates: m.dates,
      message: m.message,
    });
    if (error) throw error;
    await loadAllData();
  },

  async toggleMessage(id: string) {
    const msg = current.messages.find((m) => m.id === id);
    if (!msg) return;
    const { error } = await supabase.from("messages").update({ handled: !msg.handled }).eq("id", id);
    if (error) throw error;
    await loadAllData();
  },

  async deleteMessage(id: string) {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) throw error;
    await loadAllData();
  },

  /* Agency */
  async saveAgency(a: AgencyInfo) {
    const { data: existing } = await supabase.from("agency").select("id").limit(1);
    const payload = {
      name: a.name,
      address: a.address,
      hours: a.hours,
      phone1: a.phone1,
      phone2: a.phone2,
      maps_url: a.mapsUrl,
    };
    if (existing && existing.length > 0) {
      const { error } = await supabase.from("agency").update(payload).eq("id", existing[0].id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("agency").insert(payload);
      if (error) throw error;
    }
    await loadAllData();
  },
};

/* ─────────────────────────────────────────
   Auth — Supabase Auth
───────────────────────────────────────── */

let authState = false;
const authListeners = new Set<() => void>();

function emitAuth() {
  authListeners.forEach((l) => l());
}

// Initialise auth state from Supabase session on load
supabase.auth.getSession().then(({ data: { session } }) => {
  authState = !!session;
  emitAuth();
});

supabase.auth.onAuthStateChange((_event, session) => {
  authState = !!session;
  emitAuth();
});

export function useIsAuthenticated() {
  return useSyncExternalStore(
    (l) => {
      authListeners.add(l);
      return () => authListeners.delete(l);
    },
    () => authState,
    () => false,
  );
}

export function useAuthLoading() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getSession().then(() => setLoading(false));
  }, []);
  return loading;
}

export async function login(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return false;
  return true;
}

export async function logout() {
  await supabase.auth.signOut();
}

/* ─────────────────────────────────────────
   Cloudinary image upload
───────────────────────────────────────── */

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary n'est pas configuré. Vérifiez votre fichier .env");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  // formData.append("folder", "allaoua-location"); // Removed: often blocked by unsigned preset settings

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    console.error("Cloudinary Error Response:", errData);
    throw new Error(`Échec de l'upload Cloudinary: ${errData.error?.message || res.statusText}`);
  }
  const data = await res.json();
  return data.secure_url as string;
}

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */

export const waLink = (number: string, message: string) =>
  `https://wa.me/213${number.replace(/\D/g, "").replace(/^0/, "")}?text=${encodeURIComponent(message)}`;

export const telLink = (number: string) => `tel:+213${number.replace(/\D/g, "").replace(/^0/, "")}`;

export const formatPhone = (number: string) =>
  number.replace(/\D/g, "").replace(/(\d{4})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4");
