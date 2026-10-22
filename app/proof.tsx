"use client";
import Image from "next/image";
import type { WorkPhoto } from "@/lib/portfolio";
import { mediaUrl } from "@/lib/site-content";
import SiteText, { useSiteContent } from "@/app/site-text";
import { useState } from "react";
import {PRACTICE_FILM_SRC} from "@/lib/mascot-moments";
import { mergeCarePriority } from "@/lib/care-priority";

const practice = [
 { id: "prewash", role: "practiceFoamId", src: "/work/wiww-practice-prewash.png", title: "Before the contact wash", alt: "WIWW practice: foam on the black Corolla, with white wheels and turquoise calipers", note: "We pre-rinse and apply foam before contact. Wheel tools stay separate from paint tools.", position: "50% 61%" },
 { id: "rinse", role: "practiceRinseId", src: "/work/wiww-practice-rinse.png", title: "After the rinse", alt: "WIWW practice: water beads on the Corolla’s textured hood after rinsing", note: "This is the rinse stage before drying. We check mirrors, window edges and badges for trapped water.", position: "50% 69%" },
 { id: "rear", role: "practiceRearId", src: "/work/wiww-practice-rear.png", title: "Wheels, trim and finish", alt: "WIWW practice: rear view of the wet black Corolla and white wheels", note: "We check the wheels, trim and textured hood separately. The surface guides the method.", position: "50% 70%" },
] as const;

export default function Proof({ photos = [],filmSrc=PRACTICE_FILM_SRC }: { photos?: WorkPhoto[];filmSrc?:string }) {
 const content = useSiteContent();
 const [careNote, setCareNote] = useState("");
 const [noteStatus, setNoteStatus] = useState("");
 function carryNote() {
  const detail = careNote.trim();
  const field = document.getElementById("proudConcern") || document.getElementById("message");
  if (!detail) { document.getElementById("care-priority-note")?.focus(); return; }
  if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) { setNoteStatus("Keep this note to share in your request below."); return; }
  const next = mergeCarePriority(field.value, detail, field.maxLength);
  let target: HTMLInputElement | HTMLTextAreaElement = field;
  let value = next;
  if (next === null) {
   const message = document.getElementById("message");
   if (!(message instanceof HTMLTextAreaElement)) { setNoteStatus("Your existing note is full. Add this when reviewing your request."); return; }
   target = message;
   value = mergeCarePriority(message.value, detail, message.maxLength, "Take extra care with: ");
   if (value === null) { setNoteStatus("Your existing notes are full. Add this when reviewing your request."); return; }
  }
  if (value === null) return;
  target.value = value;
  target.dispatchEvent(new Event("input", { bubbles: true }));
  setNoteStatus("Added to your request. Review the details before sending.");
  window.dispatchEvent(new Event("wiww-open-care-request"));
  requestAnimationFrame(()=>{if(target.getClientRects().length){target.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"});target.focus({preventScroll:true});}});
 }
 const pairs = new Map<string, WorkPhoto[]>();
 for (const photo of photos) if (photo.pair_id && photo.client_permission) pairs.set(photo.pair_id, [...(pairs.get(photo.pair_id) || []), photo]);
 const complete = [...pairs.values()].filter(pair => pair.some(p => p.phase === "before") && pair.some(p => p.phase === "after"));
 return <section className="builder-section real-care-proof" aria-labelledby="proof-heading">
  <header className="real-care-heading">
   <span className="eyebrow"><SiteText id="real-care-eyebrow" value="How we work" /></span>
   <h2 id="proof-heading"><SiteText id="real-care-heading" value="Look first. Then choose the method." /></h2>
   <p><SiteText id="real-care-welcome" value="We inspect the finish and materials before choosing how to clean. Here’s what that looks like on our own car." /></p>
   <p className="practice-disclosure"><SiteText id="real-care-practice-label" value="Our Corolla · practice wash · not customer work" /></p>
  </header>
  <div className="real-care-grid">
   {practice.map(item => <figure className="real-care-photo" key={item.id}>
    <Image src={content?.images[item.role] ? mediaUrl(content.images[item.role]) : item.src} width={1152} height={1536} loading="lazy" unoptimized style={{objectPosition:item.position}} alt={item.alt} />
    <figcaption><h3><SiteText id={`real-care-${item.id}-title`} value={item.title} /></h3><p><SiteText id={`real-care-${item.id}-caption`} value={item.note} /></p></figcaption>
   </figure>)}
  </div>
  <div className="real-care-followthrough">
   {filmSrc?<figure className="real-care-video">
    <video controls playsInline muted preload="none" poster="/work/wiww-practice-reflection.png" width={512} height={910} aria-label="WIWW practice: original Corolla video" aria-describedby="practice-video-description">
     <source src={filmSrc} type="video/mp4" />
     Your browser cannot play this video. <a href={filmSrc}>Watch the original practice video</a>.
    </video>
    <figcaption id="practice-video-description"><strong><SiteText id="real-care-video-title" value="The reflection is the car." /></strong><p><SiteText id="real-care-video-caption" value="The original practice video, from the rinse through the front lawn reflection, filmed in daylight." /></p></figcaption>
   </figure>:<div className="real-care-no-film"><p>Practice work will appear here when there is something we can stand behind.</p></div>}
   <div className="real-care-method">
    <h3><SiteText id="real-care-method-heading" value="What we look for" /></h3>
    <ol>
     <li><strong><SiteText id="real-care-method-1-title" value="Look first." /></strong><p><SiteText id="real-care-method-1-copy" value="Understand the surface, existing finish, and what needs attention before choosing a method." /></p></li>
     <li><strong><SiteText id="real-care-method-2-title" value="Clean with care." /></strong><p><SiteText id="real-care-method-2-copy" value="Keep clean and dirty tools separate. Choose the safest effective use of water, chemistry, and contact." /></p></li>
     <li><strong><SiteText id="real-care-method-3-title" value="Check the quiet details." /></strong><p><SiteText id="real-care-method-3-copy" value="Look for residue, streaks, and water hiding around mirrors, windows, badges, and the trunk. Confirm suitable protection and inspect again." /></p></li>
    </ol>
    <div className="care-priority">
     <label htmlFor="care-priority-note"><SiteText id="care-priority-question" value="What should we take extra care with?" /><span><SiteText id="care-priority-optional" value="Optional" /></span></label>
     <input id="care-priority-note" type="text" maxLength={120} value={careNote} onChange={e => {setCareNote(e.target.value);setNoteStatus("");}} placeholder="A coating, white wheels, a spill, a detail you love…" />
     <p><SiteText id="care-priority-helper" value="Your note goes into the Care Request. We agree the method, scope, and price with you before any work is planned." /></p>
     <button type="button" className="btn" onClick={carryNote}><SiteText id="care-priority-button" value="Carry this into my request" /></button>
     <p className="care-priority-status" role="status">{noteStatus}</p>
    </div>
    <a className="text-link real-care-help" href="#care-reveal-services"><SiteText id="real-care-options-button" value="View services & prices" /></a>
    <a className="text-link real-care-help" href="#inquiry-flow-title"><SiteText id="real-care-help-button" value="Start a Care Request" /></a>
   </div>
  </div>
  {complete.length > 0 && <section className="real-care-client-results" aria-labelledby="client-results-heading"><h3 id="client-results-heading"><SiteText id="preservation-events-heading-v2" value="Preservation Events · shared with permission" /></h3><p>Each record describes the care requested, the work agreed and a detail checked at handoff. No names, plates or location details are published.</p><div className="proof-pair-grid">{complete.map(pair => <article className="proof-pair" key={pair[0].pair_id}><div>{(["before", "after"] as const).map(phase => {const photo = pair.find(p => p.phase === phase)!;return <figure key={photo.id}><Image src={"/api/work/" + photo.id} alt={phase + ": " + photo.caption} width={900} height={675} loading="lazy" unoptimized /><figcaption>{phase === "before" ? "Before" : "After"}</figcaption></figure>;})}</div><p>{pair.find(p => p.phase === "after")!.caption}</p></article>)}</div></section>}
 </section>;
}
