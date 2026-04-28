import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function TrackOrder() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://local-delivery-app-l4je.onrender.com";

  // 🏪 Your shop address
  const STORE_ADDRESS = "Vidyapati Chowk, Benipatti, Bihar";

  const fetchOrder = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/orders/${id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch order");
      }

      setOrder(data);
      localStorage.setItem("lastOrderId", data._id);
    } catch (err) {
      console.error(err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const clearTrackedOrder = () => {
    localStorage.removeItem("lastOrderId");
    localStorage.removeItem("lastOrderMeta");
    navigate("/");
  };

  const getStepState = (step) => {
    if (!order) return "pending";

    const status = order.status;

    if (status === "cancelled") {
      return step === "cancelled" ? "done" : "disabled";
    }

    if (step === "confirmed") return "done";

    if (step === "accepted") {
      return ["accepted", "delivered"].includes(status) ? "done" : "active";
    }

    if (step === "delivered") {
      return status === "delivered" ? "done" : "disabled";
    }

    return "disabled";
  };

  const stepDotClass = (state) => {
    if (state === "done") return "bg-green-600";
    if (state === "active") return "bg-yellow-400";
    return "bg-gray-300";
  };

  const mapUrl = order
    ? `https://maps.google.com/maps?saddr=${encodeURIComponent(
        STORE_ADDRESS
      )}&daddr=${encodeURIComponent(order.address)}&output=embed`
    : "";

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/${encodeURIComponent(
      STORE_ADDRESS
    )}/${encodeURIComponent(order.address)}`;

    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800">Order not found</h2>
          <p className="text-gray-500 mt-2">We could not find this order.</p>

          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-green-600 text-white px-5 py-3 rounded-2xl font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
          <div className="bg-green-600 text-white px-6 py-5">
            <h1 className="text-2xl font-bold">Track Order</h1>
            <p className="text-sm text-green-100 mt-1">
              Live order status from Shivam Express
            </p>
          </div>

          <div className="p-6">
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-5">
              <p className="text-xs text-gray-500">Order ID</p>
              <p className="font-semibold text-green-700 break-all mt-1">
                {order._id}
              </p>

              <p className="text-xs text-gray-500 mt-3">Current Status</p>
              <p className="font-bold text-base mt-1 capitalize text-gray-800">
                {order.status}
              </p>
            </div>

            {/* STATUS TIMELINE */}
            {order.status === "cancelled" ? (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-6">
                <p className="text-red-700 font-bold text-lg">
                  Order Cancelled
                </p>
                <p className="text-sm text-red-600 mt-1">
                  This order has been cancelled by the store/admin.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-5 h-5 rounded-full mt-1 ${stepDotClass(
                      getStepState("confirmed")
                    )}`}
                  ></div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      Order Confirmed
                    </p>
                    <p className="text-sm text-gray-500">
                      Your order has been placed successfully
                    </p>
                  </div>
                </div>

                <div className="ml-2 h-8 border-l-2 border-dashed border-gray-300"></div>

                <div className="flex items-start gap-4">
                  <div
                    className={`w-5 h-5 rounded-full mt-1 ${stepDotClass(
                      getStepState("accepted")
                    )}`}
                  ></div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      Preparing Order
                    </p>
                    <p className="text-sm text-gray-500">
                      Store is preparing your items
                    </p>
                  </div>
                </div>

                <div className="ml-2 h-8 border-l-2 border-dashed border-gray-300"></div>

                <div className="flex items-start gap-4">
                  <div
                    className={`w-5 h-5 rounded-full mt-1 ${stepDotClass(
                      getStepState("delivered")
                    )}`}
                  ></div>
                  <div>
                    <p className="font-semibold text-gray-800">Delivered</p>
                    <p className="text-sm text-gray-500">
                      Your order has been delivered
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* MAP SECTION */}
            <div className="mt-8 bg-white border rounded-2xl overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <h2 className="font-bold text-gray-800">Delivery Route</h2>
                <p className="text-sm text-gray-500 mt-1">
                  From Shivam Express to your delivery address
                </p>
              </div>

              <iframe
                title="Delivery Route Map"
                src={mapUrl}
                className="w-full h-72 border-0"
                loading="lazy"
                allowFullScreen
              ></iframe>

              <div className="p-4">
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                  <p className="text-sm text-gray-700">
                    📍 Store: <b>{STORE_ADDRESS}</b>
                  </p>

                  <p className="text-sm text-gray-700 mt-2">
                    🏠 Delivery: <b>{order.address}</b>
                  </p>

                  <p className="text-sm text-gray-700 mt-2">
                    🚚 Verified distance: <b>{order.distance || "To be verified"}</b>
                  </p>

                  <p className="text-sm text-gray-700 mt-2">
                    Delivery charge: <b>₹{order.deliveryCharge || 0}</b>
                  </p>

                  <button
                    onClick={openGoogleMaps}
                    className="mt-4 w-full bg-green-600 text-white py-3 rounded-2xl font-semibold hover:bg-green-700"
                  >
                    Open Full Route in Google Maps
                  </button>
                </div>
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div className="mt-8 bg-gray-50 border rounded-2xl p-4">
              <h2 className="font-bold text-gray-800 mb-3">Order Summary</h2>

              <p className="text-sm text-gray-600">
                <span className="font-medium">Name:</span> {order.customerName}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Phone:</span> {order.phone}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Address:</span> {order.address}
              </p>

              <div className="mt-4 space-y-2">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm text-gray-700"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-3 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal || 0}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery</span>
                  <span>₹{order.deliveryCharge || 0}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Handling</span>
                  <span>₹{order.handlingCharge || 0}</span>
                </div>

                <div className="flex justify-between font-bold text-green-700 border-t pt-3">
                  <span>Total</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => navigate("/")}
                className="bg-green-600 text-white py-3 rounded-2xl font-semibold hover:bg-green-700"
              >
                Back to Home
              </button>

              <button
                onClick={clearTrackedOrder}
                className="bg-gray-100 text-gray-800 py-3 rounded-2xl font-semibold hover:bg-gray-200"
              >
                Clear Tracking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}