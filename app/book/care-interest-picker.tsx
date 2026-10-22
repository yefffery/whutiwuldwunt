"use client";

import { careInterests, formatCareInterestNote } from "@/lib/care-interests";
import { Checkbox } from "@/components/ui/checkbox";
import SiteText from "@/app/site-text";

/** Discussion-only topics. They are not included in your starting price,
 * confirmed, or approved here — each is a conversation point for the Care
 * Plan review. */
export default function CareInterestPicker({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (id: string) => void;
}) {
  const note = formatCareInterestNote(selected);
  return (
    <details className="care-interest-panel care-upsell-panel">
      <summary>
        <span>Other things on your mind (optional)</span>
        <span aria-hidden="true">{selected.length > 0 ? `· ${selected.length} selected` : ""}</span>
      </summary>
      <p className="care-interest-note">
        These topics are conversation points for the Care Plan review. They are not included in your starting price,
        confirmed, or approved here.
      </p>
      <fieldset className="check-grid">
        <legend className="sr-only">Discussion-only interests</legend>
        {careInterests.map((interest) => (
          <label className="check-choice" key={interest.id}>
            <Checkbox checked={selected.includes(interest.id)} onCheckedChange={() => onToggle(interest.id)} />
            <span>
              {interest.label}
              <small>{interest.note}</small>
            </span>
          </label>
        ))}
      </fieldset>
      {note && <p className="selection-feedback" role="status">{note}</p>}
      <p className="note">
        <SiteText id="care-interest-text-1" value="Anything selected here is written into your request for a person to review — never into a price." />
      </p>
    </details>
  );
}
