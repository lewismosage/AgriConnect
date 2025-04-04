import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth for authentication check
import ShippingInformation from "./ShippingInformation";
import PaymentInformation from "./PaymentInformation";
import { Truck, Check, X } from "lucide-react";
import axios from "../contexts/axioConfig";

interface AddressDetails {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentMethodDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
}

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    farm?: {
      id: string;
    };
  };
  quantity: number;
}

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <p className="mt-2 text-gray-600">{message}</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems = [] as CartItem[], clearCart } = useCart();
  const { user } = useAuth(); // Get the user from the AuthContext

  const items = location.state?.cartItems || cartItems;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    number | null
  >(null);

  const [shippingDetails, setShippingDetails] = useState({
    selectedAddressId: 0,
    addressDetails: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    } as AddressDetails,
  });

  const [paymentDetails, setPaymentDetails] = useState({
    selectedMethodId: 0,
    methodDetails: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      nameOnCard: "",
    } as PaymentMethodDetails,
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const subtotal = items.reduce(
    (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setShowAlertModal(true);
  };

  const handleAddressSelect = (addressId: number) => {
    setSelectedAddressId(addressId);
  };

  const handlePaymentMethodSelect = (methodId: number) => {
    setSelectedPaymentMethodId(methodId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the user is logged in
    if (!user) {
      showAlert("Authentication Required", "Please log in to place an order.");
      return;
    }

    setIsSubmitting(true);

    if (!selectedAddressId) {
      showAlert("Missing Information", "Please select a shipping address");
      setIsSubmitting(false);
      return;
    }

    if (!selectedPaymentMethodId) {
      showAlert("Missing Information", "Please select a payment method");
      setIsSubmitting(false);
      return;
    }

    if (!items.length) {
      showAlert("Empty Cart", "Your cart is empty");
      setIsSubmitting(false);
      return;
    }

    if (!items[0].product.farm?.id) {
      showAlert("Error", "Products must belong to a farm");
      setIsSubmitting(false);
      return;
    }

    try {
      const orderData = {
        farm_id: items[0].product.farm.id,
        shipping_address: JSON.stringify({
          street: shippingDetails.addressDetails.street,
          city: shippingDetails.addressDetails.city,
          state: shippingDetails.addressDetails.state,
          zipCode: shippingDetails.addressDetails.zipCode,
          country: shippingDetails.addressDetails.country,
        }),
        payment_method: selectedPaymentMethodId.toString(),
        items: items.map((item: CartItem) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };

      const response = await axios.post("/api/orders/", orderData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data && response.data.order_number) {
        setOrderNumber(response.data.order_number);
        setOrderPlaced(true);
        clearCart();

        const newOrder = {
          id: response.data.id,
          orderNumber: response.data.order_number,
          date: new Date().toISOString(),
          items: items.map((item: CartItem) => ({
            product: {
              id: item.product.id,
              name: item.product.name,
              price: item.product.price,
              image: item.product.image,
            },
            quantity: item.quantity,
          })),
          shippingAddress: shippingDetails.addressDetails,
          paymentMethod: selectedPaymentMethodId,
          subtotal: subtotal,
          shipping: shipping,
          tax: tax,
          total: total,
          status: "pending",
        };

        try {
          const existingOrders = JSON.parse(
            localStorage.getItem("agriConnectOrders") || "[]"
          );
          localStorage.setItem(
            "agriConnectOrders",
            JSON.stringify([newOrder, ...existingOrders])
          );
        } catch (storageError) {
          console.error("Error saving to localStorage:", storageError);
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Order submission error:", error);

      let errorMessage = "Failed to place order. Please try again.";

      if (error.response) {
        if (error.response.data) {
          if (typeof error.response.data === "string") {
            errorMessage = error.response.data;
          } else if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
          } else if (error.response.data.non_field_errors) {
            errorMessage = error.response.data.non_field_errors.join(", ");
          } else {
            errorMessage = JSON.stringify(error.response.data);
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      showAlert("Order Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSuccessScreen = () => (
    <div className="text-center py-12">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="mt-6 text-2xl font-bold text-gray-900">
        Order Placed Successfully!
      </h2>
      <p className="mt-2 text-lg text-gray-500">
        Thank you for your order with AgriConnect.
      </p>
      <p className="mt-1 text-sm text-gray-500">
        Your order number is:{" "}
        <span className="font-semibold">{orderNumber}</span>
      </p>
      <p className="mt-2 text-gray-500">
        We've sent a confirmation email with your order details.
      </p>
      <div className="mt-8">
        <button
          onClick={() => navigate("/products")}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );

  if (orderPlaced) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderSuccessScreen()}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ShippingInformation onSelectAddress={handleAddressSelect} />

            <PaymentInformation onSelectMethod={handlePaymentMethodSelect} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Truck className="mr-3 text-green-600" size={24} />
              Order Summary
            </h2>
            <div className="space-y-4">
              {items.map((item: CartItem) => (
                <div
                  key={item.product.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <img
                      src={
                        item.product.image || "https://via.placeholder.com/50"
                      }
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-md mr-4"
                    />
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} • ${item.product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 mt-4 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title={alertTitle}
        message={alertMessage}
      />
    </div>
  );
};

export default CheckoutPage;
