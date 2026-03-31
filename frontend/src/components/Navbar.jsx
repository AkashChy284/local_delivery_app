import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="bg-green-950 text-white px-6 py-4 flex justify-between items-center">
      
      {/* LOGO */}
      <h1 className="text-lg font-semibold flex items-center gap-2">
        📍 YourLocalDelivery
      </h1>

      {/* MENU */}
      <div className="hidden md:flex gap-6 text-sm">

        <Link to="/" className="hover:text-green-300">
          Home
        </Link>

        <Link to="/products" className="hover:text-green-300">
          Categories
        </Link>

        <Link to="/cart" className="hover:text-green-300">
          Cart
        </Link>

        <Link to="/products" className="hover:text-green-300">
          Shop
        </Link>

      </div>

      {/* BUTTON */}
      <Link to="/cart">
        <button className="bg-green-700 px-4 py-1 rounded-lg text-sm hover:bg-green-600">
          Cart
        </button>
      </Link>
    </div>
  );
}