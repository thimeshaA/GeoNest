import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

export default function CountryMap({ countries }) {
  const navigate = useNavigate();

  // Function to get country flag URL from country data
  const getFlagUrl = (country) => {
    if (!country || !country.flags) return null;
    return country.flags.svg || country.flags.png || null;
  };

  // Create a custom icon for the flag
  const createFlagIcon = (flagUrl) => {
    return L.divIcon({
      className: 'country-flag-icon',
      html: `<img src="${flagUrl}" alt="Flag" style="width:32px; height:20px; border-radius:2px; border:1px solid #ccc; cursor:pointer;" />`,
      iconSize: [32, 20],
      iconAnchor: [16, 10],
    });
  };

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {countries.map((country) => {
          const latlng = country.latlng;
          if (!latlng || latlng.length !== 2) return null;
          const flagUrl = getFlagUrl(country);
          if (!flagUrl) return null;
          const icon = createFlagIcon(flagUrl);
          return (
            <Marker
              key={country.cca3}
              position={[latlng[0], latlng[1]]}
              icon={icon}
              eventHandlers={{
                click: () => {
                  navigate(`/country/${country.cca3}`);
                },
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
