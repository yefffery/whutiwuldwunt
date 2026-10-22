import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const root=new URL('../',import.meta.url);
export async function resolve(specifier,context,nextResolve){
 if(['cloudflare:workers','next/headers','next/image','@/db/raw','@/lib/owner'].includes(specifier))return {url:'wiww-test:'+specifier,shortCircuit:true};
 if(specifier.startsWith('@/')){const base=new URL(specifier.slice(2),root);const url=existsSync(new URL(base.href+'.ts'))?base.href+'.ts':base.href+'.tsx';return {url,shortCircuit:true};}
 if(['next/image','next/link','next/navigation'].includes(specifier))return nextResolve(specifier+'.js',context);
 if(specifier.startsWith('.')&&context.parentURL){const base=new URL(specifier,context.parentURL);for(const extension of ['.ts','.tsx'])if(existsSync(new URL(base.href+extension)))return {url:base.href+extension,shortCircuit:true};}
 return nextResolve(specifier,context);
}
export async function load(url,context,nextLoad){
 const stubs={
 'wiww-test:next/image':`import React from "${new URL('node_modules/react/index.js',root).href}"; export default function Image({unoptimized,priority,fill,...props}){return React.createElement("img",props);}`,
 'wiww-test:cloudflare:workers':'export const env=globalThis.testEnv;',
 'wiww-test:next/headers':'export async function cookies(){return globalThis.testCookies;}',
 'wiww-test:@/db/raw':'export function getRawDb(){return globalThis.testDb;}',
 'wiww-test:@/lib/owner':'export async function isOwner(){return !!globalThis.testOwner;} export function allowedOrigin(r){return r.headers.get("origin")===new URL(r.url).origin;}'
 };
 if(url in stubs)return {format:'module',source:stubs[url],shortCircuit:true};
 if(/\.tsx?$/.test(url)&&!url.includes('node_modules'))return {format:'module',source:ts.transpileModule(await readFile(new URL(url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText,shortCircuit:true};
 return nextLoad(url,context);
}
