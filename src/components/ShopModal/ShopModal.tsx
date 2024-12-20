import { X, Star, MapPin, Zap, Coffee, Navigation } from 'lucide-react';
import { CoffeeShop } from '../../types/coffee-shop';

interface ShopModalProps {
  shop: CoffeeShop;
  onClose: () => void;
}

export function ShopModal({ shop, onClose }: ShopModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <div className='flex items-center space-x-4'>
            <h2 className="text-2xl font-bold">{shop.name}</h2>
          </div>
          
          <button
            onClick={onClose}
            className="hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Images */}
          <div className="grid grid-cols-2 gap-4">
            {
              shop.images && shop.images.exterior && (
                <img
                  src={shop.images.exterior}
                  alt="Exterior"
                  className="w-full h-48 object-cover rounded-lg"
                />
              )
            }
          </div>

          {/* Contact & Location */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span>{shop.address}</span>
            </div>
          </div>

          {/* Ratings */}
          <div className="flex flex-col items-start">
            <div className='flex flex-col mb-6'>
              <div className='flex items-center space-x-2'>
                <Zap className={"w-6 h-6 text-yellow-500"} />
                <span className="text-lg font-semibold">{shop.ratings.vibe} / 5</span>
              </div>
              {/* Vibe thoughts */}
              <div className='flex items-center space-x-2 text-slate-800'>
                <span className="text-sm">{shop.thoughts.vibe}</span>
              </div>
            </div>
            
            <div className='flex flex-col mb-6'>
              <div className='flex items-center space-x-2'>
                <Coffee className={"w-6 h-6 text-yellow-500"} />
                <span className="text-lg font-semibold">{shop.ratings.taste} / 5</span>
              </div>
              {/* Taste thoughts */}
              <div className='flex items-center space-x-2'>
                <span className="text-sm">{shop.thoughts.taste}</span>
              </div>
            </div>
            
          </div>

          {/* Specialties */}
          {
            shop.specialties && shop.specialties.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {shop.specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )
          }

          {/* Get Directions Button */}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${shop.coordinates.lat},${shop.coordinates.lon}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 text-gray-500 hover:text-vintage-blue text-center text-sm rounded-lg transition-colors underline"
          >
            Get Directions
          </a>
        </div>
      </div>
    </div>
  );
}