import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About AgriConnect</h3>
            <p className="text-gray-400">
              Connecting local farmers with conscious consumers for a sustainable food future.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-green-600">Home</a></li>
              <li><a href="/products" className="text-gray-400 hover:text-green-600">Products</a></li>
              <li><a href="/farms" className="text-gray-400 hover:text-green-600">Farms</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-400">Email: support@agriconnect.com</p>
            <p className="text-gray-400">Phone: +1 (123) 456-7890</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          &copy; 2023 AgriConnect. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;