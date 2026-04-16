export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Dashboard Overview
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Total Orders</p>
          <h2 className="text-3xl font-bold mt-2">120</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Revenue</p>
          <h2 className="text-3xl font-bold mt-2">₹12,000</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Products</p>
          <h2 className="text-3xl font-bold mt-2">45</h2>
        </div>

      </div>

      {/* Welcome Section */}
      <div className="mt-8 bg-green-500 text-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold">
          Welcome to Shivam Express 🚀
        </h2>
        <p className="text-sm mt-2">
          Manage products, orders, and grow your delivery business.
        </p>
      </div>
    </div>
  );
}