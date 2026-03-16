'use client';
import { useLang } from '@/lib/LangContext';
import Link from 'next/link';

const MODULE_INFO: Record<string, {icon:string;title:string;desc:string;content:string}> = {
  simulator: {icon:'🎮',title:'SCENARIO SIMULATOR',desc:'Run crisis scenarios and model outcomes',content:'The Scenario Simulator allows analysts to adjust key variables (BCT reserve level, UGTT action, external support) and model probabilistic outcomes. Select parameters below to run a simulation. Current baseline: P(Revolution) = 64.3% over 27 months.'},
  cases: {icon:'📂',title:'CASE FILES',desc:'Documented incidents and investigations',content:'Active case files: 47 open investigations. 12 high-priority cases. Cases include: bread distribution corruption, police brutality incidents, media censorship orders, illegal detention documentation, and cross-border financial flows.'},
  suspects: {icon:'🔍',title:'SUSPECT PROFILES',desc:'Persons of interest and watch list',content:'This module contains sensitive profiles of persons of interest. Access restricted to authorised analysts. 28 active profiles. Categories: regime insiders, financial actors, informants, external agents.'},
  media: {icon:'📺',title:'MEDIA LANDSCAPE',desc:'Press freedom, outlets, censorship tracking',content:'Tunisia ranks 118/180 on the Press Freedom Index (RSF 2025). 8 journalists currently detained. State media (Wataniya, TAP) fully controlled. Independent outlets operating under self-censorship. Social media throttling reported during protest events.'},
  methodology: {icon:'🔬',title:'METHODOLOGY',desc:'Data sources, models and confidence levels',content:'TUNISIAINTEL v2.0 uses a Bayesian composite risk model drawing on 75 primary and secondary sources. The Revolutionary Risk Index (RRI) is calculated using 7 weighted factor clusters. P(Revolution) derived from historical comparative analysis of 14 analogous state fragility cases (Tunisia 2011, Egypt 2011, Sudan 2019, etc.).'},
  resources: {icon:'📚',title:'RESOURCES & SOURCES',desc:'75 verified intelligence sources',content:'Source categories: (22) Local civil society organizations, (18) Economic data providers (BCT, INS, WB, IMF), (12) International press (Reuters, AFP, Al Jazeera), (8) Diplomatic cables (declassified), (7) Academic research institutions, (5) Think tanks (ICG, Chatham House, Carnegie), (3) Confidential human sources.'},
  'geo-align': {icon:'🌍',title:'GEO-ALIGNMENT ANALYSIS',desc:'Regional power dynamics and external actor mapping',content:'Key external actors: EU (migration deal leverage), IMF (conditionality pressure), UAE (financial support contingent on normalization), Qatar (Ennahdha support, frozen since 2023), Algeria (border security cooperation), Libya (spillover risk). Tunisia increasingly isolated as regional alignment shifts.'},
  'game-theory': {icon:'♟️',title:'GAME THEORY MODULE',desc:'Strategic interaction modelling between key actors',content:'Game matrix models: Saied vs UGTT (Prisoner\'s Dilemma — both benefit from deal, both defecting to confrontation), Regime vs IMF (Hawk-Dove — IMF holds leverage), Military vs Regime (Assurance Game — military cooperates if payroll maintained). Key insight: UGTT is the pivotal swing actor whose strategy determines systemic outcome.'},
  compliance: {icon:'✅',title:'COMPLIANCE & LEGAL',desc:'Sanctions, AML and regulatory risk tracking',content:'FATF grey-listed status (since 2022). AML/CFT deficiencies persist. Financial sanctions risk for entities dealing with detained officials. EU travel ban consideration active for 12 named individuals. Correspondent banking relationships under review at 4 European institutions.'},
};

export default function ModulePage() {
  const { dir } = useLang();
  // Detect which module from URL
  const modKey = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() || '' : '';
  const info = MODULE_INFO[modKey] || {icon:'📄',title:'MODULE',desc:'Intelligence module',content:'Content loading...'};

  return (
    <div dir={dir} style={{ padding:24, display:'flex', flexDirection:'column', gap:20 }}>
      <div>
        <h1 style={{ fontSize:'1.1rem', fontWeight:800, color:'#22d3ee', margin:0, fontFamily:'Space Grotesk' }}>{info.icon} {info.title}</h1>
        <p style={{ fontSize:'0.65rem', color:'#475569', margin:'4px 0 0' }}>{info.desc}</p>
      </div>
      <div className="module-card" style={{ padding:24 }}>
        <div style={{ fontSize:'0.68rem', color:'#94a3b8', lineHeight:1.8, maxWidth:800 }}>{info.content}</div>
      </div>
      <div style={{ display:'flex', gap:10 }}>
        <Link href="/" style={{ textDecoration:'none' }}><div style={{ background:'rgba(34,211,238,0.1)', border:'1px solid rgba(34,211,238,0.3)', borderRadius:8, padding:'8px 16px', color:'#22d3ee', fontSize:'0.65rem', cursor:'pointer' }}>← Back to Dashboard</div></Link>
      </div>
    </div>
  );
}
