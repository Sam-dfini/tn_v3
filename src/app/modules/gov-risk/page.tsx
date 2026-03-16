'use client';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/LangContext';

interface Gov { id:string;name:string;lat:number;lng:number;riskScore:number;population:number;unemployment:number;protest_events:number; }

export default function GovRiskPage() {
  const { dir } = useLang();
  const [govs, setGovs] = useState<Gov[]>([]);
  useEffect(() => { fetch('/data/governorates.json').then(r=>r.json()).then((d:Gov[])=>setGovs(d.sort((a,b)=>b.riskScore-a.riskScore))).catch(()=>{}); }, []);
  const riskC = (r:number) => r>=80?'#ef4444':r>=65?'#f97316':r>=50?'#eab308':'#22c55e';
  return (
    <div dir={dir} style={{ padding:24, display:'flex', flexDirection:'column', gap:20 }}>
      <h1 style={{ fontSize:'1.1rem', fontWeight:800, color:'#22d3ee', margin:0, fontFamily:'Space Grotesk' }}>🏛️ GOVERNORATE RISK MATRIX</h1>
      <p style={{ fontSize:'0.65rem', color:'#475569', margin:'4px 0 0 0' }}>24 governorates ranked by risk score · Unemployment · Protest density</p>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {govs.map((g,i) => (
          <div key={g.id} className="module-card" style={{ padding:'10px 16px', display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ width:24, fontSize:'0.7rem', fontWeight:800, color:'#475569', textAlign:'center' }}>#{i+1}</div>
            <div style={{ width:100, fontSize:'0.65rem', fontWeight:600, color:'#e2e8f0' }}>{g.name}</div>
            <div style={{ flex:1, height:8, background:'rgba(255,255,255,0.05)', borderRadius:4 }}>
              <div style={{ height:'100%', width:`${g.riskScore}%`, background:riskC(g.riskScore), borderRadius:4, boxShadow:`0 0 6px ${riskC(g.riskScore)}44` }} />
            </div>
            <div style={{ width:40, textAlign:'center', fontSize:'0.68rem', fontWeight:800, color:riskC(g.riskScore) }}>{g.riskScore}</div>
            <div style={{ width:70, textAlign:'center', fontSize:'0.6rem', color:'#f97316' }}>⚡ {g.unemployment.toFixed(1)}%</div>
            <div style={{ width:60, textAlign:'center', fontSize:'0.6rem', color:'#a78bfa' }}>📍 {g.protest_events} events</div>
          </div>
        ))}
      </div>
    </div>
  );
}
