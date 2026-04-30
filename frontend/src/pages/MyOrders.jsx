import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const BASE_URL = "https://local-delivery-app-l4je.onrender.com";

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${BASE_URL}/api/orders/my/orders`, {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]));
  }, []);

  const getStatusClass = (status) => {
    if (status === "pending") return "bg-yellow-100 text-yellow-700";
    if (status === "accepted") return "bg-blue-100 text-blue-700";
    if (status === "delivered") return "bg-green-100 text-green-700";
    if (status === "cancelled") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] px-4 py-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
          <div className="bg-green-600 text-white px-6 py-5">
            <h1 className="text-2xl font-bold">My Orders</h1>
            <p className="text-sm text-green-100 mt-1">
              Your saved order history
            </p>
          </div>

          <div className="p-5">
            {orders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No orders yet 😔
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border rounded-2xl p-4 shadow-sm bg-white"
                  >
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-bold text-gray-900">
                          ₹{order.totalAmount}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {order.address}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {order._id}
                        </p>
                      </div>

                      <span
                        className={`h-fit px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="mt-3 text-sm text-gray-600">
                      {order.items?.slice(0, 3).map((item, i) => (
                        <p key={i}>
                          {item.name} × {item.quantity}
                        </p>
                      ))}
                    </div>

                    <button
                      onClick={() => navigate(`/track-order/${order._id}`)}
                      className="w-full mt-4 bg-green-600 text-white py-3 rounded-2xl font-semibold"
                    >
                      Track Order
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => navigate("/")}
              className="w-full mt-6 bg-gray-100 py-3 rounded-2xl font-semibold"
            >
              Back Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}