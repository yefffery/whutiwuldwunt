import { getRawDb } from "@/db/raw";
import { intakeSchema, vettingFlags } from "@/lib/intake";
import { createIntakeToken, verifyIntakeToken } from "@/lib/intake-token";
import { FOUNDING_OFFER_CODE, offerPhoneKey } from "@/lib/founding-offer";
import { sourceConfig } from "@/lib/business-config";

async function digest(text: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function GET() {
  return Response.json({ token: await createIntakeToken() });
}

function statusFor(flags: string[]): string {
  // Every inquiry arrives in the personal verification queue; the dialogue
  // flag marks which ones have unresolved onboarding answers.
  return "new";
}

export async function POST(request: Request) {
  let raw: unknown;
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      raw = await request.json();
    } else {
      const form = await request.formData();
      raw = Object.fromEntries(
        [...form.entries()].map(([key, value]) => {
          const text = String(value);
          // Hidden inputs carry the raw string arrays as JSON.
          if (["services", "environment", "utilities", "interests", "answers"].includes(key)) {
            try {
              const parsed = JSON.parse(text);
              if (Array.isArray(parsed)) return [key, parsed];
            } catch {
              /* A single native value still arrives below. */
            }
            return [key, text ? [text] : []];
          }
          return [key, text];
        }),
      );
    }
  } catch {
    return Response.json({ error: "Unable to read your request. Please try again." }, { status: 400 });
  }

  const parsed = intakeSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Some details are missing or too long. Review your request and try again." },
      { status: 400 },
    );
  }
  const payload = parsed.data;

  // Honeypot: accept silently so bots learn nothing.
  if (payload.website) return Response.json({ id: payload.id });

  if (!(await verifyIntakeToken(payload.token))) {
    return Response.json({ error: "The request form expired. Reload the page and try again." }, { status: 403 });
  }

  if (payload.kind === "inquiry" && (!payload.name.trim() || !payload.email.trim() || !payload.phone.trim())) {
    return Response.json({ error: "Add your name, email and phone so we can reply." }, { status: 400 });
  }
  if (payload.kind !== "inquiry" && (!payload.email.trim() || !payload.message.trim())) {
    return Response.json({ error: "Add your email and a short message so we can reply." }, { status: 400 });
  }

  const flags = [...new Set([...vettingFlags(payload)])];
  const fingerprint = await digest(`${payload.email.trim().toLowerCase()}|${offerPhoneKey(payload.phone)}`);

  try {
    const db = getRawDb();
    const now = Date.now();
    const recent = await db
      .prepare("SELECT id FROM requests WHERE fingerprint = ? AND created_at > ? LIMIT 1")
      .bind(fingerprint, now - 10 * 60 * 1000)
      .first<{ id: string }>();
    if (recent?.id) {
      return Response.json(
        { id: recent.id, error: "A request with these contact details is already in review. Check your inbox, or wait a few minutes to add something new." },
        { status: 409 },
      );
    }

    const services = payload.kind === "inquiry" ? payload.services : [];
    const primaryService = services[0] ?? "not-sure";
    const messageParts = [
      payload.message,
      ...payload.answers,
      ...payload.interests.map((interest) => `Open conversation point: ${interest}`),
    ].filter(Boolean);

    await db
      .prepare(
        `INSERT INTO requests
         (id, kind, name, email, phone, city, vehicle, preferred_date, time_window, topic, message,
          status, created_at, fingerprint, service, care_profile, building_name, claimed_code_text,
          services, environment, utilities, interests, flags)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        payload.id,
        payload.kind,
        payload.name.trim(),
        payload.email.trim(),
        payload.phone.trim(),
        payload.city.trim(),
        payload.vehicle.trim(),
        payload.preferredDate,
        payload.window,
        payload.topic,
        messageParts.join("\n\n").slice(0, 6000),
        statusFor(flags),
        now,
        fingerprint,
        primaryService,
        JSON.stringify({ buildingName: payload.buildingName, answers: payload.answers }),
        payload.buildingName,
        payload.promo,
        JSON.stringify(payload.services),
        JSON.stringify(payload.environment),
        JSON.stringify(payload.utilities),
        JSON.stringify(payload.interests),
        JSON.stringify(flags),
      )
      .run();

    const offerReady =
      payload.promo === FOUNDING_OFFER_CODE && (offerPhoneKey(payload.phone) !== "" || payload.email.trim() !== "");

    return Response.json({ id: payload.id, flags, offerReady });
  } catch {
    return Response.json(
      { error: "Your request could not be saved just now. Your details are still here — please try again." },
      { status: 500 },
    );
  }
}

// Referenced so the vetting flag name stays sourced from one place.
export const VETTING_FLAG = sourceConfig.vettingFlag;
