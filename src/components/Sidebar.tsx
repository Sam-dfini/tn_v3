'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '@/lib/LangContext';

const CORE_MODULES = [
  { key: 'map', href: '/', icon: '🗺️' },
  { key: 'economy', href: '/modules/economy', icon: '💹' },
  { key: 'riskModel', href: '/modules/risk-model', icon: '⚠️' },
  { key: 'actors', href: '/modules/actors', icon: '👥' },
  { key: 'narratives', href: '/modules/narratives', icon: '📡' },
  { key: 'cases', href: '/modules/cases', icon: '📂' },
  { key: 'suspects', href: '/modules/suspects', icon: '🔍' },
  { key: 'govRisk', href: '/modules/gov-risk', icon: '🏛️' },
  { key: 'predict', href: '/modules/predict', icon: '🔮' },
  { key: 'simulator', href: '/modules/simulator', icon: '🎮' },
  { key: 'energy', href: '/modules/energy', icon: '⚡' },
  { key: 'timeline', href: '/modules/timeline', icon: '📅' },
  { key: 'elections', href: '/modules/elections', icon: '🗳️' },
  { key: 'media', href: '/modules/media', icon: '📺' },
  { key: 'companies', href: '/modules/companies', icon: '🏢' },
  { key: 'methodology', href: '/modules/methodology', icon: '🔬' },
  { key: 'resources', href: '/modules/resources', icon: '📚' },
  { key: 'geoAlign', href: '/modules/geo-align', icon: '🌍' },
  { key: 'gameTheory', href: '/modules/game-theory', icon: '♟️' },
  { key: 'compliance', href: '/modules/compliance', icon: '✅' },
];

const GAUGE_MODULES = [
  { key: 'happiness', href: '/modules/gauges#happiness', icon: '😊' },
  { key: 'populationPressure', href: '/modules/gauges#population', icon: '👶' },
  { key: 'waterStress', href: '/modules/gauges#water', icon: '💧' },
  { key: 'freedom', href: '/modules/gauges#freedom', icon: '⛓️' },
  { key: 'economicLiberty', href: '/modules/gauges#economic-liberty', icon: '💰' },
  { key: 'jobs', href: '/modules/gauges#jobs', icon: '🏭' },
  { key: 'publicSafety', href: '/modules/gauges#safety', icon: '🚨' },
  { key: 'bctReserve', href: '/modules/gauges#bct', icon: '🏦' },
  { key: 'youthRage', href: '/modules/gauges#youth', icon: '🔥' },
  { key: 'phosphateBlockade', href: '/modules/gauges#phosphate', icon: '⛏️' },
  { key: 'eliteLoyalty', href: '/modules/gauges#elite', icon: '🎖️' },
  { key: 'migrationTension', href: '/modules/gauges#migration', icon: '⛵' },
];

const INTEL_MODULES = [
  { key: 'jobTreemap', href: '/modules/job-treemap', icon: '📊' },
  { key: 'migration', href: '/modules/migration', icon: '🌊' },
  { key: 'aiBriefing', href: '/modules/ai-briefing', icon: '🤖' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { t, lang, setLang, dir } = useLang();

  return (
    <aside
      dir={dir}
      style={{
        width: 220,
        minWidth: 220,
        background: '#070c18',
        borderRight: dir === 'rtl' ? 'none' : '1px solid rgba(34,211,238,0.1)',
        borderLeft: dir === 'rtl' ? '1px solid rgba(34,211,238,0.1)' : 'none',
        height: '100vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '16px 12px', borderBottom: '1px solid rgba(34,211,238,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div className="pulse-dot" style={{ background: '#ef4444' }} />
          <span style={{ fontSize: '0.65rem', color: '#ef4444', fontWeight: 700, letterSpacing: '0.1em' }}>LIVE</span>
        </div>
        <div style={{ fontSize: '0.7rem', color: '#22d3ee', fontWeight: 700, letterSpacing: '0.08em' }}>
          TUNISIA INTEL v2.0
        </div>
        <div style={{ fontSize: '0.6rem', color: '#475569', marginTop: 2 }}>March 2026</div>
      </div>

      {/* Language Switch */}
      <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(34,211,238,0.08)', display: 'flex', gap: 4 }}>
        {(['en', 'fr', 'ar'] as const).map(l => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              flex: 1,
              padding: '4px 0',
              fontSize: '0.65rem',
              fontWeight: 600,
              borderRadius: 4,
              border: 'none',
              cursor: 'pointer',
              background: lang === l ? '#22d3ee' : 'rgba(34,211,238,0.08)',
              color: lang === l ? '#0a0f1c' : '#64748b',
              transition: 'all 0.2s',
            }}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Core Modules */}
      <div style={{ padding: '8px 0' }}>
        <div style={{ padding: '4px 12px 6px', fontSize: '0.58rem', color: '#334155', fontWeight: 700, letterSpacing: '0.12em' }}>
          {t('coreModules')}
        </div>
        {CORE_MODULES.map(m => (
          <Link key={m.key} href={m.href} className={`sidebar-item ${pathname === m.href ? 'active' : ''}`}>
            <span>{m.icon}</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t(m.key)}</span>
          </Link>
        ))}
      </div>

      {/* Gauge Modules */}
      <div style={{ padding: '8px 0', borderTop: '1px solid rgba(34,211,238,0.08)' }}>
        <div style={{ padding: '4px 12px 6px', fontSize: '0.58rem', color: '#334155', fontWeight: 700, letterSpacing: '0.12em' }}>
          {t('gauges')}
        </div>
        {GAUGE_MODULES.map(m => (
          <Link key={m.key} href={m.href} className={`sidebar-item ${pathname === m.href ? 'active' : ''}`}>
            <span>{m.icon}</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t(m.key)}</span>
          </Link>
        ))}
      </div>

      {/* Intel Modules */}
      <div style={{ padding: '8px 0', borderTop: '1px solid rgba(34,211,238,0.08)' }}>
        <div style={{ padding: '4px 12px 6px', fontSize: '0.58rem', color: '#334155', fontWeight: 700, letterSpacing: '0.12em' }}>
          {t('intelligence')}
        </div>
        {INTEL_MODULES.map(m => (
          <Link key={m.key} href={m.href} className={`sidebar-item ${pathname === m.href ? 'active' : ''}`}>
            <span>{m.icon}</span>
            <span>{t(m.key)}</span>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'auto', padding: '12px', borderTop: '1px solid rgba(34,211,238,0.08)' }}>
        <div style={{ fontSize: '0.55rem', color: '#1e293b', textAlign: 'center', lineHeight: 1.6 }}>
          TUNISIAINTEL © 2026<br />
          <span style={{ color: '#22d3ee' }}>CONFIDENTIAL</span>
        </div>
      </div>
    </aside>
  );
}
