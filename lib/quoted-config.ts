import { canonicalServiceAmount, type BusinessConfig } from "@/lib/business-config";
import { serviceInclusions, serviceExclusions } from "@/lib/service-promise";

export interface QuoteEstimate {
  low: number;
  high: number;
}

export interface QuoteSnapshot {
  estimate?: QuoteEstimate;
  inclusions: string[];
  exclusions: string;
}

/**
 * The starting-price view of one care choice. Specialty items
 * (felt_care_enabled: false) never produce an upfront estimate: they are an
 * open conversation point, priced case-by-case in the Care Plan.
 */
export function quoteSnapshot(
  business: BusinessConfig,
  service: string,
  _careProfile?: unknown,
  _promoCount = 0,
): QuoteSnapshot {
  const entry = business.services.find((s) => s.id === service);
  const specialty = !!entry?.quote || !!entry?.specialtyReview || entry?.feltCareEnabled === false;
  return {
    estimate: specialty ? undefined : { low: canonicalServiceAmount(service, "sedan"), high: canonicalServiceAmount(service, "full-size") },
    inclusions: serviceInclusions(business, service),
    exclusions: serviceExclusions(business, service),
  };
}

/** A stable digest of the priced configuration, used to detect stale quotes. */
export function businessDigest(business: unknown): string {
  const relevant = JSON.stringify(
    business,
    (key, value) => (["questions", "addons"].includes(key) ? undefined : value),
  );
  let hash = 0x811c9dc5;
  for (let i = 0; i < relevant.length; i++) {
    hash ^= relevant.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `v${hash.toString(36)}`;
}
