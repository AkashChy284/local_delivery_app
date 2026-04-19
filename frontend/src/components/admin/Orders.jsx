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

      if (data.length > 0 && lastOrderId && data[0]._id !== lastOrderId) {
        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
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

    const interval = setInterval(fetchOrders, 5000);

    return () => clearInterval(interval);
  }, [lastOrderId]);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(
        `https://local-delivery-app-l4je.onrender.com/api/orders/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.log("Update Error:", data);
        alert("Failed to update status");
        return;
      }

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status } : order
        )
      );
    } catch (err) {
      console.error(err);
      alert("Something went wrong while updating status");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "accepted":
        return "bg-blue-100 text-blue-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-4">
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found 😔</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start mb-3 gap-4">
              <div>
                <h2 className="font-semibold text-lg">
                  {order.customerName || "No Name"}
                </h2>
                <p className="text-sm text-gray-600">{order.phone || "No phone"}</p>
                <p className="text-sm text-gray-500">
                  {order.address || "No address"}
                </p>
              </div>

              <span
                className={`text-sm px-3 py-1 rounded-full ${getStatusStyle(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            <div className="text-sm text-gray-700 mb-3 space-y-1">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, i) => (
                  <p key={i}>
                    {item.name} × {item.quantity}
                  </p>
                ))
              ) : (
                <p>No items</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-3">
              <span className="font-bold text-green-600 text-lg">
                ₹{order.totalAmount || 0}
              </span>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateStatus(order._id, "accepted")}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                >
                  Accept
                </button>

                <button
                  onClick={() => updateStatus(order._id, "delivered")}
                  className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                >
                  Delivered
                </button>

                <button
                  onClick={() => updateStatus(order._id, "cancelled")}
                  className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                >
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