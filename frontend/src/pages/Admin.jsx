import { Navigate } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/admin/Sidebar";
import Dashboard from "../components/admin/Dashboard";
import Products from "../components/admin/Products";
import Orders from "../components/admin/Orders.jsx";

export default function Admin() {
  const token = localStorage.getItem("adminToken");

  const [active, setActive] = useState("dashboard");
  const [refresh, setRefresh] = useState(false);

  if (!token) {
    return <Navigate to="/admin-login" />;
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin-login";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* 🔥 Sidebar */}
      <Sidebar active={active} setActive={setActive} />

      {/* 🔥 Main Content */}
      <div className="flex-1 p-6">

        {/* 🔥 Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold capitalize">
            {active}
          </h1>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded"
          >
            Logout
          </button>
        </div>

        {/* 🔥 Pages */}
        {active === "dashboard" && (
          <Dashboard setActive={setActive} />
        )}

        {active === "products" && (
          <Products
            refresh={refresh}
            setRefresh={setRefresh}
          />
        )}

        {active === "orders" && <Orders />}
      </div>
    </div>
  );
}