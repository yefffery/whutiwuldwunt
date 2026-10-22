import { canonicalServiceAmount, serviceEntry, type ServiceEntry } from "@/lib/business-config";

/** Per-service, per-tier price overrides. Empty by default: the canonical
 * prices come from src/config/business_configuration.json. */
export type CareSettings = Record<string, Record<string, number>>;

export const defaultCareSettings: CareSettings = {};

export type CareProfile = Record<string, string>;

/** Price in cents for one service at one vehicle tier. */
export function serviceAmount(offer: string, tier: string, settings: CareSettings = {}): number {
  const override = settings?.[offer]?.[tier];
  if (typeof override === "number" && Number.isFinite(override)) return Math.round(override);
  return canonicalServiceAmount(offer, tier);
}

/** What Total Therapy saves versus the two separate starting prices. */
export function packageSavings(tier: string, settings: CareSettings = {}): number {
  return (
    serviceAmount("essential_exterior", tier, settings) +
    serviceAmount("fabric_freshness", tier, settings) -
    serviceAmount("total_therapy", tier, settings)
  );
}

export function serviceFeltCareEnabled(offer: string): boolean {
  return serviceEntry(offer)?.feltCareEnabled ?? true;
}

export type { ServiceEntry };
