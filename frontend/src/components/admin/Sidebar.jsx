export default function Sidebar({ active, setActive }) {
  const menuItems = [
    { name: "dashboard", label: "Dashboard", icon: "📊" },
    { name: "products", label: "Products", icon: "📦" },
    { name: "orders", label: "Orders", icon: "🛒" },
  ];

  return (
    <div className="w-64 bg-white shadow-xl p-6 flex flex-col border-r">

      {/* 🔥 Logo */}
      <h2 className="text-2xl font-bold text-green-600 mb-10 tracking-wide">
        Shivam Admin
      </h2>

      {/* 🔥 Menu */}
      <ul className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <li
            key={item.name}
            onClick={() => setActive(item.name)}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              active === item.name
                ? "bg-green-500 text-white shadow-md"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium capitalize">
              {item.label}
            </span>
          </li>
        ))}
      </ul>

      {/* 🔥 Footer */}
      <div className="text-xs text-gray-400 mt-6">
        © Shivam Express
      </div>
    </div>
  );
}