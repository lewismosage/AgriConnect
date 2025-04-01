// components/InventoryPreview.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Package, ChevronRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface Product {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: string;
  category: string;
  image?: string; // Added image property
}

const InventoryPreview: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/products/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.length === 0) {
          setProducts([]);
          return;
        }

        // Process products to ensure image URLs are complete
        const processedProducts = response.data.map((product: any) => ({
          ...product,
          image: product.image
            ? product.image.startsWith("http")
              ? product.image
              : `${import.meta.env.VITE_BACKEND_URL}${product.image}`
            : null,
        }));

        setProducts(processedProducts.slice(0, 5));
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load inventory. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.farmer_profile?.farm) {
      fetchProducts();
    } else {
      console.log("No farmer profile or farm found");
      setLoading(false);
      setProducts([]);
    }
  }, [user]);

  const getStockStatus = (quantity: number) => {
    if (quantity <= 0) return "Out of Stock";
    if (quantity <= 10) return "Low Stock";
    return "In Stock";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center">
          <Package className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold ml-2">Product Inventory</h2>
        </div>
        <div className="p-4 text-center text-gray-500">
          Loading inventory...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center">
          <Package className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold ml-2">Product Inventory</h2>
        </div>
        <div className="p-4 text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center">
          <Package className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold ml-2">Product Inventory</h2>
        </div>
        <button
          onClick={() => navigate("/inventory")}
          className="text-sm text-green-600 font-medium hover:text-green-700 flex items-center"
        >
          View all <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {products.length > 0 ? (
          products.map((product) => {
            const status = getStockStatus(product.quantity);
            return (
              <div
                key={product.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        {product.quantity} {product.unit} • ${product.price}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Category: {product.category}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${getStatusColor(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-center text-gray-500">
            No products in inventory
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPreview;
