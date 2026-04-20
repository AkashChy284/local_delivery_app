import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function Categories() {
  const data = [
    {
      name: "Groceries",
      img: "https://images.unsplash.com/photo-1586201375761-83865001e31c",
      desc: "Rice, flour, snacks & more",
      color: "from-green-500 to-emerald-600",
    },
    {
      name: "Fruits & Vegetables",
      img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf",
      desc: "Fresh produce from markets",
      color: "from-lime-500 to-green-500",
    },
    {
      name: "Medicines",
      img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5",
      desc: "Pharmacy & health items",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Home Essentials",
      img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
      desc: "Daily household needs",
      color: "from-orange-500 to-yellow-500",
    },
  ];

  return (
    <Layout>
      <div className="py-6 sm:py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Shop by Categories
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-2">
            Explore products by category
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {data.map((item, i) => (
            <Link
              key={i}
              to={`/products?cat=${encodeURIComponent(item.name)}`}
              className="group"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 hover:-translate-y-1 border">
                {/* Image */}
                <div className="relative h-32 sm:h-40 md:h-48 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />

                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${item.color} opacity-35`}
                  ></div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800">
                    {item.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                    {item.desc}
                  </p>

                  <div className="mt-3">
                    <span className="inline-flex items-center text-green-600 text-xs sm:text-sm font-medium">
                      View products →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}