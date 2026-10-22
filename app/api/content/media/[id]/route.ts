import { env } from "cloudflare:workers";
import { getRawDb } from "@/db/raw";

/** Stored CMS media (logos, hero art, question artwork) served from R2. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const row = await getRawDb()
      .prepare("SELECT object_key, content_type FROM site_media WHERE id = ? LIMIT 1")
      .bind(id)
      .first<{ object_key: string; content_type: string }>();
    if (!row) return new Response("Media not found", { status: 404 });
    const bucket = (env as { BUCKET?: R2Bucket }).BUCKET;
    if (!bucket) return new Response("Media storage is unavailable", { status: 503 });
    const object = await bucket.get(row.object_key);
    if (!object) return new Response("Media not found", { status: 404 });
    return new Response(object.body, {
      headers: {
        "Content-Type": row.content_type || "application/octet-stream",
        "Cache-Control": "public, max-age=86400",
        ETag: object.httpEtag,
      },
    });
  } catch {
    return new Response("Media storage is unavailable", { status: 503 });
  }
}
