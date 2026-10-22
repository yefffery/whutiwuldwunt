"use client";

import { useState } from "react";
import SiteText from "@/app/site-text";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { vehicleSizes, type VehicleSize } from "@/lib/service-menu";
import type { BusinessConfig } from "@/lib/business-config";

/** Step 1: the vehicle. A size is chosen deliberately — the flow does not
 * assume a tier, and the Continue action stays disabled until one is picked. */
export default function CareProfile({
  business,
  size,
  onSize,
  returning = false,
}: {
  business: BusinessConfig;
  size: VehicleSize | null;
  onSize: (size: VehicleSize) => void;
  returning?: boolean;
}) {
  const [choice, setChoice] = useState<VehicleSize | null>(size);
  return (
    <div className="builder-section">
      <div className="step-heading">
        <h3>Step 1 · The vehicle</h3>
        <p>
          {returning
            ? "Welcome back. Tell us about the car as it is today."
            : "Only the vehicle size is needed to show baselines; every other detail is optional."}
        </p>
      </div>
      <fieldset>
        <legend>Choose vehicle size</legend>
        <RadioGroup
          value={choice ?? ""}
          onValueChange={(value) => setChoice(value)}
          className="vehicle-sizes"
          aria-label="Vehicle size"
        >
          {vehicleSizes.map((option) => (
            <label className={"size-choice" + (option.value === choice ? " selected" : "")} key={option.value} htmlFor={"size-" + option.value}>
              <RadioGroupItem value={option.value} id={"size-" + option.value} />
              <span>
                <strong>{option.label}</strong>
                <small>{option.detail}</small>
              </span>
            </label>
          ))}
        </RadioGroup>
      </fieldset>
      <div className="step-actions">
        <button className="btn" type="button" disabled={!choice} onClick={() => choice && onSize(choice)}>
          Continue
        </button>
      </div>
    </div>
  );
}
