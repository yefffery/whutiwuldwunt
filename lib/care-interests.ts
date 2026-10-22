// Ten approved discussion-only interests. They are conversation points, never
// priced add-ons and never confirmed through the request form.
export interface CareInterest {
  id: string;
  label: string;
  description: string;
}

export const careInterests: CareInterest[] = [
  { id: "engine-bay", label: "Engine bay care", description: "A light clean and dressing so the engine bay looks cared for and runs cool." },
  { id: "trim-tire-dressing", label: "Trim & tire dressing", description: "Dressing chosen for the trim and tires, applied lightly and checked for sling." },
  { id: "cured_ceramic_coating", label: "Cured Ceramic Coating", description: "A cured ceramic coating is discussed case-by-case; typical protection is 36–48 months before a personal reassessment." },
  { id: "clay-preparation", label: "Clay preparation", description: "For a wash that does not already include it. Included with exterior ceramic and wax." },
  { id: "wax", label: "Wax", description: "A hand-applied wax discussed against the finish and any coating already on the car." },
  { id: "stain-removal", label: "Stain removal", description: "Fabric stains are looked at first; we agree on what is realistic before any treatment." },
  { id: "excess-pet-hair", label: "Excess pet hair", description: "A light amount included with interior care; heavier cabins are discussed before agreeing a method." },
  { id: "odor-treatment", label: "Odor treatment", description: "We discuss the source and what may be reduced before agreeing on a method." },
  { id: "headlight-restoration", label: "Headlight restoration", description: "Assessed in person; lenses are restored when the finish can support it." },
  { id: "glass-ceramic", label: "Glass ceramic", description: "Glass only. A coating conversation for windscreens and windows, applied when the surface is sound." },
];

/** One summary line for the request. Selected interests are deduplicated,
 * validated against the approved catalog, and carry no price. */
export function formatCareInterestNote(interests: string[]): string {
  const labels = careInterests
    .filter((interest) => interests.includes(interest.id))
    .map((interest) => interest.label);
  if (labels.length === 0) return "";
  return `Optional work to discuss only: ${labels.join(", ")}. These are not added or approved by this request. Confirm scope and price in the Care Plan before any work.`;
}
