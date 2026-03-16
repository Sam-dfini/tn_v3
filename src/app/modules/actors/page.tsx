'use client';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/LangContext';

interface Actor { id: string; name: string; role: string; faction: string; influence: number; loyalty: number | null; threat: string; bio: string; risk: string; }
interface Party { id: string; name: string; alignment: string; influence: number; leader: string; description: string; color: string; size: number; seats: number; founded: number; }

export default function ActorsPage() {
  const { dir } = useLang();
  const [actors, setActors] = useState<Actor[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [activeTab, setActiveTab] = useState<'actors' | 'parties'>('actors');

  useEffect(() => {
    fetch('/data/actors.json').then(r => r.json()).then(setActors).catch(() => {});
    fetch('/data/political-parties.json').then(r => r.json()).then(setParties).catch(() => {});
  }, []);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(Object.assign(new SpeechSynthesisUtterance(text), { rate: 0.88 }));
    }
  };

  const factionColor = (f: string) => ({ Executive: '#22d3ee', Security: '#a78bfa', Opposition: '#ef4444', Labor: '#f59e0b', State: '#06b6d4', International: '#3b82f6' }[f] || '#64748b');
  const alignColor = (a: string) => a === 'pro-gov' ? '#22c55e' : a === 'opposition' ? '#ef4444' : '#eab308';

  // Simple treemap-style layout for parties
  const totalInfluence = parties.reduce((s, p) => s + p.influence, 0);

  return (
    <div dir={dir} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#22d3ee', margin: 0, fontFamily: 'Space Grotesk' }}>
            👥 KEY ACTORS & POLITICAL PARTIES
          </h1>
          <p style={{ fontSize: '0.65rem', color: '#475569', margin: '4px 0 0' }}>
            Power mapping · Loyalty indices · Threat assessments · Party landscape
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['actors', 'parties'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: activeTab === tab ? 'rgba(34,211,238,0.15)' : 'transparent', border: `1px solid ${activeTab === tab ? 'rgba(34,211,238,0.4)' : 'rgba(34,211,238,0.1)'}`, borderRadius: 6, padding: '6px 14px', color: activeTab === tab ? '#22d3ee' : '#475569', fontSize: '0.65rem', cursor: 'pointer', fontWeight: 600 }}>
              {tab === 'actors' ? '👤 Actors' : '🏛️ Parties'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'actors' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          {actors.map(actor => (
            <div key={actor.id} className="module-card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e2e8f0' }}>{actor.name}</div>
                  <div style={{ fontSize: '0.6rem', color: '#64748b', marginTop: 2 }}>{actor.role}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: '0.55rem', background: `${factionColor(actor.faction)}22`, color: factionColor(actor.faction), padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>{actor.faction}</span>
                  <button onClick={() => speak(`${actor.name}. ${actor.role}. ${actor.bio} Risk: ${actor.risk}`)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '0.7rem' }}>🔊</button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.55rem', color: '#475569', marginBottom: 3 }}>INFLUENCE</div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${actor.influence}%`, background: '#22d3ee', borderRadius: 3 }} />
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#22d3ee', fontWeight: 700, marginTop: 2 }}>{actor.influence}%</div>
                </div>
                {actor.loyalty !== null && (
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.55rem', color: '#475569', marginBottom: 3 }}>LOYALTY</div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                      <div style={{ height: '100%', width: `${actor.loyalty}%`, background: actor.loyalty > 70 ? '#22c55e' : actor.loyalty > 40 ? '#eab308' : '#ef4444', borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: '0.65rem', color: actor.loyalty > 70 ? '#22c55e' : '#eab308', fontWeight: 700, marginTop: 2 }}>{actor.loyalty}%</div>
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.55rem', color: '#475569', marginBottom: 3 }}>THREAT</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: actor.threat === 'high' ? '#ef4444' : actor.threat === 'medium' ? '#f97316' : '#22c55e', textTransform: 'uppercase' }}>{actor.threat}</div>
                </div>
              </div>
              <div style={{ fontSize: '0.6rem', color: '#64748b', lineHeight: 1.5, marginBottom: 8 }}>{actor.bio}</div>
              <div style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 6 }}>
                <span style={{ fontSize: '0.55rem', color: '#f97316' }}>⚠️ Risk: </span>
                <span style={{ fontSize: '0.58rem', color: '#64748b' }}>{actor.risk}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'parties' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, padding: '8px 0' }}>
            {[['#22c55e', 'Pro-Government'], ['#eab308', 'Centrist / Swing'], ['#ef4444', 'Opposition']].map(([c, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: c }} />
                <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>{l}</span>
              </div>
            ))}
          </div>

          {/* Treemap-style party grid */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '16px', background: 'rgba(7,12,24,0.8)', border: '1px solid rgba(34,211,238,0.1)', borderRadius: 12, minHeight: 200 }}>
            {parties.sort((a, b) => b.influence - a.influence).map(party => {
              const area = (party.influence / totalInfluence) * 100;
              const minW = Math.max(80, area * 8);
              return (
                <div key={party.id} style={{ width: minW, minHeight: 80, background: `${alignColor(party.alignment)}18`, border: `1px solid ${alignColor(party.alignment)}44`, borderRadius: 8, padding: '8px', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.border = `1px solid ${alignColor(party.alignment)}99`; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 12px ${alignColor(party.alignment)}33`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.border = `1px solid ${alignColor(party.alignment)}44`; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
                  onClick={() => speak(`${party.name}. ${party.description} Leader: ${party.leader}.`)}
                >
                  <div style={{ fontSize: '0.58rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 2, lineHeight: 1.3 }}>{party.name}</div>
                  <div style={{ fontSize: '0.55rem', color: alignColor(party.alignment), fontWeight: 600 }}>Influence: {party.influence}%</div>
                  <div style={{ fontSize: '0.52rem', color: '#475569', marginTop: 2 }}>{party.leader}</div>
                </div>
              );
            })}
          </div>

          {/* Party Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
            {parties.map(party => (
              <div key={party.id} className="module-card" style={{ padding: '12px 14px', borderLeft: `3px solid ${alignColor(party.alignment)}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#e2e8f0' }}>{party.name}</div>
                    <div style={{ fontSize: '0.55rem', color: '#64748b', marginTop: 1 }}>Founded {party.founded} · {party.seats} seats</div>
                  </div>
                  <span style={{ fontSize: '0.55rem', background: `${alignColor(party.alignment)}22`, color: alignColor(party.alignment), padding: '2px 8px', borderRadius: 10, fontWeight: 700, flexShrink: 0 }}>
                    {party.alignment === 'pro-gov' ? 'PRO-GOV' : party.alignment === 'opposition' ? 'OPPOSITION' : 'CENTER'}
                  </span>
                </div>
                <div style={{ fontSize: '0.58rem', color: '#94a3b8', lineHeight: 1.4, marginBottom: 6 }}>{party.description}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.55rem', color: '#475569' }}>Leader: <span style={{ color: '#94a3b8' }}>{party.leader}</span></div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: alignColor(party.alignment) }}>⬤ {party.influence}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
