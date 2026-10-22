import { vehicleTiers } from "@/lib/business-config";

export type VehicleSize = string;

export interface VehicleSizeOption {
  value: string;
  label: string;
  detail: string;
}

export const vehicleSizes: VehicleSizeOption[] = vehicleTiers.map((tier) => ({
  value: tier.id,
  label: tier.label,
  detail: tier.detail,
}));

export function getVehicleSize(value: string | undefined | null): VehicleSizeOption {
  return vehicleSizes.find((size) => size.value === value) ?? vehicleSizes[0];
}

/** Where a care choice pre-fills the inquiry flow. */
export function serviceRequestHref(service: string, size?: string): string {
  const tier = size && vehicleSizes.some((s) => s.value === size) ? size : "";
  return `/book?service=${encodeURIComponent(service)}${tier ? `&size=${encodeURIComponent(tier)}` : ""}`;
}
