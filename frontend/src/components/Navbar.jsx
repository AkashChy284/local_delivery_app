import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-4 flex justify-between items-center shadow-md">
      
      {/* LOGO */}
      <h1 className="text-xl font-extrabold flex items-center gap-2 tracking-wide">
        🛵 <span className="text-red-600">SHIVAM</span> EXPRESS
      </h1>

      {/* MENU */}
      <div className="hidden md:flex gap-6 text-sm font-medium">

        <Link to="/" className="hover:text-red-600 transition">
          Home
        </Link>

        <Link to="/products" className="hover:text-red-600 transition">
          Categories
        </Link>

        <Link to="/cart" className="hover:text-red-600 transition">
          Cart
        </Link>

        <Link to="/products" className="hover:text-red-600 transition">
          Shop
        </Link>

      </div>

      {/* BUTTON */}
      <Link to="/cart">
        <button className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition shadow">
          Cart
        </button>
      </Link>
    </div>
  );
}