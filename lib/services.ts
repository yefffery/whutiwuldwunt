import { sourceConfig } from "@/lib/business-config";

export interface Service {
  value: string;
  label: string;
  feltCareEnabled: boolean;
  specialtyReview: boolean;
}

/** Every care choice the request can carry, in presentation order. */
export const services: Service[] = [
  ...(sourceConfig.services as Array<{ id: string; name: string; feltCareEnabled: boolean; specialtyReview?: boolean }>).map((s) => ({
    value: s.id,
    label: s.name,
    feltCareEnabled: s.feltCareEnabled,
    specialtyReview: !!s.specialtyReview,
  })),
  { value: "not-sure", label: "I’m not sure yet", feltCareEnabled: true, specialtyReview: false },
];

export const bookableServices = services;

export function serviceById(value: string): Service | undefined {
  return services.find((s) => s.value === value);
}
