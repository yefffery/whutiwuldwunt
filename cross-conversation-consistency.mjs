import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {defaultContent} from '../lib/site-content.ts';
import {defaultCareSettings} from '../lib/care-rules.ts';
import {PriceGlance} from '../app/public-home.tsx';
import {INTRODUCTION_KEY,readIntroduction,saveIntroduction,clearIntroduction} from '../lib/contact-introduction.ts';

const render=content=>renderToStaticMarkup(React.createElement(PriceGlance,{content,careConfig:defaultCareSettings}));
assert.match(render(defaultContent),/Total Therapy/);
for(const id of ['exterior','interior']){
 const content=structuredClone(defaultContent);content.business.services.find(s=>s.id===id).visible=false;
 assert.doesNotMatch(render(content),/Total Therapy/,'homepage must not advertise a package whose component is unavailable');
}
{
 const content=structuredClone(defaultContent);content.business.services.find(s=>s.id==='exterior').quote=true;
 const html=render(content);assert.doesNotMatch(html,/Total Therapy/);assert.match(html,/Personal quote/);
 const exterior=html.split('Essential Exterior')[1].split('</article>')[0];assert.doesNotMatch(exterior,/\$\d/,'quote-only service must not show a fixed starting amount');
}
const values=new Map();const storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};
const intro={name:'WIWW test',phone:'2025550100',city:'San Francisco',vehicle:'Test car'};
assert.equal(readIntroduction(storage),null);assert.equal(saveIntroduction(storage,intro),true);assert.deepEqual(readIntroduction(storage),intro);
assert.equal(saveIntroduction(storage,{...intro,consent:true}),false,'consent or historical data cannot be persisted as an introduction');
assert.equal(saveIntroduction(storage,{...intro,name:'x'.repeat(101)}),false);assert.deepEqual(readIntroduction(storage),intro);
values.set(INTRODUCTION_KEY,'{broken');assert.equal(readIntroduction(storage),null);
values.set(INTRODUCTION_KEY,JSON.stringify({...intro,privateHistory:['other customer']}));assert.equal(readIntroduction(storage),null);
saveIntroduction(storage,intro);clearIntroduction(storage);assert.equal(readIntroduction(storage),null);
const blocked={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')},removeItem(){throw Error('blocked')}};
assert.equal(readIntroduction(blocked),null);assert.equal(saveIntroduction(blocked,intro),false);assert.doesNotThrow(()=>clearIntroduction(blocked));
console.log('PASS: homepage respects hidden/quote-only services; local introductions validate, clear, reject unrelated data and tolerate unavailable storage.');
