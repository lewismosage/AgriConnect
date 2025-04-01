import React, { useState, useEffect } from "react";
import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Farm } from "../contexts/AuthContext";

interface FarmCardProps {
  farm: Farm;
}

const FarmCard: React.FC<FarmCardProps> = ({ farm }) => {
  const [farmDetails, setFarmDetails] = useState<Farm>(farm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFarmDescription = async () => {
      // Only fetch if description isn't already provided
      if (!farm.description) {
        setLoading(true);
        try {
          const response = await axios.get(`/api/farms/${farm.id}/`);
          setFarmDetails(response.data);
        } catch (error) {
          console.error("Error fetching farm description:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFarmDescription();
  }, [farm.id, farm.description]);

  return (
    <Link to={`/farms/${farm.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
        <div className="relative h-48">
          <img
            src={farmDetails.image}
            alt={farmDetails.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-gray-900">
              {farmDetails.name}
            </h2>
            {farmDetails.rating !== undefined && (
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="text-sm text-gray-600">
                  {farmDetails.rating}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{farmDetails.location}</span>
          </div>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : (
            <p className="text-gray-600 text-sm mb-4">
              {farmDetails.description || "No description available"}
            </p>
          )}
          {farmDetails.specialty && (
            <div className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {farmDetails.specialty}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default FarmCard;
