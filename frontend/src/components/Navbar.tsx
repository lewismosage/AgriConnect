// components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';

interface SearchResult {
  id: string;
  name: string;
  type: 'product' | 'farm';
  image?: string;
  match_type?: string;
  location?: string;  // for farms
  farm_name?: string; // for products
}

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { totalItems, wishlistItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const getDashboardRoute = () => {
    if (user?.user_type === 'farmer') {
      return '/farmer-dashboard';
    } else if (user?.user_type === 'consumer') {
      return '/customer-dashboard';
    }
    return '/login';
  };

  const search = async () => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get('/api/search/', {
        params: { q: searchQuery },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim()) {
        search();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    
    if (!trimmedQuery) return;
  
    if (isSearching) {
      const timer = setTimeout(() => {
        handleSearchSubmit(e);
      }, 300);
      return () => clearTimeout(timer);
    }
  
    const exactMatch = searchResults.find(
      result => result.name.toLowerCase() === trimmedQuery.toLowerCase()
    );
  
    if (exactMatch) {
      navigate(`/${exactMatch.type}s/${exactMatch.id}`);
    } else if (searchResults.length > 0) {
      navigate(`/${searchResults[0].type}s/${searchResults[0].id}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(`/${result.type}s/${result.id}`);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <nav className="bg-white shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-green-600">AgriConnect</span>
          </Link>

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

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={toggleSearch}
                className="text-gray-600 hover:text-green-600"
              >
                <Search size={20} />
              </button>

              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-50">
                  <form onSubmit={handleSearchSubmit} className="p-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search farms and products..."
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      autoFocus
                    />
                  </form>
                  {isSearching && (
                    <div className="p-2 text-gray-500">Searching...</div>
                  )}
                  {searchResults.length > 0 && (
                    <div className="max-h-60 overflow-y-auto">
                      {searchResults.map((result) => (
                        <div
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleResultClick(result)}
                          className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        >
                          {result.image && (
                            <img
                              src={result.image}
                              alt={result.name}
                              className="w-10 h-10 object-cover rounded mr-3"
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
                              }}
                            />
                          )}
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {result.name}
                            </div>
                            {result.type === 'farm' && result.location && (
                              <div className="text-xs text-gray-500">
                                {result.location}
                              </div>
                            )}
                            {result.type === 'product' && result.farm_name && (
                              <div className="text-xs text-gray-500">
                                From: {result.farm_name}
                              </div>
                            )}
                            <div className="text-xs text-gray-400 capitalize mt-1">
                              {result.type}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {!isSearching && searchQuery && searchResults.length === 0 && (
                    <div className="p-2 text-gray-500">No results found</div>
                  )}
                </div>
              )}
            </div>

            <Link
              to="/wishlist"
              className="text-gray-600 hover:text-green-600 relative"
            >
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="text-gray-600 hover:text-green-600 relative"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              to={getDashboardRoute()}
              className="text-gray-600 hover:text-green-600"
            >
              <User size={20} />
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-green-600 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="flex flex-col space-y-4 mt-4 pb-4">
              <div className="p-2 bg-white">
                <form onSubmit={handleSearchSubmit} className="flex">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search farms and products..."
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                  <button 
                    type="submit"
                    className="bg-green-500 text-white px-3 rounded-r-md"
                  >
                    <Search size={20} />
                  </button>
                </form>
                {isSearching && (
                  <div className="p-2 text-gray-500">Searching...</div>
                )}
                {searchResults.length > 0 && (
                  <div className="max-h-60 overflow-y-auto">
                    {searchResults.map((result) => (
                      <div
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      >
                        {result.image && (
                          <img 
                            src={result.image}
                            alt={result.name}
                            className="w-8 h-8 object-cover rounded mr-2"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
                            }}
                          />
                        )}
                        <div>
                          <div className="font-medium">{result.name}</div>
                          <div className="text-xs text-gray-500 capitalize">
                            {result.type}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {!isSearching && searchQuery && searchResults.length === 0 && (
                  <div className="p-2 text-gray-500">No results found</div>
                )}
              </div>

              <Link to="/about" className="text-gray-700 hover:text-green-600 px-4">
                About Us
              </Link>
              <Link to="/farms" className="text-gray-700 hover:text-green-600 px-4">
                Farms
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-green-600 px-4">
                Products
              </Link>
              <div className="flex items-center space-x-4 px-4">
                <Link to="/wishlist" className="text-gray-600 hover:text-green-600 relative">
                  <Heart size={20} />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="text-gray-600 hover:text-green-600 relative">
                  <ShoppingCart size={20} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <Link
                  to={getDashboardRoute()}
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