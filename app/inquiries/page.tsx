import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getRawDb } from "@/db/raw";
import { ownerCookieValue } from "@/lib/intake-token";
import InquiriesView, { type QueueRow } from "./view";

export const metadata: Metadata = { title: "Personal verification queue" };
export const dynamic = "force-dynamic";

const COOKIE = "wiww-owner";

export default async function InquiriesPage() {
  const store = await cookies();
  const ownerEmail = process.env.OWNER_EMAIL || "";
  const expected = ownerEmail ? await ownerCookieValue(ownerEmail) : "";
  const isOwner = ownerEmail !== "" && store.get(COOKIE)?.value === expected;

  if (!isOwner) return <InquiriesView owner={false} rows={[]} ownerConfigured={ownerEmail !== ""} />;

  let rows: QueueRow[] = [];
  try {
    const db = getRawDb();
    const result = await db
      .prepare(
        `SELECT id, kind, name, email, phone, city, vehicle, topic, message, status, created_at,
                service, building_name, claimed_code_text, services, environment, utilities, interests, flags
         FROM requests ORDER BY created_at DESC LIMIT 200`,
      )
      .all<Record<string, unknown>>();
    rows = (result.results ?? []).map((row) => ({
      id: String(row.id),
      kind: String(row.kind),
      name: String(row.name ?? ""),
      email: String(row.email ?? ""),
      phone: String(row.phone ?? ""),
      city: String(row.city ?? ""),
      vehicle: String(row.vehicle ?? ""),
      topic: String(row.topic ?? ""),
      message: String(row.message ?? ""),
      status: String(row.status ?? "new"),
      created_at: Number(row.created_at ?? 0),
      services: parseArray(row.services),
      environment: parseArray(row.environment),
      utilities: parseArray(row.utilities),
      interests: parseArray(row.interests),
      flags: parseArray(row.flags),
    }));
  } catch {
    rows = [];
  }

  return <InquiriesView owner={true} rows={rows} ownerConfigured={ownerEmail !== ""} />;
}

function parseArray(value: unknown): string[] {
  try {
    const parsed = JSON.parse(String(value ?? "[]"));
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}
