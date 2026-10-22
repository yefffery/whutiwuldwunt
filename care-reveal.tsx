"use client";
import {useState} from "react";
import {serviceInclusions,serviceDescription} from '@/lib/service-promise';
import {careRevealAreas} from '@/lib/care-reveal-areas';
import type {BusinessConfig} from "@/lib/business-config";

export type RevealService = "exterior" | "interior" | "full";
type Props={service:RevealService;business:BusinessConfig;open:boolean;onToggle:()=>void;idPrefix?:string};

const serviceIntro:Record<RevealService,string>={
 exterior:"Everyday exterior maintenance. Not paint correction, paint protection film, or a ceramic coating.",
 interior:"Care for the cabin, fabrics, mats and touchpoints. Specialty stain and odor work is agreed separately.",
 full:"The approved exterior and interior services together, with one agreed scope."
};
const rationale:Record<RevealService,string>={
 exterior:"The work is designed around careful cleaning, minimizing unnecessary contact, and checking the final finish. The actual procedure follows the agreed scope.",
 interior:"Materials and condition guide the cleaning approach. Extra treatment is never assumed to be included.",
 full:"Combining visits keeps the work coordinated. Each service retains its published inclusions and exclusions."
};
/** Schematic service journey: illustrative only, never a before/after result. */
function CareRevealDiagram({service,stage}:{service:RevealService;stage:number}){
 const areas=careRevealAreas(service);
 const areaLabel=areas.exterior&&areas.interior?'exterior and interior areas':areas.exterior?'exterior areas':'interior areas';
 return <svg className="wiww-reveal-diagram" viewBox="0 0 320 106" role="img" aria-label={`${service==="full"?"Combined":service==="interior"?"Interior":"Exterior"} care, ${areaLabel}, stage ${stage+1} of 3. Concept illustration, not a vehicle assessment.`}>
  <rect x="1" y="1" width="318" height="104" rx="10" fill="currentColor" opacity=".04"/>
  <path d="M35 63L59 56 83 33Q90 26 108 26H198Q212 26 221 38L242 56 279 63Q292 66 292 79V84H28V77Q28 67 35 63Z" fill="none" stroke="currentColor" opacity=".73" strokeWidth="1.9" strokeLinejoin="round"/>
  <path d="M92 34H145V56H70L87 38Q89 34 92 34ZM151 34H196Q208 34 216 43L228 56H151Z" fill={areas.interior?"#1BAFA8":"none"} fillOpacity={stage===0?.22:.08} stroke="currentColor" strokeWidth="1.3" opacity=".78"/>
  <circle cx="87" cy="84" r="15" fill="currentColor" opacity=".12"/><circle cx="87" cy="84" r="9" fill="none" stroke="currentColor" strokeWidth="1.7"/>
  <circle cx="240" cy="84" r="15" fill="currentColor" opacity=".12"/><circle cx="240" cy="84" r="9" fill="none" stroke="currentColor" strokeWidth="1.7"/>
  {areas.exterior&&<path d="M41 60Q157 -3 278 60" fill="none" stroke="#16BEB4" strokeWidth={stage===1?3:2} strokeDasharray={stage===1?"4 6":undefined} opacity={stage===2?.24:1}/>}
  {areas.interior&&<path d="M109 43H206M157 35V58" fill="none" stroke="#16BEB4" strokeWidth={stage===0?2:1.5} strokeLinecap="round" opacity={stage===2?.24:1}/>}
  {stage===2&&<g><circle cx="271" cy="22" r="13" fill="#157F78"/><path d="M265 22L270 27L278 18" fill="none" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/></g>}
  <text x="15" y="17" fill="currentColor" opacity=".65" fontSize="9" letterSpacing="1.1">{stage===0?"THE APPROACH":stage===1?"THE ATTENTION":"THE FINISH"}</text>
  <text x="304" y="98" textAnchor="end" fill="currentColor" opacity=".48" fontSize="8">WIWW · ILLUSTRATIVE</text>
 </svg>;
}

export default function CareReveal({service,business,open,onToggle,idPrefix="care-reveal"}:Props){
 const [stage,setStage]=useState(0);
 const contentId=`${idPrefix}-${service}`;
 const clean=serviceInclusions(business,service);
 const description=serviceDescription(business,service)||serviceIntro[service];
 const stages=["The Approach","The Attention","The Finish"];
 return <div className="wiww-care-reveal">
  <button type="button" className="wiww-reveal-trigger" aria-expanded={open} aria-controls={contentId} onClick={()=>{if(!open)setStage(0);onToggle();}}>
   <span>{open?"Close the care details":"Explore the care"}</span><span aria-hidden="true">{open?"−":"+"}</span>
  </button>
  <div className="wiww-reveal-body" id={contentId} hidden={!open}>
   <div className="wiww-reveal-journey" aria-label={`Care explanation stage ${stage+1} of 3`}>
    {stages.map((name,index)=><button key={name} type="button" aria-current={index===stage?"step":undefined} aria-pressed={index===stage} className={index===stage?"is-current":""} onClick={()=>setStage(index)}><span className="wiww-reveal-count">0{index+1}</span><span>{name}</span></button>)}
   </div>
   <CareRevealDiagram service={service} stage={stage}/>
   <div className="wiww-reveal-content" role="region" aria-live="polite" aria-label={stages[stage]}>
    {stage===0&&<><h4>The approach to your care</h4><p>{description}</p><p>{rationale[service]}</p>{clean.length===0&&<p className="wiww-reveal-muted">Exact inclusions are confirmed in the approved service description and Care Plan.</p>}</>}
    {stage===1&&<><h4>The work receiving attention</h4>{clean.length>0?<ul>{clean.map((item,i)=><li key={`${i}-${item}`}>{item}</li>)}</ul>:<p>Itemized scope needs owner approval before it can be shown here.</p>}<p>Knowing what is included helps you choose only the care you need.</p><p className="wiww-reveal-muted">A process illustration explains our method; it is not a simulated before-and-after result.</p></>}
    {stage===2&&<><h4>The finish, with clear expectations</h4>{clean.filter(item=>/dry|check|finish/i.test(item)).map(item=><p key={item}>{item}</p>)}<p>We review the agreed work with you. Any additional treatment needs your agreement; the service description and Care Plan define what is included.</p><p className="wiww-reveal-muted">A request does not reserve an appointment. Additional work requires your agreement.</p></>}
   </div>
  </div>
 </div>;
}
