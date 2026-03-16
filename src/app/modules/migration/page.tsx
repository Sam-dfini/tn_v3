'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/lib/LangContext';

interface Destination {
  country: string;
  flag: string;
  residents: number;
  pct: number;
  trend: 'rising' | 'stable' | 'falling';
  year_change: number;
}

interface AgeGroup {
  group: string;
  pct: number;
  risk: string;
}

interface IrregularRoute {
  route: string;
  volume_annual: number;
  risk: 'critical' | 'high' | 'medium' | 'low';
  fatality_rate_pct: number;
}

interface MigrationData {
  diaspora_total: number;
  net_annual_outflow: number;
  transit_sfax: number;
  updated: string;
  destinations: Destination[];
  age_groups: AgeGroup[];
  irregular_routes: IrregularRoute[];
}

export default function MigrationPage() {
  const { dir } = useLang();
  const [data, setData] = useState<MigrationData | null>(null);

  useEffect(() => {
    fetch('/data/migration-flows.json')
      .then(r => r.json())
      .then(setData)
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

  if (!data) {
    return (
      <div dir={dir} style={{ padding: 40, color: '#475569', textAlign: 'center' }}>
        Loading migration intelligence...
      </div>
    );
  }

  const criticalRoutes = data.irregular_routes.filter(r => r.risk === 'critical' || r.risk === 'high');
  const youthShare = data.age_groups
    .filter(a => a.group.startsWith('18') || a.group.startsWith('25'))
    .reduce((s, a) => s + a.pct, 0);

  const readSummary = () => {
    const topDest = data.destinations[0];
    const summary = `Tunisia migration briefing. Total diaspora ${data.diaspora_total.toLocaleString()} people. ` +
      `Net annual outflow ${data.net_annual_outflow.toLocaleString()} Tunisians per year. ` +
      `Transit migrants in Sfax approximately ${data.transit_sfax.toLocaleString()}. ` +
      `Top destination is ${topDest.country} with ${topDest.residents.toLocaleString()} residents, trend ${topDest.trend}. ` +
      `${youthShare}% of migrants are aged 18 to 34, classified as brain drain. ` +
      `${criticalRoutes.length} irregular sea routes are at high or critical risk, with fatality rates up to ${Math.max(...criticalRoutes.map(r => r.fatality_rate_pct))} percent.`;
    speak(summary);
  };

  const maxResidents = Math.max(...data.destinations.map(d => d.residents));
  const maxAnnualVolume = Math.max(...data.irregular_routes.map(r => r.volume_annual));

  const riskColor = (risk: IrregularRoute['risk']) =>
    risk === 'critical' ? '#ef4444' :
    risk === 'high' ? '#f97316' :
    risk === 'medium' ? '#eab308' : '#22c55e';

  const trendColor = (trend: Destination['trend']) =>
    trend === 'rising' ? '#ef4444' :
    trend === 'falling' ? '#22c55e' : '#64748b';

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
            🌊 MIGRATION FLOWS MODULE
          </h1>
          <p style={{ fontSize: '0.65rem', color: '#475569', margin: '4px 0 0' }}>
            Strategic migration intelligence · Diaspora, brain drain and irregular routes · Updated {data.updated}
          </p>
        </div>
        <button
          onClick={readSummary}
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
          🔊 Read Migration Briefing
        </button>
      </div>

      {/* Top stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 12,
        }}
      >
        <div className="module-card" style={{ padding: 14 }}>
          <div style={{ fontSize: '0.6rem', color: '#22d3ee', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 6 }}>
            🌍 DIASPORA SIZE
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#22d3ee', fontFamily: 'Space Grotesk' }}>
            {(data.diaspora_total / 1_000_000).toFixed(1)}M
          </div>
          <div style={{ fontSize: '0.58rem', color: '#64748b' }}>
            Tunisians abroad · anchor of remittances and political influence
          </div>
        </div>
        <div className="module-card" style={{ padding: 14 }}>
          <div style={{ fontSize: '0.6rem', color: '#f97316', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 6 }}>
            ↗ NET ANNUAL OUTFLOW
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#f97316', fontFamily: 'Space Grotesk' }}>
            {Math.round(data.net_annual_outflow / 1000)}k
          </div>
          <div style={{ fontSize: '0.58rem', color: '#64748b' }}>
            Estimated net migrants per year leaving Tunisia
          </div>
        </div>
        <div className="module-card" style={{ padding: 14 }}>
          <div style={{ fontSize: '0.6rem', color: '#ef4444', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 6 }}>
            🚢 TRANSIT SFAX
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ef4444', fontFamily: 'Space Grotesk' }}>
            {(data.transit_sfax / 1000).toFixed(0)}k
          </div>
          <div style={{ fontSize: '0.58rem', color: '#64748b' }}>
            Transit migrants concentrated in Sfax coastal corridor
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(260px, 320px) minmax(0, 1fr)',
          gap: 18,
        }}
      >
        {/* Left column: age + risk narrative */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="module-card" style={{ padding: 14 }}>
            <div style={{ fontSize: '0.6rem', color: '#a78bfa', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 10 }}>
              🧠 AGE PROFILE · BRAIN DRAIN
            </div>
            {data.age_groups.map(g => (
              <div key={g.group} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: '0.58rem', color: '#94a3b8' }}>{g.group}</span>
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, color: g.risk === 'brain drain' ? '#ef4444' : '#eab308' }}>
                    {g.pct}%
                  </span>
                </div>
                <div style={{ height: 6, background: 'rgba(15,23,42,0.9)', borderRadius: 4 }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${g.pct}%`,
                      borderRadius: 4,
                      background: g.risk === 'brain drain'
                        ? 'linear-gradient(90deg,#a855f7,#ef4444)'
                        : 'linear-gradient(90deg,#22c55e,#eab308)',
                    }}
                  />
                </div>
                <div style={{ fontSize: '0.52rem', color: '#475569', marginTop: 2 }}>
                  {g.risk === 'brain drain'
                    ? 'High-value human capital loss'
                    : 'Lower structural risk segment'}
                </div>
              </div>
            ))}
          </div>

          <div className="module-card" style={{ padding: 14 }}>
            <div style={{ fontSize: '0.6rem', color: '#22d3ee', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>
              🧮 STRATEGIC ASSESSMENT
            </div>
            <div style={{ fontSize: '0.62rem', color: '#94a3b8', lineHeight: 1.7 }}>
              Tunisia is simultaneously an origin, transit and to a lesser extent destination country for migration flows.
              Youth outflow of {youthShare}% of migrants aged 18–34 constitutes a structural brain drain, directly linked to
              unemployment, repression and lack of prospects. Irregular routes from Sfax and Zarzis are under intense European
              pressure, raising the risk of human rights violations and episodic local unrest.
            </div>
          </div>
        </div>

        {/* Right column: destinations + irregular routes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Destinations list */}
          <div className="module-card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: '0.6rem', color: '#22d3ee', fontWeight: 700, letterSpacing: '0.08em' }}>
                🌐 TOP DIASPORA DESTINATIONS
              </div>
              <div style={{ fontSize: '0.55rem', color: '#475569' }}>
                Total: {data.diaspora_total.toLocaleString()} residents
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {data.destinations.map(dest => (
                <div
                  key={dest.country}
                  style={{
                    padding: '6px 8px',
                    borderRadius: 8,
                    background: 'rgba(15,23,42,0.9)',
                    border: '1px solid rgba(34,211,238,0.08)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '1rem' }}>{dest.flag}</span>
                      <span style={{ fontSize: '0.62rem', color: '#e2e8f0', fontWeight: 600 }}>{dest.country}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '0.6rem', color: trendColor(dest.trend), fontWeight: 600 }}>
                        {dest.trend === 'rising' ? 'Rising' : dest.trend === 'falling' ? 'Falling' : 'Stable'}
                      </span>
                      <span style={{ fontSize: '0.6rem', color: '#64748b' }}>
                        +{dest.year_change.toLocaleString()}/y
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: '0.58rem', color: '#94a3b8' }}>
                      {dest.residents.toLocaleString()} residents
                    </span>
                    <span style={{ fontSize: '0.58rem', color: '#94a3b8' }}>{dest.pct}% of diaspora</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(15,23,42,0.95)', borderRadius: 4 }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${(dest.residents / maxResidents) * 100}%`,
                        borderRadius: 4,
                        background: 'linear-gradient(90deg,#22d3ee,#3b82f6)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Irregular routes */}
          <div className="module-card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: '0.6rem', color: '#ef4444', fontWeight: 700, letterSpacing: '0.08em' }}>
                🚨 IRREGULAR SEA ROUTES
              </div>
              <div style={{ fontSize: '0.55rem', color: '#475569' }}>
                {criticalRoutes.length} high-risk routes monitored
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.irregular_routes.map(route => (
                <div
                  key={route.route}
                  style={{
                    padding: '6px 8px',
                    borderRadius: 8,
                    background: 'rgba(15,23,42,0.9)',
                    border: `1px solid ${riskColor(route.risk)}33`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.6rem', color: '#e2e8f0', fontWeight: 600 }}>
                      {route.route}
                    </span>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, color: riskColor(route.risk) }}>
                      {route.risk.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: '0.58rem', color: '#94a3b8' }}>
                      {(route.volume_annual / 1000).toFixed(1)}k departures / year
                    </span>
                    <span style={{ fontSize: '0.58rem', color: '#94a3b8' }}>
                      Fatality {route.fatality_rate_pct}%
                    </span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(15,23,42,0.95)', borderRadius: 4, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${(route.volume_annual / maxAnnualVolume) * 100}%`,
                        background: riskColor(route.risk),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

