import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user } = useAuth(); // Destructure user from useAuth
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Determine the dashboard route based on user type
  const getDashboardRoute = () => {
    if (user?.user_type === 'farmer') {
      return '/farmer-dashboard';
    } else if (user?.user_type === 'consumer') {
      return '/customer-dashboard';
    }
    return '/login'; // Fallback for unauthenticated users
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-green-600">AgriConnect</span>
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-green-600 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex space-x-8">
            <Link to="/about" className="text-gray-700 hover:text-green-600">
              About Us
            </Link>
            <Link to="/farms" className="text-gray-700 hover:text-green-600">
              Farms
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-green-600">
              Products
            </Link>
          </div>

          {/* Icons: Search, Wishlist, Cart, Account (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
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
            <Link
              to={getDashboardRoute()} // Navigate to the relevant dashboard or login
              className="text-gray-600 hover:text-green-600"
            >
              <User size={20} />
            </Link>
          </div>
        </div>

        {/* Mobile Menu (Dropdown) */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="flex flex-col space-y-4 mt-4 pb-4">
              <Link to="/about" className="text-gray-700 hover:text-green-600">
                About Us
              </Link>
              <Link to="/farms" className="text-gray-700 hover:text-green-600">
                Farms
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-green-600">
                Products
              </Link>
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
                <Link
                  to={getDashboardRoute()} // Navigate to the relevant dashboard or login
                  className="text-gray-600 hover:text-green-600"
                >
                  <User size={20} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;