import { serviceEntry, type BusinessConfig } from "@/lib/business-config";

export function serviceName(business: BusinessConfig, offer: string): string {
  return business.services.find((s) => s.id === offer)?.name ?? serviceEntry(offer)?.name ?? "WIWW care";
}

export function serviceDescription(business: BusinessConfig, offer: string): string {
  return (
    business.services.find((s) => s.id === offer)?.description ??
    serviceEntry(offer)?.description ??
    ""
  );
}

export function serviceInclusions(business: BusinessConfig, offer: string): string[] {
  return (
    business.services.find((s) => s.id === offer)?.inclusions ??
    serviceEntry(offer)?.inclusions ??
    []
  );
}

export function serviceExclusions(business: BusinessConfig, offer: string): string {
  return (
    business.services.find((s) => s.id === offer)?.exclusions ??
    serviceEntry(offer)?.exclusions ??
    ""
  );
}

export function serviceAvailable(business: BusinessConfig, offer: string): boolean {
  const entry = business.services.find((s) => s.id === offer);
  if (entry) return entry.visible !== false;
  return serviceEntry(offer)?.visible ?? false;
}

/** Specialty items are a separately reviewed inquiry: never a priced add-on. */
export function serviceNeedsPersonalReview(business: BusinessConfig, offer: string): boolean {
  return !!business.services.find((s) => s.id === offer)?.specialtyReview;
}
