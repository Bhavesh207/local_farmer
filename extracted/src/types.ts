export type ActiveTab = 'home' | 'about' | 'services' | 'shop' | 'essential';

export interface ServiceItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  image: string;
  fullDetails?: {
    overview: string;
    features: string[];
    pricing: string;
  };
}

export interface ProductItem {
  id: string;
  name: string;
  category: 'vegetables' | 'dairy' | 'soil' | 'fruits';
  price: number;
  unit: string;
  rating: number;
  image: string;
  inStock: boolean;
  description: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export interface UserAuth {
  username: string;
  isLoggedIn: boolean;
}

export type ViewMode = 'ecoland' | 'login_standalone';
