import React from 'react';
import { Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onUpdateQuantity }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-center">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div className="ml-6 flex-1">
          <h3 className="text-lg font-semibold">{item.product.name}</h3>
          <p className="text-gray-600">{item.product.farm}</p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <button
                onClick={() => onRemove(item.product.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Trash2 size={20} />
              </button>
              <div className="mx-4">
                <select
                  value={item.quantity}
                  onChange={(e) => onUpdateQuantity(item.product.id, parseInt(e.target.value))}
                  className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <span className="text-lg font-semibold">
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;