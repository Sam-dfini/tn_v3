'use client';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/LangContext';

interface Narrative { id:number;title:string;source:string;reach:number;credibility:number;sentiment:string;channels:string[];description:string;active:boolean; }

export default function NarrativesPage() {
  const { dir } = useLang();
  const [narratives, setNarratives] = useState<Narrative[]>([]);
  useEffect(() => { fetch('/data/narratives.json').then(r=>r.json()).then(setNarratives).catch(()=>{}); }, []);

  const sentColor = (s:string) => s==='negative'?'#ef4444':s==='positive'?'#22c55e':s==='volatile'?'#f97316':'#a78bfa';

  return (
    <div dir={dir} style={{ padding:24, display:'flex', flexDirection:'column', gap:20 }}>
      <div>
        <h1 style={{ fontSize:'1.1rem', fontWeight:800, color:'#22d3ee', margin:0, fontFamily:'Space Grotesk' }}>📡 NARRATIVE INTELLIGENCE</h1>
        <p style={{ fontSize:'0.65rem', color:'#475569', margin:'4px 0 0' }}>Active narratives · Reach & credibility mapping · Source tracking</p>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {narratives.map(n => (
          <div key={n.id} className="module-card" style={{ padding:16, opacity:n.active?1:0.5 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:sentColor(n.sentiment) }} />
                  <div style={{ fontSize:'0.72rem', fontWeight:700, color:'#e2e8f0' }}>{n.title}</div>
                  {!n.active && <span style={{ fontSize:'0.5rem', background:'rgba(100,116,139,0.2)', color:'#64748b', padding:'1px 6px', borderRadius:10 }}>INACTIVE</span>}
                </div>
                <div style={{ fontSize:'0.6rem', color:'#64748b' }}>Source: {n.source}</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:4, alignItems:'flex-end' }}>
                <span style={{ fontSize:'0.55rem', background:`${sentColor(n.sentiment)}18`, color:sentColor(n.sentiment), padding:'2px 8px', borderRadius:10, fontWeight:700 }}>{n.sentiment.toUpperCase()}</span>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:10 }}>
              <div>
                <div style={{ fontSize:'0.55rem', color:'#475569', marginBottom:4 }}>REACH</div>
                <div style={{ height:5, background:'rgba(255,255,255,0.06)', borderRadius:3 }}><div style={{ height:'100%', width:`${n.reach}%`, background:'#a78bfa', borderRadius:3 }} /></div>
                <div style={{ fontSize:'0.6rem', color:'#a78bfa', fontWeight:700, marginTop:2 }}>{n.reach}%</div>
              </div>
              <div>
                <div style={{ fontSize:'0.55rem', color:'#475569', marginBottom:4 }}>CREDIBILITY</div>
                <div style={{ height:5, background:'rgba(255,255,255,0.06)', borderRadius:3 }}><div style={{ height:'100%', width:`${n.credibility}%`, background:n.credibility>60?'#22c55e':n.credibility>35?'#eab308':'#ef4444', borderRadius:3 }} /></div>
                <div style={{ fontSize:'0.6rem', color:n.credibility>60?'#22c55e':n.credibility>35?'#eab308':'#ef4444', fontWeight:700, marginTop:2 }}>{n.credibility}%</div>
              </div>
            </div>
            <div style={{ fontSize:'0.6rem', color:'#94a3b8', lineHeight:1.5, marginBottom:8 }}>{n.description}</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {n.channels.map(ch => (
                <span key={ch} style={{ fontSize:'0.52rem', background:'rgba(34,211,238,0.08)', color:'#22d3ee', padding:'2px 8px', borderRadius:10, border:'1px solid rgba(34,211,238,0.2)' }}>{ch}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
