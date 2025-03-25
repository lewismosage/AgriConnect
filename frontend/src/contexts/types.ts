// types.ts
import { Farm, Product } from './AuthContext'; // Import existing types from AuthContext

export interface CartItem {
  product: Product & {
    farm: Farm; // Ensure farm is included with each product
  };
  quantity: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// You can also re-export the types from AuthContext for convenience
export type { Farm, Product, FarmerProfile, User } from './AuthContext';