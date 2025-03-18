import React from 'react';
import { Leaf, Truck, Shield, Recycle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';

const Hero: React.FC = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Detect mobile screens
  const cardWidth = isMobile ? 280 : 300; // Adjust card width for mobile
  const gap = isMobile ? 16 : 24; // Adjust gap between cards
  const totalWidth = (cardWidth + gap) * 4; // Total width for 4 cards

  const gridItems = [
    {
      id: 1,
      icon: <Leaf className="text-green-600 w-8 h-8 mb-4 mx-auto" />,
      title: '100% Organic',
      description: 'Certified organic and pesticide-free',
    },
    {
      id: 2,
      icon: <Truck className="text-green-600 w-8 h-8 mb-4 mx-auto" />,
      title: 'Fast Delivery',
      description: 'Same-day delivery for local orders',
    },
    {
      id: 3,
      icon: <Shield className="text-green-600 w-8 h-8 mb-4 mx-auto" />,
      title: 'Quality Assured',
      description: 'Rigorous quality control',
    },
    {
      id: 4,
      icon: <Recycle className="text-green-600 w-8 h-8 mb-4 mx-auto" />,
      title: 'Eco-Friendly',
      description: 'Sustainable packaging',
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
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
        <div className="lg:w-1/2 text-center lg:text-left text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Fresh from Local Farms to Your Table
          </h1>
          <p className="text-xl mb-8 max-w-xl mx-auto lg:mx-0">
            Support local farmers and enjoy the freshest produce delivered straight to your door. Reduce food miles and support sustainable agriculture.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
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

        {/* Right Side: Swiper for Small Screens, Grid for Larger Screens */}
        <div className="lg:w-1/2 mt-8 lg:mt-0 lg:pl-8">
          {/* Swiper for Small Screens */}
          {isMobile ? (
            <div className="relative overflow-hidden w-full">
              <motion.div
                className="flex"
                style={{ width: totalWidth * 2 }} // Double the width for seamless looping
                animate={{ x: ["0%", `-${totalWidth}px`], transitionEnd: { x: "0%" } }}
                transition={{
                  duration: 12, // Adjust duration for slower/faster scrolling
                  repeat: Infinity, // Infinite loop
                  ease: "linear", // Smooth linear animation
                }}
              >
                {[...gridItems, ...gridItems].map((item, index) => (
                  <motion.div
                    key={`${item.id}-${index}`}
                    className="flex-shrink-0 bg-white bg-opacity-20 rounded-lg p-6 text-center backdrop-blur-sm"
                    style={{ width: cardWidth, marginRight: gap }}
                  >
                    {item.icon}
                    <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                    <p className="text-gray-200">{item.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ) : (
            // Grid for Larger Screens
            <div className="hidden lg:grid grid-cols-2 gap-6">
              {gridItems.map((item) => (
                <div key={item.id} className="bg-white bg-opacity-20 rounded-lg p-6 text-center backdrop-blur-sm">
                  {item.icon}
                  <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                  <p className="text-gray-200">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;