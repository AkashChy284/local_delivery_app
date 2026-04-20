import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const BASE_URL = "https://local-delivery-app-l4je.onrender.com";

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("myOrders") || "[]");

    if (stored.length === 0) {
      setOrders([]);
      return;
    }

    const fetchLatestOrders = async () => {
      try {
        const results = await Promise.all(
          stored.map(async (order) => {
            try {
              const res = await fetch(`${BASE_URL}/api/orders/${order._id}`);
              const data = await res.json();
              return res.ok ? data : order;
            } catch {
              return order;
            }
          })
        );

        setOrders(results);
        localStorage.setItem("myOrders", JSON.stringify(results));
      } catch (err) {
        console.error(err);
        setOrders(stored);
      }
    };

    fetchLatestOrders();
  }, []);

  const clearOrderHistory = () => {
    localStorage.removeItem("myOrders");
    localStorage.removeItem("lastOrderId");
    setOrders([]);
  };

  const getStatusClass = (status) => {
    if (status === "pending") return "bg-yellow-100 text-yellow-700";
    if (status === "accepted") return "bg-blue-100 text-blue-700";
    if (status === "delivered") return "bg-green-100 text-green-700";
    if (status === "cancelled") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">

          {/* HEADER */}
          <div className="bg-green-600 text-white px-6 py-5 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">My Orders</h1>
              <p className="text-sm text-green-100 mt-1">
                Your recent orders
              </p>
            </div>

            {orders.length > 0 && (
              <button
                onClick={clearOrderHistory}
                className="bg-white text-green-700 px-3 py-2 rounded-xl text-sm font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          {/* BODY */}
          <div className="p-6">
            {orders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No orders yet 😔
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold">
                          {order.customerName || "Customer"}
                        </p>

                        <p className="text-xs text-gray-500 break-all">
                          {order._id}
                        </p>

                        <p className="text-sm mt-1">
                          ₹{order.totalAmount}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 text-xs rounded-full ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/track-order/${order._id}`)
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm"
                      >
                        Track
                      </button>

                      <button
                        onClick={() => navigate("/products")}
                        className="bg-gray-200 px-4 py-2 rounded-xl text-sm"
                      >
                        Order Again
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => navigate("/")}
              className="w-full mt-6 bg-gray-200 py-3 rounded-xl"
            >
              Back Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}