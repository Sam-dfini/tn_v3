'use client';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/LangContext';

interface Sector { id:string;name:string;workers:number;risk:string;riskScore:number;avgWage:number;education:string;color:string; }
interface RiskByPay { range:string;workers:number;riskScore:number; }
interface RiskByEdu { level:string;workers:number;riskScore:number; }
interface JobData { title:string;total_workers:number;sectors:Sector[];risk_by_pay:RiskByPay[];risk_by_education:RiskByEdu[];wages_at_risk:{total_wage_bill_monthly_TND:number;at_risk_pct:number;at_risk_TND:number}; }

export default function JobTreemapPage() {
  const { dir } = useLang();
  const [data, setData] = useState<JobData | null>(null);
  const [selected, setSelected] = useState<Sector | null>(null);

  useEffect(() => { fetch('/data/job-treemap.json').then(r=>r.json()).then(setData).catch(()=>{}); }, []);

  const speak = (text: string) => { if (typeof window !== 'undefined' && window.speechSynthesis) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(Object.assign(new SpeechSynthesisUtterance(text), {rate:0.88})); } };

  if (!data) return <div style={{ padding:40, color:'#475569', textAlign:'center' }}>Loading job risk data...</div>;

  const totalWorkers = data.sectors.reduce((s,sec)=>s+sec.workers, 0);
  const maxWorkers = Math.max(...data.sectors.map(s=>s.workers));

  return (
    <div dir={dir} style={{ padding:24, display:'flex', flexDirection:'column', gap:20 }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <h1 style={{ fontSize:'1.1rem', fontWeight:800, color:'#22d3ee', margin:0, fontFamily:'Space Grotesk' }}>📊 {data.title}</h1>
          <p style={{ fontSize:'0.65rem', color:'#475569', margin:'4px 0 0' }}>
            {data.total_workers.toLocaleString()} total workers · Sized by employment · Colored by risk exposure
          </p>
        </div>
        <button onClick={() => speak(`Tunisia Job Risk Exposure. ${data.sectors.filter(s=>s.risk==='critical').length} sectors in critical risk. Informal sector is highest risk at 95 percent. Total wages at risk: ${data.wages_at_risk.at_risk_pct} percent of monthly wage bill.`)}
          style={{ background:'rgba(34,211,238,0.1)', border:'1px solid rgba(34,211,238,0.3)', borderRadius:8, padding:'8px 16px', color:'#22d3ee', fontSize:'0.7rem', cursor:'pointer' }}>
          🔊 Read Summary
        </button>
      </div>

      {/* Main layout: left panel + treemap */}
      <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:20 }}>

        {/* LEFT PANEL */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {/* Wages at risk */}
          <div className="module-card" style={{ padding:14 }}>
            <div style={{ fontSize:'0.6rem', color:'#ef4444', fontWeight:700, letterSpacing:'0.08em', marginBottom:10 }}>💸 WAGES AT RISK</div>
            <div style={{ fontSize:'1.8rem', fontWeight:800, color:'#ef4444', fontFamily:'Space Grotesk' }}>{data.wages_at_risk.at_risk_pct}%</div>
            <div style={{ fontSize:'0.58rem', color:'#64748b', marginBottom:10 }}>of monthly wage bill at risk</div>
            <div style={{ height:8, background:'rgba(255,255,255,0.06)', borderRadius:4, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${data.wages_at_risk.at_risk_pct}%`, background:'linear-gradient(90deg,#eab308,#ef4444)', borderRadius:4 }} />
            </div>
          </div>

          {/* Risk by pay */}
          <div className="module-card" style={{ padding:14 }}>
            <div style={{ fontSize:'0.6rem', color:'#f97316', fontWeight:700, letterSpacing:'0.08em', marginBottom:10 }}>💰 RISK BY INCOME</div>
            {data.risk_by_pay.map(rp => (
              <div key={rp.range} style={{ marginBottom:8 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                  <span style={{ fontSize:'0.58rem', color:'#94a3b8' }}>{rp.range}</span>
                  <span style={{ fontSize:'0.6rem', fontWeight:700, color:rp.riskScore>75?'#ef4444':rp.riskScore>55?'#f97316':'#eab308' }}>{rp.riskScore}%</span>
                </div>
                <div style={{ height:5, background:'rgba(255,255,255,0.06)', borderRadius:3 }}>
                  <div style={{ height:'100%', width:`${rp.riskScore}%`, background:rp.riskScore>75?'#ef4444':rp.riskScore>55?'#f97316':'#eab308', borderRadius:3 }} />
                </div>
                <div style={{ fontSize:'0.52rem', color:'#475569', marginTop:1 }}>{rp.workers.toLocaleString()} workers</div>
              </div>
            ))}
          </div>

          {/* Risk by education */}
          <div className="module-card" style={{ padding:14 }}>
            <div style={{ fontSize:'0.6rem', color:'#a78bfa', fontWeight:700, letterSpacing:'0.08em', marginBottom:10 }}>🎓 RISK BY EDUCATION</div>
            {data.risk_by_education.map(re => (
              <div key={re.level} style={{ marginBottom:8 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                  <span style={{ fontSize:'0.58rem', color:'#94a3b8' }}>{re.level}</span>
                  <span style={{ fontSize:'0.6rem', fontWeight:700, color:re.riskScore>75?'#ef4444':re.riskScore>55?'#f97316':'#eab308' }}>{re.riskScore}%</span>
                </div>
                <div style={{ height:5, background:'rgba(255,255,255,0.06)', borderRadius:3 }}>
                  <div style={{ height:'100%', width:`${re.riskScore}%`, background:re.riskScore>75?'#ef4444':re.riskScore>55?'#f97316':'#eab308', borderRadius:3 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Selected sector detail */}
          {selected && (
            <div className="module-card" style={{ padding:14, border:`1px solid ${selected.color}44` }}>
              <div style={{ fontSize:'0.6rem', fontWeight:700, color:selected.color, marginBottom:8 }}>{selected.name}</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                <div><div style={{ fontSize:'0.52rem', color:'#475569' }}>Workers</div><div style={{ fontSize:'0.75rem', fontWeight:700, color:'#e2e8f0' }}>{selected.workers.toLocaleString()}</div></div>
                <div><div style={{ fontSize:'0.52rem', color:'#475569' }}>Risk Score</div><div style={{ fontSize:'0.75rem', fontWeight:700, color:selected.color }}>{selected.riskScore}%</div></div>
                <div><div style={{ fontSize:'0.52rem', color:'#475569' }}>Avg Wage</div><div style={{ fontSize:'0.75rem', fontWeight:700, color:'#e2e8f0' }}>{selected.avgWage} TND</div></div>
                <div><div style={{ fontSize:'0.52rem', color:'#475569' }}>Education</div><div style={{ fontSize:'0.7rem', fontWeight:600, color:'#94a3b8', textTransform:'capitalize' }}>{selected.education}</div></div>
              </div>
            </div>
          )}
        </div>

        {/* TREEMAP */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {/* Risk Legend */}
          <div style={{ display:'flex', gap:12 }}>
            {[['#ef4444','Critical (>80%)'],['#dc2626','Critical-High'],['#f97316','High (60-79%)'],['#eab308','Medium (40-59%)'],['#22c55e','Low (<40%)']].map(([c,l]) => (
              <div key={l} style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:10, height:10, borderRadius:2, background:c }} />
                <span style={{ fontSize:'0.55rem', color:'#64748b' }}>{l}</span>
              </div>
            ))}
          </div>

          {/* Treemap grid */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:4, padding:16, background:'rgba(7,12,24,0.8)', border:'1px solid rgba(34,211,238,0.1)', borderRadius:12, minHeight:420 }}>
            {data.sectors.sort((a,b)=>b.workers-a.workers).map(sector => {
              const area = (sector.workers / maxWorkers);
              const w = Math.max(60, area * 260);
              const h = Math.max(50, area * 200);
              const isSelected = selected?.id === sector.id;
              return (
                <div key={sector.id}
                  onClick={() => setSelected(isSelected ? null : sector)}
                  style={{ width:w, height:h, background:`${sector.color}20`, border:`1px solid ${sector.color}${isSelected?'99':'44'}`, borderRadius:6, padding:'8px', cursor:'pointer', display:'flex', flexDirection:'column', justifyContent:'space-between', transition:'all 0.2s', boxShadow:isSelected?`0 0 16px ${sector.color}44`:'none', flexShrink:0 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.border=`1px solid ${sector.color}88`; (e.currentTarget as HTMLDivElement).style.boxShadow=`0 0 12px ${sector.color}33`; }}
                  onMouseLeave={e => { if (!isSelected) { (e.currentTarget as HTMLDivElement).style.border=`1px solid ${sector.color}44`; (e.currentTarget as HTMLDivElement).style.boxShadow='none'; } }}
                >
                  <div style={{ fontSize:Math.max(9, Math.min(12, w/10)), fontWeight:700, color:'#e2e8f0', lineHeight:1.3, overflow:'hidden' }}>{sector.name}</div>
                  <div>
                    <div style={{ fontSize:Math.max(10, Math.min(16, w/8)), fontWeight:800, color:sector.color, fontFamily:'Space Grotesk' }}>{sector.riskScore}%</div>
                    <div style={{ fontSize:Math.max(8, Math.min(11, w/12)), color:'#64748b' }}>{(sector.workers/1000).toFixed(0)}k workers</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Risk breakdown bar */}
          <div className="module-card" style={{ padding:14 }}>
            <div style={{ fontSize:'0.6rem', color:'#475569', fontWeight:700, marginBottom:10 }}>SECTOR RISK DISTRIBUTION</div>
            <div style={{ display:'flex', height:24, borderRadius:6, overflow:'hidden', gap:1 }}>
              {data.sectors.map(s => (
                <div key={s.id} title={`${s.name}: ${s.riskScore}%`} style={{ width:`${(s.workers/totalWorkers)*100}%`, background:s.color, display:'flex', alignItems:'center', justifyContent:'center', minWidth:2 }} />
              ))}
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:4, fontSize:'0.52rem', color:'#334155' }}>
              <span>Informal Sector (highest risk)</span>
              <span>ICT (lowest risk)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
