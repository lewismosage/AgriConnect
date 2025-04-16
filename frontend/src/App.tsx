import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Inventory from "./pages/Inventory";
import Subscriptions from "./pages/Subscriptions";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import ProductsPage from "./pages/ProductsPage";
import FarmsPage from "./pages/FarmsPage";
import CartPage from "./pages/CartPage";
import FarmerDashboard from "./pages/FarmerDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import AboutPage from "./pages/AboutPage";
import FarmRegistration from "./pages/FarmRegistration";
import FarmProducts from "./pages/FarmProducts";
import FarmDetailPage from './pages/FarmDetailPage';
import FarmShopPage from './pages/FarmShopPage';
import { CartProvider } from './contexts/CartContext';
import Wishlist from './pages/Wishlist';
import CheckoutPage from './pages/CheckoutPage';
import OrderDetails from './pages/OrderDetails';
import OrdersPage from './pages/OrdersPage';
import OrderHistory from './pages/OrderHistory';
import OrderTracking from './pages/OrderTracking';
import ProductDetailPage from './pages/ProductDetailPage';
import PaymentVerificationPage from './pages/PaymentVerificationPage';
import PaymentsToVerifyPage from './pages/PaymentsToVerifyPage';
import SubscriptionPage from './pages/SubscriptionPage';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';


function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/farms" element={<FarmsPage />} />
                <Route path="/farms/:farmId" element={<FarmDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/farm-registration" element={<FarmRegistration />} />
                <Route path="/farm-products" element={<FarmProducts />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/farm/:farmId/shop" element={<FarmShopPage />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/orders/:id/tracking" element={<OrderTracking />} />
                <Route path="/orders-history" element={<OrderHistory />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
                <Route path="/products/:productId" element={<ProductDetailPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                <Route
                  path="/subscriptions"
                  element={
                    <ProtectedRoute>
                      <Subscriptions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer-dashboard"
                  element={
                    <ProtectedRoute>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer-dashboard"
                  element={
                    <ProtectedRoute>
                      <FarmerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path="/payments-to-verify" 
                  element={
                    <ProtectedRoute>
                      <PaymentsToVerifyPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/payment-verification/:orderId" 
                  element={
                    <ProtectedRoute>
                      <PaymentVerificationPage />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </div>

            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;