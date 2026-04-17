import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Dashboard({ setActive }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    fetch("https://local-delivery-app-l4je.onrender.com/api/orders", {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err));
  }, []);

  // 🔥 BASIC STATS
  const totalOrders = orders.length;

  const revenue = orders.reduce(
    (acc, o) => acc + (o.totalAmount || 0),
    0
  );

  const pending = orders.filter((o) => o.status === "pending").length;

  const delivered = orders.filter((o) => o.status === "delivered").length;

  // 🔥 LAST 7 DAYS DATA
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const day = date.toLocaleDateString("en-IN", {
      weekday: "short",
    });

    const dayOrders = orders.filter((o) => {
      const d = new Date(o.createdAt);
      return d.toDateString() === date.toDateString();
    });

    return {
      day,
      orders: dayOrders.length,
      revenue: dayOrders.reduce(
        (acc, o) => acc + (o.totalAmount || 0),
        0
      ),
    };
  }).reverse();

  // 🔥 PIE DATA
  const pieData = [
    { name: "Pending", value: pending },
    { name: "Delivered", value: delivered },
  ];

  const COLORS = ["#facc15", "#22c55e"];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Business insights & analytics
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div
          onClick={() => setActive("orders")}
          className="cursor-pointer p-6 rounded-2xl text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow hover:scale-105 transition"
        >
          <p>Total Orders</p>
          <h2 className="text-3xl font-bold">{totalOrders}</h2>
        </div>

        <div className="p-6 rounded-2xl text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow">
          <p>Revenue</p>
          <h2 className="text-3xl font-bold">
            ₹{revenue.toLocaleString()}
          </h2>
        </div>

        <div className="p-6 rounded-2xl text-white bg-gradient-to-r from-yellow-500 to-orange-500 shadow">
          <p>Pending</p>
          <h2 className="text-3xl font-bold">{pending}</h2>
        </div>

        <div className="p-6 rounded-2xl text-white bg-gradient-to-r from-blue-500 to-cyan-500 shadow">
          <p>Delivered</p>
          <h2 className="text-3xl font-bold">{delivered}</h2>
        </div>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 📈 ORDERS TREND */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="mb-4 font-semibold">Orders (Last 7 Days)</h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={last7Days}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#6366f1"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 🥧 STATUS PIE */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="mb-4 font-semibold">Order Status</h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={90}
                label
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* RECENT */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold">Recent Orders</h2>

          <button
            onClick={() => setActive("orders")}
            className="text-green-600 text-sm"
          >
            View All →
          </button>
        </div>

        {orders.slice(0, 5).map((o) => (
          <div
            key={o._id}
            className="flex justify-between border-b py-2 text-sm"
          >
            <span>{o.customerName}</span>
            <span>₹{o.totalAmount}</span>
            <span className="text-gray-500">{o.status}</span>
          </div>
        ))}
      </div>

    </div>
  );
}