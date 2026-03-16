'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamic import to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

export default function TunisiaMap() {
  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[34.0, 9.5]} 
        zoom={7} 
        className="w-full h-full"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {/* Your existing event markers, overlays, etc. go here */}
        {/* For now this will at least show the map tiles */}
      </MapContainer>
    </div>
  );
}
