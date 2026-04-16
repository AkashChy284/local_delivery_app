import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const navigate = useNavigate();

  // ✅ REAL CART (global state)
  const { cart, increaseQty, decreaseQty } = useCart();

  const phoneNumber = "918935847223";

  // ✅ BACKEND URL
  const BASE_URL = "https://local-delivery-app-l4je.onrender.com";

  // ✅ TOTAL
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // ✅ WHATSAPP ORDER
  const sendWhatsApp = () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    let msg = "Hi, I want to place an order:\n\n";

    cart.forEach((item) => {
      msg += `🛒 ${item.name} - Qty: ${item.qty} - ₹${
        item.price * item.qty
      }\n`;
    });

    msg += `\nTotal: ₹${totalPrice}`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  // 🛒 NEW: PLACE ORDER (DATABASE)
  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    const orderData = {
      customerName: "Customer",
      phone: "9999999999",
      address: "Village Address",

      items: cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.qty,
      })),

      totalAmount: totalPrice,
    };

    try {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error();

      alert("✅ Order Saved (Admin will process)");

    } catch (err) {
      console.error(err);
      alert("❌ Failed to place order");
    }
  };

  return (
    <div className="min-h-screen bg-green-100 p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="bg-green-700 text-white px-6 py-4 flex justify-between items-center">
          <h1 className="font-semibold text-lg">🛒 Your Cart</h1>
          <button
            onClick={() => navigate("/")}
            className="text-sm underline"
          >
            Continue Shopping
          </button>
        </div>

        {/* EMPTY CART */}
        {cart.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            Your cart is empty 😔
          </div>
        ) : (
          <>
            {/* ITEMS */}
            <div className="px-6 py-4 space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        ₹{item.price}
                      </p>
                    </div>
                  </div>

                  {/* QTY CONTROL */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQty(item._id)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>

                    <span>{item.qty}</span>

                    <button
                      onClick={() => increaseQty(item._id)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>

                  {/* PRICE */}
                  <div className="font-medium">
                    ₹{item.price * item.qty}
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="border-t px-6 py-4">
              <div className="flex justify-between mb-4">
                <p className="text-gray-600">Total</p>
                <p className="font-semibold text-lg">₹{totalPrice}</p>
              </div>

              {/* 🛒 NEW BUTTON */}
              <button
                onClick={placeOrder}
                className="w-full bg-blue-600 text-white py-3 rounded-lg mb-3 hover:bg-blue-700"
              >
                🛒 Place Order
              </button>

              {/* EXISTING WHATSAPP */}
              <button
                onClick={sendWhatsApp}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
              >
                📲 Order on WhatsApp
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}