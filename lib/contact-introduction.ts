export interface ContactIntroduction {
  name: string;
  phone: string;
  city: string;
  vehicle: string;
}

const KEY = "wiww-introduction";

export function readIntroduction(storage: Storage): ContactIntroduction | null {
  try {
    const raw = storage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ContactIntroduction>;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      name: String(parsed.name ?? ""),
      phone: String(parsed.phone ?? ""),
      city: String(parsed.city ?? ""),
      vehicle: String(parsed.vehicle ?? ""),
    };
  } catch {
    return null;
  }
}

export function saveIntroduction(storage: Storage, introduction: ContactIntroduction): void {
  storage.setItem(KEY, JSON.stringify(introduction));
}

export function clearIntroduction(storage: Storage): void {
  storage.removeItem(KEY);
}
