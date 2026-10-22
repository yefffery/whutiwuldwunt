"use client";
import CareReveal,{type RevealService} from "./care-reveal";
import {serviceName,serviceDescription,serviceInclusions,serviceAvailable} from "@/lib/service-promise";
import {careFromBusiness} from "@/lib/business-config";
import {VariableWrapper} from "@/app/manage/preview/variable-wrapper";
import SiteText from "@/app/site-text";
import { defaultCareSettings,packageSavings,serviceAmount,type CareSettings } from "@/lib/care-rules";
import { money } from "@/lib/money";
import { useState } from "react";
import { defaultCopy,type SiteCopy } from "@/lib/site-content";
import type { BusinessConfig } from "@/lib/business-config";
import Link from "@/lib/site-link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getVehicleSize, serviceRequestHref, vehicleSizes, type VehicleSize } from "@/lib/service-menu";

export default function ServiceMenu({copy=defaultCopy,careConfig=defaultCareSettings,preferredService,business}:{copy?:SiteCopy;careConfig?:CareSettings;preferredService?:string;business:BusinessConfig}) {
  const [size, setSize] = useState<VehicleSize>("sedan");
  const vehicle = getVehicleSize(size);
  const [expanded,setExpanded]=useState<RevealService|null>(null);
  careConfig={...careConfig,...careFromBusiness(business)};
  return <>
    <div className="service-controls">
      <fieldset className="size-fieldset"><legend><SiteText id="service-menu-text-1" value={copy.services_05} field={"services_05"}/></legend>
        <RadioGroup value={size} onValueChange={v => setSize(getVehicleSize(v).value)} className="vehicle-sizes" aria-label="Vehicle size">
          {vehicleSizes.map(s => <label className={"size-choice" + (s.value === size ? " selected" : "")} key={s.value} htmlFor={"size-" + s.value}>
            <RadioGroupItem value={s.value} id={"size-" + s.value}/><span><strong><SiteText id="service-menu-text-69" value={s.label}/></strong><small><SiteText id="service-menu-text-70" value={s.detail}/></small></span>
          </label>)}
        </RadioGroup>
      </fieldset>
      <div className="quick-request"><Link className="btn" href={serviceRequestHref("not-sure", size)}><SiteText id="service-menu-text-2" value={copy.services_06} field={"services_06"}/></Link><span><SiteText id="service-menu-text-3" value={copy.services_07} field={"services_07"}/></span></div>
    </div>
    <div className="premium-service-grid">
      {business.services.find(service=>service.id==='exterior')?.visible&&<article className="premium-service signature-service" style={{order:preferredService==="exterior"?-1:0}}>
        <div className="tier-label"><span><SiteText id="service-menu-text-4" value={copy.services_08} field={"services_08"}/></span><span><SiteText id="service-menu-text-5" value={"Personal Care Plan"}/></span></div>
        <h3>{serviceName(business,'exterior')}</h3>
        <p className="tier-intro">{serviceDescription(business,'exterior')}</p>
        <div className="service-price" aria-live="polite" aria-atomic="true"><strong><VariableWrapper id={`business.services.exterior.prices.${size}`} displayValue={business.services.find(s=>s.id==="exterior")?.quote?"Personal quote":money(serviceAmount("exterior",size,careConfig))}/></strong><span><SiteText id="service-menu-text-9" value={"Starting price. Final scope and price confirmed after we review the car."}/><br/><SiteText id="service-menu-text-10" value={vehicle.label}/></span></div>
        <ul className="service-inclusions">{serviceInclusions(business,'exterior').map((item,i)=><li key={i}>{item}</li>)}</ul><CareReveal service="exterior" business={business} open={expanded==='exterior'} onToggle={()=>setExpanded(expanded==='exterior'?null:'exterior')} idPrefix="service-detail"/>
        <Link className="btn" href={serviceRequestHref("exterior", size)}><SiteText id="service-menu-text-19" value={copy.services_24} field={"services_24"}/></Link>
        <p className="tier-footnote"><SiteText id="service-menu-text-20" value={"We confirm the scope, travel and timing with you."}/></p>
      </article>}
      {business.services.find(service=>service.id==='interior')?.visible&&<article className="premium-service" style={{order:preferredService==="interior"?-1:0}}>
        <div className="tier-label"><span><SiteText id="service-menu-text-21" value={copy.services_27} field={"services_27"}/></span><span><SiteText id="service-menu-text-22" value={copy.services_28} field={"services_28"}/></span></div>
        <h3>{serviceName(business,'interior')}</h3>
        <p className="tier-intro">{serviceDescription(business,'interior')}</p>
        <div className="service-price quote-price"><strong><VariableWrapper id={`business.services.interior.prices.${size}`} displayValue={business.services.find(s=>s.id==="interior")?.quote?"Personal quote":money(serviceAmount("interior",size,careConfig))}/></strong><span><SiteText id="service-menu-text-26" value={"Starting price. Final scope and price confirmed after we review the car."}/><br/><SiteText id="service-menu-text-27" value={vehicle.label}/></span></div>
        <ul className="service-inclusions">{serviceInclusions(business,'interior').map((item,i)=><li key={i}>{item}</li>)}</ul><CareReveal service="interior" business={business} open={expanded==='interior'} onToggle={()=>setExpanded(expanded==='interior'?null:'interior')} idPrefix="service-detail"/>
        <Link className="btn outline" href={serviceRequestHref("interior", size)}><SiteText id="service-menu-text-36" value={copy.services_43} field={"services_43"}/></Link>
        <p className="tier-footnote"><SiteText id="service-menu-text-37" value={copy.services_44} field={"services_44"}/></p>
      </article>}
      {serviceAvailable(business,"full")&&<article className="premium-service total-therapy-service" style={{order:preferredService==="full"?-1:0}}>
        <div className="tier-label"><span>WIWW / combined care</span><span>One visit</span></div>
        <h3>{serviceName(business,'full')}</h3>
        <p className="tier-intro">{serviceDescription(business,'full')}</p>
        <div className="service-price"><strong><VariableWrapper id={`business.package.prices.${size}`} displayValue={money(serviceAmount("full",size,careConfig))}/></strong><span>Combined starting price · {vehicle.label}. We confirm the final scope and total before you decide.</span></div>
        <ul className="service-inclusions">{serviceInclusions(business,'full').map((item,i)=><li key={i}>{item}</li>)}</ul><CareReveal service="full" business={business} open={expanded==='full'} onToggle={()=>setExpanded(expanded==='full'?null:'full')} idPrefix="service-detail"/>
        <Link className="btn" href={serviceRequestHref("full", size)}>Request {serviceName(business,'full')}</Link>
        <p className="tier-footnote">Save {money(packageSavings(size,careConfig))} compared with the separate starting prices.</p>
      </article>}
    </div>
    <p className="menu-scope-note"><SiteText id="service-menu-text-57" value={copy.services_63} field={"services_63"}/></p>
    <p className="environment-note"><strong><SiteText id="service-menu-text-67" value={copy.services_69} field={"services_69"}/></strong><SiteText id="service-menu-text-68" value={copy.services_70} field={"services_70"}/></p>
  </>;
}
