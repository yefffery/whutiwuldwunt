export type ThemePreference = "dark" | "light";

const KEY = "wiww-theme";
const listeners = new Set<() => void>();

function normalize(value: string | null): ThemePreference {
  return value === "light" ? "light" : "dark";
}

export function currentTheme(): ThemePreference {
  try {
    return normalize(localStorage.getItem(KEY));
  } catch {
    return "dark";
  }
}

export function setThemePreference(theme: ThemePreference): void {
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* Storage is optional. */
  }
  document.documentElement.dataset.theme = theme;
  listeners.forEach((listener) => listener());
}

export function subscribeTheme(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Runs before paint so the first frame already carries the chosen theme. */
export const themeInitializationScript = `try{var t=localStorage.getItem('${KEY}');document.documentElement.dataset.theme=(t==='light'?'light':'dark');}catch(e){document.documentElement.dataset.theme='dark';}`;
