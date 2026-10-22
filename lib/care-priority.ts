/** Carry a note written next to the work photos into a form field, keeping
 * the field's existing text and respecting its maximum length. */
export function mergeCarePriority(
  existing: string,
  detail: string,
  maxLength = 2000,
): string {
  const note = detail.trim();
  if (!note) return existing;
  const line = `What I want you to notice: ${note}`;
  if (!existing.trim()) return line.slice(0, maxLength);
  return `${existing.trim()}\n\n${line}`.slice(0, maxLength);
}
