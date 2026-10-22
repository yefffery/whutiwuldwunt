import type { BusinessConfig } from "@/lib/business-config";
import { serviceAvailable } from "@/lib/service-promise";
import { sourceConfig } from "@/lib/business-config";

export interface InquirySelection {
  selected: string[];
  chosen: string;
  canCombine: boolean;
  helpChoosing: boolean;
}

function combineId(business: BusinessConfig): string | undefined {
  return business.services.find((s) => s.package && s.visible)?.id ?? sourceConfig.services.find((s) => s.package)?.id;
}

/** Reduce a set of toggled choices to the canonical selection. */
export function inquirySelection(business: BusinessConfig, selected: string[]): InquirySelection {
  const visible = selected.filter((id) => serviceAvailable(business, id) && !business.services.find((s) => s.id === id)?.quote);
  const combine = combineId(business);
  const parts = visible.filter((id) => !business.services.find((s) => s.id === id)?.package);
  const chosen =
    combine && parts.length === 2 && parts.every((id) => !!business.services.find((s) => s.id === id))
      ? combine
      : parts[0] ?? "";
  return {
    selected: visible,
    chosen,
    canCombine: !!(combine && !business.services.find((s) => s.id === parts[0])?.quote),
    helpChoosing: false,
  };
}

export function toggleInquiryService(business: BusinessConfig, selected: string[], id: string): string[] {
  if (selected.includes(id)) return selected.filter((value) => value !== id);
  return [...selected.filter((value) => value !== (business.services.find((s) => s.package)?.id ?? "")), id];
}

/** Map a founding-interest label to the canonical selection it starts. */
export function selectionFromFoundingInterest(label: string): { selected: string[]; helpChoosing: boolean } {
  if (/still deciding|not sure/i.test(label)) return { selected: [], helpChoosing: true };
  const matches: string[] = [];
  for (const service of sourceConfig.services) {
    if (new RegExp(service.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(label)) matches.push(service.id);
  }
  if (new RegExp("ceramic", "i").test(label)) matches.push("cured_ceramic_coating");
  if (/total therapy|full/i.test(label) && !matches.includes("total_therapy")) {
    matches.push("essential_exterior", "fabric_freshness");
  }
  return { selected: [...new Set(matches)], helpChoosing: false };
}
