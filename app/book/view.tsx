"use client";

import { useState } from "react";
import RequestForm from "@/app/request-form";
import CareProfile from "./care-profile";
import CareInterestPicker from "./care-interest-picker";
import SiteText from "@/app/site-text";
import CareReveal, { type RevealService } from "@/app/care-reveal";
import { serviceName, serviceInclusions } from "@/lib/service-promise";
import { decimalMoney as money } from "@/lib/money";
import { serviceAmount, type CareSettings } from "@/lib/care-rules";
import { vehicleSizes, getVehicleSize, type VehicleSize } from "@/lib/service-menu";
import { defaultBusiness, sourceConfig, type BusinessConfig } from "@/lib/business-config";
import { Checkbox } from "@/components/ui/checkbox";

const PRIMARY_STEPS = [
  { id: 1, label: "Vehicle" },
  { id: 2, label: "Care" },
  { id: 3, label: "Where" },
  { id: 4, label: "Utilities" },
  { id: 5, label: "Review & send" },
] as const;

// Steps 3 and 4 are the onboarding environment and utility questions. They are
// completely non-blocking: nothing here is required and no answer produces a
// validation error. Blank or "unsure" answers are flagged for human vetting
// when the inquiry is sent.
export const ENVIRONMENT_OPTIONS = [
  { id: "garage", label: "Garage or covered parking" },
  { id: "driveway", label: "Private driveway" },
  { id: "street", label: "Street parking" },
  { id: "apartment", label: "Apartment or shared complex" },
  { id: "unsure", label: "Not sure yet" },
] as const;

export const UTILITY_OPTIONS = [
  { id: "water-access", label: "Water access available" },
  { id: "power-access", label: "Power outlet nearby" },
  { id: "shade", label: "Shade available" },
  { id: "none", label: "None of these yet" },
  { id: "unsure", label: "Not sure yet" },
] as const;

const NON_BLOCKING_NOTE =
  "Nothing here is required. Anything you leave blank or mark “not sure” is fine — we review it with you and confirm what we need on site.";

function labelFor(options: ReadonlyArray<{ id: string; label: string }>, id: string): string {
  return options.find((option) => option.id === id)?.label ?? id;
}

type Props = {
  careConfig?: CareSettings;
  preview?: boolean;
  embedded?: boolean;
  preferredService?: string;
  preferredSize?: string;
  returning?: boolean;
};

export default function BookView({
  careConfig = {},
  embedded = false,
  preferredService,
  preferredSize,
  returning = false,
}: Props) {
  const business: BusinessConfig = defaultBusiness();

  const initialSize: VehicleSize | null =
    preferredSize && vehicleSizes.some((item) => item.value === preferredSize) ? preferredSize : null;
  const initialSelected =
    preferredService && preferredService !== "not-sure" && preferredService !== "cured_ceramic_coating"
      ? [preferredService]
      : [];

  const [step, setStep] = useState(initialSelected.length > 0 ? 2 : 1);
  const [size, setSize] = useState<VehicleSize | null>(initialSize);
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [ceramic, setCeramic] = useState(preferredService === "cured_ceramic_coating");
  const [environment, setEnvironment] = useState<string[]>([]);
  const [utilities, setUtilities] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  const tier = size ? getVehicleSize(size).value : "";
  const primaryServices = sourceConfig.services.filter(
    (service) => service.visible && !service.specialtyReview && service.feltCareEnabled,
  );
  const ceramicService = sourceConfig.services.find((service) => service.specialtyReview);

  const toggle = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));

  const summaryServices = [...selected, ...(ceramic && ceramicService ? [ceramicService.id] : [])];

  return (
    <section className={embedded ? "care-builder" : "book-page-section"} aria-labelledby="inquiry-flow-title">
      <div className="wrap">
        <h2 id="inquiry-flow-title" className={embedded ? "inquiry-heading" : "section-title"}>
          <SiteText id="book-view-text-1" value="Start my care request" />
        </h2>
        <p className="inquiry-lede">
          Five short steps, your pace. Nothing is scheduled or charged until we agree on the plan together.
        </p>
        <ol className="inquiry-progress" aria-label="Request steps">
          {PRIMARY_STEPS.map((entry) => (
            <li
              key={entry.id}
              aria-current={step === entry.id ? "step" : undefined}
              className={entry.id === step ? "is-current" : entry.id < step ? "is-done" : ""}
            >
              {entry.id < step ? "✓ " : `${entry.id}. `}
              {entry.label}
            </li>
          ))}
        </ol>

        {step === 1 && (
          <CareProfile
            business={business}
            size={size}
            onSize={(next) => {
              setSize(next);
              setStep(2);
            }}
            returning={returning}
          />
        )}

        {step === 2 && (
          <div className="builder-section">
            <div className="step-heading">
              <h3>Step 2 · Choose the care</h3>
              <p>{size ? "Baselines are shown for your vehicle size." : "Choose a vehicle size first so the baselines can show."}</p>
            </div>
            <div className="premium-service-grid">
              {primaryServices.map((service) => (
                <PrimaryCard
                  key={service.id}
                  service={service}
                  business={business}
                  careConfig={careConfig}
                  size={size}
                  tier={tier}
                  checked={selected.includes(service.id)}
                  onToggle={() => toggle(service.id)}
                />
              ))}

              {ceramicService && (
                <article className={"premium-service specialty-service open-specialty-card" + (ceramic ? " selected" : "")}>
                  <div className="tier-label">
                    <span>Open conversation</span>
                    <span>Reviewed separately</span>
                  </div>
                  <h3>{ceramicService.name}</h3>
                  <p className="tier-intro">{ceramicService.description}</p>
                  <div className="service-price">
                    <strong>
                      {size
                        ? `Baseline for ${getVehicleSize(size).label}: ${money(serviceAmount(ceramicService.id, tier, careConfig))}`
                        : `Baseline per size: ${primaryServices && ceramicService ? `${money(serviceAmount(ceramicService.id, "sedan", careConfig))} · ${money(serviceAmount(ceramicService.id, "compact-suv", careConfig))} · ${money(serviceAmount(ceramicService.id, "full-size", careConfig))}` : ""}`}
                    </strong>
                    <span>
                      Baseline only. The final scope and price are set case-by-case in your Care Plan after a personal
                      review — nothing is priced or calculated here.
                    </span>
                  </div>
                  <ul className="service-inclusions">
                    {serviceInclusions(business, ceramicService.id).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                  {/* felt_care_enabled: false — no Approach, Attention or Finish
                      steps for this service; it remains an open conversation point. */}
                  <label className="care-choice">
                    <Checkbox
                      checked={ceramic}
                      onCheckedChange={(v) => setCeramic(v === true)}
                      aria-label={`Discuss ${ceramicService.name} in my Care Plan`}
                    />
                    <span>Discuss {ceramicService.name} in my Care Plan</span>
                  </label>
                  <p className="note">
                    Selecting this adds a manual context topic for your Care Plan. No upfront total is calculated and no
                    price changes here.
                  </p>
                </article>
              )}
            </div>
            <div className="step-actions">
              <button className="btn outline" type="button" onClick={() => setStep(1)}>Back</button>
              <button className="btn" type="button" disabled={!size} onClick={() => setStep(3)}>Continue</button>
            </div>
            <CareInterestPicker
              selected={interests}
              onToggle={(id) =>
                setInterests((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]))
              }
            />
          </div>
        )}

        {step === 3 && (
          <div className="builder-section">
            <div className="step-heading">
              <h3>Step 3 · Where will the car be?</h3>
              <p>{NON_BLOCKING_NOTE}</p>
            </div>
            <fieldset className="check-grid">
              <legend className="sr-only">Parking and setting</legend>
              {ENVIRONMENT_OPTIONS.map((option) => (
                <label className="check-choice" key={option.id}>
                  <Checkbox
                    checked={environment.includes(option.id)}
                    onCheckedChange={(v) =>
                      setEnvironment((current) => (v === true ? [...current, option.id] : current.filter((id) => id !== option.id)))
                    }
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </fieldset>
            <div className="step-actions">
              <button className="btn outline" type="button" onClick={() => setStep(2)}>Back</button>
              <button className="btn" type="button" onClick={() => setStep(4)}>Continue</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="builder-section">
            <div className="step-heading">
              <h3>Step 4 · What can we use?</h3>
              <p>{NON_BLOCKING_NOTE}</p>
            </div>
            <fieldset className="check-grid">
              <legend className="sr-only">Utilities</legend>
              {UTILITY_OPTIONS.map((option) => (
                <label className="check-choice" key={option.id}>
                  <Checkbox
                    checked={utilities.includes(option.id)}
                    onCheckedChange={(v) =>
                      setUtilities((current) => (v === true ? [...current, option.id] : current.filter((id) => id !== option.id)))
                    }
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </fieldset>
            <div className="step-actions">
              <button className="btn outline" type="button" onClick={() => setStep(3)}>Back</button>
              <button className="btn" type="button" onClick={() => setStep(5)}>Continue</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="builder-section">
            <div className="step-heading">
              <h3>Step 5 · Review &amp; send</h3>
              <p>Your selections travel with the request for personal review. Nothing is scheduled or charged.</p>
            </div>
            <RequestForm
              kind="inquiry"
              configuredService={(summaryServices[0] as string) || "not-sure"}
              selectedServices={summaryServices}
              tier={tier}
              environment={environment}
              utilities={utilities}
              interests={interests}
              initialCity=""
              configuration={
                [
                  summaryServices.length > 0
                    ? `Care discussed: ${summaryServices.map((id) => serviceName(business, id)).join(", ")}.`
                    : "Care discussed: not sure yet.",
                  ceramic && ceramicService
                    ? `${ceramicService.name}: priced case-by-case inside the final Care Plan.`
                    : "",
                  `Vehicle size: ${size ? getVehicleSize(size).label : "not sure yet"}.`,
                  environment.length > 0
                    ? `Setting: ${environment.map((id) => labelFor(ENVIRONMENT_OPTIONS, id)).join(", ")}.`
                    : "",
                  utilities.length > 0
                    ? `Utilities: ${utilities.map((id) => labelFor(UTILITY_OPTIONS, id)).join(", ")}.`
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
            />
            <div className="step-actions">
              <button className="btn outline" type="button" onClick={() => setStep(4)}>Back</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function PrimaryCard({
  service,
  business,
  careConfig,
  size,
  tier,
  checked,
  onToggle,
}: {
  service: (typeof sourceConfig.services)[number];
  business: BusinessConfig;
  careConfig: CareSettings;
  size: VehicleSize | null;
  tier: string;
  checked: boolean;
  onToggle: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <article className={"premium-service" + (checked ? " selected" : "")}>
      <div className="tier-label">
        <span>{service.package ? "Combined care" : service.id === "fabric_freshness" ? "Cabin care" : "Exterior care"}</span>
        <span>{service.package ? "One visit" : "Personal Care Plan"}</span>
      </div>
      <h3>{service.name}</h3>
      <p className="tier-intro">{service.description}</p>
      <div className="service-price" aria-live="polite">
        <strong>{size ? money(serviceAmount(service.id, tier, careConfig)) : "Choose vehicle size"}</strong>
        <span>
          {size
            ? <>Starting price · {getVehicleSize(size).label}. We confirm the final scope and price after we review the car.</>
            : "A starting price is not shown before a vehicle size is chosen."}
        </span>
      </div>
      <ul className="service-inclusions">
        {serviceInclusions(business, service.id).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      {!service.package && (
        <CareReveal service={service.id as RevealService} business={business} open={open} onToggle={() => setOpen(!open)} idPrefix="book-care" />
      )}
      <label className="care-choice">
        <Checkbox checked={checked} onCheckedChange={() => onToggle()} aria-label={`Include ${service.name} in my request`} />
        <span>Include {service.name} in my request</span>
      </label>
    </article>
  );
}
