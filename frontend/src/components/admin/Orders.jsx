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

      if (!res.ok) return;

      if (data.length > 0 && lastOrderId && data[0]._id !== lastOrderId) {
        audioRef.current?.play().catch(() => {});
        alert("🆕 New Order!");
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

  // ✅ UPDATED FUNCTION (IMPORTANT)
  const updateStatus = async (id, status, distance = null) => {
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
          body: JSON.stringify({
            status,
            distance: distance ? Number(distance) : undefined,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert("Update failed");
        return;
      }

      setOrders((prev) =>
        prev.map((o) => (o._id === id ? data : o))
      );
    } catch (err) {
      console.error(err);
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
      <audio ref={audioRef} src="/notification.mp3" />

      {orders.length === 0 ? (
        <p>No orders</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="bg-white p-4 rounded shadow">

            {/* HEADER */}
            <div className="flex justify-between">
              <div>
                <p className="font-bold">{order.customerName}</p>
                <p className="text-sm">{order.phone}</p>
                <p className="text-sm">{order.address}</p>
              </div>

              <span className={`px-2 py-1 text-xs rounded ${getStatusStyle(order.status)}`}>
                {order.status}
              </span>
            </div>

            {/* ITEMS */}
            <div className="mt-2 text-sm">
              {order.items?.map((item, i) => (
                <p key={i}>
                  {item.name} × {item.quantity}
                </p>
              ))}
            </div>

            {/* BILL */}
            <div className="mt-2 text-sm bg-gray-50 p-2 rounded">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal || 0}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span>₹{order.deliveryCharge || 0}</span>
              </div>

              <div className="flex justify-between">
                <span>Handling</span>
                <span>₹{order.handlingCharge || 0}</span>
              </div>

              <div className="flex justify-between font-bold border-t mt-1 pt-1">
                <span>Total</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>

            {/* DISTANCE */}
            <p className="text-xs mt-1">
              Distance: {order.distance || "Not set"}
            </p>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-3 items-center">

              {/* INPUT */}
              <input
                type="number"
                placeholder="km"
                className="w-14 border px-1 text-xs"
                onChange={(e) => (order.tempDistance = e.target.value)}
              />

              <button
                onClick={() =>
                  updateStatus(order._id, "accepted", order.tempDistance)
                }
                className="bg-blue-500 text-white px-2 py-1 text-xs"
              >
                Accept
              </button>

              <button
                onClick={() =>
                  updateStatus(order._id, "delivered")
                }
                className="bg-green-500 text-white px-2 py-1 text-xs"
              >
                Delivered
              </button>

              <button
                onClick={() =>
                  updateStatus(order._id, "cancelled")
                }
                className="bg-red-500 text-white px-2 py-1 text-xs"
              >
                Cancel
              </button>
            </div>

          </div>
        ))
      )}
    </div>
  );
}