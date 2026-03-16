'use client';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/LangContext';

interface Company { id:string;name:string;sector:string;state_owned:boolean;debt_TND_M:number|null;employees:number;risk:string;status:string; }

export default function CompaniesPage() {
  const { dir } = useLang();
  const [companies, setCompanies] = useState<Company[]>([]);
  useEffect(() => { fetch('/data/companies.json').then(r=>r.json()).then(setCompanies).catch(()=>{}); }, []);

  const riskC = (r:string) => r==='critical'?'#ef4444':r==='high'?'#f97316':'#eab308';

  return (
    <div dir={dir} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize:'1.1rem', fontWeight:800, color:'#22d3ee', margin:0, fontFamily:'Space Grotesk' }}>🏢 COMPANIES & SOES</h1>
        <p style={{ fontSize:'0.65rem', color:'#475569', margin:'4px 0 0' }}>State-owned enterprise debt · Private sector stress · Key corporate risk profiles</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
        {companies.map(co => (
          <div key={co.id} className="module-card" style={{ padding:16, borderLeft:`3px solid ${riskC(co.risk)}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <div>
                <div style={{ fontSize:'0.75rem', fontWeight:700, color:'#e2e8f0' }}>{co.name}</div>
                <div style={{ fontSize:'0.6rem', color:'#64748b', marginTop:2 }}>{co.sector} · {co.state_owned?'🏛️ State-owned':'🏢 Private'}</div>
              </div>
              <div style={{ fontSize:'0.55rem', background:`${riskC(co.risk)}18`, color:riskC(co.risk), padding:'2px 8px', borderRadius:10, fontWeight:700 }}>
                {co.risk.toUpperCase()}
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
              {co.debt_TND_M !== null && (
                <div style={{ textAlign:'center', padding:'6px', background:'rgba(239,68,68,0.05)', borderRadius:6 }}>
                  <div style={{ fontSize:'1.1rem', fontWeight:800, color:'#ef4444', fontFamily:'Space Grotesk' }}>{co.debt_TND_M > 1000 ? `${(co.debt_TND_M/1000).toFixed(1)}B` : `${co.debt_TND_M}M`}</div>
                  <div style={{ fontSize:'0.52rem', color:'#64748b' }}>Debt (TND)</div>
                </div>
              )}
              <div style={{ textAlign:'center', padding:'6px', background:'rgba(34,211,238,0.05)', borderRadius:6 }}>
                <div style={{ fontSize:'1.1rem', fontWeight:800, color:'#22d3ee', fontFamily:'Space Grotesk' }}>{co.employees.toLocaleString()}</div>
                <div style={{ fontSize:'0.52rem', color:'#64748b' }}>Employees</div>
              </div>
            </div>
            <div style={{ fontSize:'0.6rem', color:'#94a3b8', lineHeight:1.5 }}>{co.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
