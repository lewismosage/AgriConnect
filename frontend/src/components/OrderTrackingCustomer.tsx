// src/components/OrderTrackingCustomer.tsx
import React from 'react';
import { MapPin, Truck, Check, Clock, Package, X } from 'lucide-react';

interface TrackingUpdate {
  id: string;
  status: string;
  location?: string;
  notes?: string;
  timestamp: string;
  updated_by: string;
}

interface OrderTrackingCustomerProps {
  orderId: string;
  currentStatus: string;
  trackingUpdates: TrackingUpdate[];
}

const OrderTrackingCustomer: React.FC<OrderTrackingCustomerProps> = ({ 
  orderId,
  currentStatus,
  trackingUpdates
}) => {
  const statusIcons = {
    pending: <Clock className="w-4 h-4 text-yellow-500" />,
    processing: <Truck className="w-4 h-4 text-blue-500" />,
    completed: <Check className="w-4 h-4 text-green-500" />,
    cancelled: <X className="w-4 h-4 text-red-500" />,
  };

  const statusDescriptions = {
    pending: "Order received, preparing for processing",
    processing: "Your order is on the way",
    completed: "Order delivered successfully",
    cancelled: "Order has been cancelled",
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <Truck className="w-5 h-5 mr-2" /> Order Tracking
      </h3>
      
      <div className="space-y-4">
        {trackingUpdates.map((update, index) => (
          <div key={update.id} className="flex">
            <div className="mr-4 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index === trackingUpdates.length - 1 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {statusIcons[update.status as keyof typeof statusIcons] || <Package className="w-4 h-4" />}
              </div>
              {index < trackingUpdates.length - 1 && (
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
              <p className="text-sm text-gray-600 mt-1">
                {update.notes || statusDescriptions[update.status as keyof typeof statusDescriptions]}
              </p>
              {update.location && (
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{update.location}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Updated by: {update.updated_by}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTrackingCustomer;