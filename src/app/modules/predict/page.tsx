'use client';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/LangContext';

interface RRIData { current: number; label: string; unit: string; description: string; series: {month:string;value:number}[]; projection: {month:string;value:number}[]; }

export default function PredictPage() {
  const { dir } = useLang();
  const [rri, setRri] = useState<RRIData | null>(null);

  useEffect(() => {
    fetch('/data/rri-series.json').then(r => r.json()).then(setRri).catch(() => {});
  }, []);

  const allSeries = rri ? [...rri.series, ...rri.projection] : [];
  const maxV = 55;

  const speak = (t: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(Object.assign(new SpeechSynthesisUtterance(t), { rate: 0.88 })); }
  };

  return (
    <div dir={dir} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#22d3ee', margin: 0, fontFamily: 'Space Grotesk' }}>🔮 PREDICTIVE ANALYTICS</h1>
          <p style={{ fontSize: '0.65rem', color: '#475569', margin: '4px 0 0' }}>Revolutionary Risk Index trajectory · 90-day projection · Trigger identification</p>
        </div>
        <button onClick={() => speak(`Predictive analytics. Revolutionary Risk Index currently at ${rri?.current ?? 27} months. The index has been declining from 48 months in January 2024 to 27 months in March 2026. Projection shows continued decline to 15 months by September 2026 if current trajectory holds.`)}
          style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: 8, padding: '8px 16px', color: '#22d3ee', fontSize: '0.7rem', cursor: 'pointer' }}>
          🔊 Read Forecast
        </button>
      </div>

      {/* RRI Chart */}
      <div className="module-card" style={{ padding: 20 }}>
        <div style={{ fontSize: '0.65rem', color: '#22d3ee', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 16 }}>
          ⏱️ REVOLUTIONARY RISK INDEX — 27-MONTH TRAJECTORY
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 120, padding: '0 8px', position: 'relative' }}>
          {/* Grid lines */}
          {[25, 50, 75, 100].map(pct => (
            <div key={pct} style={{ position: 'absolute', left: 0, right: 0, bottom: `${pct}%`, height: 1, background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
          ))}
          {allSeries.map((s, i) => {
            const isProjection = i >= (rri?.series.length ?? 0);
            const h = Math.max(4, (s.value / maxV) * 120);
            const isCurrent = s.month === '2026-03';
            return (
              <div key={s.month} title={`${s.month}: ${s.value} months`} style={{ flex: 1, height: h, background: isCurrent ? '#f59e0b' : isProjection ? 'rgba(239,68,68,0.5)' : 'rgba(34,211,238,0.6)', borderRadius: '2px 2px 0 0', borderTop: isProjection ? '1px dashed rgba(239,68,68,0.8)' : 'none', position: 'relative', cursor: 'default' }}>
                {isCurrent && (
                  <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', fontSize: '0.5rem', color: '#f59e0b', fontWeight: 700, whiteSpace: 'nowrap' }}>NOW</div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: '0.52rem', color: '#334155' }}>Jan 2024</span>
          <span style={{ fontSize: '0.52rem', color: '#334155' }}>Mar 2026</span>
          <span style={{ fontSize: '0.52rem', color: '#ef4444' }}>Sep 2026 (proj.)</span>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 8, background: 'rgba(34,211,238,0.6)', borderRadius: 2 }} /><span style={{ fontSize: '0.6rem', color: '#64748b' }}>Historical</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 8, background: '#f59e0b', borderRadius: 2 }} /><span style={{ fontSize: '0.6rem', color: '#64748b' }}>Current (Mar 2026)</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 8, background: 'rgba(239,68,68,0.5)', borderRadius: 2, border: '1px dashed rgba(239,68,68,0.8)' }} /><span style={{ fontSize: '0.6rem', color: '#64748b' }}>Projection</span></div>
        </div>
      </div>

      {/* Trigger Indicators */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="module-card" style={{ padding: 16 }}>
          <div style={{ fontSize: '0.65rem', color: '#ef4444', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 12 }}>🔴 CRITICAL TRIGGERS</div>
          {[
            { t: 'Bread price exceeds 0.40 TND/loaf', prob: 72 },
            { t: 'BCT reserves fall below 60 days', prob: 65 },
            { t: 'UGTT declares general strike', prob: 58 },
            { t: 'Military pay arrears > 30 days', prob: 42 },
            { t: 'IMF deal collapses permanently', prob: 38 },
          ].map(trigger => (
            <div key={trigger.t} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>{trigger.t}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#ef4444' }}>{trigger.prob}%</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                <div style={{ height: '100%', width: `${trigger.prob}%`, background: trigger.prob > 60 ? '#ef4444' : '#f97316', borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
        <div className="module-card" style={{ padding: 16 }}>
          <div style={{ fontSize: '0.65rem', color: '#22c55e', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 12 }}>🟢 STABILISING FACTORS</div>
          {[
            { t: 'IMF tranche disbursed', impact: -12 },
            { t: 'Gulf credit line USD 2B+', impact: -15 },
            { t: 'Tourism revenue surge maintains', impact: -5 },
            { t: 'Saied deepens repression', impact: -8 },
            { t: 'Diaspora remittances increase', impact: -4 },
          ].map(factor => (
            <div key={factor.t} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '6px 10px', background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 6 }}>
              <span style={{ fontSize: '0.6rem', color: '#94a3b8', flex: 1 }}>{factor.t}</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#22c55e', marginLeft: 8 }}>{factor.impact}mo</span>
            </div>
          ))}
        </div>
      </div>

      {/* 90-Day Forecast */}
      <div className="module-card" style={{ padding: 20 }}>
        <div style={{ fontSize: '0.65rem', color: '#22d3ee', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 16 }}>📅 90-DAY FORECAST (March → June 2026)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {[
            { month: 'April 2026', rri: 25, risk: 'HIGH', color: '#f97316', event: 'UGTT strike decision · IMF mission visit' },
            { month: 'May 2026', rri: 23, risk: 'HIGH', color: '#f97316', event: 'Summer heat + water shortages begin · Ramadan social strain' },
            { month: 'June 2026', rri: 21, risk: 'CRITICAL', color: '#ef4444', event: 'Election preparation pressure · BCT reserve threshold' },
          ].map(month => (
            <div key={month.month} style={{ background: 'rgba(7,12,24,0.8)', border: `1px solid ${month.color}33`, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 6 }}>{month.month}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: month.color, fontFamily: 'Space Grotesk' }}>{month.rri}<span style={{ fontSize: '0.7rem', color: '#475569' }}>mo</span></div>
              <div style={{ fontSize: '0.55rem', background: `${month.color}18`, color: month.color, padding: '2px 8px', borderRadius: 4, display: 'inline-block', fontWeight: 700, marginTop: 4, marginBottom: 8 }}>{month.risk}</div>
              <div style={{ fontSize: '0.58rem', color: '#64748b', lineHeight: 1.4 }}>{month.event}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
