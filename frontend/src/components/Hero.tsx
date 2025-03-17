import React from 'react';
import { Leaf, Truck, Shield, Recycle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="relative h-screen flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80')", // New image
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div> {/* Dark overlay */}
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between w-full">
        {/* Left Side: Heading and Description */}
        <div className="lg:w-1/2 text-left text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Fresh from Local Farms to Your Table
          </h1>
          <p className="text-xl mb-8 max-w-xl">
            Support local farmers and enjoy the freshest produce delivered straight to your door. Reduce food miles and support sustainable agriculture.
          </p>
          <div className="flex space-x-4">
            <Link
              to="/products"
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Shop Now
            </Link>
            <Link
              to="/farm-registration"
              className="bg-white text-green-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-300"
            >
              Join Farmers Directory
            </Link>
          </div>
        </div>

        {/* Right Side: Separate Transparent Grid Items */}
        <div className="lg:w-1/2 mt-8 lg:mt-0 lg:pl-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Grid Item 1: 100% Organic */}
          <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center backdrop-blur-sm">
            <Leaf className="text-green-600 w-8 h-8 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2 text-white">100% Organic</h3>
            <p className="text-gray-200">Certified organic and pesticide-free</p>
          </div>

          {/* Grid Item 2: Fast Delivery */}
          <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center backdrop-blur-sm">
            <Truck className="text-green-600 w-8 h-8 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2 text-white">Fast Delivery</h3>
            <p className="text-gray-200">Same-day delivery for local orders</p>
          </div>

          {/* Grid Item 3: Quality Assured */}
          <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center backdrop-blur-sm">
            <Shield className="text-green-600 w-8 h-8 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2 text-white">Quality Assured</h3>
            <p className="text-gray-200">Rigorous quality control</p>
          </div>

          {/* Grid Item 4: Eco-Friendly */}
          <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center backdrop-blur-sm">
            <Recycle className="text-green-600 w-8 h-8 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2 text-white">Eco-Friendly</h3>
            <p className="text-gray-200">Sustainable packaging</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;