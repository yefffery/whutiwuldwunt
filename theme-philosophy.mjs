import assert from 'node:assert/strict';
import vm from 'node:vm';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {checkedTheme,currentTheme,setThemePreference,subscribeTheme,themeInitializationScript} from '../lib/theme-preference.ts';
import {CORE_QUESTION,DEEPER_STATEMENT,universalBrandText} from '../lib/brand-philosophy.ts';
import {wiwwVoice,parseContent,defaultContent,contrast} from '../lib/site-content.ts';
import ThemeToggle from '../app/theme-toggle.tsx';
for(const preference of [undefined,'dark','light','invalid']){
 const document={documentElement:{dataset:{}}};vm.runInNewContext(themeInitializationScript,{document,localStorage:{getItem:()=>preference}});
 assert.equal(document.documentElement.dataset.theme,preference==='light'?'light':'dark');
}
{const document={documentElement:{dataset:{}}};vm.runInNewContext(themeInitializationScript,{document,localStorage:{getItem(){throw Error('blocked');}}});assert.equal(document.documentElement.dataset.theme,'dark');}
const previousDocument=globalThis.document,previousWindow=globalThis.window,previousStorage=globalThis.localStorage;
const window=new EventTarget();const values=new Map();globalThis.document={documentElement:{dataset:{theme:'dark'}}};globalThis.window=window;globalThis.localStorage={setItem:(key,value)=>values.set(key,value)};
try{
 let changes=0;const cleanup=subscribeTheme(()=>changes++);setThemePreference('light');assert.equal(currentTheme(),'light');assert.equal(values.get('wiww-theme'),'light');setThemePreference('dark');assert.equal(currentTheme(),'dark');assert.equal(changes,2);
 const storageEvent=new Event('storage');Object.assign(storageEvent,{key:'wiww-theme',newValue:'light'});window.dispatchEvent(storageEvent);assert.equal(currentTheme(),'light');
 globalThis.localStorage={setItem(){throw Error('blocked');}};setThemePreference('dark');assert.equal(currentTheme(),'dark','preference storage failure does not break switching');cleanup();
}finally{globalThis.document=previousDocument;globalThis.window=previousWindow;globalThis.localStorage=previousStorage;}
assert.equal(checkedTheme('anything'),'dark');
assert.match(renderToStaticMarkup(React.createElement(ThemeToggle)),/Switch to light mode/);
assert.match(renderToStaticMarkup(React.createElement(ThemeToggle)),/type="button"/);
const approved='I am you.\nYou are me.\nWe are we.\nYou are whut i wuld wunt.';
assert.equal(DEEPER_STATEMENT,approved);assert.equal(CORE_QUESTION,'What will you do with what is already in your hands?');
const historical='I am him. He is you. You are me. We are we. You are whut i wuld wunt.';
assert.equal(universalBrandText(historical),approved);assert.doesNotMatch(wiwwVoice(historical),/\bhim\b|He is you/i);
const saved=structuredClone(defaultContent);saved.textOverrides['brand-line']=historical;saved.invitation.message=historical;
const restored=parseContent(JSON.stringify(saved));assert.doesNotMatch(restored.textOverrides['brand-line']+restored.invitation.message,/\bhim\b|He is you/i);
assert.ok(contrast('#475569','#f8fafc')>=4.5);assert.ok(contrast('#0f172a','#ffffff')>=4.5);assert.ok(contrast('#cbd5e1','#020617')>=4.5);
const {confirmedAnswer,confirmedAnswers,confirmedFallback}=await import('../lib/confirmed-answers.ts');
assert.equal(confirmedAnswer('What is the weather tomorrow?'),confirmedFallback);
assert.ok(confirmedFallback.startsWith(CORE_QUESTION));
for(const item of confirmedAnswers)assert.equal(confirmedAnswer(item.question),item.answer);
assert.equal(confirmedAnswer('Tell me a guaranteed arrival time'),confirmedFallback);
console.log('PASS: dark default, restored saved light preference, bidirectional switching, storage-blocked resilience, cross-tab preference, universal saved-copy correction and both-theme contrast. Browser interaction remains unverified.');
const {Footer,Header}=await import('../app/site-shell.tsx');
const header=renderToStaticMarkup(React.createElement(Header));
assert.equal((header.match(/aria-label="Switch to light mode"/g)||[]).length,2,'desktop and mobile navigation each expose the preference switch');
const footer=renderToStaticMarkup(React.createElement(Footer));
assert.doesNotMatch(footer,/href="\/manage"|Owner inbox/,'public footer does not expose the private owner dashboard');
assert.equal(Object.hasOwn(parseContent(JSON.stringify({...defaultContent,copy:{...defaultContent.copy,brand_16:'Owner inbox'}})).copy,'brand_16'),false,'legacy owner-link wording is ignored when older saved content is loaded');
assert.equal(wiwwVoice('Imagine being apart of the team.'),'Imagine being a part of the team.','legacy grammar error is corrected for saved customer copy');
assert.ok(contrast('#08b6bb','#141615')>=4.5,'dark-theme price card action text has accessible contrast');
const {preparationTemplate}=await import('../lib/care-copy.ts');
assert.equal(preparationTemplate,'Before we arrive\nService location: [Agreed location]\nParking: [Permission and access arrangements]\nWater/power: [Only the access agreed for this service]\nPreparation: [Any specific action needed from the customer]\nPlease contact WIWW before the appointment if these arrangements change.');
console.log('PASS: both header controls and exact preparation template.');
