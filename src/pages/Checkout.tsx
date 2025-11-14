import React, { useState } from "react";
import { PaystackButton } from "react-paystack";
import { useCart } from "../context/CardContext";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

const CheckoutPage: React.FC = () => {
  const { cartItems, totalAmount, clearCart } = useCart();
  const [shippingMethod, setShippingMethod] = useState<string>("standard");

  const publicKey = "pk_test_yourpublickey"; // Replace with your Paystack public key
  const email = "customer@example.com"; // Replace with actual user email

  const componentProps = {
    email,
    amount: totalAmount * 100,
    metadata: { cart: cartItems },
    publicKey,
    text: "Pay with Paystack",
    onSuccess: (response: any) => {
      alert("Payment Successful! Reference: " + response.reference);
      // Here you can send order + payment info to backend
      clearCart();
    },
    onClose: () => alert("Payment cancelled."),
  };

  return (
    <>
      <Navbar />

      {/* Hero Section for Checkout */}
      <Hero
        title="Finalize Your Order"
        subtitle="Please review your cart, add delivery details, and complete your purchase securely."
        
      />

      {/* Checkout Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Delivery Details */}
          <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Delivery Details</h2>

            <button className="bg-primary text-white py-2 px-4 rounded-lg mb-4 hover:opacity-90">
              Add Delivery Details
            </button>

            <textarea
              placeholder="Any note to the merchant..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 mb-4 resize-none dark:bg-gray-700 dark:text-white"
              rows={4}
            />

            <h3 className="text-lg font-semibold mb-2">Shipping Method</h3>
            <select
              value={shippingMethod}
              onChange={(e) => setShippingMethod(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 mb-4 dark:bg-gray-700 dark:text-white"
            >
              <option value="standard">Standard Shipping</option>
              <option value="express">Express Shipping</option>
              <option value="pickup">Store Pickup</option>
            </select>
          </div>

          {/* Right: Your Orders */}
          <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
            <div className="flex flex-col gap-3 mb-4 max-h-96 overflow-y-auto">
              {cartItems.length === 0 && <p>No items in cart.</p>}
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b border-gray-300 dark:border-gray-600 pb-2"
                >
                  <span>
                    {item.name} {item.size ? `(${item.size})` : ""}
                  </span>
                  <span className="font-semibold">₦{item.price}</span>
                </div>
              ))}
            </div>

            <p className="text-lg font-semibold mb-4">Total: ₦{totalAmount}</p>

            {/* Paystack Button */}
            <PaystackButton
              {...componentProps}
              className="w-full bg-primary text-white py-3 rounded-lg mb-4 hover:opacity-90"
            />

            {/* Place Order Button */}
            <button
              onClick={() => alert("Order placed!")}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:opacity-90"
            >
              Place Your Order
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default CheckoutPage;
