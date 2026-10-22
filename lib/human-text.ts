/** Normalize any stored text value into a human-readable string. */
export function humanText(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return String(value);
}
