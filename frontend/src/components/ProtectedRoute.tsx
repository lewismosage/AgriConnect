// components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SubscriptionRequired from "./SubscriptionRequired";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, subscriptionStatus } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is a farmer and subscription is required
  if (user.user_type === "farmer" && subscriptionStatus?.has_access === false) {
    return (
      <SubscriptionRequired
        message={subscriptionStatus.message || "Subscription required"}
        subscriptionData={subscriptionStatus.subscription}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;