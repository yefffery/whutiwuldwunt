import { getRawDb } from "@/db/raw";
import type { WorkPhoto } from "@/lib/business-config";

export type { WorkPhoto };

/** Owner-approved work photos, newest first. Returns [] when storage or the
 * table is unavailable, so the public site still renders. */
export async function getWorkPhotos(): Promise<WorkPhoto[]> {
  try {
    const db = getRawDb();
    const result = await db
      .prepare(
        `SELECT id, object_key, caption, category, content_type, created_at,
                COALESCE(pair_id,'') AS pair_id, COALESCE(phase,'') AS phase,
                COALESCE(client_permission,1) AS client_permission,
                COALESCE(request_id,'') AS request_id, COALESCE(published,1) AS published
         FROM portfolio
         WHERE COALESCE(published,1) = 1 AND COALESCE(client_permission,1) = 1
         ORDER BY created_at DESC LIMIT 60`,
      )
      .all<{ id: string; object_key: string; caption: string; category: string; content_type: string; created_at: number; pair_id: string; phase: string; client_permission: number; request_id: string; published: number }>();
    return result.results ?? [];
  } catch {
    return [];
  }
}
