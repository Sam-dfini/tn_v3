'use client'; 
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useLang } from '@/lib/LangContext';
import SemiGauge from '@/components/gauges/SemiGauge';
import SensorGrid from '@/components/SensorGrid'; // adjust path if needed
import TunisiaMap from '@/components/TunisiaMap';




export default function Dashboard() {
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* LEFT SENSOR GRID - NEW */}
      <div className="w-80 border-r border-cyan-500/30 p-4 overflow-y-auto">
        <SensorGrid />
      </div>

      {/* CENTER MAP + everything else you already have */}
      <div className="flex-1 flex flex-col">
        {/* Your existing map and top bar stay here */}
      </div>
      {/* Inside your dashboard layout */}
      <div className="flex-1 relative h-full">
      <TunisiaMap />
      </div>
      
      {/* RIGHT ALERTS PANEL (we'll add next) */}
    </div>
  );
}



interface GaugeData {
  [key: string]: {
    value: number; max: number; label: string; unit: string;
    status: 'critical' | 'high' | 'medium' | 'low';
    trend: number; sparkline: number[];
  };
}

interface Event {
  id: number;
  date: string;
  title: string;
  type: string;
  severity: string;
  gov: string;
  lat: number;
  lng: number;
}

interface ShortageItem {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  severity: string;
  severityScore: number;
  blackMarketPremium: number;
  priceStrike: boolean;
  daysStock: number;
  unit: string;
  officialPrice: number | null;
  blackPrice: number | null;
  trend: string;
  note?: string;
}

interface ShortageData {
  updated: string;
  overall_index: number;
  items: ShortageItem[];
}

interface Party {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  alignment: 'pro-gov' | 'center' | 'opposition';
  influence: number;
  seats: number;
  founded: number;
  leader: string;
  description: string;
  color: string;
  size: number;
}

const SENSOR_GAUGES = [
  { key: 'rri', labelKey: 'rri', display: 'RRI 2.31', href: '/modules/risk-model' },
  { key: 'pRevolution', labelKey: 'pRevolution', display: 'P(REV) 64.3%', href: '/modules/risk-model' },
  { key: 'bct_reserve', labelKey: 'bctReserve', display: 'BCT 88 days', href: '/modules/gauges#bct' },
  { key: 'happiness', labelKey: 'happiness', display: 'Happiness 34%', href: '/modules/gauges#happiness' },
  { key: 'freedom', labelKey: 'freedom', display: 'Freedom 28%', href: '/modules/gauges#freedom' },
  { key: 'jobs', labelKey: 'jobs', display: 'Jobs 41%', href: '/modules/gauges#jobs' },
  { key: 'public_safety', labelKey: 'publicSafety', display: 'Public Safety 54%', href: '/modules/gauges#safety' },
  { key: 'road_accidents', labelKey: 'roadAccidents', display: 'Road Accidents', href: '/modules/gauges#road' },
  { key: 'suicide_rate', labelKey: 'suicideRate', display: 'Suicide Rate', href: '/modules/gauges#suicide' },
  { key: 'water_stress', labelKey: 'waterStress', display: 'Water Stress', href: '/modules/gauges#water' },
  { key: 'desertification', labelKey: 'desertification', display: 'Desertification', href: '/modules/gauges#desertification' },
  { key: 'forest_fire', labelKey: 'forestFire', display: 'Forest Fire', href: '/modules/gauges#forestfire' },
  { key: 'co2', labelKey: 'co2', display: 'CO₂ Emissions', href: '/modules/gauges#co2' },
  { key: 'env_risk', labelKey: 'envRisk', display: 'Environmental Risk', href: '/modules/gauges#envrisk' },
  { key: 'elite_loyalty', labelKey: 'eliteLoyalty', display: 'Elite Loyalty', href: '/modules/gauges#elite' },
  { key: 'youth_rage', labelKey: 'youthRage', display: 'Youth Rage', href: '/modules/gauges#youth' },
  { key: 'phosphate_blockade', labelKey: 'phosphateBlockade', display: 'Phosphate Blockade', href: '/modules/gauges#phosphate' },
  { key: 'migration_tension', labelKey: 'migrationTension', display: 'Migration Tension', href: '/modules/gauges#migration' },
];

const HIGH_ALERT_TYPES = ['critical', 'high'];

type OverlayId =
  | 'social_unrest'
  | 'economic_crisis'
  | 'labor_actions'
  | 'security_incidents'
  | 'infrastructure'
  | 'environment'
  | 'health'
  | 'political'
  | 'safety'
  | 'national'
  | 'coastal'
  | 'interior'
  | 'migration'
  | 'water'
  | 'forest_fire'
  | 'critical'
  | 'high'
  | 'medium'
  | 'economic_shock_recent'
  | 'drought_agriculture'
  | 'youth_risk'
  | 'energy_stress'
  | 'osint_signal';

interface OverlayDef {
  id: OverlayId;
  label: string;
  short: string;
  filter: (ev: Event) => boolean;
}

const OVERLAYS: OverlayDef[] = [
  { id: 'social_unrest', label: 'Social Unrest & Protests', short: 'SOC', filter: (ev: Event) => ['social', 'labor', 'security'].includes(ev.type) },
  { id: 'economic_crisis', label: 'Macro-Economic Stress', short: 'ECO', filter: (ev: Event) => ev.type === 'economic' },
  { id: 'labor_actions', label: 'Strikes & Labor Actions', short: 'LAB', filter: (ev: Event) => ev.type === 'labor' },
  { id: 'security_incidents', label: 'Security Incidents', short: 'SEC', filter: (ev: Event) => ev.type === 'security' },
  { id: 'infrastructure', label: 'Infrastructure & Power', short: 'INF', filter: (ev: Event) => ev.type === 'infrastructure' },
  { id: 'environment', label: 'Environment & Water', short: 'ENV', filter: (ev: Event) => ev.type === 'environment' },
  { id: 'health', label: 'Health System Stress', short: 'HLT', filter: (ev: Event) => ev.type === 'health' },
  { id: 'political', label: 'Political Repression & Moves', short: 'POL', filter: (ev: Event) => ev.type === 'political' },
  { id: 'safety', label: 'Public Safety & Accidents', short: 'SAFE', filter: (ev: Event) => ev.type === 'safety' },
  { id: 'national', label: 'National-Level Indicators', short: 'NAT', filter: (ev: Event) => ev.gov === 'National' },
  { id: 'coastal', label: 'Coastal Corridor', short: 'SEA', filter: (ev: Event) => ['Sfax', 'Sousse', 'Medenine'].includes(ev.gov) },
  { id: 'interior', label: 'Interior Hotspots', short: 'INT', filter: (ev: Event) => ['Kasserine', 'Sidi Bouzid', 'Kairouan', 'Beja', 'Gafsa', 'Jendouba'].includes(ev.gov) },
  { id: 'migration', label: 'Migration & Transit', short: 'MIGR', filter: (ev: Event) => ev.title.toLowerCase().includes('migration') || ev.type === 'security' },
  { id: 'water', label: 'Water Stress & Rationing', short: 'WATR', filter: (ev: Event) => ev.title.toLowerCase().includes('water') || ev.title.toLowerCase().includes('drought') },
  { id: 'forest_fire', label: 'Forest Fire Risk', short: 'FIRE', filter: (ev: Event) => ev.title.toLowerCase().includes('fire') },
  { id: 'critical', label: 'Critical Severity Only', short: 'CRIT', filter: (ev: Event) => ev.severity === 'critical' },
  { id: 'high', label: 'High Severity Only', short: 'HIGH', filter: (ev: Event) => ev.severity === 'high' },
  { id: 'medium', label: 'Medium Severity Only', short: 'MED', filter: (ev: Event) => ev.severity === 'medium' },
  { id: 'economic_shock_recent', label: 'Recent Economic Shocks', short: 'ΔECO', filter: (ev: Event) => ev.type === 'economic' && Number(ev.id) <= 12 },
  { id: 'drought_agriculture', label: 'Drought & Agriculture', short: 'AGR', filter: (ev: Event) => ev.title.toLowerCase().includes('agricultural output') || ev.title.toLowerCase().includes('drought') },
  { id: 'youth_risk', label: 'Youth Despair Signals', short: 'YTH', filter: (ev: Event) => ev.title.toLowerCase().includes('youth') || ev.title.toLowerCase().includes('suicide') },
  { id: 'energy_stress', label: 'Energy & Fuel Stress', short: 'ENER', filter: (ev: Event) => ev.title.toLowerCase().includes('power') || ev.title.toLowerCase().includes('lpg') },
  { id: 'osint_signal', label: 'Key OSINT Signals', short: 'SIG', filter: (ev: Event) => ['economic', 'political', 'security'].includes(ev.type) && ev.severity !== 'low' },
];

export default function HomePage() {
  const { t, dir } = useLang();
  const [gauges, setGauges] = useState<GaugeData | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [rriData, setRriData] = useState<{ current: number; series: { month: string; value: number }[] } | null>(null);
  const [shortages, setShortages] = useState<ShortageData | null>(null);
  const [parties, setParties] = useState<Party[]>([]);
  const [showBoot, setShowBoot] = useState(true);
  const [now, setNow] = useState<Date | null>(null);
  const [sensorModal, setSensorModal] = useState<{ title: string; href: string } | null>(null);
  const [showEconomyModal, setShowEconomyModal] = useState(false);
  const [showPartiesModal, setShowPartiesModal] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const [activeOverlays, setActiveOverlays] = useState<Record<OverlayId, boolean>>(() => {
    const all: Partial<Record<OverlayId, boolean>> = {};
    OVERLAYS.forEach((o: OverlayDef) => {
      all[o.id] = true;
    });
    return all as Record<OverlayId, boolean>;
  });

  useEffect(() => {
    fetch('/data/gauges.json').then(r => r.json()).then(setGauges).catch(() => {});
    fetch('/data/events.json').then(r => r.json()).then(setEvents).catch(() => {});
    fetch('/data/rri-series.json').then(r => r.json()).then(setRriData).catch(() => {});
    fetch('/data/economy-shortages.json').then(r => r.json()).then(setShortages).catch(() => {});
    fetch('/data/political-parties.json').then(r => r.json()).then(setParties).catch(() => {});
  }, []);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setShowBoot(false), 4500);
    return () => clearTimeout(id);
  }, []);

  // Initialize Leaflet map once
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current || events.length === 0) return;
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      const L = (window as any).L;
      if (!mapRef.current || leafletMapRef.current) return;
      const map = L.map(mapRef.current, {
        center: [33.886917, 9.537499],
        zoom: 6,
        zoomControl: true,
        attributionControl: false,
      });
      leafletMapRef.current = { map, L };
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);
      markersLayerRef.current = L.layerGroup().addTo(map);
    };
    if (!(window as any).L) {
      document.head.appendChild(script);
    } else {
      script.onload(new Event('load'));
    }
  }, [events]);

  // Update markers when events or overlays change
  useEffect(() => {
    if (!leafletMapRef.current || !markersLayerRef.current) return;
    const { L } = leafletMapRef.current;
    const layer = markersLayerRef.current;
    layer.clearLayers();

    const anyActive = OVERLAYS.some(o => activeOverlays[o.id]);

    events.forEach((ev: Event) => {
      const visible =
        anyActive &&
        OVERLAYS.some(o => activeOverlays[o.id] && o.filter(ev));
      if (!visible) return;
      const color =
        ev.severity === 'critical'
          ? '#ef4444'
          : ev.severity === 'high'
          ? '#f97316'
          : '#eab308';
      const marker = L.circleMarker([ev.lat, ev.lng], {
        radius: ev.severity === 'critical' ? 8 : 6,
        fillColor: color,
        color,
        weight: 1,
        opacity: 0.9,
        fillOpacity: 0.6,
      });
      marker
        .addTo(layer)
        .bindPopup(
          `<div style="background:#0d1526;color:#e2e8f0;padding:8px;border-radius:6px;font-size:12px;border:1px solid rgba(34,211,238,0.2)"><strong style="color:#22d3ee">${ev.gov}</strong><br>${ev.title}<br><small style="color:#ef4444">${ev.severity.toUpperCase()}</small></div>`,
        );
    });
  }, [events, activeOverlays]);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  };

  const highAlertEvents = events.filter((ev: Event) => HIGH_ALERT_TYPES.includes(ev.severity)).slice(0, 5);

  if (showBoot) {
    return (
      <div
        dir={dir}
        className="boot-screen"
      >
        <div className="boot-inner">
          <div className="boot-title">
            <span className="boot-prefix">[CLASSIFIED]</span> SYSTEM BOOT SEQUENCE v2.0.4
          </div>
          <div className="boot-line">{'>'} Initializing TUNISIA INTEL core modules...</div>
          <div className="boot-line">{'>'} Loading geospatial engine............... OK</div>
          <div className="boot-line">{'>'} Mounting OSINT data streams............. OK</div>
          <div className="boot-line">{'>'} Compiling Revolutionary Risk Index...... OK</div>
          <div className="boot-line">{'>'} Checking gauge integrity (18/18)........ OK</div>
          <div className="boot-status">
            SYSTEM NOMINAL · MARCH 2026 · ACCESS LEVEL: <span className="boot-classified">CLASSIFIED</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir={dir} style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* TOP BAR: STATUS STRIP */}
      <div
        className="module-card"
        style={{
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderLeft: '3px solid #22d3ee',
          fontSize: '0.62rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '0.7rem', color: '#22d3ee' }}>
            TUNISIA INTEL v2.0
          </span>
          <span style={{ padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', fontFamily: 'Space Grotesk, monospace' }}>
            CLASSIFIED
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ color: '#64748b' }}>
            🕒 UTC {now ? now.toISOString().substring(11, 19) : '--:--:--'}
          </span>
          <span style={{ color: '#22c55e' }}>📡 SOURCES 14/14</span>
          <span style={{ color: '#ef4444', fontWeight: 700 }}>
            ⚠ HIGH ALERT
          </span>
        </div>
      </div>

      {/* MAIN GRID: SENSOR GRID · MAP · ALERTS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '260px minmax(0, 1.7fr) 320px',
          gap: 14,
          alignItems: 'stretch',
        }}
      >
        {/* SENSOR GRID */}
        <div className="module-card" style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: '0.6rem', color: '#64748b', letterSpacing: '0.12em', fontWeight: 700 }}>
              SENSOR GRID · 18 LIVE
            </span>
            <span style={{ fontSize: '0.55rem', color: gauges ? '#22d3ee' : '#334155' }}>
              {gauges ? 'Click for module popup' : 'Loading gauges...'}
            </span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 6,
            }}
          >
            {SENSOR_GAUGES.map(sensor => {
              const g = gauges?.[sensor.key];
              const statusClass =
                g?.status === 'critical'
                  ? 'bg-severity-critical'
                  : g?.status === 'high'
                  ? 'bg-severity-high'
                  : g?.status === 'medium'
                  ? 'bg-severity-medium'
                  : 'bg-severity-low';
              return (
                <button
                  key={sensor.key}
                  onClick={() => gauges && setSensorModal({ title: t(sensor.labelKey), href: sensor.href })}
                  style={{
                    borderRadius: 8,
                    border: '1px solid rgba(34,211,238,0.15)',
                    padding: '6px 8px',
                    background: 'rgba(7,12,24,0.95)',
                    textAlign: 'left',
                    cursor: gauges ? 'pointer' : 'default',
                  }}
                  className={statusClass}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <span style={{ fontSize: '0.6rem', color: '#e2e8f0', fontWeight: 600 }}>
                      {sensor.display}
                    </span>
                    <span style={{ fontSize: '0.55rem', color: '#64748b' }}>
                      {g ? `${g.value}${g.unit || ''}` : '—'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.52rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t(sensor.labelKey)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CENTRAL MAP */}
        <div className="module-card" style={{ padding: 0, overflow: 'hidden', position: 'relative', minHeight: 460 }}>
          <div
            style={{
              padding: '10px 16px',
              borderBottom: '1px solid rgba(34,211,238,0.1)',
              background: 'linear-gradient(90deg, rgba(34,211,238,0.08), transparent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#22d3ee', letterSpacing: '0.1em' }}>
                🌍 {t('geoTitle')}
              </div>
              <div style={{ fontSize: '0.58rem', color: '#475569', marginTop: 2 }}>
                Tunisia + MENA overlay · 23 map layers · Events · Migration · Protests · Environment
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: 260 }}>
              {OVERLAYS.map((ol: OverlayDef) => {
                const active = activeOverlays[ol.id];
                return (
                  <button
                    key={ol.id}
                    onClick={() =>
                      setActiveOverlays((prev: Record<OverlayId, boolean>) => ({
                        ...prev,
                        [ol.id]: !prev[ol.id],
                      }))
                    }
                    title={ol.label}
                    style={{
                      background: active ? 'rgba(34,211,238,0.18)' : 'rgba(15,23,42,0.9)',
                      border: active
                        ? '1px solid rgba(34,211,238,0.7)'
                        : '1px solid rgba(34,211,238,0.25)',
                      borderRadius: 4,
                      padding: '1px 6px',
                      color: active ? '#22d3ee' : '#64748b',
                      fontSize: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontFamily: 'Space Grotesk, monospace',
                    }}
                  >
                    {ol.short}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ position: 'relative', height: 420, width: '100%', background: '#070c18' }}>
            {!events.length && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  color: '#475569',
                }}
              >
                Loading live events map...
              </div>
            )}
            <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
          </div>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}>
            {[80, 130, 180, 230].map((s, i) => (
              <div
                key={i}
                className="geo-circle"
                style={{
                  width: s,
                  height: s,
                  top: -s / 2,
                  left: -s / 2,
                  animationDelay: `${i}s`,
                  borderColor: `rgba(34,211,238,${0.25 - i * 0.05})`,
                }}
              />
            ))}
          </div>
          <div className="scanner-line" style={{ top: 60 }} />
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              background: 'rgba(7,12,24,0.85)',
              border: '1px solid rgba(34,211,238,0.2)',
              borderRadius: 6,
              padding: '5px 9px',
              fontSize: '0.52rem',
              color: '#94a3b8',
              maxWidth: 260,
            }}
          >
            <div style={{ marginBottom: 2, letterSpacing: '0.06em', color: '#64748b' }}>LEGEND</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[['#ef4444', 'Protest / Riot'], ['#f97316', 'Economic Shock'], ['#eab308', 'Tension'], ['#22c55e', 'Stabilising']].map(
                ([c, l]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: c as string }} />
                    <span>{l}</span>
                  </div>
                ),
              )}
            </div>
            {!events.length && (
              <div style={{ marginTop: 4, fontSize: '0.5rem', color: '#475569' }}>Waiting for event stream...</div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: HIGH ALERTS + OSINT STREAM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="module-card" style={{ padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: '0.6rem', color: '#ef4444', fontWeight: 700, letterSpacing: '0.08em' }}>
                ⚠ HIGH ALERT SIGNALS
              </span>
              <span style={{ fontSize: '0.55rem', color: '#64748b' }}>{highAlertEvents.length} / {events.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 170, overflowY: 'auto' }}>
            {highAlertEvents.map((ev: Event) => (
                <div
                  key={ev.id}
                  style={{
                    padding: '6px 8px',
                    borderRadius: 8,
                    background: 'rgba(15,23,42,0.95)',
                    border: `1px solid ${ev.severity === 'critical' ? '#ef4444' : '#f97316'}55`,
                    fontSize: '0.55rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ color: '#64748b' }}>{ev.date}</span>
                    <span style={{ color: ev.severity === 'critical' ? '#ef4444' : '#f97316', fontWeight: 700 }}>
                      {ev.severity.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ color: '#e2e8f0', marginBottom: 1 }}>{ev.title}</div>
                  <div style={{ color: '#475569' }}>📍 {ev.gov}</div>
                </div>
              ))}
              {highAlertEvents.length === 0 && (
                <div style={{ fontSize: '0.55rem', color: '#334155' }}>No critical signals in the last window.</div>
              )}
            </div>
          </div>

          <div className="module-card" style={{ padding: 12, flex: 1, minHeight: 180 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: '0.6rem', color: '#22d3ee', fontWeight: 700, letterSpacing: '0.08em' }}>
                🌐 OSINT STREAM
              </span>
              <Link
                href="/modules/resources"
                style={{ fontSize: '0.55rem', color: '#22d3ee', textDecoration: 'none' }}
              >
                View sources →
              </Link>
            </div>
            <div style={{ fontSize: '0.58rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Live aggregation of open sources: local media, social feeds, economic bulletins and diplomatic cables.
              Use module popups and dedicated pages for full analytical context.
            </div>
            <div style={{ marginTop: 8, fontSize: '0.52rem', color: '#64748b' }}>
              Tip: trigger the AI briefing module or click any sensor in the grid for focused decision support.
            </div>
            <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Link href="/modules/ai-briefing" style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    padding: '5px 9px',
                    borderRadius: 6,
                    background: 'rgba(34,211,238,0.08)',
                    border: '1px solid rgba(34,211,238,0.3)',
                    fontSize: '0.55rem',
                    color: '#22d3ee',
                  }}
                >
                  🤖 Launch AI Briefing
                </div>
              </Link>
              <button
                type="button"
                onClick={() => shortages && setShowEconomyModal(true)}
                style={{
                  padding: '5px 9px',
                  borderRadius: 6,
                  background: shortages ? 'rgba(239,68,68,0.08)' : 'rgba(15,23,42,0.7)',
                  border: shortages ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(51,65,85,0.7)',
                  fontSize: '0.55rem',
                  color: shortages ? '#ef4444' : '#64748b',
                  cursor: shortages ? 'pointer' : 'default',
                }}
              >
                🛒 Goods Shortages
              </button>
              <button
                type="button"
                onClick={() => parties.length && setShowPartiesModal(true)}
                style={{
                  padding: '5px 9px',
                  borderRadius: 6,
                  background: parties.length ? 'rgba(34,197,94,0.08)' : 'rgba(15,23,42,0.7)',
                  border: parties.length ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(51,65,85,0.7)',
                  fontSize: '0.55rem',
                  color: parties.length ? '#22c55e' : '#64748b',
                  cursor: parties.length ? 'pointer' : 'default',
                }}
              >
                🏛️ Parties Map
              </button>
              <Link href="/modules/timeline" style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    padding: '5px 9px',
                    borderRadius: 6,
                    background: 'rgba(15,23,42,0.9)',
                    border: '1px solid rgba(148,163,184,0.4)',
                    fontSize: '0.55rem',
                    color: '#94a3b8',
                  }}
                >
                  📅 View Timeline
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* GAUGES SNAPSHOT */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <div style={{ fontSize: '0.62rem', color: '#475569', fontWeight: 700, letterSpacing: '0.1em' }}>
            📊 LIVE INTELLIGENCE GAUGES (SNAPSHOT)
          </div>
          <Link href="/modules/gauges" style={{ fontSize: '0.6rem', color: '#22d3ee', textDecoration: 'none' }}>
            Open all 18 →
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 10 }}>
          {gauges &&
            [
              { g: gauges.bct_reserve, label: 'BCT Reserve' },
              { g: gauges.freedom, label: 'Freedom' },
              { g: gauges.youth_rage, label: 'Youth Rage' },
              { g: gauges.phosphate_blockade, label: 'Phosphate' },
              { g: gauges.jobs, label: 'Jobs Risk' },
              { g: gauges.happiness, label: 'Happiness' },
            ].map((item, i) =>
              item.g ? (
                <SemiGauge
                  key={i}
                  value={item.g.value}
                  max={item.g.max}
                  label={item.g.label || item.label}
                  unit={item.g.unit}
                  status={item.g.status as 'critical' | 'high' | 'medium' | 'low'}
                  sparkline={item.g.sparkline || []}
                  size={110}
                />
              ) : null,
            )}
        </div>
      </div>

      {/* NEWS TICKER */}
      <div className="ticker-container">
        <div className="ticker-label">BREAKING</div>
        <div className="ticker-track">
          {events.length ? (
            <div className="ticker-inner">
              {events.slice(0, 20).map((ev: Event) => (
                <span key={ev.id} className="ticker-item">
                  [{ev.severity.toUpperCase()}] {ev.date} · {ev.gov} · {ev.title}
                </span>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '0.6rem', color: '#fecaca', whiteSpace: 'nowrap' }}>
              No breaking events yet · Waiting for OSINT feed...
            </div>
          )}
        </div>
      </div>

      {/* SENSOR POPUP (LIGHTWEIGHT) */}
      {sensorModal && (
        <div
          className="sensor-modal-overlay"
          onClick={() => setSensorModal(null)}
        >
          <div
            className="sensor-modal"
            onClick={(e: any) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: '0.7rem', color: '#22d3ee', fontWeight: 700 }}>{sensorModal.title}</div>
              <button
                onClick={() => setSensorModal(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ fontSize: '0.6rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: 10 }}>
              This is a quick-look popup for the selected sensor. Use the dedicated module for full historical charts,
              model settings and scenario analysis.
            </div>
            <Link href={sensorModal.href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  padding: '6px 10px',
                  borderRadius: 6,
                  background: 'rgba(34,211,238,0.12)',
                  border: '1px solid rgba(34,211,238,0.4)',
                  fontSize: '0.6rem',
                  color: '#22d3ee',
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                Open full module →
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* ECONOMY SHORTAGE POPUP */}
      {showEconomyModal && shortages && (
        <div
          className="sensor-modal-overlay"
          onClick={() => setShowEconomyModal(false)}
        >
          <div
            className="sensor-modal"
            style={{ width: 620, maxWidth: 'calc(100% - 32px)', maxHeight: '80vh', overflowY: 'auto' }}
            onClick={(e: any) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#22d3ee', fontWeight: 700, letterSpacing: '0.08em' }}>
                  🛒 ESSENTIAL GOODS SHORTAGES
                </div>
                <div style={{ fontSize: '0.58rem', color: '#64748b', marginTop: 2 }}>
                  Live shortage index & black market premiums · Updated {shortages.updated}
                </div>
              </div>
              <button
                onClick={() => setShowEconomyModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                }}
              >
                ✕
              </button>
            </div>

            {/* Overall index */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ef4444', textShadow: '0 0 14px rgba(239,68,68,0.5)', fontFamily: 'Space Grotesk' }}>
                  {shortages.overall_index}
                </div>
                <div style={{ fontSize: '0.55rem', color: '#64748b', letterSpacing: '0.08em' }}>SHORTAGE INDEX</div>
              </div>
              <div style={{ width: 1, height: 36, background: 'rgba(239,68,68,0.4)' }} />
              <div style={{ fontSize: '0.6rem', color: '#94a3b8', lineHeight: 1.6 }}>
                Elevated risk of **essential goods crisis**. Index above 60 indicates widespread multi‑commodity disruption and
                heavy reliance on informal supply chains.
              </div>
            </div>

            {/* Compact table */}
            <div
              style={{
                borderRadius: 8,
                border: '1px solid rgba(34,211,238,0.2)',
                overflow: 'hidden',
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.6fr 1fr 1fr 1fr',
                  padding: '6px 10px',
                  background: 'rgba(15,23,42,0.95)',
                  borderBottom: '1px solid rgba(15,23,42,0.9)',
                }}
              >
                {['Commodity', 'Severity', 'Black +%', 'Days'].map((h: string) => (
                  <div
                    key={h}
                    style={{ fontSize: '0.55rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.08em' }}
                  >
                    {h}
                  </div>
                ))}
              </div>
              {shortages.items.map((item: ShortageItem, idx: number) => {
                const sevColor =
                  item.severity === 'critical'
                    ? '#ef4444'
                    : item.severity === 'high'
                    ? '#f97316'
                    : '#eab308';
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.6fr 1fr 1fr 1fr',
                      padding: '6px 10px',
                      fontSize: '0.58rem',
                      alignItems: 'center',
                      background: idx % 2 === 0 ? 'rgba(15,23,42,0.85)' : 'rgba(15,23,42,0.9)',
                      borderBottom: '1px solid rgba(15,23,42,0.8)',
                    }}
                  >
                    <div>
                      <div style={{ color: '#e2e8f0' }}>{item.name}</div>
                      {item.note && (
                        <div style={{ color: '#f97316', fontSize: '0.5rem', marginTop: 1 }}>
                          {item.note}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: sevColor,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ color: sevColor, fontWeight: 700 }}>
                        {item.severity.toUpperCase()}
                      </span>
                    </div>
                    <div
                      style={{
                        color:
                          item.blackMarketPremium > 80
                            ? '#ef4444'
                            : item.blackMarketPremium > 40
                            ? '#f97316'
                            : '#eab308',
                        fontWeight: 700,
                      }}
                    >
                      +{item.blackMarketPremium}%
                    </div>
                    <div
                      style={{
                        color: item.daysStock <= 4 ? '#ef4444' : item.daysStock <= 7 ? '#f97316' : '#eab308',
                        fontWeight: 700,
                      }}
                    >
                      {item.daysStock}d
                    </div>
                  </div>
                );
              })}
            </div>

            <Link href="/modules/economy" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  marginTop: 4,
                  padding: '6px 10px',
                  borderRadius: 6,
                  background: 'rgba(34,211,238,0.1)',
                  border: '1px solid rgba(34,211,238,0.4)',
                  fontSize: '0.6rem',
                  color: '#22d3ee',
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                Open full Economy module →
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* POLITICAL PARTIES POPUP */}
      {showPartiesModal && parties.length > 0 && (
        <div
          className="sensor-modal-overlay"
          onClick={() => setShowPartiesModal(false)}
        >
          <div
            className="sensor-modal"
            style={{ width: 680, maxWidth: 'calc(100% - 32px)', maxHeight: '80vh', overflowY: 'auto' }}
            onClick={(e: any) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#22d3ee', fontWeight: 700, letterSpacing: '0.08em' }}>
                  🏛️ POLITICAL PARTIES LANDSCAPE
                </div>
                <div style={{ fontSize: '0.58rem', color: '#64748b', marginTop: 2 }}>
                  Pro‑Gov (green) · Center/Swing (yellow) · Opposition (red)
                </div>
              </div>
              <button
                onClick={() => setShowPartiesModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                }}
              >
                ✕
              </button>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 8 }}>
              {[['#22c55e', 'Pro‑Gov'], ['#eab308', 'Center / Swing'], ['#ef4444', 'Opposition']].map(
                ([c, l]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: c as string }} />
                    <span style={{ fontSize: '0.58rem', color: '#94a3b8' }}>{l}</span>
                  </div>
                ),
              )}
            </div>

            {/* Treemap-style mini map */}
            <div
              style={{
                marginBottom: 10,
                padding: 14,
                borderRadius: 10,
                border: '1px solid rgba(34,211,238,0.15)',
                background: 'rgba(7,12,24,0.9)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                minHeight: 140,
              }}
            >
              {parties
                .slice()
                .sort((a: Party, b: Party) => b.influence - a.influence)
                .map((p: Party) => {
                  const alignColor =
                    p.alignment === 'pro-gov'
                      ? '#22c55e'
                      : p.alignment === 'opposition'
                      ? '#ef4444'
                      : '#eab308';
                  const baseWidth = Math.max(80, p.influence * 4);
                  return (
                    <div
                      key={p.id}
                      style={{
                        width: baseWidth,
                        minHeight: 70,
                        borderRadius: 8,
                        border: `1px solid ${alignColor}44`,
                        background: `${alignColor}12`,
                        padding: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        cursor: 'default',
                      }}
                    >
                      <div style={{ fontSize: '0.6rem', color: '#e2e8f0', fontWeight: 600, lineHeight: 1.3 }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '0.55rem', color: alignColor, fontWeight: 700, marginTop: 2 }}>
                        ⬤ {p.influence}% influence
                      </div>
                      <div style={{ fontSize: '0.5rem', color: '#64748b', marginTop: 2 }}>
                        Leader: {p.leader}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Detail list */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
              {parties.map((p: Party) => {
                const alignColor =
                  p.alignment === 'pro-gov'
                    ? '#22c55e'
                    : p.alignment === 'opposition'
                    ? '#ef4444'
                    : '#eab308';
                const alignLabel =
                  p.alignment === 'pro-gov'
                    ? 'PRO‑GOV'
                    : p.alignment === 'opposition'
                    ? 'OPPOSITION'
                    : 'CENTER';
                return (
                  <div
                    key={p.id}
                    className="module-card"
                    style={{
                      padding: 10,
                      borderLeft: `3px solid ${alignColor}`,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: 4,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.65rem', color: '#e2e8f0', fontWeight: 700 }}>{p.name}</div>
                        <div style={{ fontSize: '0.52rem', color: '#64748b', marginTop: 1 }}>
                          Founded {p.founded} · {p.seats} seats
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '0.52rem',
                          padding: '2px 6px',
                          borderRadius: 10,
                          background: `${alignColor}22`,
                          color: alignColor,
                          fontWeight: 700,
                        }}
                      >
                        {alignLabel}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.54rem', color: '#94a3b8', lineHeight: 1.4, marginBottom: 4 }}>
                      {p.description}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.52rem',
                        color: '#64748b',
                      }}
                    >
                      <span>
                        Leader: <span style={{ color: '#cbd5f5' }}>{p.leader}</span>
                      </span>
                      <span style={{ fontWeight: 700, color: alignColor }}>⬤ {p.influence}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link href="/modules/actors" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  marginTop: 8,
                  padding: '6px 10px',
                  borderRadius: 6,
                  background: 'rgba(34,211,238,0.1)',
                  border: '1px solid rgba(34,211,238,0.4)',
                  fontSize: '0.6rem',
                  color: '#22d3ee',
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                Open full Actors & Parties module →
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
