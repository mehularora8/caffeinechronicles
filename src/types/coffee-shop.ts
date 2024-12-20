export interface CoffeeShop {
  id: string;
  name: string;
  city: string;
  visitAgain: string;
  address: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  hours?: {
    [key: string]: string;
  };
  ratings: {
    [key: string]: number;
  };
  thoughts: {
    [key: string]: string;
  };
  specialties?: string[];
  images?: {
    exterior: string;
    interior: string[];
  };
}