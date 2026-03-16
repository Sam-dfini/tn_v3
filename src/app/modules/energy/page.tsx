'use client';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/LangContext';

interface EnergyData { gas_production_bcm: number; oil_production_kbpd: number; renewable_pct: number; import_dependency_pct: number; steg_debt_TND_million: number; daily_cuts_hours: number; phosphate_output_mt: number; phosphate_target_mt: number; regions: {gov:string;cuts_h:number;risk:string}[]; }

export default function EnergyPage() {
  const { dir } = useLang();
  const [data, setData] = useState<EnergyData | null>(null);
  useEffect(() => { fetch('/data/energy.json').then(r => r.json()).then(setData).catch(()=>{}); }, []);

  const speak = (t: string) => { if (typeof window !== 'undefined') { window.speechSynthesis.cancel(); window.speechSynthesis.speak(Object.assign(new SpeechSynthesisUtterance(t), {rate:0.88})); } };

  return (
    <div dir={dir} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#22d3ee', margin: 0, fontFamily: 'Space Grotesk' }}>⚡ ENERGY MODULE</h1>
          <p style={{ fontSize: '0.65rem', color: '#475569', margin: '4px 0 0' }}>Power infrastructure · Phosphate crisis · STEG debt · Regional outages</p>
        </div>
        <button onClick={() => speak('Tunisia Energy Module. Average daily power cuts are 5.8 hours. STEG debt at 8.4 billion dinars. Import dependency at 62 percent. Phosphate output at 35 percent of target due to social blockades.')}
          style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: 8, padding: '8px 16px', color: '#22d3ee', fontSize: '0.7rem', cursor: 'pointer' }}>🔊 Briefing</button>
      </div>

      {/* Key Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
        {[
          { label: 'Avg. Daily Cuts', value: `${data?.daily_cuts_hours ?? '5.8'}h`, color: '#ef4444', icon: '🌑' },
          { label: 'Import Dependency', value: `${data?.import_dependency_pct ?? 62}%`, color: '#f97316', icon: '⬆️' },
          { label: 'STEG Debt', value: `${((data?.steg_debt_TND_million ?? 8400)/1000).toFixed(1)}B TND`, color: '#ef4444', icon: '🏦' },
          { label: 'Phosphate Output', value: `${data?.phosphate_output_mt ?? 2.8}Mt`, color: '#eab308', icon: '⛏️' },
          { label: 'Gas Production', value: `${data?.gas_production_bcm ?? 2.1} BCM`, color: '#22d3ee', icon: '🔥' },
          { label: 'Oil Production', value: `${data?.oil_production_kbpd ?? 38} kbpd`, color: '#22d3ee', icon: '🛢️' },
          { label: 'Renewables', value: `${data?.renewable_pct ?? 4.2}%`, color: '#22c55e', icon: '☀️' },
          { label: 'Phosphate Gap', value: `-${(((data?.phosphate_target_mt??8)-(data?.phosphate_output_mt??2.8))/(data?.phosphate_target_mt??8)*100).toFixed(0)}%`, color: '#ef4444', icon: '📉' },
        ].map(stat => (
          <div key={stat.label} className="stat-card" style={{ padding: '12px 14px' }}>
            <div style={{ fontSize: '1.1rem', marginBottom: 4 }}>{stat.icon}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: stat.color, fontFamily: 'Space Grotesk' }}>{stat.value}</div>
            <div style={{ fontSize: '0.58rem', color: '#64748b', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Regional outage map */}
      <div className="module-card" style={{ padding: 16 }}>
        <div style={{ fontSize: '0.65rem', color: '#f97316', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 12 }}>🌑 REGIONAL POWER OUTAGE SEVERITY</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(data?.regions ?? []).map(reg => {
            const maxH = 8; const riskC = reg.risk === 'critical' ? '#ef4444' : reg.risk === 'high' ? '#f97316' : '#eab308';
            return (
              <div key={reg.gov} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 80, fontSize: '0.62rem', color: '#94a3b8', textAlign: dir === 'rtl' ? 'right' : 'left' }}>{reg.gov}</div>
                <div style={{ flex: 1, height: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(reg.cuts_h / maxH) * 100}%`, background: riskC, borderRadius: 3, boxShadow: `0 0 6px ${riskC}44`, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 6 }}>
                    <span style={{ fontSize: '0.55rem', color: '#fff', fontWeight: 700 }}>{reg.cuts_h}h</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.55rem', fontWeight: 700, color: riskC, width: 50, textAlign: 'center' }}>{reg.risk.toUpperCase()}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phosphate situation */}
      <div className="module-card" style={{ padding: 16 }}>
        <div style={{ fontSize: '0.65rem', color: '#eab308', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 12 }}>⛏️ PHOSPHATE REVENUE CRISIS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#eab308', fontFamily: 'Space Grotesk' }}>{data?.phosphate_output_mt ?? 2.8}Mt</div>
            <div style={{ fontSize: '0.6rem', color: '#64748b' }}>Actual Output 2025</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#334155', fontFamily: 'Space Grotesk' }}>{data?.phosphate_target_mt ?? 8}Mt</div>
            <div style={{ fontSize: '0.6rem', color: '#64748b' }}>Target Output</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444', fontFamily: 'Space Grotesk' }}>-USD 1.2B</div>
            <div style={{ fontSize: '0.6rem', color: '#64748b' }}>Annual Revenue Loss</div>
          </div>
        </div>
        <div style={{ marginTop: 12, padding: '10px', background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.2)', borderRadius: 8, fontSize: '0.6rem', color: '#94a3b8', lineHeight: 1.6 }}>
          The Gafsa phosphate basin social blockades — ongoing since 2011 — now cost Tunisia USD 1.2 billion annually. GCT (state phosphate company) debt at 1.8B TND. Workers demand jobs, locals demand profit-sharing. No resolution in sight.
        </div>
      </div>
    </div>
  );
}
