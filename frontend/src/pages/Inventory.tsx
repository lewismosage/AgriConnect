// pages/Inventory.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: string;
  category: string;
  image?: string;
}

const Inventory: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/products/', {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          }
        });

        // Process products to ensure image URLs are complete
        const processedProducts = response.data.map((product: any) => ({
          ...product,
          image: product.image 
            ? product.image.startsWith('http') 
              ? product.image 
              : `${import.meta.env.VITE_BACKEND_URL}${product.image}`
            : null
        }));

        setProducts(processedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load inventory. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.farmer_profile) {
      fetchProducts();
    } else {
      console.log('No farmer profile found');
      setLoading(false);
    }
  }, [user]);

  const getStockStatus = (quantity: number) => {
    if (quantity <= 0) return 'Out of Stock';
    if (quantity <= 10) return 'Low Stock';
    return 'In Stock';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Inventory</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Product Inventory</h2>
          <div className="text-center text-gray-500">Loading inventory...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Inventory</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Product Inventory</h2>
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Inventory</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Product Inventory</h2>
        <div className="space-y-4">
          {products.length > 0 ? (
            products.map((product) => {
              const status = getStockStatus(product.quantity);
              return (
                <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    {product.image ? (
                      <img 
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        {product.quantity} {product.unit} • ${product.price}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Category: {product.category}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${getStatusColor(status)}`}
                  >
                    {status}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Package className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p>No products in inventory</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;