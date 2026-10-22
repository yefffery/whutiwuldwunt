export interface RevealAreas {
  exterior: boolean;
  interior: boolean;
}

/** Which areas a care choice covers in the schematic journey illustration. */
export function careRevealAreas(service: string): RevealAreas {
  switch (service) {
    case "essential_exterior":
      return { exterior: true, interior: false };
    case "fabric_freshness":
      return { exterior: false, interior: true };
    case "total_therapy":
      return { exterior: true, interior: true };
    default:
      // Specialty items (e.g. cured ceramic coating) carry no schematic
      // journey: they remain an open conversation point.
      return { exterior: false, interior: false };
  }
}
