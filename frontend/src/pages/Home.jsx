import Navbar from "../components/Navbar";
import { useState } from "react";
import Products from "./Products";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);

    const section = document.getElementById("products");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-green-100 min-h-screen">
      <Navbar />

      {/* HERO */}
      <div className="bg-gradient-to-r from-green-900 to-green-600 text-white pt-14 pb-20 text-center rounded-b-3xl">
        <h1 className="text-3xl md:text-4xl font-bold leading-snug">
          Get Anything From Nearby Shops <br />
          in <span className="text-yellow-300">30–60 Minutes!</span>
        </h1>

        <p className="mt-3 text-sm opacity-90">
          We source from trusted local shops near you — you get it delivered fast.
        </p>

        {/* SEARCH */}
        <div className="mt-6 flex justify-center">
          <div className="flex bg-white rounded-xl overflow-hidden shadow-lg w-[90%] md:w-[500px]">
            <input
              type="text"
              placeholder="Search for vegetables, milk, medicine, etc..."
              className="flex-1 px-4 py-3 text-black outline-none"
            />
            <button className="bg-green-700 px-6 text-white font-medium">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="flex justify-center mt-[-30px] px-4">
        <div className="bg-white rounded-xl shadow-md flex flex-wrap justify-between w-full max-w-3xl p-4 text-sm">
          <div className="flex items-center gap-2">
            📦 <span>No Minimum Order</span>
          </div>
          <div className="flex items-center gap-2">
            💳 <span>Pay After Confirmation</span>
          </div>
          <div className="flex items-center gap-2">
            ⚡ <span>Fast Delivery</span>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="mt-10 px-6 pb-10 text-center">
        <h2 className="text-lg font-semibold mb-6">Popular Categories</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto">
          
          {/* Groceries */}
          <div
            onClick={() => handleCategoryClick("Groceries")}
            className="bg-white rounded-xl shadow p-3 hover:shadow-lg transition cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1586201375761-83865001e31c"
              className="h-28 w-full object-cover rounded-lg"
            />
            <p className="mt-2 text-sm font-medium">Groceries</p>
          </div>

          {/* Fruits */}
          <div
            onClick={() => handleCategoryClick("Fruits & Vegetables")}
            className="bg-white rounded-xl shadow p-3 hover:shadow-lg transition cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1610832958506-aa56368176cf"
              className="h-28 w-full object-cover rounded-lg"
            />
            <p className="mt-2 text-sm font-medium">Fruits & Vegetables</p>
          </div>

          {/* Medicines */}
          <div
            onClick={() => handleCategoryClick("Medicines")}
            className="bg-white rounded-xl shadow p-3 hover:shadow-lg transition cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5"
              className="h-28 w-full object-cover rounded-lg"
            />
            <p className="mt-2 text-sm font-medium">Medicines</p>
          </div>

          {/* Home Essentials */}
          <div
            onClick={() => handleCategoryClick("Home Essentials")}
            className="bg-white rounded-xl shadow p-3 hover:shadow-lg transition cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db"
              className="h-28 w-full object-cover rounded-lg"
            />
            <p className="mt-2 text-sm font-medium">Home Essentials</p>
          </div>

        </div>
      </div>

      {/* ✅ PRODUCTS SECTION (FIXED POSITION) */}
      <div id="products" className="mt-16 px-6 pb-16">
        <h2 className="text-xl font-semibold mb-6 text-center">
          {selectedCategory
            ? `${selectedCategory} Products`
            : "All Products"}
        </h2>

        <Products selectedCategory={selectedCategory} />
      </div>

    </div>
  );
}