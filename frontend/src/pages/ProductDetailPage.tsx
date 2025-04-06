import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Product } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${productId}/`);
        // Ensure price is a number
        const productData = {
          ...response.data,
          price: typeof response.data.price === 'string' 
            ? parseFloat(response.data.price) 
            : response.data.price
        };
        setProduct(productData);
      } catch (err) {
        setError('Failed to load product');
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="flex justify-center items-center min-h-screen">Product not found</div>;
  }

  // Safely format the price
  const formattedPrice = typeof product.price === 'number'
    ? product.price.toFixed(2)
    : parseFloat(product.price || '0').toFixed(2);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Product Image */}
          <div className="mb-8 lg:mb-0">
            <img
              src={product.image || 'https://via.placeholder.com/600'}
              alt={product.name}
              className="w-full h-auto rounded-lg shadow-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600';
              }}
            />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            {product.farm && (
              <p className="text-lg text-gray-600 mb-4">
                From: {product.farm.name} in {product.farm.location}
              </p>
            )}
            
            <div className="mb-6">
              <span className="text-2xl font-semibold text-green-600">
                ${formattedPrice}
              </span>
              <span className="text-gray-500 ml-2">per {product.unit}</span>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600">
                {product.category || 'No description available.'}
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={cartItems.some(item => item.product.id === product.id)}
              className={`w-full md:w-auto px-6 py-3 rounded-md text-white font-medium ${
                cartItems.some(item => item.product.id === product.id)
                  ? 'bg-green-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {cartItems.some(item => item.product.id === product.id)
                ? 'Added to Cart'
                : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;