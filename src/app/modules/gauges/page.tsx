'use client';
import { useEffect, useState } from 'react';
import SemiGauge from '@/components/gauges/SemiGauge';
import { useLang } from '@/lib/LangContext';

interface GaugeEntry {
  value: number; max: number; label: string; unit: string;
  status: 'critical' | 'high' | 'medium' | 'low';
  trend: number; sparkline: number[];
  description?: string;
  total?: number;
  youth_unemployment?: number;
}

interface GaugeData { [key: string]: GaugeEntry; }

const GAUGE_DEFS = [
  { key: 'happiness', id: 'happiness', emoji: '😊', desc: 'Composite happiness index based on economic security, freedom, social trust. Tunisia at historic low.' },
  { key: 'population_pressure', id: 'population', emoji: '👶', desc: '38.4% of population under 25. Youth bulge straining labor markets, housing, services.' },
  { key: 'water_stress', id: 'water', emoji: '💧', desc: 'Renewable water resources at critical level. 7 of 24 governorates face daily rationing.' },
  { key: 'desertification', id: 'desertification', emoji: '🌵', desc: '65% of territory threatened by desertification. 40,000 ha of agricultural land lost annually.' },
  { key: 'forest_fire', id: 'forestfire', emoji: '🔥', desc: '72% fire risk index. Unusually dry spring 2026. Jendouba and Bizerte at extreme risk.' },
  { key: 'co2', id: 'co2', emoji: '🌫️', desc: '2.8 tonnes CO₂/capita/year. Increasing due to coal fallback from gas shortage.' },
  { key: 'env_risk', id: 'envrisk', emoji: '⚠️', desc: 'Composite environmental risk: water + desertification + fire + industrial pollution.' },
  { key: 'freedom', id: 'freedom', emoji: '⛓️', desc: '28% — CRITICAL. Press Freedom Index rank 118/180. 40+ journalists/activists detained.' },
  { key: 'economic_liberty', id: 'econlib', emoji: '💰', desc: '42% — RESTRICTED. Heritage Foundation index. Capital controls, forex rationing, nationalization risk.' },
  { key: 'jobs', id: 'jobs', emoji: '🏭', desc: 'Overall unemployment 18.4%. Youth unemployment 37.8% — structural, persistent, revolutionary trigger.' },
  { key: 'public_safety', id: 'safety', emoji: '🚨', desc: '54% public safety risk. Organized crime growing in south. Police overstretched in interior.' },
  { key: 'road_accidents', id: 'road', emoji: '🚗', desc: '1,240 road fatalities in 2025. Highest in MENA per capita. Infrastructure deterioration.' },
  { key: 'suicide_rate', id: 'suicide', emoji: '📊', desc: '9.8 per 100,000. Youth spike in Sidi Bouzid, Kasserine. Economic despair primary factor.' },
  { key: 'elite_loyalty', id: 'elite', emoji: '🎖️', desc: '72% elite loyalty to Saied regime. Declining. Military and technocrats showing cracks.' },
  { key: 'bct_reserve', id: 'bct', emoji: '🏦', desc: '88 days import cover. IMF threshold = 90. Critically close to reserve crisis.' },
  { key: 'youth_rage', id: 'youth', emoji: '💢', desc: '76% youth rage index. Combines unemployment, hopelessness, censorship resentment, bread prices.' },
  { key: 'phosphate_blockade', id: 'phosphate', emoji: '⛏️', desc: '82% disruption. Gafsa blockade costs Tunisia USD 1.2B/year in lost revenue.' },
  { key: 'migration_tension', id: 'migration', emoji: '⛵', desc: '71% tension index. 42,000 transit migrants in Sfax. Sub-Saharan tensions rising.' },
];

export default function GaugesPage() {
  const { t, dir } = useLang();
  const [gauges, setGauges] = useState<GaugeData | null>(null);

  useEffect(() => {
    fetch('/data/gauges.json').then(r => r.json()).then(setGauges).catch(() => {});
  }, []);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.88;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  };

  const speakAll = () => {
    if (!gauges) return;
    const summary = GAUGE_DEFS.map(d => {
      const g = gauges[d.key];
      return g ? `${g.label}: ${g.value} ${g.unit}, status ${g.status}.` : '';
    }).filter(Boolean).join(' ');
    speak(`Tunisia Intel Gauge Summary, March 2026. ${summary}`);
  };

  return (
    <div dir={dir} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#22d3ee', margin: 0, fontFamily: 'Space Grotesk' }}>
            📊 18 INTELLIGENCE GAUGES
          </h1>
          <p style={{ fontSize: '0.65rem', color: '#475569', margin: '4px 0 0' }}>
            Real-time political, social, environmental and economic risk indicators · Tunisia March 2026
          </p>
        </div>
        <button
          onClick={speakAll}
          style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: 8, padding: '8px 16px', color: '#22d3ee', fontSize: '0.7rem', cursor: 'pointer' }}
        >
          🔊 Read All Gauges
        </button>
      </div>

      {/* Summary bar */}
      <div style={{ display: 'flex', gap: 12, padding: '12px 16px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10 }}>
        {[['CRITICAL', '8', '#ef4444'], ['HIGH', '6', '#f97316'], ['MEDIUM', '3', '#eab308'], ['LOW', '1', '#22c55e']].map(([l, v, c]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: c }}>{v}</span>
            <span style={{ fontSize: '0.6rem', color: '#475569' }}>{l}</span>
          </div>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: '0.6rem', color: '#475569' }}>Last updated: 2026-03-14 21:00 UTC</div>
      </div>

      {/* Gauges Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {GAUGE_DEFS.map(def => {
          const g = gauges?.[def.key];
          if (!g) return (
            <div key={def.key} id={def.id} style={{ background: 'rgba(13,21,38,0.8)', border: '1px solid rgba(34,211,238,0.1)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
              <span style={{ color: '#334155', fontSize: '0.7rem' }}>Loading...</span>
            </div>
          );
          return (
            <div key={def.key} id={def.id} style={{ background: 'linear-gradient(135deg, #0d1526, #070c18)', border: `1px solid rgba(${g.status === 'critical' ? '239,68,68' : g.status === 'high' ? '249,115,22' : '234,179,8'},0.2)`, borderRadius: 12, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <SemiGauge
                value={g.value} max={g.max} label={g.label} unit={g.unit}
                status={g.status} sparkline={g.sparkline} size={130}
                showVoice={false}
              />
              <div style={{ fontSize: '0.58rem', color: '#64748b', lineHeight: 1.5, textAlign: 'center' }}>
                {def.desc}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.55rem', color: g.trend > 0 ? '#ef4444' : '#22c55e' }}>
                  {g.trend > 0 ? '▲' : '▼'} {Math.abs(g.trend)} vs prev month
                </div>
                <button
                  onClick={() => speak(`${g.label}: ${g.value} ${g.unit}. Status: ${g.status}. Trend: ${g.trend > 0 ? 'worsening' : 'improving'}. ${def.desc}`)}
                  style={{ background: 'none', border: 'none', color: '#475569', fontSize: '0.6rem', cursor: 'pointer' }}
                >
                  🔊
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
