import React, { useState, useEffect } from 'react';
import { MapPin, Truck, Check, Clock, Package } from 'lucide-react';
import axios from 'axios';

interface TrackingUpdate {
  id: string;
  status: string;
  location?: string;
  notes?: string;
  timestamp: string;
}

interface OrderTrackingFarmerProps {
  orderId: string;
  currentStatus: string;
  onTrackingUpdate: (update: TrackingUpdate) => void;
}

const OrderTrackingFarmer: React.FC<OrderTrackingFarmerProps> = ({ 
  orderId,
  currentStatus,
  onTrackingUpdate
}) => {
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [trackingHistory, setTrackingHistory] = useState<TrackingUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrackingHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/orders/${orderId}/tracking/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTrackingHistory(response.data);
      } catch (error) {
        console.error('Failed to fetch tracking history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingHistory();
  }, [orderId]);

  const addTrackingUpdate = async () => {
    if (!location.trim()) return;

    const update = {
      status: currentStatus,
      location: location.trim(),
      notes: notes.trim()
    };

    try {
      const response = await axios.post(
        `/api/orders/${orderId}/tracking/update/`, 
        update,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      onTrackingUpdate(response.data);
      setTrackingHistory(prevHistory => [...prevHistory, response.data]);
      setLocation('');
      setNotes('');
    } catch (error) {
      console.error('Tracking update failed:', error);
      alert('Failed to update tracking. Please try again.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'processing':
        return <Truck className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'completed':
        return <Check className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading tracking history...</div>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <Truck className="w-5 h-5 mr-2" /> Delivery Tracking
      </h3>
      
      {/* Tracking History */}
      <div className="space-y-4 mb-6">
        {trackingHistory.length > 0 ? (
          trackingHistory.map((update, index) => (
            <div key={update.id} className="flex">
              <div className="mr-4 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index === trackingHistory.length - 1 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {getStatusIcon(update.status)}
                </div>
                {index < trackingHistory.length - 1 && (
                  <div className="w-px h-8 bg-gray-300 my-1"></div>
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex justify-between">
                  <h4 className="font-medium capitalize">{update.status}</h4>
                  <span className="text-sm text-gray-500">
                    {new Date(update.timestamp).toLocaleString()}
                  </span>
                </div>
                {update.notes && (
                  <p className="text-sm text-gray-600 mt-1">{update.notes}</p>
                )}
                {update.location && (
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{update.location}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            No tracking updates available yet
          </div>
        )}
      </div>

      {/* Update Form (for processing or shipped status) */}
      {["processing", "shipped"].includes(currentStatus.toLowerCase()) && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-3">Add Tracking Update</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Location
              </label>
              <input
                type="text"
                placeholder="e.g., Left warehouse, In transit, etc."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Update Notes
              </label>
              <textarea
                placeholder="Any additional information for the customer"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
                rows={3}
              />
            </div>
            <button
              onClick={addTrackingUpdate}
              disabled={!location.trim()}
              className={`px-4 py-2 rounded-md text-sm ${
                location.trim() 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Update Tracking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingFarmer;