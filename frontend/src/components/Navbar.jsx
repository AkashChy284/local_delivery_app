import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const location = useLocation();
  const { cart } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const linkClass = (path) =>
    `transition font-medium ${
      location.pathname === path
        ? "text-red-600"
        : "text-black hover:text-red-600"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3">
        {/* TOP ROW */}
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <span className="text-lg sm:text-xl">🛵</span>
            <h1 className="text-base sm:text-xl font-extrabold tracking-wide truncate">
              <span className="text-red-600">SHIVAM</span> EXPRESS
            </h1>
          </Link>

          <Link to="/cart" className="relative shrink-0">
            <button className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-700 transition shadow">
              Cart
            </button>

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-red-600 text-[10px] font-bold min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center shadow">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* MENU ROW - visible on mobile also */}
        <nav className="flex items-center justify-center gap-5 sm:gap-8 text-xs sm:text-sm font-medium mt-3">
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
        </nav>
      </div>
    </header>
  );
}