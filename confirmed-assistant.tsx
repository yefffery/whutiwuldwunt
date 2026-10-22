"use client";
import {useState} from 'react';
import {confirmedAnswer,confirmedFallback} from '@/lib/confirmed-answers';
export default function ConfirmedAssistant(){
 const [question,setQuestion]=useState(''),[answer,setAnswer]=useState('');
 return <section className="wrap confirmed-assistant" aria-label="WIWW confirmed information"><details><summary>Ask WIWW</summary><p>Answers come from WIWW’s confirmed information. Questions stay in this page; use the inquiry link when you want a personal reply.</p><form onSubmit={event=>{event.preventDefault();setAnswer(confirmedAnswer(question));}}><label htmlFor="wiww-question">Your question</label><input id="wiww-question" value={question} onChange={event=>setQuestion(event.target.value)} maxLength={500} autoComplete="off"/><button type="submit" className="btn small">Ask WIWW</button></form><p role="status" aria-live="polite">{answer||confirmedFallback}</p><a className="text-link" href="/inquiries">Ask WIWW personally</a></details></section>;
}
