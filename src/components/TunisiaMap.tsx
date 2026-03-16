'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css'; // ← this line is now valid

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
    <MapContainer
      center={[34.0, 9.5]}
      zoom={7}
      style={{ height: '100%', width: '100%' }}
      className="bg-black"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
    </MapContainer>
  );
}
