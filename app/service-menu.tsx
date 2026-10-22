"use client";
import CareReveal, { type RevealService } from "./care-reveal";
import SiteText from "@/app/site-text";
import { defaultCareSettings, packageSavings, serviceAmount, type CareSettings } from "@/lib/care-rules";
import { money } from "@/lib/money";
import { useState } from "react";
import { defaultCopy, type SiteCopy } from "@/lib/site-content";
import Link from "@/lib/site-link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getVehicleSize, serviceRequestHref, vehicleSizes, type VehicleSize } from "@/lib/service-menu";
import { sourceConfig, type BusinessConfig } from "@/lib/business-config";

/** The services menu. Every card, baseline and inclusion is read from
 * src/config/business_configuration.json — nothing is hardcoded here. */
export default function ServiceMenu({ copy = defaultCopy, careConfig = defaultCareSettings, preferredService, business }: { copy?: SiteCopy; careConfig?: CareSettings; preferredService?: string; business: BusinessConfig }) {
  const [size, setSize] = useState<VehicleSize>("sedan");
  const vehicle = getVehicleSize(size);
  const [expanded, setExpanded] = useState<string | null>(null);
  careConfig = { ...careConfig };
  const primary = sourceConfig.services.filter((service) => service.visible && !service.specialtyReview && service.feltCareEnabled);
  const ceramic = sourceConfig.services.find((service) => service.specialtyReview && service.visible);
  return <>
    <div className="service-controls">
      <fieldset className="size-fieldset"><legend><SiteText id="service-menu-text-1" value={copy.services_05} field={"services_05"} /></legend>
        <RadioGroup value={size} onValueChange={v => setSize(getVehicleSize(v).value)} className="vehicle-sizes" aria-label="Vehicle size">
          {vehicleSizes.map(s => <label className={"size-choice" + (s.value === size ? " selected" : "")} key={s.value} htmlFor={"size-" + s.value}>
            <RadioGroupItem value={s.value} id={"size-" + s.value} /><span><strong><SiteText id="service-menu-text-69" value={s.label} /></strong><small><SiteText id="service-menu-text-70" value={s.detail} /></small></span>
          </label>)}
        </RadioGroup>
      </fieldset>
      <div className="quick-request"><Link className="btn" href={serviceRequestHref("not-sure", size)}><SiteText id="service-menu-text-2" value={copy.services_06} field={"services_06"} /></Link><span><SiteText id="service-menu-text-3" value={copy.services_07} field={"services_07"} /></span></div>
    </div>
    <div className="premium-service-grid">
      {primary.map((service, index) => <article className={"premium-service" + (index === 0 ? " signature-service" : "") + (service.package ? " total-therapy-service" : "")} style={{ order: preferredService === service.id ? -1 : 0 }} key={service.id}>
        <div className="tier-label"><span><SiteText id={"service-menu-label-" + service.id} value={service.package ? copy.services_10 : service.id === "fabric_freshness" ? copy.services_21 : copy.services_08} field={service.package ? "services_10" : service.id === "fabric_freshness" ? "services_21" : "services_08"} /></span><span><SiteText id={"service-menu-label2-" + service.id} value={service.package ? "One visit" : "Personal Care Plan"} /></span></div>
        <h3>{service.name}</h3>
        <p className="tier-intro">{service.description}</p>
        <div className="service-price" aria-live="polite" aria-atomic="true"><strong>{money(serviceAmount(service.id, size, careConfig))}</strong><span><SiteText id="service-menu-text-9" value={"Starting price. Final scope and price confirmed after we review the car."} /><br /><SiteText id="service-menu-text-10" value={vehicle.label} /></span></div>
        <ul className="service-inclusions">{service.inclusions.map((item, i) => <li key={i}>{item}</li>)}</ul>
        <CareReveal service={service.id as RevealService} business={business} open={expanded === service.id} onToggle={() => setExpanded(expanded === service.id ? null : service.id)} idPrefix="service-detail" />
        <Link className="btn" href={serviceRequestHref(service.id, size)}><SiteText id={"service-menu-request-" + service.id} value={service.package ? copy.services_43 : service.id === "fabric_freshness" ? copy.services_36 : copy.services_24} field={service.package ? "services_43" : service.id === "fabric_freshness" ? "services_36" : "services_24"} /></Link>
        <p className="tier-footnote">{service.package ? <>Save {money(packageSavings(size, careConfig))} compared with the separate starting prices.</> : <SiteText id={"service-menu-footnote-" + service.id} value={service.id === "fabric_freshness" ? copy.services_37 : copy.services_20} />}</p>
      </article>)}

      {ceramic && (
        <article className="premium-service specialty-service open-specialty-card" style={{ order: preferredService === ceramic.id ? -1 : 0 }}>
          <div className="tier-label"><span>Open conversation</span><span>Reviewed separately</span></div>
          <h3>{ceramic.name}</h3>
          <p className="tier-intro">{ceramic.description}</p>
          <div className="service-price">
            <strong>Baseline · {vehicle.label}: {money(serviceAmount(ceramic.id, size, careConfig))}</strong>
            <span>
              Baseline only. The final scope and price are set case-by-case in your Care Plan after a personal review — nothing is priced or calculated here.
            </span>
          </div>
          <ul className="service-inclusions">{ceramic.inclusions.map((item, i) => <li key={i}>{item}</li>)}</ul>
          {/* felt_care_enabled: false — no Approach, Attention or Finish steps.
              Cured Ceramic Coating remains an open conversation point. */}
          <Link className="btn outline" href={serviceRequestHref(ceramic.id, size)}>Discuss {ceramic.name} in my Care Plan</Link>
          <p className="tier-footnote">A manual context topic — no upfront total is calculated, and no price changes here.</p>
        </article>
      )}
    </div>
    <p className="menu-scope-note"><SiteText id="service-menu-text-57" value={copy.services_63} field={"services_63"} /></p>
    <p className="environment-note"><strong><SiteText id="service-menu-text-67" value={copy.services_69} field={"services_69"} /></strong><SiteText id="service-menu-text-68" value={copy.services_70} field={"services_70"} /></p>
  </>;
}
