import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Farm } from '../types';
import { Link } from 'react-router-dom';

interface FarmCardProps {
  farm: Farm;
}

const FarmCard: React.FC<FarmCardProps> = ({ farm }) => {
  return (
    <Link to={`/farms/${farm.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
        <div className="relative h-48">
          <img
            src={farm.image}
            alt={farm.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-gray-900">{farm.name}</h2>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-sm text-gray-600">{farm.rating}</span>
            </div>
          </div>
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{farm.location}</span>
          </div>
          <p className="text-gray-600 text-sm mb-4">{farm.description}</p>
          <div className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {farm.specialty}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FarmCard;