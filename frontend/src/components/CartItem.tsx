import React from 'react';
import { Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../contexts/types';

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  showFarm?: boolean; // New prop to optionally show farm info
  compact?: boolean; // New prop for compact view
}

const CartItem: React.FC<CartItemProps> = ({ 
  item, 
  onRemove, 
  onUpdateQuantity,
  showFarm = true,
  compact = false
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${compact ? 'py-3' : 'mb-4'}`}>
      <div className="flex items-center">
        <img
          src={item.product.image}
          alt={item.product.name}
          className={`${compact ? 'w-12 h-12' : 'w-20 h-20'} object-cover rounded-lg`}
        />
        <div className={`ml-6 flex-1 ${compact ? 'space-y-1' : ''}`}>
          <h3 className={`${compact ? 'text-md' : 'text-lg'} font-semibold`}>
            {item.product.name}
          </h3>
          {showFarm && (
            <p className="text-gray-600 text-sm">
              {item.product.farm.name}
            </p>
          )}
          <div className={`flex items-center justify-between ${compact ? 'mt-2' : 'mt-4'}`}>
            <div className="flex items-center">
              <button
                onClick={() => onRemove(item.product.id)}
                className="text-gray-500 hover:text-red-500"
              >
                <Trash2 size={compact ? 16 : 20} />
              </button>
              <div className="mx-4">
                <select
                  value={item.quantity}
                  onChange={(e) => onUpdateQuantity(item.product.id, parseInt(e.target.value))}
                  className={`block rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 ${
                    compact ? 'w-16 py-1 text-sm' : 'w-20'
                  }`}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <span className={`${compact ? 'text-md' : 'text-lg'} font-semibold`}>
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;