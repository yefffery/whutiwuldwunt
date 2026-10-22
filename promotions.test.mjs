import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
const sql=new DatabaseSync(':memory:');for(const f of readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())sql.exec(readFileSync('drizzle/'+f,'utf8'));
function prepare(q){let args=[];return {bind(...v){args=v;return this;},async first(){return sql.prepare(q).get(...args)||null;},async all(){return {results:sql.prepare(q).all(...args)};},async run(){return {meta:{changes:Number(sql.prepare(q).run(...args).changes)}};}};}
globalThis.testDb={prepare,async batch(list){sql.exec('BEGIN');try{const out=[];for(const q of list)out.push(await q.run());sql.exec('COMMIT');return out;}catch(e){sql.exec('ROLLBACK');throw e;}}};globalThis.testOwner=false;globalThis.testEnv={SITE_ORIGIN:'https://wiww.test'};globalThis.fetch=async()=>{throw Error('No external provider calls permitted.');};
const route=await import('../app/api/promotions/route.ts'),manage=await import('../app/api/manage/promotions/route.ts'),legacyLink=await import('../app/go/[token]/route.ts');
const req=(path,body,origin='https://wiww.test')=>new Request('https://wiww.test'+path,{method:body?'POST':'GET',headers:{origin,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
const publicState=await (await route.GET(req('/api/promotions'))).json();assert.equal(publicState.active,false);assert.match(publicState.notice,/Care Keys.*reviewed manually/);
assert.equal((await route.POST(req('/api/promotions',{action:'spin'}))).status,410,'automated rewards remain disabled');assert.equal((await manage.GET()).status,403);globalThis.testOwner=true;
assert.equal((await legacyLink.GET()).status,410,'legacy reward links clearly report that the former offer has ended');
assert.equal((await (await manage.GET()).json()).active,false);assert.equal((await manage.POST(req('/api/manage/promotions',{action:'settings',config:{}}))).status,410,'external campaign writes remain disabled');assert.equal((await manage.POST(req('/api/manage/promotions',{action:'settings',config:{}},'https://other.test'))).status,403);
assert.equal(sql.prepare('SELECT COUNT(*) n FROM promo_leads').get().n,0);assert.equal(sql.prepare('SELECT COUNT(*) n FROM promo_events').get().n,0);
console.log('PASS: public rewards and external campaign API are disabled; no third-party calls or promotion records are created.');
