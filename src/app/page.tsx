'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* Top Bar - Your Replit style */}
      <div className="h-14 border-b border-cyan-500/30 flex items-center px-6 justify-between bg-black/90">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-widest">TUNISIA INTEL</span>
          <span className="text-cyan-400 text-xl font-bold">v2.0</span>
          <span className="px-3 py-1 text-[10px] bg-red-500/20 text-red-400 rounded">CLASSIFIED</span>
        </div>
        <div className="text-xs text-cyan-400">MAR 16 2026 • 12:12 AM • SOURCES 14/14</div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SENSOR GRID - Placeholder for now */}
        <div className="w-80 border-r border-cyan-500/30 bg-black/80 p-4 overflow-y-auto">
          <div className="text-cyan-400 uppercase text-xs tracking-widest mb-4">SENSOR GRID</div>
          <div className="text-center text-gray-400 py-10">Gauges coming in next step...</div>
        </div>

        {/* CENTER MAP - THIS SHOULD WORK */}
        <div className="flex-1 relative">
          <MapContainer
            center={[34.0, 9.5]}
            zoom={7}
            style={{ height: '100%', width: '100%' }}
            className="bg-black"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap'
            />
          </MapContainer>
        </div>

        {/* RIGHT PANEL - Placeholder */}
        <div className="w-80 border-l border-cyan-500/30 bg-black/80 p-4">
          <div className="text-red-400 uppercase text-xs tracking-widest">HIGH ALERT SIGNALS</div>
        </div>
      </div>
    </div>
  );
}
