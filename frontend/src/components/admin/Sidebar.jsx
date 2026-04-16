export default function Sidebar({ active, setActive }) {
  return (
    <div className="w-64 bg-white shadow-lg p-6 flex flex-col">
      
      {/* Logo */}
      <h2 className="text-2xl font-bold text-green-600 mb-8">
        Shivam Admin
      </h2>

      {/* Menu */}
      <ul className="space-y-3 flex-1">
        <li
          onClick={() => setActive("dashboard")}
          className={`p-3 rounded-lg cursor-pointer transition ${
            active === "dashboard"
              ? "bg-green-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          📊 Dashboard
        </li>

        <li
          onClick={() => setActive("products")}
          className={`p-3 rounded-lg cursor-pointer transition ${
            active === "products"
              ? "bg-green-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          📦 Products
        </li>

        <li
          onClick={() => setActive("orders")}
          className={`p-3 rounded-lg cursor-pointer transition ${
            active === "orders"
              ? "bg-green-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          🛒 Orders
        </li>
      </ul>

      {/* Bottom */}
      <div className="text-xs text-gray-400 mt-6">
        © Shivam Express
      </div>
    </div>
  );
}