import React from "react";
import { Instagram, Mail } from "lucide-react";

// Custom "X" (Twitter) Icon
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6.94 3H3L10.6 12L3 21H6.94L12 14.88L17.06 21H21L13.4 12L21 3H17.06L12 9.12L6.94 3Z" />
  </svg>
);

const navigation = {
  social: [
    {
      name: "Instagram",
      href: "https://instagram.com/savanna.tek",
      icon: Instagram,
    },
    {
      name: "X (Twitter)",
      href: "https://twitter.com/savannatek",
      icon: XIcon,
    },
    {
      name: "Email",
      href: "mailto:savannatek.ke@gmail.com",
      icon: Mail,
    },
  ],
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
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
            <p className="text-gray-400">Phone: +254 793 052198</p>
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
                    target="_blank"
                    rel="noopener noreferrer"
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