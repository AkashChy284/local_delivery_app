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

  useEffect(() => {
    const savedOrderId = localStorage.getItem("lastOrderId");
    const savedOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");

    if (savedOrderId) setLastOrderId(savedOrderId);
    setHasOrderHistory(savedOrders.length > 0);
  }, [location.pathname]);

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const linkClass = (path) =>
    `transition font-medium ${
      location.pathname === path
        ? "text-red-600"
        : "text-black hover:text-red-600"
    }`;

  const goToTrackOrder = () => {
    if (lastOrderId) {
      navigate(`/track-order/${lastOrderId}`);
      setMenuOpen(false);
    }
  };

  const goToMyOrders = () => {
    navigate("/my-orders");
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <span className="text-lg sm:text-xl">🛵</span>
          <h1 className="text-base sm:text-xl font-extrabold tracking-wide truncate">
            <span className="text-red-600">SHIVAM</span> EXPRESS
          </h1>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className={linkClass("/")}>
            Home
          </Link>

          <Link to="/categories" className={linkClass("/categories")}>
            Categories
          </Link>

          <Link to="/products" className={linkClass("/products")}>
            Shop
          </Link>

          <Link to="/cart" className={linkClass("/cart")}>
            Cart
          </Link>

          {lastOrderId && (
            <button
              onClick={goToTrackOrder}
              className="bg-green-600 text-white px-3 py-2 rounded-xl text-xs font-semibold hover:bg-green-700"
            >
              Track Order
            </button>
          )}

          {hasOrderHistory && (
            <button
              onClick={goToMyOrders}
              className="bg-white text-green-700 px-3 py-2 rounded-xl text-xs font-semibold border border-green-200 hover:bg-green-50"
            >
              My Orders
            </button>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {lastOrderId && (
            <button
              onClick={goToTrackOrder}
              className="hidden sm:block md:hidden bg-green-600 text-white px-3 py-2 rounded-xl text-xs font-semibold"
            >
              Track
            </button>
          )}

          <Link to="/cart" className="relative">
            <button className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-red-700 transition shadow">
              Cart
            </button>

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-red-600 text-[10px] sm:text-xs font-bold min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center shadow">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden bg-white/70 px-3 py-2 rounded-lg text-sm font-semibold"
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-yellow-300 bg-yellow-50 px-4 py-3">
          <nav className="flex flex-col gap-3 text-sm">
            <Link
              to="/"
              className={linkClass("/")}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              to="/categories"
              className={linkClass("/categories")}
              onClick={() => setMenuOpen(false)}
            >
              Categories
            </Link>

            <Link
              to="/products"
              className={linkClass("/products")}
              onClick={() => setMenuOpen(false)}
            >
              Shop
            </Link>

            <Link
              to="/cart"
              className={linkClass("/cart")}
              onClick={() => setMenuOpen(false)}
            >
              Cart
            </Link>

            {lastOrderId && (
              <button
                onClick={goToTrackOrder}
                className="text-left bg-green-600 text-white px-4 py-2 rounded-xl font-semibold"
              >
                Track My Order
              </button>
            )}

            {hasOrderHistory && (
              <button
                onClick={goToMyOrders}
                className="text-left bg-white text-green-700 px-4 py-2 rounded-xl font-semibold border border-green-200"
              >
                My Orders
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}