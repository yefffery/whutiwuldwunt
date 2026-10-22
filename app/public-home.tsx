"use client";
import {sourceConfig} from "@/lib/business-config";
import SiteText,{useOpenSiteControl,useSiteEditing} from "./site-text";
import {mediaUrl} from "@/lib/site-content";
import {CORE_QUESTION,DEEPER_STATEMENT} from "@/lib/brand-philosophy";
import ConfirmedAssistant from "./confirmed-assistant";
import HomeView from "./home-view";
import BookView from "./book/view";
import Proof from "./proof";
import {careFromBusiness,orderedPhotos} from "@/lib/business-config";
import {serviceAmount} from "@/lib/care-rules";
import {decimalMoney as money} from "@/lib/money";

import {type SiteContent} from "@/lib/site-content";
import type { WorkPhoto } from "@/lib/portfolio";
import type { CareSettings } from "@/lib/care-rules";
import Image from "next/image";
import {serviceName,serviceDescription,serviceInclusions} from "@/lib/service-promise";
import CareReveal, {type RevealService} from "./care-reveal";
import {useState} from "react";

export function PriceGlance({content,careConfig}:{content:SiteContent;careConfig:CareSettings}){
 const [expanded,setExpanded]=useState<RevealService|null>(null);
 const prices={...careConfig,...careFromBusiness(content.business)};
 const tiers=[{id:"sedan" as const,label:"Sedan"},{id:"compact-suv" as const,label:"Compact SUV"},{id:"full-size" as const,label:"Large SUV / Truck"}];
 const offers=sourceConfig.services.filter(item=>item.visible&&!item.specialtyReview&&item.feltCareEnabled).map(item=>item.id);
 return <section className="wrap price-glance" aria-labelledby="price-glance-title"><div className="price-glance-heading"><span className="eyebrow">Pricing up front</span><h2 id="price-glance-title">See the starting price before you choose.</h2><p>Prices are shown by vehicle size. Choose your vehicle and care in the request; we’ll agree on the exact scope before work begins.</p><p className="wiww-home-discovery-note">Curious about what goes into the work? Each service has an optional care journey to explore.</p></div><div className="price-glance-grid" id="care-reveal-services">{offers.map(offer=><article className="price-glance-card" key={offer}><header><h3>{serviceName(content.business,offer)}</h3><p>{serviceDescription(content.business,offer)}</p></header><dl>{tiers.map(tier=><div key={tier.id}><dt>{tier.label}</dt><dd>{content.business.services.find(item=>item.id===offer)?.quote?"Personal quote":money(serviceAmount(offer,tier.id,prices))}</dd></div>)}</dl>{content.business.services.find(item=>item.id===offer)?.duration&&<p className="service-duration">Estimated on site: {content.business.services.find(item=>item.id===offer)?.duration}</p>}<ul>{serviceInclusions(content.business,offer).map((item,i)=><li key={i}>{item}</li>)}</ul><CareReveal service={offer as RevealService} business={content.business} open={expanded===offer} onToggle={()=>setExpanded(previous=>previous===offer?null:offer as RevealService)} idPrefix="home-care"/><a href={`/book?service=${offer}`} onClick={event=>{if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;const target=document.getElementById("inquiry-flow-title");if(!target)return;event.preventDefault();window.dispatchEvent(new CustomEvent("wiww-select-care",{detail:{service:offer}}));target.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});}}>Choose in the care request</a></article>)}</div><p className="price-glance-note">The base price stays clear. Any additional work is scoped and priced in your Care Plan, and only done with your approval.</p><aside className="travel-parking-policy" aria-labelledby="travel-parking-title"><h3 id="travel-parking-title">Travel &amp; Parking Surcharge</h3><p>Any travel surcharge is confirmed with you before work begins. Parking fees for non-private residential or office locations are billed at cost. We agree on the parking arrangement and any applicable charges with you first.</p></aside></section>;
}
export default function PublicHome({content,photos,careConfig,preview=false}:{content:SiteContent;photos:WorkPhoto[];careConfig:CareSettings;preview?:boolean}){
 const editing=useSiteEditing();const openControl=useOpenSiteControl();
 const styles=[
  ".public-home>.square-one-intro{order:0!important}",
  ".public-home>.price-glance{order:1!important}",
  ".public-home>.inquiry-heading{order:2!important}",
  ".public-home>.care-builder{order:3!important}",
  ".public-home>.mobile-care-summary{order:4!important}",
  ".public-home>.proof-near-top{order:5!important}",
  ".public-home>.brand-premise{order:6!important}",
  ".public-home>.return-care{order:20!important}",".public-home>.confirmed-assistant{order:21!important}",
  ...content.sections.map((s,i)=>`.public-home>[data-cms-section="${s.id}"]{order:${7+i}!important;${!s.visible?"display:none!important;":""}}`)
 ].join("");
 const darkBackground=content.images.heroId?mediaUrl(content.images.heroId):"/brand/wiww-mascot-bay.png";
 const lightBackground=content.images.lightHeroId?mediaUrl(content.images.lightHeroId):"/brand/wiww-sunrise-corolla.png";
 const supportingContent={...content,sections:content.sections.map(s=>({...s,visible:s.visible&&s.id!=="hero"&&["work","approach","areas","trust","steps","closing"].includes(s.id)}))};
 return <div className="public-home"><style>{styles}</style>
  {content.sections.some(section=>section.id==='hero'&&section.visible)&&<section className="square-one-intro fusion-hero">
   <figure className="square-one-backdrop fusion-stage"><div className="fusion-scene"><Image className="square-one-art-dark" unoptimized src={darkBackground} width={1672} height={945} alt="Black Corolla beside San Francisco Bay · brand illustration" priority/><Image className="square-one-art-light" unoptimized src={lightBackground} width={1672} height={945} alt="Black Corolla at sunrise by San Francisco Bay · brand illustration"/></div></figure>
   {preview&&editing&&<div className="cms-hero-tools"><button type="button" className="cms-open-control" onClick={()=>openControl?.('brand')}>Edit both theme artworks</button><button type="button" className="cms-open-control" onClick={()=>openControl?.('copy')}>Edit wording & invitation</button></div>}
   <div className="wrap square-one-copy"><span className="eyebrow"><SiteText id="square-one-brand-kicker-v2" value="WIWW · Care expressed through action"/></span><h1><SiteText id="master-standard-hero-title" value="Care for what is in your hands. Clear from the start."/></h1><p><SiteText id="master-standard-hero-copy" value="I am you. You are me. We are we. Whether it is your daily driver, your supercar, your living space, or the design you have worked hard to build—you already know what honest stewardship feels like. We do not use templates, timers, or automated expectations. Look at what is in your hands, see the baseline clearly, and let’s agree on the plan before our hands move."/></p><div className="actions"><a className="btn teal" href="#inquiry-flow-title">Start my care</a><a className="btn outline" href="#price-glance-title">See starting prices</a></div><a className="wiww-hero-discovery-link" href="#care-reveal-services">See the care behind the work. <span aria-hidden="true">↓</span></a><span className="square-one-art-note">WIWW brand illustration · our Corolla, not a client result</span></div>
  </section>}
  <PriceGlance content={content} careConfig={careConfig}/>
  <BookView copy={content.copy} careConfig={careConfig} photos={photos} preview={preview} embedded/>
  <div className="wrap proof-near-top" id="care-in-practice"><Proof photos={orderedPhotos(photos,content.business)}/></div>
  <section className="wrap brand-premise" aria-labelledby="brand-question"><p className="eyebrow"><SiteText id="brand-action-v43" value="Care expressed through action."/></p><h2 id="brand-question">One standard, in every interaction.</h2><p><SiteText id="brand-premise-v43" value="Whut i wuld wunt means treating what’s in our hands the way we’d want it treated ourselves. That means honest prices, considered methods and following through on the small things."/></p><p><SiteText id="brand-future-v43" value="Vehicle care is our first expression. Other forms of care come when we can stand behind them."/></p><p className="brand-we">{DEEPER_STATEMENT}</p><p className="core-question">{CORE_QUESTION}</p></section>
  <HomeView content={supportingContent} photos={photos}/>
  <section className="wrap return-care"><h2>Back for another visit?</h2><p>You already know how we work. Tell us what has changed with the car this time; we’ll review your request and prepare a new Care Plan.</p><a className="btn outline" href="/book?returning=1">Request care again</a><p className="note">Start a fresh request. Private vehicle history is never shown from contact details alone.</p></section>
  <ConfirmedAssistant/>
 </div>;
}
