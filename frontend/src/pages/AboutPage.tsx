import React from 'react';
import { Leaf, Truck, Users, Heart } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About FreshLocal</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting local farmers with conscious consumers for a sustainable food future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              At FreshLocal, we're passionate about revolutionizing the way people access fresh, local produce. 
              Our platform bridges the gap between local farmers and consumers, promoting sustainable agriculture 
              and supporting local communities.
            </p>
            <p className="text-gray-600">
              We believe in transparency, sustainability, and the power of community. By choosing FreshLocal, 
              you're not just getting the freshest produce – you're supporting local farmers and contributing 
              to a more sustainable food system.
            </p>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854"
              alt="Local Farm"
              className="rounded-lg shadow-lg w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Sustainable Practices</h3>
            <p className="text-gray-600">Supporting environmentally conscious farming methods</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Local Delivery</h3>
            <p className="text-gray-600">Reducing food miles with efficient local distribution</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community Support</h3>
            <p className="text-gray-600">Building stronger connections between farmers and consumers</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality First</h3>
            <p className="text-gray-600">Ensuring the highest quality fresh produce</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Join Our Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">For Consumers</h3>
              <ul className="space-y-3 text-gray-600">
                <li>✓ Access to fresh, local produce</li>
                <li>✓ Support local farmers</li>
                <li>✓ Know where your food comes from</li>
                <li>✓ Reduce environmental impact</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">For Farmers</h3>
              <ul className="space-y-3 text-gray-600">
                <li>✓ Direct access to local customers</li>
                <li>✓ Fair pricing for your produce</li>
                <li>✓ Simplified distribution</li>
                <li>✓ Growth opportunities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;