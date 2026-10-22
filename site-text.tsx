"use client";
import {useDesktop} from '@/lib/use-desktop';
import { createContext,useContext,useState,useRef,type ReactNode } from 'react';
import { Popover,PopoverAnchor,PopoverContent } from '@/components/ui/popover';
import { bindText,readText,type TextBinding } from '@/lib/inline-text';
import {humanText} from '@/lib/human-text';
import {wiwwVoice,type SiteContent} from '@/lib/site-content';
type Selected={binding:TextBinding;value:string;original:string;rect:{left:number;top:number;width:number;height:number}};
type Context={businessVersion?:string;preview?:boolean;content:SiteContent;edit?:(binding:TextBinding,value:string)=>void;select?:(binding:TextBinding,value:string,original:string,element:HTMLElement)=>void;openControl?:(tab:'brand'|'services'|'copy')=>void};
const TextContext=createContext<Context|null>(null);
export function SiteTextProvider({content,businessVersion,onEdit,onOpenControl,children,preview=false}:{content:SiteContent;businessVersion?:string;onEdit?:(binding:TextBinding,value:string)=>void;onOpenControl?:(tab:'brand'|'services'|'copy')=>void;children:ReactNode;preview?:boolean}){
 const desktop=useDesktop();
 const [selected,setSelected]=useState<Selected|null>(null);const input=useRef<HTMLTextAreaElement>(null);
 const select=(binding:TextBinding,value:string,original:string,element:HTMLElement)=>{const r=element.getBoundingClientRect();setSelected({binding,value,original,rect:{left:r.left,top:r.top,width:r.width,height:r.height}});};
 return <TextContext.Provider value={{preview,content,businessVersion,edit:desktop?onEdit:undefined,select:onEdit&&desktop?select:undefined,openControl:onEdit&&desktop?onOpenControl:undefined}}>{children}{onEdit&&desktop&&<Popover open={!!selected} onOpenChange={open=>{if(!open)setSelected(null);}}><PopoverAnchor asChild><span aria-hidden="true" style={{position:'fixed',pointerEvents:'none',left:selected?.rect.left||0,top:selected?.rect.top||0,width:selected?.rect.width||1,height:selected?.rect.height||1}}/></PopoverAnchor><PopoverContent className="inline-text-popover" side="bottom" align="start" collisionPadding={12} onOpenAutoFocus={e=>{e.preventDefault();requestAnimationFrame(()=>{input.current?.focus();input.current?.select();});}}><div className="inline-edit-title"><strong>Edit text</strong><button type="button" aria-label="Close text editor" onClick={()=>setSelected(null)}>×</button></div><textarea ref={input} aria-label="Text on this page" rows={selected&&selected.value.length>120?5:3} maxLength={2500} value={selected?.value||''} onChange={e=>{if(!selected)return;const value=e.target.value;setSelected({...selected,value});onEdit(selected.binding,value);}} onKeyDown={e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();setSelected(null);}}}/><div className="inline-edit-actions"><button type="button" onClick={()=>{if(selected){onEdit(selected.binding,selected.original);setSelected(null);}}}>Undo this edit</button><button type="button" className="btn small" onClick={()=>setSelected(null)}>Done</button></div><p>Changes appear here immediately. Use Save draft or Publish above when ready.</p></PopoverContent></Popover>}</TextContext.Provider>;
}
export const useBusinessVersion=()=>useContext(TextContext)?.businessVersion;
export const useSitePreview=()=>!!useContext(TextContext)?.preview;
export const useSiteContent=()=>useContext(TextContext)?.content;
export const useSiteEditing=()=>!!useContext(TextContext)?.select;
export const useOpenSiteControl=()=>useContext(TextContext)?.openControl;
export default function SiteText({id,value,field}:{id:string;value:string|number|null|undefined;field?:string}){
 const context=useContext(TextContext);const original=humanText(value);if(!context)return <>{wiwwVoice(original)}</>;const binding=bindText(id,original,context.content.copy,field);const text=wiwwVoice(readText(context.content,binding,original));
 if(!context.select)return <>{text}</>;
 const select=(e:React.MouseEvent<HTMLElement>|React.KeyboardEvent<HTMLElement>)=>{e.preventDefault();e.stopPropagation();context.select!(binding,text,text,e.currentTarget);};
 return <span className={'inline-site-text'+(!text?' inline-site-empty':'')} data-site-text={id} tabIndex={0} role="button" aria-label={`Edit text: ${text||'empty text'}`} title="Click to edit this text" style={{color:'inherit',font:'inherit',letterSpacing:'inherit',textTransform:'inherit'}} onClick={select} onKeyDown={e=>{if(e.key==='Enter'||e.key===' ')select(e);}}>{text||'[empty text]'}</span>;
}
