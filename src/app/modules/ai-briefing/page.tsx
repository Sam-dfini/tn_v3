'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/lib/LangContext';

interface GaugeEntry {
  value: number;
  max: number;
  label: string;
  unit: string;
  status: 'critical' | 'high' | 'medium' | 'low';
  trend: number;
}

interface GaugesData {
  [key: string]: GaugeEntry;
}

export default function AIBriefingPage() {
  const { t, dir } = useLang();
  const [gauges, setGauges] = useState<GaugesData | null>(null);

  useEffect(() => {
    fetch('/data/gauges.json')
      .then(r => r.json())
      .then(setGauges)
      .catch(() => {});
  }, []);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  const buildBriefing = () => {
    if (!gauges) {
      return 'Tunisia intelligence briefing. Data is still loading.';
    }

    const rri = gauges['rri'] || gauges['p_revolution'];
    const youthRage = gauges['youth_rage'];
    const jobs = gauges['jobs'];
    const bct = gauges['bct_reserve'];
    const migrationTension = gauges['migration_tension'];
    const freedom = gauges['freedom'];

    const parts: string[] = [];
    parts.push('Tunisia Intelligence automated briefing, March 2026.');
    if (rri) {
      parts.push(
        `Revolutionary Risk Index at ${rri.value} ${rri.unit}, status ${rri.status}.`
      );
    }
    if (youthRage) {
      parts.push(
        `Youth Rage Index at ${youthRage.value}${youthRage.unit || ' points'}, status ${youthRage.status}, trend ${youthRage.trend > 0 ? 'worsening' : 'improving'}.`
      );
    }
    if (jobs) {
      parts.push(
        `Jobs and Employment: ${jobs.label} at ${jobs.value}${jobs.unit || '%'}.`
      );
    }
    if (bct) {
      parts.push(
        `Central Bank reserves at ${bct.value} ${bct.unit}, status ${bct.status}.`
      );
    }
    if (migrationTension) {
      parts.push(
        `Migration tension index at ${migrationTension.value}${migrationTension.unit || ''}, status ${migrationTension.status}.`
      );
    }
    if (freedom) {
      parts.push(
        `Freedom index at ${freedom.value}${freedom.unit || ''}, status ${freedom.status}.`
      );
    }

    parts.push('Overall outlook: elevated systemic risk with mounting social pressure and constrained economic buffers over the next 12 to 24 months.');
    return parts.join(' ');
  };

  const handleSpeak = () => {
    speak(buildBriefing());
  };

  const gaugeBadges = [
    { key: 'pRevolution', gaugeKey: 'p_revolution', color: '#ef4444', icon: '⏱️' },
    { key: 'youthRage', gaugeKey: 'youth_rage', color: '#f97316', icon: '💢' },
    { key: 'jobs', gaugeKey: 'jobs', color: '#eab308', icon: '🏭' },
    { key: 'bctReserve', gaugeKey: 'bct_reserve', color: '#22d3ee', icon: '🏦' },
    { key: 'migrationTension', gaugeKey: 'migration_tension', color: '#3b82f6', icon: '⛵' },
  ];

  return (
    <div dir={dir} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div>
          <h1
            style={{
              fontSize: '1.1rem',
              fontWeight: 800,
              color: '#22d3ee',
              margin: 0,
              fontFamily: 'Space Grotesk',
            }}
          >
            🤖 {t('aiBriefing')}
          </h1>
          <p style={{ fontSize: '0.65rem', color: '#475569', margin: '4px 0 0' }}>
            Automated daily briefing assembling key intelligence gauges into a concise spoken narrative.
          </p>
        </div>
        <button
          onClick={handleSpeak}
          style={{
            background: 'rgba(34,211,238,0.1)',
            border: '1px solid rgba(34,211,238,0.3)',
            borderRadius: 8,
            padding: '8px 16px',
            color: '#22d3ee',
            fontSize: '0.7rem',
            cursor: 'pointer',
          }}
        >
          🔊 {t('readAloud')}
        </button>
      </div>

      {/* Summary + key gauges snapshot */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 1.4fr) minmax(220px, 1fr)', gap: 16 }}>
        <div className="module-card" style={{ padding: 20 }}>
          <div style={{ fontSize: '0.6rem', color: '#22d3ee', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 10 }}>
            EXECUTIVE SUMMARY
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', lineHeight: 1.8, maxWidth: 760 }}>
            {gauges
              ? 'This briefing uses live gauge values to generate a synthetic human‑readable assessment. Use it to rapidly orient senior decision‑makers before deeper module analysis.'
              : 'Gauge data is still loading. Once available, an automated narrative will summarise systemic risk in real time.'}
          </div>
          <div style={{ marginTop: 12, padding: 10, borderRadius: 8, background: 'rgba(15,23,42,0.9)', border: '1px dashed rgba(34,211,238,0.3)' }}>
            <div style={{ fontSize: '0.58rem', color: '#64748b', marginBottom: 4 }}>AI‑GENERATED VOICE SCRIPT</div>
            <div style={{ fontSize: '0.66rem', color: '#e2e8f0', lineHeight: 1.7 }}>
              {buildBriefing()}
            </div>
          </div>
        </div>

        <div className="module-card" style={{ padding: 16 }}>
          <div style={{ fontSize: '0.6rem', color: '#f97316', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>
            KEY RISK SNAPSHOT
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {gaugeBadges.map(badge => {
              const g = gauges?.[badge.gaugeKey];
              return (
                <div
                  key={badge.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    borderRadius: 8,
                    background: 'rgba(15,23,42,0.9)',
                    border: `1px solid ${badge.color}33`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{badge.icon}</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.6rem', color: '#e2e8f0', fontWeight: 600 }}>
                        {t(badge.key)}
                      </span>
                      <span style={{ fontSize: '0.55rem', color: '#64748b' }}>
                        {g ? g.label : t('loading')}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: badge.color }}>
                      {g ? `${g.value}${g.unit || ''}` : '—'}
                    </div>
                    <div style={{ fontSize: '0.52rem', color: g ? (g.trend > 0 ? '#ef4444' : '#22c55e') : '#1e293b' }}>
                      {g
                        ? `${g.trend > 0 ? '▲' : '▼'} ${Math.abs(g.trend)} vs prev`
                        : t('noData')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 10, fontSize: '0.52rem', color: '#334155' }}>
            Last synchronisation is aligned with the main Gauges module. Use both views together for drill‑down analysis.
          </div>
        </div>
      </div>
    </div>
  );
}

