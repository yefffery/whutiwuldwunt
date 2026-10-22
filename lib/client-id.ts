const KEY = "wiww-client-id";

/** A stable per-browser inquiry id, generated without any server round trip. */
export function clientId(): string {
  try {
    const existing = localStorage.getItem(KEY);
    if (existing && /^wiww_[0-9a-f-]{16,}$/.test(existing)) return existing;
  } catch {
    /* Storage is optional. */
  }
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const id = `wiww_${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* Storage is optional. */
  }
  return id;
}
