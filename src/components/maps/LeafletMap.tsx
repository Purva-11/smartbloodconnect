import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ArrowRight, MapPin } from 'lucide-react';

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const createIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const icons = {
  camp: createIcon('var(--blue)'),
  hospital: createIcon('var(--cyan)'),
  bloodBank: createIcon('var(--green)'),
  emergency: createIcon('var(--red)'),
  user: createIcon('var(--text)'),
};

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'camp' | 'hospital' | 'bloodBank' | 'emergency' | 'user';
  details?: string;
  urgency?: string;
}

interface LeafletMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  locations?: Location[];
  emergencyRadius?: number;
  onMarkerClick?: (loc: Location) => void;
  onMapClick?: (coordinates: { lat: number; lng: number }) => void;
  className?: string;
}

function ChangeView({ center, zoom }: { center: {lat: number, lng: number}, zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

function MapClickHandler({ onMapClick }: { onMapClick?: LeafletMapProps['onMapClick'] }) {
  useMapEvents({
    click: event => onMapClick?.({ lat: event.latlng.lat, lng: event.latlng.lng }),
  });
  return null;
}

export function LeafletMap({ center, zoom = 13, locations = [], emergencyRadius, onMarkerClick, onMapClick, className = 'h-96' }: LeafletMapProps) {
  return (
    <div className={`w-full rounded-[var(--radius-xl)] overflow-hidden border border-[var(--glass-border)] relative z-0 ${className}`}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%', background: 'var(--glass)' }}>
        <ChangeView center={center} zoom={zoom} />
        <MapClickHandler onMapClick={onMapClick} />
        
        {/* Dark theme compatible tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {emergencyRadius && (
          <Circle 
            center={center} 
            radius={emergencyRadius * 1000} // km to meters
            pathOptions={{ color: 'var(--red)', fillColor: 'var(--red)', fillOpacity: 0.1 }}
          />
        )}

        {locations.map(loc => (
          <Marker 
            key={loc.id} 
            position={[loc.lat, loc.lng]} 
            icon={icons[loc.type]}
            eventHandlers={{ click: () => onMarkerClick?.(loc) }}
          >
            <Popup className="custom-popup">
              <div className="p-1">
                <h3 className="font-bold mb-1">{loc.name}</h3>
                <Badge variant={
                  loc.type === 'emergency' ? 'red' : 
                  loc.type === 'camp' ? 'blue' : 
                  loc.type === 'hospital' ? 'cyan' : 'green'
                } className="mb-2 uppercase text-[10px]">
                  {loc.type}
                </Badge>
                {loc.details && <p className="text-xs text-gray-600 mb-2">{loc.details}</p>}
                {onMarkerClick && (
                  <Button size="sm" className="w-full text-xs py-1 h-7" onClick={() => onMarkerClick(loc)}>
                    View Details
                  </Button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
