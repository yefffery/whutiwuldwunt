import { defaultBusiness, type BusinessConfig, orderedPhotos, type WorkPhoto } from "@/lib/business-config";
import { CORE_QUESTION } from "@/lib/brand-philosophy";
import type { CSSProperties } from "react";

export interface SiteSection {
  id: string;
  visible: boolean;
}

export interface SiteImages {
  heroId: string;
  lightHeroId: string;
  logoId: string;
  darkLogoId: string;
  questionId: string;
}

export interface SiteTheme {
  logoPosition: "center" | "left" | "right";
  logoDesktopWidth: number;
  logoMobileWidth: number;
}

export interface SiteInvitation {
  enabled: boolean;
  heading: string;
  message: string;
}

export type SiteCopy = Record<string, string>;

export interface SiteContent {
  copy: SiteCopy;
  business: BusinessConfig;
  sections: SiteSection[];
  images: SiteImages;
  theme: SiteTheme;
  invitation: SiteInvitation;
  links: { primary: string; secondary: string };
  siteText?: Record<string, string>;
}

const SECTION_ORDER = ["hero", "trust", "services", "work", "steps", "approach", "areas", "closing"];

export const defaultCopy: SiteCopy = {
  brand_01: "Whut i wuld wunt",
  brand_02: "Whut",
  brand_03: "i wuld wunt",
  brand_06: "Menu",
  brand_07: "Everything on this site, in one place.",
  brand_17: "Start my care",
  brand_18: "Care, in practice",
  brand_19: "Ask WIWW",
  brand_20: "Owner sign-in",
  hero_02: "Care for what is in your hands.",
  hero_03: "Clear from the start.",
  hero_04: "Mobile vehicle care in San Francisco and the Bay Area. We agree on the plan and the price before our hands move, and the base price stays clear.",
  hero_08: "Start my care request",
  hero_09: "See starting prices",
  hero_10: "No payment is collected with a request. We review the car and the details, then send a Care Plan.",
  trust_01: "Prices shown up front",
  trust_02: "We confirm the plan with you first",
  trust_03: "No templates, no timers",
  services_01: "Starting prices",
  services_02: "Choose the care",
  services_03: "that fits the car.",
  services_04: "Every baseline is shown by vehicle size. Additional work is scoped and priced in your Care Plan, and only done with your approval.",
  services_05: "Vehicle size",
  services_06: "Not sure yet?",
  services_07: "Start the request and tell us what you see.",
  services_08: "Exterior care",
  services_09: "Interior care",
  services_10: "Combined care",
  services_24: "Start my exterior care request",
  services_20: "We confirm the scope, travel and timing with you.",
  services_21: "Cabin care",
  services_22: "One visit",
  services_26: "Starting price. Final scope and price confirmed after we review the car.",
  services_27: "Interior care, agreed as fabrics, mats and touchpoints.",
  services_28: "About 2 hours on site",
  services_36: "Start my interior care request",
  services_37: "We confirm the cabin’s condition and timing with you.",
  services_43: "Start my combined care request",
  services_44: "We confirm the combined scope and total with you.",
  services_63: "Every baseline includes only what is written here. Anything additional is agreed in your Care Plan before work begins.",
  services_69: "Where the car sits matters.",
  services_70: " We plan around parking, clearance and water access. We agree on any travel or parking surcharge with you first.",
  work_14: "Our chemistry standard",
  work_15: "Gentle first, strong only where needed.",
  work_16: "We start with the gentlest thing that will work, and step up only when the surface tells us it is needed.",
  work_17: "Ready to tell us about the car?",
  work_18: "Start my care request",
  steps_01: "How it works",
  steps_02: "Three steps",
  steps_03: "and you decide at every one.",
  steps_04: "Nothing is scheduled and nothing is charged until we agree on the plan together.",
  steps_05: "01",
  steps_06: "Tell us about the car",
  steps_07: "Vehicle, size, condition and what you want the care to make possible. Blank or unsure answers are fine — we review them together.",
  steps_08: "02",
  steps_09: "We prepare your Care Plan",
  steps_11: "03",
  steps_12: "You decide",
  steps_13: "You approve the plan before anything happens. Only then do we set a time.",
  approach_01: "The approach",
  approach_02: "Care",
  approach_03: "expressed through action.",
  approach_04: "We do not use templates, timers or automated expectations. The car, the location and the week are looked at with attention, and the plan follows what is actually there.",
  approach_05: "Whut i wuld wunt means treating what’s in our hands the way we’d want it treated ourselves.",
  approach_06: "That means honest prices, considered methods and following through on the small things.",
  areas_01: "Where we work",
  areas_02: "San Francisco,",
  areas_03: "and the Bay Area.",
  areas_05: "Ask WIWW a question",
  areas_06: "Have a question first?",
  areas_07: "Ask it. We answer personally, using only what you have told us.",
  areas_08: "Ask WIWW personally",
  areas_09: "Want to work with us?",
  areas_10: "Team opportunities are open. Tell us how you care for what is in your hands.",
  areas_11: "Write about yourself",
  closing_01: "Ready when",
  closing_02: "you are.",
  closing_03: "Start my care request",
};

export const defaultContent: SiteContent = {
  copy: defaultCopy,
  business: defaultBusiness(),
  sections: SECTION_ORDER.map((id) => ({ id, visible: true })),
  images: { heroId: "", lightHeroId: "", logoId: "", darkLogoId: "", questionId: "" },
  theme: { logoPosition: "center", logoDesktopWidth: 128, logoMobileWidth: 112 },
  invitation: { enabled: true, heading: "Welcome to WIWW", message: "A personal welcome." },
  links: { primary: "/book", secondary: "#care-reveal-services" },
  siteText: {},
};

/** Merge stored content over the defaults; unknown or malformed values fall
 * back to the defaults rather than throwing. */
export function parseContent(raw: string | null | undefined): SiteContent {
  let stored: unknown;
  try {
    stored = raw ? JSON.parse(raw) : null;
  } catch {
    stored = null;
  }
  if (!stored || typeof stored !== "object") return structuredClone(defaultContent);
  const data = stored as Partial<SiteContent>;
  const content = structuredClone(defaultContent);
  if (data.copy && typeof data.copy === "object") {
    content.copy = { ...content.copy, ...Object.fromEntries(Object.entries(data.copy).filter(([, v]) => typeof v === "string")) };
  }
  if (data.business && typeof data.business === "object") {
    content.business = { ...content.business, ...data.business } as BusinessConfig;
  }
  if (Array.isArray(data.sections)) {
    content.sections = content.sections.map((section) => {
      const override = data.sections!.find((s) => s?.id === section.id);
      return override && typeof override.visible === "boolean" ? { ...section, visible: override.visible } : section;
    });
  }
  if (data.images && typeof data.images === "object") {
    content.images = { ...content.images, ...Object.fromEntries(Object.entries(data.images).filter(([, v]) => typeof v === "string")) } as SiteImages;
  }
  if (data.theme && typeof data.theme === "object") {
    const theme = { ...content.theme };
    const t = data.theme as Partial<SiteTheme>;
    if (t.logoPosition === "center" || t.logoPosition === "left" || t.logoPosition === "right") theme.logoPosition = t.logoPosition;
    if (Number.isFinite(t.logoDesktopWidth) && (t.logoDesktopWidth as number) > 0 && (t.logoDesktopWidth as number) <= 400) theme.logoDesktopWidth = t.logoDesktopWidth as number;
    if (Number.isFinite(t.logoMobileWidth) && (t.logoMobileWidth as number) > 0 && (t.logoMobileWidth as number) <= 400) theme.logoMobileWidth = t.logoMobileWidth as number;
    content.theme = theme;
  }
  if (data.invitation && typeof data.invitation === "object" && typeof (data.invitation as SiteInvitation).enabled === "boolean") {
    content.invitation = {
      enabled: (data.invitation as SiteInvitation).enabled,
      heading: String((data.invitation as SiteInvitation).heading ?? content.invitation.heading),
      message: String((data.invitation as SiteInvitation).message ?? content.invitation.message),
    };
  }
  if (data.links && typeof data.links === "object") {
    const links = data.links as Partial<SiteContent["links"]>;
    content.links = {
      primary: typeof links.primary === "string" && links.primary ? links.primary : content.links.primary,
      secondary: typeof links.secondary === "string" && links.secondary ? links.secondary : content.links.secondary,
    };
  }
  if (data.siteText && typeof data.siteText === "object") {
    content.siteText = Object.fromEntries(Object.entries(data.siteText).filter(([, v]) => typeof v === "string"));
  }
  return content;
}

/** Public URL for a stored media object. */
export function mediaUrl(id: string): string {
  return `/api/content/media/${id}`;
}

/** Per-theme inline styles derived from stored content. */
export function themeStyle(_content: SiteContent): CSSProperties {
  return {};
}

/** Legacy wording is rewritten to the current voice. */
const voiceRewrites: Array<[RegExp, string]> = [
  [/^\s*The WIWW Preservation Standard\.\s*$/, CORE_QUESTION],
  [/^\s*Proven methods\s*$/, "Methods chosen with care"],
];

export function wiwwVoice(original: string): string {
  for (const [pattern, replacement] of voiceRewrites) {
    if (pattern.test(original)) return replacement;
  }
  return original;
}

export type { WorkPhoto };
export { orderedPhotos };
