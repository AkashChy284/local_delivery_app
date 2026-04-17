import { useEffect, useState, useRef } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [lastOrderId, setLastOrderId] = useState(null);

  const audioRef = useRef(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(
        "https://local-delivery-app-l4je.onrender.com/api/orders",
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.log("Error:", data);
        return;
      }

      // 🔔 NEW ORDER DETECTION
      if (data.length > 0 && lastOrderId && data[0]._id !== lastOrderId) {
        audioRef.current.play(); // 🔊 play sound
        alert("🆕 New Order Received!");
      }

      if (data.length > 0) {
        setLastOrderId(data[0]._id);
      }

      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();

    // 🔁 AUTO REFRESH EVERY 5 SECONDS
    const interval = setInterval(fetchOrders, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">

      {/* 🔊 SOUND */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found 😔</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-lg">
                {order.customerName || "No Name"}
              </h2>

              <span className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                {order.status}
              </span>
            </div>

            <p className="text-sm text-gray-600">{order.phone}</p>
            <p className="text-sm text-gray-500 mb-2">
              {order.address}
            </p>

            {/* ITEMS */}
            <div className="text-sm text-gray-700 mb-2">
              {order.items.map((item, i) => (
                <p key={i}>
                  {item.name} × {item.quantity}
                </p>
              ))}
            </div>

            {/* FOOTER */}
            <div className="flex justify-between items-center mt-3">
              <span className="font-bold text-green-600">
                ₹{order.totalAmount}
              </span>

              <div className="space-x-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs">
                  Accept
                </button>

                <button className="bg-green-500 text-white px-3 py-1 rounded text-xs">
                  Delivered
                </button>

                <button className="bg-red-500 text-white px-3 py-1 rounded text-xs">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}