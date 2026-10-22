const KEY = "wiww-member-status";

export interface ConfirmedIntakeRecord {
  at: number;
  id?: string;
  offerReady?: boolean;
}

/** Remembers that this browser has already sent a confirmed inquiry. */
export function recordConfirmedIntake(ok: boolean, result: { id?: string; offerReady?: boolean }): void {
  if (!ok) return;
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({ at: Date.now(), id: result.id, offerReady: result.offerReady === true } satisfies ConfirmedIntakeRecord),
    );
  } catch {
    /* Storage is optional. */
  }
}

export function readConfirmedIntake(): ConfirmedIntakeRecord | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConfirmedIntakeRecord;
    return typeof parsed?.at === "number" ? parsed : null;
  } catch {
    return null;
  }
}
