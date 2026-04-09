import Navbar from "../components/Navbar";
import { useState } from "react";
import Products from "./Products";

import heroImg from "../assets/hero.jpg";
import shopImg from "../assets/shop.jpg";
import fruitsImg from "../assets/fruits.jpg";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);

    const section = document.getElementById("products");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-yellow-50 min-h-screen">
      <Navbar />

      {/* 🔥 HERO IMAGE SECTION */}
      <div className="relative h-[500px] md:h-[600px]">

        <img
          src={heroImg}
          alt="delivery"
          className="w-full h-full object-cover"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 text-white">
          
          <h1 className="text-3xl md:text-5xl font-extrabold leading-snug">
            <span className="text-yellow-400">Shivam Express</span> <br />
            Bazar Aapke Ghar Par
          </h1>

          <p className="mt-3 text-sm md:text-base">
            🚀 Delivery in{" "}
            <span className="text-yellow-300 font-bold">
              30–60 Minutes
            </span>
          </p>

          {/* SEARCH */}
          <div className="mt-6 w-full max-w-md flex bg-white rounded-xl overflow-hidden shadow-lg">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-4 py-3 text-black outline-none"
            />
            <button className="bg-green-600 px-6 text-white font-semibold">
              Search
            </button>
          </div>

          {/* CTA */}
          <div className="mt-6 flex gap-4 flex-wrap justify-center">
            <a
              href="https://wa.me/918935847223"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 px-5 py-2 rounded-lg font-semibold shadow hover:bg-green-700"
            >
              💬 WhatsApp Order
            </a>

            <a
              href="tel:+918935847223"
              className="bg-red-600 px-5 py-2 rounded-lg font-semibold shadow hover:bg-red-700"
            >
              📞 Call Now
            </a>
          </div>
        </div>
      </div>

      {/* 🔥 CATEGORY BANNERS */}
      <div className="mt-10 px-6 text-center">
        <h2 className="text-xl font-bold mb-6">Shop by Category</h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">

          {/* All */}
          <div
            onClick={() => handleCategoryClick("")}
            className="relative cursor-pointer rounded-2xl overflow-hidden shadow-lg"
          >
            <img src={shopImg} className="h-60 w-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-lg">
              All Products
            </div>
          </div>

          {/* Fruits */}
          <div
            onClick={() => handleCategoryClick("Fruits & Vegetables")}
            className="relative cursor-pointer rounded-2xl overflow-hidden shadow-lg"
          >
            <img src={fruitsImg} className="h-60 w-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-lg">
              Fruits & Vegetables
            </div>
          </div>

          {/* Groceries */}
          <div
            onClick={() => handleCategoryClick("Groceries")}
            className="relative cursor-pointer rounded-2xl overflow-hidden shadow-lg"
          >
            <img src={heroImg} className="h-60 w-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-lg">
              Groceries
            </div>
          </div>

        </div>
      </div>

      {/* PRODUCTS */}
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