'use client';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/LangContext';

interface ElectionData { last_election: {year:number;type:string;winner:string;pct:number;turnout:number;credibility:string}; next_scheduled: {year:number;type:string;date:string;status:string}; scenarios: {id:string;name:string;probability:number;description:string}[]; }

export default function ElectionsPage() {
  const { dir } = useLang();
  const [data, setData] = useState<ElectionData | null>(null);
  useEffect(() => { fetch('/data/elections.json').then(r => r.json()).then(setData).catch(()=>{}); }, []);

  return (
    <div dir={dir} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#22d3ee', margin: 0, fontFamily: 'Space Grotesk' }}>🗳️ ELECTIONS MODULE</h1>
        <p style={{ fontSize: '0.65rem', color: '#475569', margin: '4px 0 0' }}>Electoral calendar · Legitimacy assessment · Scenario modelling</p>
      </div>

      {data && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="module-card" style={{ padding: 18 }}>
              <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, marginBottom: 10 }}>LAST ELECTION — {data.last_election.year}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 6 }}>{data.last_election.type}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(34,211,238,0.05)', borderRadius: 6 }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#22d3ee', fontFamily: 'Space Grotesk' }}>{data.last_election.pct}%</div>
                  <div style={{ fontSize: '0.55rem', color: '#64748b' }}>Saied vote share</div>
                </div>
                <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(239,68,68,0.05)', borderRadius: 6 }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ef4444', fontFamily: 'Space Grotesk' }}>{data.last_election.turnout}%</div>
                  <div style={{ fontSize: '0.55rem', color: '#64748b' }}>Voter turnout</div>
                </div>
              </div>
              <div style={{ padding: '8px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6 }}>
                <span style={{ fontSize: '0.6rem', color: '#ef4444', fontWeight: 700 }}>Credibility: {data.last_election.credibility.toUpperCase()}</span>
                <div style={{ fontSize: '0.58rem', color: '#64748b', marginTop: 2 }}>Opposition boycotted. International observers given limited access. Result broadly dismissed by EU and AU.</div>
              </div>
            </div>
            <div className="module-card" style={{ padding: 18 }}>
              <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, marginBottom: 10 }}>NEXT SCHEDULED — {data.next_scheduled.year}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 6 }}>{data.next_scheduled.type}</div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginBottom: 8 }}>Date: {data.next_scheduled.date}</div>
              <div style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(234,179,8,0.15)', border: '1px solid rgba(234,179,8,0.3)', borderRadius: 6, fontSize: '0.6rem', color: '#eab308', fontWeight: 700, marginBottom: 10 }}>
                STATUS: {data.next_scheduled.status.toUpperCase()}
              </div>
              <div style={{ fontSize: '0.6rem', color: '#64748b', lineHeight: 1.5 }}>
                Constitutional obligation to hold elections by October 2026. Feasibility under current economic and political conditions: LOW. Most likely outcome: managed process or postponement.
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 10 }}>SCENARIO PROBABILITY</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
              {data.scenarios.map(s => {
                const c = s.probability > 40 ? '#22d3ee' : s.probability > 20 ? '#eab308' : s.probability > 8 ? '#f97316' : '#ef4444';
                return (
                  <div key={s.id} style={{ background: 'linear-gradient(135deg,#0d1526,#070c18)', border: `1px solid ${c}33`, borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 8 }}>{s.name}</div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: c, fontFamily: 'Space Grotesk', textShadow: `0 0 12px ${c}44` }}>{s.probability}%</div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, margin: '8px 0' }}>
                      <div style={{ height: '100%', width: `${s.probability}%`, background: c, borderRadius: 2 }} />
                    </div>
                    <div style={{ fontSize: '0.56rem', color: '#64748b', lineHeight: 1.4 }}>{s.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
