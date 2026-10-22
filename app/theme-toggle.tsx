"use client";
import {useSyncExternalStore} from 'react';
import {currentTheme,setThemePreference,subscribeTheme} from '@/lib/theme-preference';
export default function ThemeToggle(){
 const theme=useSyncExternalStore(subscribeTheme,currentTheme,()=> 'dark' as const);
 const next=theme==='dark'?'light':'dark';
 return <button className="theme-toggle" type="button" aria-label={`Switch to ${next} mode`} onClick={()=>setThemePreference(next)}><span className="theme-label-light">Light</span><span className="theme-label-dark">Dark</span></button>;
}
