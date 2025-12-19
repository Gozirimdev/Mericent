// CheckoutPage.tsx
import React, { useEffect, useState } from "react";
import type { Order, DeliveryInfo } from "../types/order";
import { useCart } from "../context/CardContext";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
// country-state-city is used inside DeliveryModal; no direct import needed here
import DeliveryDetails from "../components/checkout/DeliveryDetails";
import ShippingSelector from "../components/checkout/ShippingSelector";
import OrdersTable from "../components/checkout/OrdersTable";
import RecentOrders from "../components/checkout/RecentOrders";
import OrderPreviewModal from "../components/checkout/OrderPreviewModal";
import DeliveryModal from "../components/checkout/DeliveryModal";
import {
  fetchShippingOptions,
  fetchOrders,
  persistOrderLocal,
  createOrderOnServer,
  createPayment,
} from "../utils/checkout";

/**
 * NOTE:
 * - Install: npm i country-state-city
 * - This component expects an API:
 *    GET  /api/shipping-prices       -> returns [{ state: "Lagos", price: 2500 }, ...]
 *    POST /api/create-payment        -> create payment (you already had this)
 */

const CheckoutPage: React.FC = () => {
  const { cartItems, totalAmount, clearCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderPreview, setOrderPreview] = useState<Order | null>(null);

  // Shipping options from admin/backend
  const [shippingOptions, setShippingOptions] = useState<{ state: string; price: number }[]>([]);
  const [selectedShippingState, setSelectedShippingState] = useState<string>("");
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [processing, setProcessing] = useState(false);

  // Delivery modal
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    fullName: "",
    email: "",
    phoneCode: "",
    phone: "",
    countryIso: "",
    countryName: "",
    stateIso: "",
    stateName: "",
    cityName: "",
  });

  // Final total includes shipping fee
  const finalTotal = (Number(totalAmount) || 0) + (shippingFee || 0);

  // Fetch shipping options from backend (admin-controlled)
  useEffect(() => {
    fetchShippingOptions().then(setShippingOptions).catch(() => {});
  }, []);

  // Load recent orders (backend or localStorage)
  useEffect(() => {
    fetchOrders().then(setOrders).catch(() => {});
  }, []);

  // Payment handler (sends cart + delivery + shipping to backend)
  const handleCheckout = async () => {
    // basic validation
    if (!deliveryInfo.fullName || !deliveryInfo.phone || !deliveryInfo.countryName) {
      alert("Please provide delivery information before proceeding.");
      return;
    }
    if (!selectedShippingState) {
      alert("Please select a shipping location.");
      return;
    }

    setProcessing(true);
    try {
      const payload: Partial<Order> = {
        items: cartItems,
        subtotal: Number(totalAmount) || 0,
        shipping: { state: selectedShippingState, fee: shippingFee },
        delivery: deliveryInfo,
        total: finalTotal,
        createdAt: new Date().toISOString(),
      };

      let createdOrder = await createOrderOnServer(payload);
      if (!createdOrder) {
        createdOrder = {
          id: Date.now(),
          ...payload,
        } as Order;
      }

      setOrders(persistOrderLocal(createdOrder));
      setOrderPreview(createdOrder as Order);
      setShowOrderModal(true);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  // Called after user confirms order in the preview modal — starts payment flow
  const proceedToPayment = async (order: Order | null) => {
    if (!order) return;
    setShowOrderModal(false);
    setProcessing(true);
    try {
      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: order.total || order.subtotal || 0,
          items: order.items,
          shipping: order.shipping,
          delivery: order.delivery,
          orderId: order.id,
        }),
      });
      const data = await res.json();
      if (data.payment_url) {
        clearCart();
        window.location.href = data.payment_url;
      } else {
        console.error("create-payment response:", data);
        alert("Payment URL not returned by backend.");
      }
    } catch (err) {
      console.error(err);
      alert("Payment initiation failed. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  // Save delivery data from modal
  const onSaveDelivery = (data: DeliveryInfo) => {
    setDeliveryInfo(data);
    setShowDeliveryModal(false);
  };

  return (
    <>
      <Navbar />
      <Hero
        title="Finalize Your Order"
        subtitle="Please review your cart, add delivery details, and complete your purchase securely."
      />

      <section className="py-10 bg-milk dark:bg-darkblack transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT: Delivery Details */}
          <div className="flex-1">
            <DeliveryDetails deliveryInfo={deliveryInfo} onOpenDelivery={() => setShowDeliveryModal(true)} />

            <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-2">Shipping Method</h3>
              <ShippingSelector
                shippingOptions={shippingOptions}
                selectedShippingState={selectedShippingState}
                setSelectedShippingState={setSelectedShippingState}
                setShippingFee={setShippingFee}
              />

              {selectedShippingState ? (
                <p className="font-semibold mb-2">Selected: {selectedShippingState} — ₦{shippingFee.toLocaleString()}</p>
              ) : (
                <p className="text-sm text-gray-600 mb-2">No shipping location selected.</p>
              )}

              <textarea
                placeholder="Any note to the merchant..."
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 mb-4 resize-none dark:bg-gray-700 dark:text-white"
                rows={4}
              />
            </div>
          </div>

          {/* RIGHT: Orders */}
          <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>

            <OrdersTable items={cartItems} />

            <div className="mb-4">
              <p className="text-lg font-semibold">Subtotal: ₦{Number(totalAmount).toLocaleString()}</p>
              <p className="text-lg font-semibold">Shipping: ₦{shippingFee.toLocaleString()}</p>
              <p className="text-xl font-bold mt-2">Total: ₦{finalTotal.toLocaleString()}</p>
            </div>

            <RecentOrders orders={orders} />

            <button
              onClick={handleCheckout}
              disabled={processing || cartItems.length === 0}
              className={`w-full py-3 rounded-lg ${processing || cartItems.length === 0 ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-green-600 text-white hover:opacity-90'}`}
            >
              {processing ? 'Processing…' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
        </div>
      </section>

      <OrderPreviewModal order={orderPreview} visible={showOrderModal} processing={processing} onConfirm={proceedToPayment} onCancel={() => setShowOrderModal(false)} />

      {/* Shipping selection is handled inline via ShippingSelector component */}

      {
        showDeliveryModal &&       <DeliveryModal value={deliveryInfo} onChange={setDeliveryInfo} onSave={onSaveDelivery} onClose={() => setShowDeliveryModal(false)} />

      }
    </>
  );
};

export default CheckoutPage;
