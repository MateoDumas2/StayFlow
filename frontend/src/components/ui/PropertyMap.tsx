"use client";

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon missing in Leaflet + Webpack/Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const customIcon = L.icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export interface PropertyMapProps {
    location: string;
}

const coordinates: Record<string, [number, number]> = {
  'Cancún, México': [21.1619, -86.8515],
  'Bariloche, Argentina': [-41.1335, -71.3103],
  'Bogotá, Colombia': [4.7110, -74.0721],
  'Ciudad de México': [19.4326, -99.1332],
  'Kyoto, Japón': [35.0116, 135.7681],
  'Santorini, Grecia': [36.3932, 25.4615],
  'Ubud, Bali': [-8.5069, 115.2625],
  'New York, USA': [40.7128, -74.0060],
  'París, Francia': [48.8566, 2.3522],
  'Torres del Paine, Chile': [-50.9423, -73.4068],
};

const PropertyMap: React.FC<PropertyMapProps> = ({ location }) => {
    // Coordenadas simuladas para demo
    // En una app real, usaríamos geocoding o coordenadas de la DB
    const position: [number, number] = coordinates[location] || [21.1619, -86.8515]; // Default to Cancun 

    return (
        <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-inner border border-gray-border z-0">
            <MapContainer 
                center={position} 
                zoom={13} 
                scrollWheelZoom={false} 
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <Marker position={position} icon={customIcon}>
                    <Popup className="font-sans">
                        <div className="text-center">
                            <strong className="text-primary block mb-1">Ubicación aproximada</strong>
                            {location}
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default PropertyMap;
