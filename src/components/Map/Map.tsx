import { CoffeeShop } from '../../types/coffee-shop';
import coffeeShops from '../../data/processed-data.json';
import { ShopModal } from '../ShopModal/ShopModal';
import { MapView } from './MapView';
import { useSearch } from '../../hooks/useSearch';
import { useEffect, useState } from 'react';

const typedCoffeeShops: CoffeeShop[] = coffeeShops; 

export function Map() {
  const [selectedShop, setSelectedShop] = useState<CoffeeShop | null>(null);
  const { searchQuery } = useSearch();

  const filteredShops = typedCoffeeShops.filter((shop) =>
    shop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setSelectedShop(null);
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="h-full relative">
      <MapView shops={filteredShops} onShopSelect={setSelectedShop} />

      {selectedShop && (
        <ShopModal
          shop={selectedShop}
          onClose={() => setSelectedShop(null)}
        />
      )}
    </div>
  );
}