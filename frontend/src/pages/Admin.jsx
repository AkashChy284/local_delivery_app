import { Navigate } from "react-router-dom";
import { useState } from "react";
import AdminForm from "../components/AdminForm";
import AdminList from "../components/AdminList";

export default function Admin() {
  const token = localStorage.getItem("adminToken");

  const [refresh, setRefresh] = useState(false);

  if (!token) {
    return <Navigate to="/admin-login" />;
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin-login";
  };

  return (
    <div className="min-h-screen bg-green-100 p-6">
      {/* 🔥 Header */}
      <div className="flex justify-between items-center mb-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* 🔥 Form */}
      <AdminForm onProductAdded={() => setRefresh(!refresh)} />

      {/* 🔥 List */}
      <AdminList key={refresh} />
    </div>
  );
}