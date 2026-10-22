"use client";
import {orderedPhotos} from "@/lib/business-config";
import SiteText from "@/app/site-text";
import { defaultCareSettings,type CareSettings } from "@/lib/care-rules";
import Link from "@/lib/site-link";
import Image from "next/image";
import type { WorkPhoto } from "@/lib/portfolio";
import { mediaUrl,type SiteContent } from "@/lib/site-content";
import ServiceMenu from "./service-menu";

export default function HomeView({content,photos,editSection,careConfig=defaultCareSettings}:{content:SiteContent;photos:WorkPhoto[];careConfig?:CareSettings;editSection?:(id:string)=>void}) {
 photos=orderedPhotos(photos,content.business);
 const copy=content.copy;
 const blocks:Record<string,React.ReactNode>={
hero:(<>
  <section className="wrap hero conversion-hero premium-hero">
   <div><span className="eyebrow"><SiteText id="home-view-text-1" value={"Based in San Francisco. We travel for the right fit."}/></span>
    <h1><SiteText id="home-view-text-2" value={copy.hero_02} field={"hero_02"}/><br/><em><SiteText id="home-view-text-3" value={copy.hero_03} field={"hero_03"}/></em></h1>
    <p className="hero-copy"><SiteText id="home-view-text-4" value={copy.hero_04} field={"hero_04"}/></p>
    <div className="actions"><a className="btn" href={content.links.primary}><SiteText id="home-view-text-8" value={copy.hero_08} field={"hero_08"}/></a><Link className="text-link" href={content.links.secondary}><SiteText id="home-view-text-9" value={copy.hero_09} field={"hero_09"}/></Link></div>
    <p className="note"><SiteText id="home-view-text-10" value={copy.hero_10} field={"hero_10"}/></p>
   </div>
   <figure className="hero-photo"><Image unoptimized src={photos.length?"/api/work/"+photos[0].id:"/work/wiww-practice-rear.jpg"} width={1536} height={1024} alt={photos.length?photos[0].caption:"Our Corolla after a practice wash, photographed in the driveway"} priority/><figcaption><span><SiteText id="home-view-text-11" value={photos.length?photos[0].caption:"Practice wash on our Corolla."}/></span><span><SiteText id="home-view-text-12" value={photos.length?photos[0].category:"Our car · not client work"}/></span></figcaption></figure>
  </section>

</>),
trust:(<>
  <div className="brand-strip"><div className="wrap strip-inner"><span><SiteText id="home-view-text-13" value={copy.trust_01} field={"trust_01"}/></span><span><SiteText id="home-view-text-14" value={copy.trust_02} field={"trust_02"}/></span><span><SiteText id="home-view-text-15" value={copy.trust_03} field={"trust_03"}/></span></div></div>

</>),
services:(<>
  <section className="premium-services" id="services"><Image unoptimized className="service-watermark" src={content.images.questionId?mediaUrl(content.images.questionId):"/brand/considered-question.png"} width={1536} height={1536} alt="" aria-hidden="true"/><div className="wrap section">
   <div className="section-heading"><div><span className="eyebrow"><SiteText id="home-view-text-16" value={copy.services_01} field={"services_01"}/></span><h2><SiteText id="home-view-text-17" value={copy.services_02} field={"services_02"}/><br/><SiteText id="home-view-text-18" value={copy.services_03} field={"services_03"}/></h2></div><p><SiteText id="home-view-text-19" value={copy.services_04} field={"services_04"}/></p></div>
   <ServiceMenu careConfig={careConfig} copy={copy} business={content.business}/>
  </div></section>

</>),
work:(<>
  <section className="section work-section" id="work"><div className="wrap">
   <div className="section-heading"><div><span className="eyebrow"><SiteText id="home-view-text-20" value="Care, in practice"/></span><h2><SiteText id="home-view-text-21" value="Our standard starts here."/></h2></div><p><SiteText id="home-view-text-22" value="We wash paint and wheels with separate tools, clear the glass, then check mirrors, seals and badges for trapped water."/></p></div>
   {photos.length ? <div className="work-grid">{photos.map(p => <figure key={p.id}><Image unoptimized src={"/api/work/" + p.id} width={1000} height={750} alt={p.caption}/><figcaption><span className="tag"><SiteText id={"work-photo-category-"+p.id} value={p.category}/></span><p><SiteText id={"work-photo-caption-"+p.id} value={p.caption}/></p></figcaption></figure>)}</div> : <p className="practice-disclosure">Client work will appear here only with permission. The practice photos above show our own car.</p>}
   <div className="chemistry-standard"><span className="eyebrow"><SiteText id="home-view-text-23" value={copy.work_14} field={"work_14"}/></span><h3><SiteText id="home-view-text-24" value={copy.work_15} field={"work_15"}/></h3><p><SiteText id="home-view-text-25" value={copy.work_16} field={"work_16"}/></p></div>
   <div className="work-bottom"><p><SiteText id="home-view-text-26" value={copy.work_17} field={"work_17"}/></p><Link className="btn" href="/book"><SiteText id="home-view-text-27" value={copy.work_18} field={"work_18"}/></Link></div>
  </div></section>

</>),
steps:(<>
  <section className="section wrap"><div className="section-heading"><div><span className="eyebrow"><SiteText id="home-view-text-28" value={copy.steps_01} field={"steps_01"}/></span><h2><SiteText id="home-view-text-29" value={copy.steps_02} field={"steps_02"}/><br/><SiteText id="home-view-text-30" value={copy.steps_03} field={"steps_03"}/></h2></div><p><SiteText id="home-view-text-31" value={copy.steps_04} field={"steps_04"}/></p></div><div className="steps">
   <article className="step"><span className="number"><SiteText id="home-view-text-32" value={copy.steps_05} field={"steps_05"}/></span><h3><SiteText id="home-view-text-33" value={copy.steps_06} field={"steps_06"}/></h3><p><SiteText id="home-view-text-34" value={copy.steps_07} field={"steps_07"}/></p></article>
   <article className="step"><span className="number"><SiteText id="home-view-text-35" value={copy.steps_08} field={"steps_08"}/></span><h3><SiteText id="home-view-text-36" value={copy.steps_09} field={"steps_09"}/></h3><p><SiteText id="home-view-text-37" value={"We review condition, materials, location and availability, then confirm the final quote with you."}/></p></article>
   <article className="step"><span className="number"><SiteText id="home-view-text-38" value={copy.steps_11} field={"steps_11"}/></span><h3><SiteText id="home-view-text-39" value={copy.steps_12} field={"steps_12"}/></h3><p><SiteText id="home-view-text-40" value={copy.steps_13} field={"steps_13"}/></p></article>
  </div></section>

</>),
approach:(<>
  <section className="section ink-section manifesto" id="approach"><div className="wrap manifesto-text"><div><span className="eyebrow"><SiteText id="home-view-text-41" value={copy.approach_01} field={"approach_01"}/></span><h2><SiteText id="home-view-text-42" value={copy.approach_02} field={"approach_02"}/>{" "}<span style={{color:"var(--teal)"}}><SiteText id="home-view-text-43" value={"i"}/></span>{" "}<SiteText id="home-view-text-44" value={copy.approach_03} field={"approach_03"}/></h2><p className="lead"><SiteText id="home-view-text-45" value={copy.approach_04} field={"approach_04"}/></p><blockquote><SiteText id="home-view-text-46" value={copy.approach_05} field={"approach_05"}/></blockquote><p className="lead manifesto-copy"><SiteText id="home-view-text-47" value={copy.approach_06} field={"approach_06"}/></p></div></div></section>

</>),
areas:(<>
  <section className="section wrap"><div className="two"><div><span className="eyebrow"><SiteText id="home-view-text-48" value={copy.areas_01} field={"areas_01"}/></span><h2><SiteText id="home-view-text-49" value={copy.areas_02} field={"areas_02"}/><br/><SiteText id="home-view-text-50" value={copy.areas_03} field={"areas_03"}/></h2><p className="lead"><SiteText id="home-view-text-51" value={"Based in San Francisco. We travel for the right fit. Travel and timing are confirmed with you."}/></p><Link className="text-link" style={{display:"inline-block",margin:"22px 0 0"}} href="/inquiries"><SiteText id="home-view-text-52" value={copy.areas_05} field={"areas_05"}/></Link></div><div className="future compact-future"><article><h3><SiteText id="home-view-text-53" value={copy.areas_06} field={"areas_06"}/></h3><p><SiteText id="home-view-text-54" value={copy.areas_07} field={"areas_07"}/></p><Link className="text-link" style={{marginLeft:0}} href="/inquiries"><SiteText id="home-view-text-55" value={copy.areas_08} field={"areas_08"}/></Link></article><article><h3><SiteText id="home-view-text-56" value={copy.areas_09} field={"areas_09"}/></h3><p><SiteText id="home-view-text-57" value={copy.areas_10} field={"areas_10"}/></p><span className="text-link"><SiteText id="home-view-text-58" value={copy.areas_11} field={"areas_11"}/></span></article></div></div></section>

</>),
closing:(<>
  <section className="closing"><div className="wrap"><h2><SiteText id="home-view-text-59" value={copy.closing_01} field={"closing_01"}/><br/><SiteText id="home-view-text-60" value={copy.closing_02} field={"closing_02"}/></h2><Link className="btn teal" href="/book"><SiteText id="home-view-text-61" value={copy.closing_03} field={"closing_03"}/></Link></div></section>

</>)
 };
 return <>{content.sections.filter(s=>s.visible).map(s=><div key={s.id} data-cms-section={s.id} onDoubleClick={editSection?()=>editSection(s.id):undefined}>{editSection&&<button className="cms-section-handle" onClick={()=>editSection(s.id)}><SiteText id="home-view-text-69" value={"Edit "}/><SiteText id="home-view-text-70" value={s.id}/></button>}{blocks[s.id]}</div>)}</>;
}
