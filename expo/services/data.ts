import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useSyncExternalStore } from "react";
import { Store } from "./store";
import { CaseRecord, isCases, migrateCases } from "../content/cases";
export const caseStore = new Store<CaseRecord[]>(
  AsyncStorage,
  "gas:cases:v1",
  [],
  isCases,
  async () => migrateCases(await AsyncStorage.getItem("anesthesia_case_logs")),
);
export interface Preferences {
  theme: "system" | "light" | "dark";
  role: "resident" | "attending";
  mode: "quick" | "learn";
  favorites: string[];
  recents: string[];
  institution: string;
  emergencyContact: string;
  concentrations: string;
}
const preferences: Preferences = {
  theme: "system",
  role: "resident",
  mode: "quick",
  favorites: [],
  recents: [],
  institution: "",
  emergencyContact: "",
  concentrations: "",
};
export const preferencesStore = new Store<Preferences>(
  AsyncStorage,
  "gas:preferences:v1",
  preferences,
  (v): v is Preferences => {
    const p = v as Preferences;
    return (
      !!p &&
      ["system", "light", "dark"].includes(p.theme) &&
      ["resident", "attending"].includes(p.role) &&
      ["quick", "learn"].includes(p.mode) &&
      Array.isArray(p.favorites) &&
      p.favorites.every((x) => typeof x === "string") &&
      Array.isArray(p.recents) &&
      p.recents.every((x) => typeof x === "string") &&
      ["institution", "emergencyContact", "concentrations"].every(
        (k) => typeof p[k as keyof Preferences] === "string",
      )
    );
  },
);
export interface ChecklistSession {
  id: string;
  startedAt: string;
  checked: string[];
  custom: string[];
}
export const freshSession = (): ChecklistSession => ({
  id: String(Date.now()),
  startedAt: new Date().toISOString(),
  checked: [],
  custom: [],
});
export const checklistStore = new Store<ChecklistSession>(
  AsyncStorage,
  "gas:checklist:v1",
  freshSession(),
  (v): v is ChecklistSession => {
    const s = v as ChecklistSession;
    return (
      !!s &&
      typeof s.id === "string" &&
      typeof s.startedAt === "string" &&
      Number.isFinite(Date.parse(s.startedAt)) &&
      Array.isArray(s.checked) &&
      s.checked.every((x) => typeof x === "string") &&
      Array.isArray(s.custom) &&
      s.custom.every((x) => typeof x === "string")
    );
  },
);
export interface CrisisSession {
  protocol: string;
  startedAt: number;
  checked: string[];
}
export const crisisStore = new Store<CrisisSession[]>(
  AsyncStorage,
  "gas:crisis:v1",
  [],
  (v): v is CrisisSession[] =>
    Array.isArray(v) &&
    v.every(
      (s) =>
        s &&
        typeof s.protocol === "string" &&
        Number.isFinite(s.startedAt) &&
        Array.isArray(s.checked) &&
        s.checked.every((x: unknown) => typeof x === "string"),
    ),
);
export function useStore<T>(store: Store<T>) {
  useEffect(() => {
    void store.load();
  }, [store]);
  return useSyncExternalStore(store.subscribe, store.snapshot, store.snapshot);
}
export function toggleFavorite(id: string) {
  return preferencesStore.update((p) => ({
    ...p,
    favorites: p.favorites.includes(id)
      ? p.favorites.filter((x) => x !== id)
      : [...p.favorites, id],
  }));
}
export function recordRecent(id: string) {
  return preferencesStore.update((p) => ({
    ...p,
    recents: [id, ...p.recents.filter((x) => x !== id)].slice(0, 12),
  }));
}
