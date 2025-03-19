import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import Subscriptions from "./pages/Subscriptions";
import Deliveries from "./pages/Deliveries";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import ProductsPage from "./pages/ProductsPage";
import FarmsPage from "./pages/FarmsPage";
import CartPage from "./pages/CartPage";
import FarmerDashboard from "./pages/FarmerDashboard";
import AboutPage from "./pages/AboutPage";
import FarmRegistration from "./pages/FarmRegistration";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          {/* Navbar appears on all pages */}
          <Navbar />

          {/* Main content */}
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/farms" element={<FarmsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/farm-registration" element={<FarmRegistration />} />
              <Route path="/farmer-dashboard" element={<FarmerDashboard />} />

              <Route
                path="/inventory"
                element={
                  <ProtectedRoute>
                    <Inventory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subscriptions"
                element={
                  <ProtectedRoute>
                    <Subscriptions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/deliveries"
                element={
                  <ProtectedRoute>
                    <Deliveries />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
            {/*  <Route
                path="/farmer-dashboard"
                element={
                  <ProtectedRoute>
                    <FarmerDashboard />
                  </ProtectedRoute>
                }
              /> */}
            </Routes>
          </div>

          {/* Footer appears on all pages */}
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;