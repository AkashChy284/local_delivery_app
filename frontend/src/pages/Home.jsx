import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Products from "./Products";

import heroImg from "../assets/hero.jpg";
import shopImg from "../assets/shop.jpg";
import fruitsImg from "../assets/fruits.jpg";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [heroSearch, setHeroSearch] = useState("");
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleHeroSearch = () => {
    const value = heroSearch.trim();

    if (!value) {
      navigate("/products");
      return;
    }

    navigate(`/products?search=${encodeURIComponent(value)}`);
  };

  const handleHeroSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleHeroSearch();
    }
  };

  return (
    <Layout>
      {/* 🔥 HERO */}
      <div className="relative h-[420px] sm:h-[520px] md:h-[620px]">
        <img
          src={heroImg}
          alt="delivery"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 text-white">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight">
            <span className="text-yellow-400">Shivam Express</span>
            <br />
            Bazar Aapke Ghar Par
          </h1>

          <p className="mt-2 text-xs sm:text-sm md:text-base text-gray-200">
            🚀 Delivery in{" "}
            <span className="text-yellow-300 font-semibold">
              30–60 Minutes
            </span>
          </p>

          {/* 🔍 HERO SEARCH */}
          <div className="mt-6 w-full max-w-md flex bg-white rounded-full overflow-hidden shadow-lg">
            <input
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              onKeyDown={handleHeroSearchKeyDown}
              placeholder="Search products..."
              className="flex-1 px-4 py-3 text-black outline-none text-sm"
            />
            <button
              onClick={handleHeroSearch}
              className="bg-green-600 px-5 text-white font-semibold"
            >
              🔍
            </button>
          </div>

          <div className="mt-6 flex gap-3 flex-wrap justify-center">
            <a
              href="https://wa.me/918935847223"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 px-5 py-2 rounded-full font-semibold shadow hover:bg-green-700 text-sm"
            >
              💬 WhatsApp
            </a>

            <a
              href="tel:+918935847223"
              className="bg-red-600 px-5 py-2 rounded-full font-semibold shadow hover:bg-red-700 text-sm"
            >
              📞 Call
            </a>
          </div>
        </div>
      </div>

      {/* 🔥 CATEGORY */}
      <div className="mt-10 px-4 text-center">
        <h2 className="text-lg sm:text-xl font-bold mb-6">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          <div
            onClick={() => handleCategoryClick("")}
            className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
          >
            <img
              src={shopImg}
              className="h-36 sm:h-48 md:h-56 w-full object-cover group-hover:scale-105 transition"
              alt="All Products"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold">
              All Products
            </div>
          </div>

          <div
            onClick={() => handleCategoryClick("Fruits & Vegetables")}
            className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
          >
            <img
              src={fruitsImg}
              className="h-36 sm:h-48 md:h-56 w-full object-cover group-hover:scale-105 transition"
              alt="Fruits"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold">
              Fruits
            </div>
          </div>

          <div
            onClick={() => handleCategoryClick("Groceries")}
            className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition col-span-2 md:col-span-1"
          >
            <img
              src={heroImg}
              className="h-36 sm:h-48 md:h-56 w-full object-cover group-hover:scale-105 transition"
              alt="Groceries"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold">
              Groceries
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 PRODUCTS */}
      <div id="products" className="mt-12 px-3 sm:px-6 pb-24">
        <h2 className="text-lg sm:text-xl font-semibold mb-6 text-center">
          {selectedCategory ? `${selectedCategory}` : "All Products"}
        </h2>

        <Products selectedCategory={selectedCategory} />
      </div>
    </Layout>
  );
}