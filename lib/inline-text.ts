import type { SiteContent } from "@/lib/site-content";

export interface TextBinding {
  kind: "site-text" | "copy-field";
  id: string;
  field?: string;
}

/** Resolve where an editable string lives: a site-text slot or a CMS copy field. */
export function bindText(id: string, original: string, copy: unknown, field?: string): TextBinding {
  if (field && copy && typeof copy === "object" && (field in (copy as Record<string, unknown>))) {
    return { kind: "copy-field", id, field };
  }
  return { kind: "site-text", id, field };
}

/** Read the current value for a binding, falling back to the rendered original. */
export function readText(content: SiteContent, binding: TextBinding, original: string): string {
  if (binding.kind === "copy-field" && binding.field) {
    const value = (content.copy as unknown as Record<string, unknown>)?.[binding.field];
    if (typeof value === "string" && value.length > 0) return value;
    return original;
  }
  const overrides = content.siteText ?? {};
  const value = overrides[binding.id];
  return typeof value === "string" ? value : original;
}
