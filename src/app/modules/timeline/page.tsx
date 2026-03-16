'use client';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/LangContext';

interface Event { id: number; date: string; title: string; type: string; severity: string; gov: string; lat: number; lng: number; }

const TYPE_COLORS: Record<string, string> = {
  social: '#a78bfa', economic: '#22d3ee', labor: '#f59e0b', security: '#ef4444',
  political: '#f97316', environment: '#22c55e', infrastructure: '#64748b', health: '#ec4899', safety: '#fb923c',
};

export default function TimelinePage() {
  const { dir } = useLang();
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetch('/data/events.json').then(r => r.json()).then(setEvents).catch(() => {});
  }, []);

  const types = ['all', ...Array.from(new Set(events.map(e => e.type)))];
  const filtered = filter === 'all' ? events : events.filter(e => e.type === filter);

  return (
    <div dir={dir} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#22d3ee', margin: 0, fontFamily: 'Space Grotesk' }}>📅 EVENT TIMELINE</h1>
        <p style={{ fontSize: '0.65rem', color: '#475569', margin: '4px 0 0' }}>112 tracked events · Classified by type and severity · March 2026</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {types.map(type => (
          <button key={type} onClick={() => setFilter(type)} style={{ background: filter === type ? (TYPE_COLORS[type] || '#22d3ee') + '22' : 'rgba(255,255,255,0.03)', border: `1px solid ${filter === type ? (TYPE_COLORS[type] || '#22d3ee') + '66' : 'rgba(255,255,255,0.08)'}`, borderRadius: 20, padding: '4px 12px', color: filter === type ? (TYPE_COLORS[type] || '#22d3ee') : '#64748b', fontSize: '0.6rem', cursor: 'pointer', fontWeight: 600, textTransform: 'capitalize' }}>
            {type}
          </button>
        ))}
      </div>

      {/* Severity summary */}
      <div style={{ display: 'flex', gap: 12 }}>
        {['critical', 'high', 'medium', 'low'].map(sev => {
          const count = filtered.filter(e => e.severity === sev).length;
          const c = sev === 'critical' ? '#ef4444' : sev === 'high' ? '#f97316' : sev === 'medium' ? '#eab308' : '#22c55e';
          return (
            <div key={sev} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: `${c}11`, border: `1px solid ${c}33`, borderRadius: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: c }}>{count}</span>
              <span style={{ fontSize: '0.6rem', color: '#64748b', textTransform: 'capitalize' }}>{sev}</span>
            </div>
          );
        })}
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: 32 }}>
        <div style={{ position: 'absolute', left: 12, top: 0, bottom: 0, width: 1, background: 'rgba(34,211,238,0.15)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((ev, i) => {
            const c = ev.severity === 'critical' ? '#ef4444' : ev.severity === 'high' ? '#f97316' : ev.severity === 'medium' ? '#eab308' : '#22c55e';
            const tc = TYPE_COLORS[ev.type] || '#64748b';
            return (
              <div key={ev.id} style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: -26, top: 10, width: 10, height: 10, borderRadius: '50%', background: c, boxShadow: `0 0 8px ${c}66`, border: `2px solid ${c}44` }} />
                <div className="module-card" style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: '0.55rem', color: '#475569' }}>{ev.date}</span>
                        <span style={{ fontSize: '0.5rem', background: `${tc}22`, color: tc, padding: '1px 6px', borderRadius: 10, fontWeight: 600, textTransform: 'capitalize' }}>{ev.type}</span>
                        <span style={{ fontSize: '0.5rem', background: `${c}18`, color: c, padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>{ev.severity.toUpperCase()}</span>
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#e2e8f0', fontWeight: 500, lineHeight: 1.3 }}>{ev.title}</div>
                      <div style={{ fontSize: '0.55rem', color: '#475569', marginTop: 3 }}>📍 {ev.gov}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
