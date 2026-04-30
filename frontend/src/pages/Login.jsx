import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const BASE_URL = "https://local-delivery-app-l4je.onrender.com";

  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    const url = mode === "login" ? "/api/user/login" : "/api/user/signup";

    const body =
      mode === "login"
        ? { phone, password }
        : { name, phone, password };

    const res = await fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Something went wrong");
      return;
    }

    localStorage.setItem("userToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === "login" ? "Login" : "Create Account"}
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Continue to Shivam Express
        </p>

        <div className="mt-6 space-y-4">
          {mode === "signup" && (
            <input
              placeholder="Full name"
              className="w-full border rounded-2xl px-4 py-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            placeholder="Phone number"
            className="w-full border rounded-2xl px-4 py-3"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            placeholder="Password"
            type="password"
            className="w-full border rounded-2xl px-4 py-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={submit}
            className="w-full bg-green-600 text-white rounded-2xl py-3 font-bold"
          >
            {mode === "login" ? "Login" : "Sign Up"}
          </button>
        </div>

        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="w-full mt-4 text-green-700 font-semibold"
        >
          {mode === "login"
            ? "New user? Create account"
            : "Already have account? Login"}
        </button>
      </div>
    </div>
  );
}