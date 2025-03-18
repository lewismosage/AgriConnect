import React from "react";
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react";

const navigation = {
  social: [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "Email", href: "#", icon: Mail },
  ],
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 min-h-fit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">About AgriConnect</h3>
            <p className="text-gray-400">
              Connecting local farmers with conscious consumers for a sustainable food future.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-green-600">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="text-gray-400 hover:text-green-600">
                  Products
                </a>
              </li>
              <li>
                <a href="/farms" className="text-gray-400 hover:text-green-600">
                  Farms
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-400">Email: support@agriconnect.com</p>
            <p className="text-gray-400">Phone: +1 (123) 456-7890</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} AgriConnect. All rights reserved.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-6">
              {navigation.social.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;