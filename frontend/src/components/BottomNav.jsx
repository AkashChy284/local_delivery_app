import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function BottomNav() {
  const location = useLocation();
  const { cart } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const itemClass = (path) =>
    `flex flex-col items-center justify-center text-xs font-semibold ${
      location.pathname === path ? "text-green-600" : "text-gray-500"
    }`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-[0_-4px_18px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-4 h-16">
        <Link to="/" className={itemClass("/")}>
          <span className="text-xl">🏠</span>
          Home
        </Link>

        <Link to="/categories" className={itemClass("/categories")}>
          <span className="text-xl">🧺</span>
          Categories
        </Link>

        <Link to="/my-orders" className={itemClass("/my-orders")}>
          <span className="text-xl">📦</span>
          Orders
        </Link>

        <Link to="/cart" className={`${itemClass("/cart")} relative`}>
          <span className="text-xl">🛒</span>
          Cart

          {totalItems > 0 && (
            <span className="absolute top-1 right-6 bg-green-600 text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}