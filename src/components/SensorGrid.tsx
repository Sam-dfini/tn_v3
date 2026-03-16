'use client';

import React from 'react';

const gauges = [
  { label: "RRI", value: "2.31", status: "AT THRESHOLD", color: "text-cyan-400" },
  { label: "P(Revolution)", value: "64.3%", status: "90-DAY", color: "text-red-400" },
  { label: "BCT Reserves", value: "88 days", status: "CRITICAL", color: "text-orange-400" },
  { label: "Happiness", value: "34%", status: "", color: "text-yellow-400" },
  { label: "Population Pressure", value: "76%", status: "", color: "text-orange-400" },
  { label: "Water Stress", value: "82%", status: "", color: "text-blue-400" },
  { label: "Desertification", value: "68%", status: "", color: "text-amber-400" },
  { label: "Forest Fire Risk", value: "45%", status: "", color: "text-red-400" },
  { label: "CO₂ Emission", value: "71%", status: "", color: "text-emerald-400" },
  { label: "Environmental Risk", value: "79%", status: "", color: "text-teal-400" },
  { label: "Freedom Index", value: "28%", status: "CRITICAL", color: "text-red-500" },
  { label: "Economic Liberty", value: "42%", status: "RESTRICTED", color: "text-yellow-400" },
  { label: "Jobs Risk", value: "41%", status: "CRITICAL", color: "text-red-400" },
  { label: "Public Safety", value: "54%", status: "", color: "text-orange-400" },
  { label: "Road Accident Risk", value: "67%", status: "", color: "text-red-400" },
  { label: "Suicide Rate", value: "9.8/100k", status: "+22%", color: "text-red-400" },
  { label: "Elite Loyalty", value: "72%", status: "", color: "text-cyan-400" },
  { label: "Youth Rage", value: "79%", status: "", color: "text-red-400" },
];

export default function SensorGrid() {
  return (
    <div className="bg-black/80 border border-cyan-500/30 rounded-xl p-6 h-full overflow-y-auto">
      <div className="uppercase text-xs tracking-[3px] text-cyan-400 mb-4">SENSOR GRID</div>
      
      <div className="grid grid-cols-2 gap-3">
        {gauges.map((g, i) => (
          <div 
            key={i}
            className="bg-zinc-950 border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-400 transition-all cursor-pointer group"
            onClick={() => alert(`Opening ${g.label} module...`)} // We'll replace with real popups next
          >
            <div className="text-xs text-gray-400">{g.label}</div>
            <div className={`text-3xl font-bold mt-1 ${g.color}`}>{g.value}</div>
            {g.status && <div className="text-[10px] mt-1 text-red-400">{g.status}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
