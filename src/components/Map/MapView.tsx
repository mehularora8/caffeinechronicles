import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { CoffeeShop } from '../../types/coffee-shop';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

function LocationFinder() {
  const map = useMap();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        map.setView(
          [position.coords.latitude, position.coords.longitude],
          13
        );
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  }, [map]);

  return null;
}

interface MapViewProps {
  shops: CoffeeShop[];
  onShopSelect: (shop: CoffeeShop) => void;
}

export function MapView({ shops, onShopSelect }: MapViewProps) {
  const customMarker = divIcon({
    className: 'bg-transparent',
    html: `
      <div class="w-4 h-4 bg-vintage-blue rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"></div>
    `,
    iconSize: [12, 12],
  });

  return (
    <MapContainer
      center={[40.7128, -94.0060]}
      zoom={5}
      className="h-full w-full rounded-lg shadow-lg"
    >
      <TileLayer
        attribution='&copy; CartoDB'
        url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png'
      />
      <LocationFinder />
      
      {shops.map((shop) => (
        <Marker
          key={shop.id}
          position={[shop.coordinates.lat, shop.coordinates.lon]}
          eventHandlers={{
            click: () => onShopSelect(shop),
          }}
          icon={customMarker}
        >
        </Marker>
      ))}
    </MapContainer>
  );
}