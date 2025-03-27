import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Truck, Check, Clock, ArrowLeft, Loader2 } from "lucide-react";
import axios from "../contexts/axioConfig";

interface TrackingUpdate {
  id: string;
  status: string;
  location?: string;
  notes?: string;
  timestamp: string;
  updated_by: string;
}

const OrderTracking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trackingUpdates, setTrackingUpdates] = useState<TrackingUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrackingUpdates = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/orders/${id}/tracking/`);
        setTrackingUpdates(response.data);
      } catch (err) {
        console.error("Error fetching tracking updates:", err);
        setError(
          "Failed to load tracking information. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingUpdates();
  }, [id]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">{error}</div>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Order
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Truck className="h-6 w-6 mr-2 text-purple-600" />
              Order Tracking
            </h2>

            <div className="space-y-6">
              {trackingUpdates.length > 0 ? (
                trackingUpdates.map((update, index) => (
                  <div key={update.id} className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === trackingUpdates.length - 1
                            ? "bg-purple-100 text-purple-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {update.status === "pending" ? (
                          <Clock className="w-4 h-4" />
                        ) : update.status === "processing" ? (
                          <Truck className="w-4 h-4" />
                        ) : update.status === "shipped" ? (
                          <Truck className="w-4 h-4" />
                        ) : update.status === "completed" ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      {index < trackingUpdates.length - 1 && (
                        <div className="w-px h-8 bg-gray-300 my-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex justify-between">
                        <h4 className="font-medium capitalize">
                          {update.status}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {formatDate(update.timestamp)}
                        </span>
                      </div>
                      {update.notes && (
                        <p className="text-sm text-gray-600 mt-1">
                          {update.notes}
                        </p>
                      )}
                      {update.status === "shipped" && (
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>In transit: {update.location}</span>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Updated by: {update.updated_by}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No tracking updates available yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
