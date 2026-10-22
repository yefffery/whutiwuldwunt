import "server-only";
import { getRawDb } from "@/db/raw";
import { defaultCareSettings, type CareSettings } from "@/lib/care-rules";

/** Owner-tuned care settings, stored as JSON in the care_settings table. */
export async function careSettings(): Promise<CareSettings> {
  const db = getRawDb();
  const row = await db
    .prepare("SELECT config FROM care_settings WHERE id = 'default' LIMIT 1")
    .first<{ config: string }>();
  if (!row?.config) return defaultCareSettings;
  const parsed = JSON.parse(row.config) as CareSettings;
  return parsed && typeof parsed === "object" ? parsed : defaultCareSettings;
}
