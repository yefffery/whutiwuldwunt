import { sourceConfig } from "@/lib/business-config";

/** Whole cents, US-style with two decimals: 9075 -> "$90.75". */
export function decimalMoney(cents: number): string {
  const value = Math.round(Number(cents) || 0);
  if (value < 0) return `-$${(value / -100).toFixed(2)}`;
  return `$${(value / 100).toFixed(2)}`;
}

export const money = decimalMoney;

export { sourceConfig };
