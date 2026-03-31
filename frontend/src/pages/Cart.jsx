import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([
    { id: 1, name: "Amul Milk 1L", price: 60, qty: 1 },
    { id: 2, name: "Fresh Bananas", price: 40, qty: 1 },
    { id: 3, name: "Parle-G Biscuit", price: 25, qty: 2 },
    { id: 4, name: "Surf Excel 1kg", price: 250, qty: 1 },
  ]);

  const phoneNumber = "919876543210";

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const sendWhatsApp = () => {
    let msg = "Hi, I want to place an order:\n\n";

    cart.forEach((item) => {
      msg += `🛒 ${item.name} - Qty: ${item.qty} - ₹${item.price * item.qty}\n`;
    });

    msg += `\nSubtotal (Approx): ₹${totalPrice}`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-green-100 p-4">

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* NAVBAR */}
        <div className="bg-green-900 text-white px-6 py-4 flex justify-between items-center">
          <h1 className="font-semibold">📍 YourLocalDelivery</h1>
          <p className="text-sm">Cart</p>
        </div>

        {/* HEADER */}
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold">Your Cart</h2>
          <p className="text-sm text-gray-500">
            Review your items before sending order
          </p>
        </div>

        {/* INFO BOX */}
        <div className="mx-6 mb-4 bg-blue-50 border border-blue-200 text-blue-700 text-sm p-3 rounded-lg">
          This is not a direct checkout. After placing order, we will confirm
          availability and final price on WhatsApp.
        </div>

        {/* TABLE HEADER */}
        <div className="grid grid-cols-3 px-6 text-sm font-medium text-gray-500 border-b pb-2">
          <p>Item</p>
          <p className="text-center">Qty</p>
          <p className="text-right">Price</p>
        </div>

        {/* ITEMS */}
        <div className="px-6 py-4 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-3 items-center"
            >
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500">
                  Approx ₹{item.price}
                </p>
              </div>

              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>

                <span>{item.qty}</span>

                <button
                  onClick={() => increaseQty(item.id)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>

              <div className="text-right font-medium">
                ₹{item.price * item.qty}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="border-t px-6 py-4">

          <div className="flex justify-between mb-4">
            <p className="text-gray-600">Subtotal (Approx)</p>
            <p className="font-semibold">₹{totalPrice}</p>
          </div>

          <div className="flex gap-3">
            {/* ✅ FIXED BUTTON */}
            <button
              onClick={() => navigate("/")}
              className="flex-1 border rounded-lg py-2"
            >
              Continue Shopping
            </button>

            <button
              onClick={sendWhatsApp}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Send Order on WhatsApp
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}