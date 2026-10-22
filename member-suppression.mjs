import {completeNativeReview} from './native-review.ts';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
const sql=new DatabaseSync(':memory:');for(const file of readdirSync('drizzle').filter(x=>x.endsWith('.sql')).sort())sql.exec(readFileSync('drizzle/'+file,'utf8'));
function prepare(query){let args=[];return {bind(...values){args=values;return this;},async first(){return sql.prepare(query).get(...args)||null;},async all(){return {results:sql.prepare(query).all(...args)};},async run(){return {meta:{changes:Number(sql.prepare(query).run(...args).changes)}};}};}
let failWrites=false;
globalThis.testDb={prepare,async batch(items){if(failWrites)throw Error('synthetic write failure');sql.exec('BEGIN');try{const result=[];for(const item of items)result.push(await item.run());sql.exec('COMMIT');return result;}catch(error){sql.exec('ROLLBACK');throw error;}}};globalThis.testEnv={SITE_ORIGIN:'https://wiww.test'};globalThis.testOwner=false;
const jar=new Map();globalThis.testCookies={get:key=>jar.has(key)?{value:jar.get(key)}:undefined,set:(key,value)=>jar.set(key,value)};
const intake=await import('../app/api/intake/route.ts');
const req=body=>new Request('https://wiww.test/api/intake',{method:body?'POST':'GET',headers:{origin:'https://wiww.test','Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
const token=(await (await intake.GET(req())).json()).token;
const base={id:crypto.randomUUID(),kind:'booking',service:'exterior',token,name:'First Client',email:'first@example.test',phone:'4155550111',city:'San Francisco',vehicle:'Corolla',consent:true,careProfile:{size:'sedan'}};
const submit=body=>intake.POST(req(body));const key='wiww_member_status_confirmed';
let response=await submit(base);assert.equal(response.status,201);const first=await response.json();assert.equal(first.suppressInvitation,true);assert.equal(jar.get(key),'1');
jar.delete(key);response=await submit({...base,phone:'4155550999'});assert.equal(response.status,200);assert.equal((await response.json()).suppressInvitation,true,'retry eligibility uses the saved receipt, not altered input');
jar.delete(key);const repeat={...base,id:crypto.randomUUID()};response=await submit(repeat);assert.equal(response.status,201);const repeatReceipt=await response.json();assert.equal(repeatReceipt.suppressInvitation,false);assert.equal(jar.has(key),false,'a returning client/phone does not create durable suppression');
response=await submit(repeat);assert.equal((await response.json()).suppressInvitation,false,'same-millisecond retry eligibility is stable by stored insert order');
const freshPhone={...base,id:crypto.randomUUID(),phone:'4155550222'};response=await submit(freshPhone);assert.equal((await response.json()).suppressInvitation,true,'first-time phone qualifies');
jar.delete(key);response=await submit({...base,id:crypto.randomUUID(),name:''});assert.equal(response.status,400);assert.equal(jar.has(key),false);
failWrites=true;response=await submit({...base,id:crypto.randomUUID(),email:'write-failed@example.test',phone:'4155550333'});assert.equal(response.status,503);assert.equal(jar.has(key),false,'failed persistence never sets success');failWrites=false;
response=await submit({...base,id:crypto.randomUUID(),kind:'inquiry',email:'inquiry@example.test',phone:'4155550444',message:'A general inquiry only.'});assert.equal((await response.json()).suppressInvitation,false);assert.equal(jar.has(key),false);
const native=new URLSearchParams({...base,id:crypto.randomUUID(),phone:'4155550555',careProfile:JSON.stringify(base.careProfile),consent:'on'});response=await completeNativeReview(intake.POST,new Request('https://wiww.test/api/intake',{method:'POST',headers:{origin:'https://wiww.test','Content-Type':'application/x-www-form-urlencoded'},body:native}));assert.equal(response.status,303);assert.equal(jar.get(key),'1','native success sets the same durable cookie fallback');
const {hasConfirmedMemberStatus,recordConfirmedIntake}=await import('../lib/member-status.ts');
const previous={window:globalThis.window,document:globalThis.document,localStorage:globalThis.localStorage,sessionStorage:globalThis.sessionStorage};
const local=new Map(),session=new Map();let cookie='';const window=new EventTarget();window.location={protocol:'https:'};globalThis.window=window;globalThis.document={get cookie(){return cookie;},set cookie(value){cookie=value;}};globalThis.localStorage={getItem:key=>local.get(key)||null,setItem:(key,value)=>local.set(key,value)};globalThis.sessionStorage={getItem:key=>session.get(key)||null,setItem:(key,value)=>session.set(key,value)};
try{
 assert.equal(hasConfirmedMemberStatus(),false);session.set('wiww-founding-dismissed','1');assert.equal(hasConfirmedMemberStatus(),false,'manual dismissal is not durable success');
 for(const [ok,receipt] of [[false,first],[true,{id:first.id}],[true,repeatReceipt],[true,{id:'invalid',suppressInvitation:true}]])assert.equal(recordConfirmedIntake(ok,receipt),false);
 assert.equal(local.has(key),false);assert.equal(session.get('wiww-founding-dismissed'),'1','failure leaves dismissal untouched');
 let events=0;window.addEventListener('wiww-member-confirmed',()=>events++);assert.equal(recordConfirmedIntake(true,first),true);assert.equal(local.get(key),'1');assert.equal(events,1);
 session.clear();assert.equal(hasConfirmedMemberStatus(),true,'a fresh session retains local success');cookie='';assert.equal(hasConfirmedMemberStatus(),true,'subsequent loads can use local success alone');
 local.clear();cookie=key+'=1';assert.equal(hasConfirmedMemberStatus(),true);assert.equal(local.get(key),'1','native cookie is mirrored into localStorage');
 local.clear();globalThis.localStorage={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}};assert.equal(hasConfirmedMemberStatus(),true,'cookie fallback does not recurse when storage is blocked');
}finally{Object.assign(globalThis,previous);}
console.log('PASS: first-time eligibility after confirmed persistence, stable retries, no marker on returning/failing/inquiry submissions, native fallback, separate session dismissal, durable new-session marker and blocked-storage resilience. Browser reload verification remains open.');
