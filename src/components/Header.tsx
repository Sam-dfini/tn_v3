'use client';
import { useLang } from '@/lib/LangContext';

export default function Header() {
  const { t, dir } = useLang();

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <header
      dir={dir}
      style={{
        background: 'linear-gradient(180deg, #070c18 0%, #0a0f1c 100%)',
        borderBottom: '1px solid rgba(34,211,238,0.15)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Left: Title */}
      <div>
        <h1
          className="glow-cyan-text"
          style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            color: '#22d3ee',
            letterSpacing: '0.06em',
            margin: 0,
            fontFamily: 'Space Grotesk, Inter, sans-serif',
          }}
        >
          {t('appTitle')} <span style={{ color: '#475569', fontWeight: 400, fontSize: '0.75rem' }}>· March 2026</span>
        </h1>
        <p style={{ fontSize: '0.65rem', color: '#475569', margin: 0, letterSpacing: '0.05em' }}>
          {t('appSubtitle')}
        </p>
      </div>

      {/* Center: Live indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className="pulse-dot pulse-red" style={{ width: 6, height: 6 }} />
          <span style={{ fontSize: '0.6rem', color: '#ef4444', fontWeight: 700, letterSpacing: '0.1em' }}>LIVE FEED</span>
        </div>
        <div style={{ fontSize: '0.6rem', color: '#334155', display: 'flex', gap: 12 }}>
          <span>⚠️ <span style={{ color: '#f97316' }}>12 CRITICAL</span></span>
          <span>📍 <span style={{ color: '#22d3ee' }}>24 GOV</span></span>
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button
          onClick={() => speak(`Tunisia Intel version 2.0. Political Risk Intelligence Platform. March 2026. Revolutionary Risk Index: 27 months. Probability of Revolution: 64.3 percent. BCT reserves at 88 days. Situation is critical.`)}
          style={{
            background: 'rgba(34,211,238,0.1)',
            border: '1px solid rgba(34,211,238,0.3)',
            borderRadius: 6,
            padding: '4px 10px',
            color: '#22d3ee',
            fontSize: '0.65rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          🔊 Briefing
        </button>
        <div style={{
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 6,
          padding: '4px 10px',
          color: '#ef4444',
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
        }}>
          P(REV) 64.3%
        </div>
      </div>
    </header>
  );
}
