export interface InquirySession {
  id: string;
}

/** Keeps a stable inquiry id across the flow, per browser tab. */
export function readInquirySession(storage: Storage): InquirySession | null {
  try {
    const raw = storage.getItem("wiww-inquiry-session");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<InquirySession>;
    if (typeof parsed?.id === "string" && parsed.id.length >= 6) return { id: parsed.id };
    return null;
  } catch {
    return null;
  }
}

export function writeInquirySession(storage: Storage, session: InquirySession): void {
  storage.setItem("wiww-inquiry-session", JSON.stringify(session));
}

export function clearInquirySession(storage: Storage): void {
  storage.removeItem("wiww-inquiry-session");
}
