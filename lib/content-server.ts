import "server-only";
import { getRawDb } from "@/db/raw";
import { defaultContent, parseContent, type SiteContent } from "@/lib/site-content";

/** The published site content; falls back to the built-in defaults. */
export async function getPublishedContent(): Promise<SiteContent> {
  try {
    const db = getRawDb();
    const row = await db
      .prepare("SELECT published FROM site_content WHERE id = 'default' LIMIT 1")
      .first<{ published: string }>();
    if (!row?.published) return structuredClone(defaultContent);
    return parseContent(row.published);
  } catch {
    return structuredClone(defaultContent);
  }
}
