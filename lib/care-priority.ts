/** Carry a note written next to the work photos into a form field, keeping
 * the field's existing text and respecting its maximum length. Returns null
 * when the note cannot fit, so the caller can fall back to another field. */
export function mergeCarePriority(
  existing: string,
  detail: string,
  maxLength = 2000,
  prefix = "What I want you to notice: ",
): string | null {
  const note = detail.trim();
  if (!note) return existing;
  const line = `${prefix}${note}`;
  if (!existing.trim()) return line.slice(0, maxLength);
  const merged = `${existing.trim()}\n\n${line}`;
  if (merged.length > maxLength) return null;
  return merged;
}
