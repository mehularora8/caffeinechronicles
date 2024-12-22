import { useMap } from 'react-leaflet';
import { cn } from '../../lib/utils';

interface City {
  name: string;
  coordinates: [number, number];
  zoom: number;
}

const cities: City[] = [
    { name: 'San Francisco', coordinates: [37.7749, -122.4194], zoom: 13 },
    { name: 'New York', coordinates: [40.7128, -74.0060], zoom: 13 },
    { name: 'Seattle', coordinates: [47.6062, -122.3321], zoom: 13 },
];

export function CityNavigation() {
  const map = useMap();
  
  const handleCityClick = (city: City) => {
    map.flyTo(city.coordinates, city.zoom, {
      duration: 1.5,
      easeLinearity: 0.25,
    });
  };

  return (
    <div className="absolute top-4 left-12 z-[1000] flex flex-wrap gap-2 max-w-[calc(100%-2rem)]">
      {cities.map((city) => (
        <button
          key={city.name}
          onClick={() => handleCityClick(city)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium",
            "bg-white shadow-md border border-gray-200",
            "hover:bg-gray-50 hover:border-gray-300",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          )}
        >
          {city.name}
        </button>
      ))}
    </div>
  );
}