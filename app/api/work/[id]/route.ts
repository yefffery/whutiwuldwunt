import { env } from "cloudflare:workers";
import { getRawDb } from "@/db/raw";

/** Owner-published work photos served from R2, only when published and
 * approved for sharing. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const row = await getRawDb()
      .prepare(
        "SELECT object_key, content_type FROM portfolio WHERE id = ? AND COALESCE(published,1) = 1 AND COALESCE(client_permission,1) = 1 LIMIT 1",
      )
      .bind(id)
      .first<{ object_key: string; content_type: string }>();
    if (!row) return new Response("Photo not found", { status: 404 });
    const bucket = (env as { BUCKET?: R2Bucket }).BUCKET;
    if (!bucket) return new Response("Photo storage is unavailable", { status: 503 });
    const object = await bucket.get(row.object_key);
    if (!object) return new Response("Photo not found", { status: 404 });
    return new Response(object.body, {
      headers: {
        "Content-Type": row.content_type || "image/jpeg",
        "Cache-Control": "public, max-age=86400",
        ETag: object.httpEtag,
      },
    });
  } catch {
    return new Response("Photo storage is unavailable", { status: 503 });
  }
}
