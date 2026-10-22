// Single source of truth for every service, multiplier and baseline price.
// The canonical data lives in src/config/business_configuration.json; this
// module is the typed access layer. No other file may hardcode a price.
import businessConfiguration from "../src/config/business_configuration.json";

export interface VehicleTier {
  id: string;
  label: string;
  detail: string;
  multiplier: number;
}

export interface ServiceEntry {
  id: string;
  name: string;
  feltCareEnabled: boolean;
  visible: boolean;
  quote: boolean;
  specialtyReview?: boolean;
  package?: boolean;
  combines?: string[];
  duration?: string;
  base: number;
  prices: Record<string, number>;
  description?: string;
  inclusions?: string[];
  exclusions?: string;
}

export interface BusinessQuestion {
  id: string;
  label: string;
  type: "text" | "textarea" | "date" | "time" | "select" | "contact";
  required: boolean;
  visible: boolean;
  options?: string[];
}

export interface Availability {
  note: string;
  days: string[];
  start: string;
  end: string;
}

export interface BusinessConfig {
  services: ServiceEntry[];
  package: { visible: boolean; duration: string; prices?: Record<string, number> };
  addons: unknown[];
  questions: BusinessQuestion[];
  availability: Availability;
  labels: { reply: string; honesty: string; price: string };
  travelPolicy?: string;
  pricingBasis: string;
  vettingFlag: string;
}

export const sourceConfig = businessConfiguration;

export const vehicleTiers: VehicleTier[] = businessConfiguration.vehicleTiers as VehicleTier[];

export function tierMultiplier(tier: string): number {
  return vehicleTiers.find((entry) => entry.id === tier)?.multiplier ?? 1;
}

/** Canonical price in cents for a service at a tier, straight from the config. */
export function canonicalServiceAmount(serviceId: string, tier: string): number {
  const service = businessConfiguration.services.find((s) => s.id === serviceId);
  if (!service) return 0;
  const priced = (service.prices ?? {})[tier];
  if (typeof priced === "number" && Number.isFinite(priced)) return Math.round(priced);
  return Math.round(service.base * tierMultiplier(tier));
}

export function serviceEntry(serviceId: string): ServiceEntry | undefined {
  return businessConfiguration.services.find((s) => s.id === serviceId);
}

/** The canonical catalog, projected into the CMS-shaped business object. */
export function defaultBusiness(): BusinessConfig {
  const services: ServiceEntry[] = (businessConfiguration.services as ServiceEntry[]).map((s) => ({ ...s }));
  return {
    services,
    package: {
      visible: services.some((s) => s.package && s.visible),
      duration: services.find((s) => s.package)?.duration ?? "",
    },
    addons: [],
    questions: [
      { id: "preferredDate", label: "Preferred date", type: "date", required: false, visible: true },
      { id: "buildingName", label: "Building or garage name", type: "text", required: false, visible: true },
      { id: "careIntent", label: "What should this care make possible?", type: "textarea", required: false, visible: true },
      { id: "proudConcern", label: "Anything you are proud of, or worried about?", type: "textarea", required: false, visible: true },
    ],
    availability: { ...businessConfiguration.availability },
    labels: { ...businessConfiguration.labels },
    travelPolicy: businessConfiguration.travelPolicy,
    pricingBasis: businessConfiguration.pricingBasis,
    vettingFlag: businessConfiguration.vettingFlag,
  };
}

export type { ServiceEntry as BusinessService };

/** CMS-level per-tier price overrides live in content only; pricing itself is
 * owned by business_configuration.json, so this legacy hook resolves to {}. */
export function careFromBusiness(_business: BusinessConfig): Record<string, never> {
  return {};
}

export interface WorkPhoto {
  id: string;
  object_key: string;
  caption: string;
  category: string;
  content_type: string;
  created_at: number;
  pair_id: string;
  phase: string;
  client_permission: number;
  request_id: string;
  published: number;
}

/** Photos the owner has approved, newest first. */
export function orderedPhotos(photos: WorkPhoto[], _business?: BusinessConfig): WorkPhoto[] {
  return (photos ?? [])
    .filter((photo) => photo.published !== 0 && photo.client_permission !== 0)
    .sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0));
}
