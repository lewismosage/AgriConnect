import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, User, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-green-600">AgriConnect</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/farms" className="text-gray-700 hover:text-green-600">Farms</Link>
            <Link to="/products" className="text-gray-700 hover:text-green-600">Products</Link>
            {user && (
              <Link to="/farmer-dashboard" className="text-gray-700 hover:text-green-600">Farmer Dashboard</Link>
            )}
            <Link to="/about" className="text-gray-700 hover:text-green-600">About</Link>
          </div>

          {/* Icons: Search, Wishlist, Cart, Account */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-green-600">
              <Search size={20} />
            </button>
            <Link to="/wishlist" className="text-gray-600 hover:text-green-600 relative">
              <Heart size={20} />
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </Link>
            <Link to="/cart" className="text-gray-600 hover:text-green-600 relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </Link>
            {user ? (
              <button
                onClick={logout}
                className="text-gray-600 hover:text-green-600"
              >
                <User size={20} />
              </button>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-green-600">
                <User size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;