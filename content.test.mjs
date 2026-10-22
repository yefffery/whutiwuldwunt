import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
const sql=new DatabaseSync(':memory:');for(const f of readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())sql.exec(readFileSync('drizzle/'+f,'utf8'));
function prepare(query){let args=[];return {bind(...a){args=a;return this;},async first(){return sql.prepare(query).get(...args)||null;},async all(){return {results:sql.prepare(query).all(...args)};},async run(){return {meta:{changes:Number(sql.prepare(query).run(...args).changes)}};}};}
globalThis.testDb={prepare,async batch(list){sql.exec('BEGIN');try{const results=[];for(const stmt of list)results.push(await stmt.run());sql.exec('COMMIT');return results;}catch(e){sql.exec('ROLLBACK');throw e;}}};
const objects=new Map();globalThis.testEnv={BUCKET:{async put(k,v){objects.set(k,v);},async get(k){return objects.has(k)?{body:objects.get(k)}:null;},async delete(k){objects.delete(k);}}};globalThis.testOwner=false;
const route=await import('../app/api/content/route.ts'),server=await import('../lib/content-server.ts'),rules=await import('../lib/site-content.ts'),upload=await import('../app/api/content/media/route.ts'),image=await import('../app/api/content/media/[id]/route.ts');
const req=(body,origin='https://wiww.test')=>new Request('https://wiww.test/api/content',{method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
assert.equal((await route.GET()).status,403);assert.equal((await route.POST(req({}))).status,403);
globalThis.testOwner=true;assert.equal((await route.POST(req({},'https://other.test'))).status,403);
let state=await (await route.GET()).json();assert.equal(state.revision,0);let content=structuredClone(state.draft);content.copy.hero_02='Draft title';
assert.equal((await route.POST(req({action:'save',revision:0,content}))).status,200);assert.notEqual((await server.getPublishedContent()).copy.hero_02,'Draft title');
assert.equal((await route.POST(req({action:'publish',revision:0,content}))).status,409,'old tab cannot publish over new saved changes');
assert.equal((await route.POST(req({action:'publish',revision:1,content}))).status,200);assert.equal((await server.getPublishedContent()).copy.hero_02,'Draft title');state=await (await route.GET()).json();assert.equal(state.history.length,1);
assert.equal((await route.POST(req({action:'restore',revision:2,historyId:state.history[0].id}))).status,200);assert.equal((await server.getPublishedContent()).copy.hero_02,'Draft title','restore changes draft only');state=await (await route.GET()).json();assert.notEqual(state.draft.copy.hero_02,'Draft title');
assert.equal(rules.contentSchema.safeParse({...content,links:{primary:'javascript:alert(1)',secondary:'/book'}}).success,false);assert.equal(rules.contentSchema.safeParse({...content,theme:{...content.theme,ink:'#ffffff'}}).success,false);assert.equal(rules.contentSchema.safeParse({...content,sections:content.sections.map(s=>({...s,visible:false}))}).success,false);
content.images.heroId=crypto.randomUUID();assert.equal((await route.POST(req({action:'save',revision:3,content}))).status,400,'reject unknown asset references');
const form=new FormData();form.set('name','Draft PNG');form.set('permission','yes');form.set('photo',new File([new Uint8Array([137,80,78,71,13,10,26,10,...Array(40).fill(0)])],'draft.png',{type:'image/png'}));
const uploaded=await upload.POST(new Request('https://wiww.test/api/content/media',{method:'POST',headers:{origin:'https://wiww.test'},body:form}));assert.equal(uploaded.status,201);const {media}=await uploaded.json();const imageReq=new Request('https://wiww.test/api/content/media/'+media.id),params={params:Promise.resolve({id:media.id})};
globalThis.testOwner=false;assert.equal((await image.GET(imageReq,params)).status,404,'draft images must remain private');globalThis.testOwner=true;assert.equal((await image.GET(imageReq,params)).status,200);content.images.heroId=media.id;assert.equal((await route.POST(req({action:'publish',revision:3,content}))).status,200);globalThis.testOwner=false;assert.equal((await image.GET(imageReq,params)).status,200,'published image is public');
console.log('PASS: CMS owner/origin protection, permanent drafts, publish isolation, revision conflicts, recovery history, validated links/colors, private image upload and public image publication.');

// Previously unregistered text must persist through the real save/publish API and public renderer.
globalThis.testOwner=true;
const inline=await import('../lib/inline-text.ts');const React=await import('react');const {renderToStaticMarkup}=await import('react-dom/server');const {default:SiteText,SiteTextProvider}=await import('../app/site-text.tsx');
state=await (await route.GET()).json();const binding=inline.bindText('home-view-text-12','AI-enhanced brand image',state.draft.copy);assert.equal(binding.kind,'override');
const changed=inline.writeText(state.draft,binding,'Founder’s vehicle · finish detail');const oldLive=await server.getPublishedContent();assert.equal((await route.POST(req({action:'save',revision:state.revision,content:changed}))).status,200);assert.deepEqual((await server.getPublishedContent()).textOverrides,oldLive.textOverrides,'inline drafts remain private');
state=await (await route.GET()).json();assert.equal(inline.readText(state.draft,binding,'AI-enhanced brand image'),'WIWW vehicle · finish detail');assert.equal((await route.POST(req({action:'publish',revision:state.revision,content:state.draft}))).status,200);
const live=await server.getPublishedContent();const render=content=>renderToStaticMarkup(React.createElement(SiteTextProvider,{content},React.createElement('figcaption',null,React.createElement(SiteText,{id:'home-view-text-12',value:'AI-enhanced brand image'}))));assert.equal(render(live),'<figcaption>WIWW vehicle · finish detail</figcaption>','published text must render without editor spans/controls');
const escaped=inline.writeText(live,binding,'<script>alert(1)</script>');assert.ok(!render(escaped).includes('<script>'),'text is always escaped, never HTML');assert.ok(render(escaped).includes('&lt;script&gt;'));
const other=inline.bindText('another-caption','AI-enhanced brand image',live.copy);assert.equal(inline.readText(live,other,'AI-enhanced brand image'),'AI-enhanced brand image','one caption edit must not change unrelated same-text captions');
const explicit=inline.bindText('heading',live.copy.hero_02,live.copy,'hero_02');assert.equal(explicit.kind,'copy');assert.equal(inline.writeText(live,explicit,'A new headline').copy.hero_02,'A new headline');
assert.equal(rules.contentSchema.safeParse({...live,textOverrides:{'invalid key with spaces':'No'}}).success,false);
const legacy={...live};delete legacy.textOverrides;assert.deepEqual(rules.parseContent(JSON.stringify(legacy)).textOverrides,{});
console.log('PASS: direct caption editing persists through draft/save/publish/reload, renders as plain escaped text, stays scoped, and preserves existing content compatibility.');

// Business controls must affect live calculation only after Publish.
globalThis.testOwner=true;state=await (await route.GET()).json();const businessDraft=structuredClone(state.draft);businessDraft.business.services.reverse();businessDraft.business.services.find(s=>s.id==='exterior').prices.sedan=9000;businessDraft.business.addons.push({id:'extra-care',name:'Extra care',description:'By request',visible:true,price:1500,quote:false});businessDraft.business.questions.reverse();businessDraft.business.labels.hero='Care%20%26%20consideration';businessDraft.business.messaging.reminderHours=12;const before=(await server.getPublishedContent()).business.services.find(s=>s.id==='exterior').prices.sedan;assert.equal((await route.POST(req({action:'save',revision:state.revision,content:businessDraft}))).status,200);assert.equal((await server.getPublishedContent()).business.services.find(s=>s.id==='exterior').prices.sedan,before);state=await (await route.GET()).json();assert.equal((await route.POST(req({action:'publish',revision:state.revision,content:state.draft}))).status,200);const business=(await server.getPublishedContent()).business;const {careFromBusiness}=await import('../lib/business-config.ts');const {defaultCareSettings,estimateCare}=await import('../lib/care-rules.ts');assert.equal(business.labels.hero,'Care & consideration');assert.equal(business.services[0].id,'protection');assert.equal(business.messaging.reminderHours,12);assert.deepEqual(estimateCare('exterior',{size:'sedan',extras:['extra-care']},{...defaultCareSettings,...careFromBusiness(business)}),{low:10500,high:10500});const {humanText}=await import('../lib/human-text.ts');assert.equal(humanText('A%20car&amp;care\\nMarley&#39;s'),'A car&care\nMarley\'s');assert.equal(humanText(null,'—'),'—');assert.equal(humanText('undefined'),'');assert.equal(humanText('["Wheels","Glass"]'),'Wheels, Glass');assert.equal(humanText('{"vehicle":"Toyota%20Corolla"}'),'vehicle: Toyota Corolla');console.log('PASS: normalized readable values, draft-only prices, published calculation with add-ons, ordered services/questions, configurable messaging and graceful empty values.');

const oldReassurance='Expect a personal message from Marley the same day, not an automated reply. If we don’t do something, we’ll tell you and point you to someone we trust.';
const expectedReassurance='We review requests personally and reply as soon as we can. We’ll explain what we can do and help you find trusted care when something falls outside our work.';
assert.equal(rules.wiwwVoice(oldReassurance),expectedReassurance);
const oldContent=structuredClone(rules.defaultContent);oldContent.business.labels.reply=oldReassurance.split(' If ')[0];oldContent.textOverrides['legacy-note']=oldReassurance;
const migrated=rules.parseContent(JSON.stringify(oldContent));assert.equal(migrated.business.labels.reply,'We review requests personally and reply as soon as we can.');assert.equal(migrated.textOverrides['legacy-note'],expectedReassurance);
// Drafts saved before later operations fields were introduced must remain editable.
const earlierDraft=structuredClone(rules.defaultContent);earlierDraft.copy.hero_02='Saved draft from an earlier editor';earlierDraft.business.messaging.templates.confirmation='Hi {name}, WIWW here. Your service is confirmed for {time}.';delete earlierDraft.business.messaging.reminderHours;delete earlierDraft.business.messaging.maintenanceDays;delete earlierDraft.business.messaging.reviewDelayHours;delete earlierDraft.business.messaging.followupMinutes;delete earlierDraft.business.messaging.manualFollowup;
const reopened=rules.parseContent(JSON.stringify(earlierDraft));assert.equal(reopened.copy.hero_02,'Saved draft from an earlier editor');assert.equal(reopened.business.messaging.templates.confirmation,earlierDraft.business.messaging.templates.confirmation);assert.equal(reopened.business.messaging.reminderHours,rules.defaultContent.business.messaging.reminderHours);assert.equal(reopened.business.messaging.manualFollowup,rules.defaultContent.business.messaging.manualFollowup);
assert.equal(rules.defaultContent.business.labels.reply,'We’ll review it and reply personally.');
assert.ok(rules.contrast(rules.defaultContent.theme.darkText,rules.defaultContent.theme.darkSurface)>=4.5);assert.ok(rules.contrast(rules.defaultContent.theme.ink,rules.defaultContent.theme.lightBackground)>=4.5);
console.log('PASS: WIWW reassurance replaces legacy copy in labels and saved overrides; default light/dark reassurance contrast exceeds 4.5:1.');

// Variable inspector helpers integrate with the existing explicit D1 save lifecycle.
const variables=await import('../lib/cms-variable-bridge.ts');
globalThis.testOwner=true;
const variableBefore=await (await route.GET()).json();
const publishedBeforeVariable=await server.getPublishedContent();
const variableDraft=variables.applyVariableMutation(variableBefore.draft,'business.services.exterior.prices.sedan',12345);
assert.deepEqual((await (await route.GET()).json()).draft,variableBefore.draft,'applying locally must not persist');
assert.equal((await route.POST(req({action:'save',revision:variableBefore.revision,content:variableDraft}))).status,200);
const variableReload=await (await route.GET()).json();
assert.equal(variables.extractValueByPath(variableReload.draft,'business.services.exterior.prices.sedan'),12345);
assert.deepEqual(await server.getPublishedContent(),publishedBeforeVariable,'saving inspector edits must preserve public content');
assert.equal((await route.POST(req({action:'save',revision:variableBefore.revision,content:variableBefore.draft}))).status,409);
assert.deepEqual((await (await route.GET()).json()).draft,variableReload.draft,'stale saves must not overwrite the newer draft');
console.log('PASS: inspector mutations persist only on explicit save, reload correctly, preserve published content and reject stale revisions.');

// Practical owner settings must survive D1 save/reload without publishing.
const practicalBefore=await (await route.GET()).json();
const practicalPublic=await server.getPublishedContent();
const practicalDraft=structuredClone(practicalBefore.draft);
practicalDraft.invitation={enabled:false,heading:'A considered welcome',message:'Review the care options first.'};
practicalDraft.images.lightHeroId=media.id;
practicalDraft.business.services.find(s=>s.id==='exterior').inclusions=['Wheel care','Safe contact wash'];
assert.equal((await route.POST(req({action:'save',revision:practicalBefore.revision,content:practicalDraft}))).status,200);
const practicalReload=await (await route.GET()).json();
assert.equal(practicalReload.draft.invitation.enabled,false);
assert.equal(practicalReload.draft.images.lightHeroId,practicalDraft.images.lightHeroId);
assert.deepEqual(practicalReload.draft.business.services.find(s=>s.id==='exterior').inclusions,['Wheel care','Safe contact wash']);
assert.deepEqual(await server.getPublishedContent(),practicalPublic);
console.log('PASS: invitation, theme artwork and service inclusions persist as private D1 drafts without changing public content.');
