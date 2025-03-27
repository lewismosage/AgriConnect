// src/components/NotificationButton.tsx
import React from "react";
import { Bell, Check, X, Truck } from "lucide-react";
import axios from "./../contexts/axioConfig";

interface NotificationButtonProps {
  orderId: string;
  customerEmail: string;
  currentStatus: string;
  onNotify: (success: boolean) => void;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({
  orderId,
  customerEmail,
  currentStatus,
  onNotify,
}) => {
  const sendNotification = async () => {
    try {
      const response = await axios.post(
        "/api/notifications/",
        {
          order_id: orderId,
          recipient_email: customerEmail,
          message: `Your order status has been updated to: ${currentStatus}`,
          notification_type: "order_update",
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      onNotify(true);
    } catch (error) {
      console.error("Notification failed:", error);
      onNotify(false);
    }
  };

  const statusMessages = {
    pending: "Your order has been received",
    processing: "Your order is being prepared",
    shipped: "Your order has been shipped",
    completed: "Your order has been delivered",
    cancelled: "Your order has been cancelled",
  };
  const message =
    statusMessages[currentStatus as keyof typeof statusMessages] || "Your order status has been updated";

  return (
    <button
      onClick={sendNotification}
      className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200"
    >
      <Bell className="w-4 h-4 mr-1" />
      Notify Customer
    </button>
  );
};

export default NotificationButton;
