import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const BASE_URL = "https://local-delivery-app-l4je.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      alert("⚠️ Please enter username and password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/auth/admin-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // 🔐 overwrite old token safely
      localStorage.removeItem("adminToken");
      localStorage.setItem("adminToken", data.token);

      navigate("/shivam-secret-admin-123");

    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-green-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow w-80"
      >
        <h2 className="text-lg font-bold mb-4 text-center">Admin Login</h2>

        <input
          placeholder="Username"
          className="w-full border p-2 mb-3"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-green-600"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}