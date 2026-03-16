'use client';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/LangContext';

interface ShortageItem {
  id: string; name: string; nameAr: string; nameFr: string;
  severity: string; severityScore: number; blackMarketPremium: number;
  priceStrike: boolean; daysStock: number; unit: string;
  officialPrice: number | null; blackPrice: number | null;
  trend: string; note?: string;
}
interface ShortageData { updated: string; overall_index: number; items: ShortageItem[]; }

export default function EconomyPage() {
  const { t, dir } = useLang();
  const [data, setData] = useState<ShortageData | null>(null);

  useEffect(() => {
    fetch('/data/economy-shortages.json').then(r => r.json()).then(setData).catch(() => {});
  }, []);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(Object.assign(new SpeechSynthesisUtterance(text), { rate: 0.88 }));
    }
  };

  const severityColor = (s: string) => s === 'critical' ? '#ef4444' : s === 'high' ? '#f97316' : '#eab308';

  const ecoIndicators = [
    { label: 'GDP Growth', value: '-1.2%', color: '#ef4444', sub: '2025 actual' },
    { label: 'Inflation', value: '9.8%', color: '#f97316', sub: 'March 2026' },
    { label: 'USD/TND', value: '3.42', color: '#ef4444', sub: 'Central rate' },
    { label: 'Current Account', value: '-8.1%', color: '#ef4444', sub: '% of GDP' },
    { label: 'Public Debt', value: '83% GDP', color: '#f97316', sub: '2025' },
    { label: 'IMF Tranche', value: 'DELAYED', color: '#ef4444', sub: 'USD 1.9B blocked' },
    { label: 'Tourism Revenue', value: '+18%', color: '#22c55e', sub: 'YoY (bright spot)' },
    { label: 'Remittances', value: 'USD 2.8B', color: '#22d3ee', sub: 'Annual diaspora' },
  ];

  return (
    <div dir={dir} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#22d3ee', margin: 0, fontFamily: 'Space Grotesk' }}>
            💹 ECONOMY MODULE
          </h1>
          <p style={{ fontSize: '0.65rem', color: '#475569', margin: '4px 0 0' }}>
            Macroeconomic indicators, essential goods shortages & black market data · March 2026
          </p>
        </div>
        <button onClick={() => speak('Tunisia Economy Module. GDP contracted 1.2 percent. Inflation at 9.8 percent. Dinar at 3.42 per US Dollar. IMF tranche delayed. Critical shortages in 8 essential goods categories.')}
          style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: 8, padding: '8px 16px', color: '#22d3ee', fontSize: '0.7rem', cursor: 'pointer' }}>
          🔊 Read Briefing
        </button>
      </div>

      {/* Macro Indicators */}
      <div>
        <div style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 10 }}>MACROECONOMIC INDICATORS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          {ecoIndicators.map(ind => (
            <div key={ind.label} className="stat-card" style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: ind.color, fontFamily: 'Space Grotesk', textShadow: `0 0 10px ${ind.color}44` }}>
                {ind.value}
              </div>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8', marginTop: 2 }}>{ind.label}</div>
              <div style={{ fontSize: '0.55rem', color: '#475569', marginTop: 1 }}>{ind.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Shortage Index */}
      {data && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444', textShadow: '0 0 15px rgba(239,68,68,0.5)', fontFamily: 'Space Grotesk' }}>{data.overall_index}</div>
            <div style={{ fontSize: '0.55rem', color: '#64748b', letterSpacing: '0.06em' }}>SHORTAGE INDEX</div>
          </div>
          <div style={{ width: 1, height: 40, background: 'rgba(239,68,68,0.3)' }} />
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ef4444' }}>CRITICAL — Essential Goods Crisis</div>
            <div style={{ fontSize: '0.6rem', color: '#64748b', marginTop: 3 }}>8 essential commodities in shortage · 3 in price strike · Updated {data.updated}</div>
          </div>
          <button onClick={() => speak(`Overall goods shortage index: ${data.overall_index} out of 100. Critical status. 8 essential commodities affected.`)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#475569', fontSize: '0.7rem', cursor: 'pointer' }}>🔊</button>
        </div>
      )}

      {/* Shortage Table */}
      <div className="module-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(34,211,238,0.1)', background: 'rgba(34,211,238,0.03)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#22d3ee', letterSpacing: '0.08em' }}>🛒 ESSENTIAL GOODS SHORTAGE TRACKER</div>
          <div style={{ fontSize: '0.58rem', color: '#475569', marginTop: 2 }}>Real-time shortage severity · Black market premium · Days of stock remaining</div>
        </div>

        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 1fr', gap: 0, padding: '8px 16px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(34,211,238,0.08)' }}>
          {['Commodity', 'Severity', 'Black Market +%', 'Price Strike', 'Days Stock', 'Trend'].map(h => (
            <div key={h} style={{ fontSize: '0.55rem', color: '#334155', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>

        {data?.items.map((item, i) => (
          <div key={item.id} style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 1fr',
            gap: 0,
            padding: '10px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.03)',
            background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#e2e8f0', fontWeight: 500 }}>{item.name}</div>
              {item.note && <div style={{ fontSize: '0.52rem', color: '#f97316', marginTop: 2 }}>{item.note}</div>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: severityColor(item.severity), flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, color: severityColor(item.severity) }}>{item.severity.toUpperCase()}</div>
                <div style={{ width: Math.min(80, item.severityScore * 0.8), height: 3, background: severityColor(item.severity), borderRadius: 2, marginTop: 2, opacity: 0.6 }} />
              </div>
            </div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: item.blackMarketPremium > 80 ? '#ef4444' : item.blackMarketPremium > 40 ? '#f97316' : '#eab308' }}>
              +{item.blackMarketPremium}%
            </div>
            <div>
              {item.priceStrike ? (
                <span style={{ fontSize: '0.55rem', background: 'rgba(239,68,68,0.15)', color: '#ef4444', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>⚡ YES</span>
              ) : (
                <span style={{ fontSize: '0.55rem', color: '#334155' }}>No</span>
              )}
            </div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: item.daysStock <= 4 ? '#ef4444' : item.daysStock <= 7 ? '#f97316' : '#eab308' }}>
              {item.daysStock}d
            </div>
            <div style={{ fontSize: '0.6rem', color: item.trend === 'critical' ? '#ef4444' : item.trend === 'worsening' ? '#f97316' : '#eab308' }}>
              {item.trend === 'critical' ? '🔴' : item.trend === 'worsening' ? '🟠' : '🟡'} {item.trend}
            </div>
          </div>
        ))}
      </div>

      {/* BCT and IMF note */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="module-card" style={{ padding: 16 }}>
          <div style={{ fontSize: '0.65rem', color: '#f59e0b', fontWeight: 700, marginBottom: 8 }}>🏦 BCT FOREIGN RESERVES</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'Space Grotesk', textShadow: '0 0 15px rgba(245,158,11,0.4)' }}>88 days</div>
          <div style={{ fontSize: '0.6rem', color: '#64748b', marginTop: 4 }}>Import cover remaining · IMF threshold: 90 days</div>
          <div style={{ marginTop: 10, padding: '6px 10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6 }}>
            <div style={{ fontSize: '0.6rem', color: '#ef4444' }}>⚠️ Below IMF minimum threshold. Capital flight risk if dinar continues to weaken.</div>
          </div>
        </div>
        <div className="module-card" style={{ padding: 16 }}>
          <div style={{ fontSize: '0.65rem', color: '#22d3ee', fontWeight: 700, marginBottom: 8 }}>🏛️ IMF PROGRAMME STATUS</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444', fontFamily: 'Space Grotesk' }}>STALLED</div>
          <div style={{ fontSize: '0.6rem', color: '#64748b', marginTop: 4 }}>USD 1.9B Extended Fund Facility · Tranche 3 delayed since Nov 2025</div>
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: '0.6rem', color: '#94a3b8', marginBottom: 4 }}>Key conditions unmet:</div>
            {['Fuel subsidy reform', 'SOE restructuring', 'Wage bill reduction'].map(c => (
              <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
                <span style={{ fontSize: '0.58rem', color: '#64748b' }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
