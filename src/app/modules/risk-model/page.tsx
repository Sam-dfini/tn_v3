'use client';
import { useLang } from '@/lib/LangContext';

const RISK_FACTORS = [
  { factor: 'Economic Collapse Risk', weight: 22, score: 88, drivers: ['BCT reserves critical','IMF tranche blocked','Youth unemployment 37.8%'] },
  { factor: 'Elite Defection Risk', weight: 18, score: 28, drivers: ['Military loyalty 78%','Technocrats disillusioned','Business class hedging'] },
  { factor: 'Mass Mobilisation', weight: 20, score: 71, drivers: ['Bread prices +45%','Youth rage 76%','UGTT strike threat'] },
  { factor: 'Security Apparatus Cohesion', weight: 15, score: 75, drivers: ['Police salary arrears','Interior overstretch','Regional protest density'] },
  { factor: 'External Pressure', weight: 10, score: 55, drivers: ['IMF conditionality','EU migration deal fragile','Gulf withdrawal risk'] },
  { factor: 'Opposition Coordination', weight: 8, score: 35, drivers: ['Leadership in prison','Diaspora divided','No unified platform'] },
  { factor: 'Information Environment', weight: 7, score: 62, drivers: ['Internet throttling','Social media suppression','Underground networks active'] },
];

const SCENARIOS = [
  { id: 'A', name: 'Managed Decline', prob: 40, color: '#eab308', desc: 'Regime survives through repression and selective patronage. Economy deteriorates slowly. No rupture within 27 months.', triggers: ['IMF deal reached','Gulf bailout','Continued repression'] },
  { id: 'B', name: 'Social Explosion', prob: 35, color: '#f97316', desc: 'Bread shortage triggers multi-city protests. Security forces fracture. Rapid political transition.', triggers: ['Bread price doubling','Military refusal to fire','Coordinated protests in 5+ cities'] },
  { id: 'C', name: 'Military Intervention', prob: 15, color: '#a78bfa', desc: 'Military seizes power in "stabilisation" coup. Transition council formed. Political prisoners released.', triggers: ['Saied health crisis','Economic free-fall','External actor backing'] },
  { id: 'D', name: 'IMF-led Recovery', prob: 7, color: '#22c55e', desc: 'Saied accepts IMF conditions. Economic stabilisation. Controlled opening. Slow democratic reversal.', triggers: ['IMF deal signed','Subsidy reform enacted','Gulf credit line'] },
  { id: 'E', name: 'Total State Collapse', prob: 3, color: '#ef4444', desc: 'Reserve depletion, state payroll failure, security vacuum. Libya-style fragmentation risk.', triggers: ['Reserve hits zero','Police mutiny','Simultaneous shocks'] },
];

export default function RiskModelPage() {
  const { dir } = useLang();

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(Object.assign(new SpeechSynthesisUtterance(text), { rate: 0.88 }));
    }
  };

  const compositeScore = Math.round(
    RISK_FACTORS.reduce((sum, f) => sum + (f.score * f.weight / 100), 0)
  );

  return (
    <div dir={dir} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#22d3ee', margin: 0, fontFamily: 'Space Grotesk' }}>
            ⚠️ POLITICAL RISK MODEL
          </h1>
          <p style={{ fontSize: '0.65rem', color: '#475569', margin: '4px 0 0' }}>
            Composite risk assessment · 7 weighted factors · 5 scenario projections · P(Revolution) = 64.3%
          </p>
        </div>
        <button onClick={() => speak(`Political Risk Model. Composite score ${compositeScore} out of 100. Probability of revolution 64.3 percent. Primary drivers: economic collapse risk 88 percent, mass mobilisation 71 percent. Most likely scenario: managed decline at 40 percent probability.`)}
          style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: 8, padding: '8px 16px', color: '#22d3ee', fontSize: '0.7rem', cursor: 'pointer' }}>
          🔊 Read Briefing
        </button>
      </div>

      {/* P(Revolution) Hero */}
      <div style={{ display: 'flex', gap: 16 }}>
        <div className="module-card glow-red" style={{ padding: '24px 32px', textAlign: 'center', flex: '0 0 auto' }}>
          <div style={{ fontSize: '0.6rem', color: '#ef4444', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 8 }}>P(REVOLUTION) — 27MO WINDOW</div>
          <div style={{ fontSize: '4rem', fontWeight: 900, color: '#ef4444', textShadow: '0 0 30px rgba(239,68,68,0.6)', fontFamily: 'Space Grotesk', lineHeight: 1 }}>
            64.3%
          </div>
          <div style={{ fontSize: '0.58rem', color: '#64748b', marginTop: 8 }}>Bayesian composite model · March 2026</div>
        </div>

        <div className="module-card" style={{ padding: '20px 24px', flex: 1 }}>
          <div style={{ fontSize: '0.6rem', color: '#475569', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 12 }}>COMPOSITE RISK SCORE</div>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: '#f97316', fontFamily: 'Space Grotesk', lineHeight: 1 }}>{compositeScore}<span style={{ fontSize: '1rem', color: '#475569' }}>/100</span></div>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#475569', marginBottom: 4 }}>
              <span>STABLE</span><span>LOW</span><span>MEDIUM</span><span>HIGH</span><span>CRITICAL</span>
            </div>
            <div style={{ height: 8, background: 'linear-gradient(90deg, #22c55e, #84cc16, #eab308, #f97316, #ef4444)', borderRadius: 4, position: 'relative' }}>
              <div style={{ position: 'absolute', top: -4, width: 16, height: 16, background: '#fff', borderRadius: '50%', border: '3px solid #f97316', boxShadow: '0 0 8px rgba(249,115,22,0.6)', left: `${compositeScore}%`, transform: 'translateX(-50%)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Risk Factors */}
      <div>
        <div style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 10 }}>WEIGHTED RISK FACTORS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {RISK_FACTORS.map(f => (
            <div key={f.factor} className="module-card" style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#e2e8f0' }}>{f.factor}</div>
                  <div style={{ fontSize: '0.55rem', color: '#475569' }}>Weight: {f.weight}%</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: f.score > 75 ? '#ef4444' : f.score > 55 ? '#f97316' : f.score > 35 ? '#eab308' : '#22c55e', fontFamily: 'Space Grotesk' }}>
                    {f.score}
                  </div>
                </div>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{ height: '100%', width: `${f.score}%`, background: f.score > 75 ? '#ef4444' : f.score > 55 ? '#f97316' : f.score > 35 ? '#eab308' : '#22c55e', borderRadius: 3, boxShadow: `0 0 6px ${f.score > 75 ? '#ef4444' : '#f97316'}66` }} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {f.drivers.map(d => (
                  <span key={d} style={{ fontSize: '0.52rem', color: '#64748b', background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: 4 }}>{d}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scenarios */}
      <div>
        <div style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 10 }}>SCENARIO PROBABILITY DISTRIBUTION</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
          {SCENARIOS.map(s => (
            <div key={s.id} style={{ background: 'linear-gradient(135deg, #0d1526, #070c18)', border: `1px solid ${s.color}33`, borderRadius: 10, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${s.color}22`, border: `1px solid ${s.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: s.color }}>
                  {s.id}
                </div>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#e2e8f0' }}>{s.name}</div>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color, fontFamily: 'Space Grotesk', textShadow: `0 0 12px ${s.color}55` }}>
                {s.prob}%
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, margin: '6px 0' }}>
                <div style={{ height: '100%', width: `${s.prob}%`, background: s.color, borderRadius: 2 }} />
              </div>
              <div style={{ fontSize: '0.55rem', color: '#64748b', lineHeight: 1.5, marginBottom: 8 }}>{s.desc}</div>
              <div style={{ fontSize: '0.52rem', color: '#334155', fontWeight: 600, marginBottom: 4 }}>TRIGGERS:</div>
              {s.triggers.map(tr => (
                <div key={tr} style={{ fontSize: '0.52rem', color: '#475569', marginBottom: 2 }}>• {tr}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
