import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { CoffeeShop } from '../../types/coffee-shop';
import { divIcon } from 'leaflet';
import { renderToString } from 'react-dom/server';
import { CiCoffeeCup } from "react-icons/ci";
import 'leaflet/dist/leaflet.css';
import { CityNavigation } from './CityNavigation';

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
    html: renderToString(
      <div className="text-2xl rounded-full border-brown-600 bg-white p-1">
        <CiCoffeeCup className="text-orange-800" />
      </div>
    ),
    className: 'custom-coffee-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
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
      <CityNavigation />
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