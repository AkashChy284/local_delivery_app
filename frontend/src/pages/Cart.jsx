import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import OrderSuccess from "../components/OrderSuccess";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, increaseQty, decreaseQty } = useCart();

  const BASE_URL = "http://localhost:5000";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const deliveryCharge = cart.length > 0 ? 30 : 0;
  const handlingCharge = cart.length > 0 ? 10 : 0;
  const grandTotal = totalPrice + deliveryCharge + handlingCharge;
  const distanceRange = "To be verified";

  const saveOrderToHistory = (order) => {
    const existing = JSON.parse(localStorage.getItem("myOrders") || "[]");

    const newEntry = {
      _id: order._id,
      customerName: order.customerName,
      phone: order.phone,
      address: order.address,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      distance: order.distance,
      deliveryCharge: order.deliveryCharge,
      handlingCharge: order.handlingCharge,
    };

    const updated = [newEntry, ...existing.filter((o) => o._id !== order._id)];

    localStorage.setItem("myOrders", JSON.stringify(updated));
    localStorage.setItem("lastOrderId", order._id);
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert("Please fill all details");
      return;
    }

    const orderData = {
      customerName: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      distance: distanceRange,
      subtotal: totalPrice,
      deliveryCharge,
      handlingCharge,
      totalAmount: grandTotal,
      items: cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.qty,
      })),
    };

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      console.log("Placed order response:", data);

      if (!res.ok || !data._id) {
        throw new Error(data.message || "Failed to place order");
      }

      setPlacedOrderId(data._id);
      setOrderSuccess(true);

      saveOrderToHistory(data);
      localStorage.removeItem("cart");

      setTimeout(() => {
        navigate(`/track-order/${data._id}`);
      }, 2200);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] py-4 sm:py-8 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
          <div className="bg-green-600 text-white px-5 sm:px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="font-bold text-lg sm:text-xl">Your Cart</h1>
              <p className="text-xs sm:text-sm text-green-100">
                Review items and place your order
              </p>
            </div>

            <button
              onClick={() => navigate("/")}
              className="text-xs sm:text-sm bg-white text-green-700 px-3 py-2 rounded-xl font-semibold"
            >
              Continue
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-14 text-gray-500 bg-white">
              Your cart is empty 😔
            </div>
          ) : (
            <>
              <div className="p-4 sm:p-6 border-b bg-white">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Delivery Details
                </h2>

                <div className="grid gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full border border-gray-200 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="w-full border border-gray-200 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />

                  <textarea
                    placeholder="Full Address"
                    rows="3"
                    className="w-full border border-gray-200 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />

                  <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">📍</div>

                      <div>
                        <p className="font-semibold text-gray-800">
                          Delivery distance will be verified
                        </p>

                        <p className="text-sm text-gray-600 mt-1">
                          Base delivery charge is ₹30 for nearby areas. Final
                          distance will be checked from your address by Shivam
                          Express.
                        </p>

                        <p className="text-xs text-green-700 mt-2 font-medium">
                          Estimated delivery: 30–60 minutes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 sm:px-6 py-4 bg-white">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Cart Items
                </h2>

                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-50 rounded-2xl h-16 w-16 flex items-center justify-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-14 w-14 object-contain rounded"
                          />
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-sm text-green-600 font-bold">
                            ₹{item.price}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-2 py-1">
                          <button
                            onClick={() => decreaseQty(item._id)}
                            className="px-2 py-1 font-bold"
                          >
                            -
                          </button>

                          <span className="font-semibold min-w-[20px] text-center">
                            {item.qty}
                          </span>

                          <button
                            onClick={() => increaseQty(item._id)}
                            className="px-2 py-1 font-bold"
                          >
                            +
                          </button>
                        </div>

                        <div className="font-bold text-gray-800 min-w-[70px] text-right">
                          ₹{item.price * item.qty}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t px-4 sm:px-6 py-5 bg-white">
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Delivery estimate</span>
                    <span>₹{deliveryCharge}</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Handling Charge</span>
                    <span>₹{handlingCharge}</span>
                  </div>

                  <div className="flex justify-between text-lg font-bold text-green-700 border-t pt-3 mt-3">
                    <span>Total</span>
                    <span>₹{grandTotal}</span>
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    *Delivery charge may change after address verification.
                  </p>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3.5 rounded-2xl font-bold hover:bg-green-700 disabled:opacity-70"
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <OrderSuccess show={orderSuccess} orderId={placedOrderId} />
    </div>
  );
}