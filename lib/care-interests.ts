// Ten approved discussion-only interests. They are conversation points, never
// priced add-ons and never confirmed through the request form.
export interface CareInterest {
  id: string;
  label: string;
  note: string;
}

export const careInterests: CareInterest[] = [
  { id: "paint-protection", label: "Paint protection", note: "An open conversation about protecting the finish; scoped separately if it is a fit." },
  { id: "paint-correction", label: "Paint correction", note: "Discussed case-by-case; any work is scoped in a personal Care Plan." },
  { id: "interior-deep-clean", label: "Deeper interior clean", note: "Beyond the starting scope; agreed by material and condition." },
  { id: "odor-treatment", label: "Odor treatment", note: "Assessed in person; agreed separately from the starting price." },
  { id: "pet-hair", label: "Pet hair", note: "Depends on the cabin; we discuss what is realistic before agreeing anything." },
  { id: "engine-bay", label: "Engine bay care", note: "An open conversation; only agreed when it is safe and useful." },
  { id: "headlight-restoration", label: "Headlight restoration", note: "Assessed in person and scoped in the Care Plan if it is a fit." },
  { id: "water-spot-removal", label: "Water spot removal", note: "Depends on the finish; we look before promising anything." },
  { id: "wheel-refinish", label: "Wheel refinish", note: "A specialist conversation; referred or scoped personally." },
  { id: "monthly-upkeep", label: "Regular upkeep", note: "If we are a fit, a rhythm can be planned after a first visit." },
];

/** One summary line for the request, per selected interest. */
export function formatCareInterestNote(interests: string[]): string {
  const labels = careInterests
    .filter((interest) => interests.includes(interest.id))
    .map((interest) => interest.label);
  if (labels.length === 0) return "";
  return `Open conversation points: ${labels.join(", ")}. Not included in the starting price; each is reviewed personally and priced case-by-case in the Care Plan.`;
}
