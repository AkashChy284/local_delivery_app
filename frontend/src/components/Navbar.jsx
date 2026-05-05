import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);
  const [lastOrderId, setLastOrderId] = useState("");
  const [hasOrderHistory, setHasOrderHistory] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    const savedOrderId = localStorage.getItem("lastOrderId");
    const savedOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");

    setLastOrderId(savedOrderId || "");
    setHasOrderHistory(savedOrders.length > 0);
  }, [location.pathname]);

  const goToTrackOrder = () => {
    if (lastOrderId) navigate(`/track-order/${lastOrderId}`);
    setMenuOpen(false);
  };

  const navLink = (path) =>
    `text-sm font-semibold transition ${
      location.pathname === path
        ? "text-green-700"
        : "text-gray-700 hover:text-green-700"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-[#ffcc00] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <div className="h-9 w-9 rounded-2xl bg-white flex items-center justify-center shadow-sm">
            🛵
          </div>

          <div className="leading-tight truncate">
            <h1 className="font-black tracking-wide text-lg sm:text-xl truncate">
              <span className="text-red-600">SHIVAM</span>{" "}
              <span className="text-black">EXPRESS</span>
            </h1>
            <p className="hidden sm:block text-[11px] font-semibold text-gray-700">
              Bazar Aapke Ghar Par
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className={navLink("/")}>Home</Link>
          <Link to="/categories" className={navLink("/categories")}>Categories</Link>
          <Link to="/products" className={navLink("/products")}>Shop</Link>
          <Link to="/my-orders" className={navLink("/my-orders")}>Orders</Link>

          {lastOrderId && (
            <button
              onClick={goToTrackOrder}
              className="bg-green-700 text-white px-4 py-2 rounded-full text-xs font-bold"
            >
              Track Order
            </button>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative">
            <button className="bg-red-600 text-white px-4 py-2.5 rounded-2xl text-sm font-bold shadow">
              Cart
            </button>

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-black min-w-[22px] h-[22px] rounded-full flex items-center justify-center shadow">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden h-11 w-11 bg-white rounded-2xl font-black text-xl shadow flex items-center justify-center"
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 shadow-lg">
          <div className="grid gap-3">
            <Link onClick={() => setMenuOpen(false)} to="/" className="font-bold">🏠 Home</Link>
            <Link onClick={() => setMenuOpen(false)} to="/categories" className="font-bold">🧺 Categories</Link>
            <Link onClick={() => setMenuOpen(false)} to="/products" className="font-bold">🛒 Shop</Link>
            <Link onClick={() => setMenuOpen(false)} to="/my-orders" className="font-bold">📦 My Orders</Link>

            {lastOrderId && (
              <button
                onClick={goToTrackOrder}
                className="bg-green-700 text-white py-3 rounded-2xl font-bold"
              >
                Track My Order
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}