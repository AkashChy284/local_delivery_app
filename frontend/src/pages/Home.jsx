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

  const goProducts = (cat = "") => {
    setSelectedCategory(cat);
    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const searchNow = () => {
    const value = heroSearch.trim();
    navigate(value ? `/products?search=${encodeURIComponent(value)}` : "/products");
  };

  const categories = [
    { name: "All", icon: "🛒", cat: "" },
    { name: "Fruits", icon: "🍎", cat: "Fruits & Vegetables" },
    { name: "Vegetables", icon: "🥦", cat: "Fruits & Vegetables" },
    { name: "Groceries", icon: "🛍️", cat: "Groceries" },
    { name: "Food", icon: "🍕", cat: "Food" },
    { name: "Drinks", icon: "🥤", cat: "Drink" },
    { name: "Cake", icon: "🎂", cat: "Cake" },
    { name: "Dairy", icon: "🥛", cat: "Dairy" },
  ];

  const offers = [
    {
      title: "Fresh Fruits & Vegetables",
      sub: "Daily fresh items near you",
      img: fruitsImg,
      cat: "Fruits & Vegetables",
      badge: "Fresh Today",
    },
    {
      title: "Grocery Essentials",
      sub: "Rice, oil, snacks & more",
      img: shopImg,
      cat: "Groceries",
      badge: "Best Price",
    },
    {
      title: "Food Delivery",
      sub: "Pizza, roll, fast food",
      img: heroImg,
      cat: "Food",
      badge: "Fast Delivery",
    },
  ];

  const quickSections = [
    { title: "Daily Needs", icon: "🛒", text: "Atta, rice, oil, spices" },
    { title: "Fresh Zone", icon: "🍅", text: "Fruits & vegetables" },
    { title: "Party Order", icon: "🎉", text: "Cake, snacks, drinks" },
    { title: "Quick Food", icon: "🍔", text: "Fast food nearby" },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 px-4 pt-5 pb-7 rounded-b-[36px] shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <p className="text-xs font-extrabold text-gray-800">
                📍 Delivering in Benipatti & nearby villages
              </p>
              <h1 className="text-3xl sm:text-5xl font-black text-gray-950 leading-tight">
                Shivam Express
              </h1>
              <p className="text-sm sm:text-base font-bold text-gray-800">
                Bazar Aapke Ghar Par
              </p>
            </div>

            <button
              onClick={() => navigate("/my-orders")}
              className="bg-white/95 px-4 py-2 rounded-2xl font-black shadow-md active:scale-95"
            >
              Orders
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-xl flex overflow-hidden border border-white">
            <input
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchNow()}
              placeholder='Search "milk", "cake", "fruits"...'
              className="flex-1 px-5 py-4 outline-none text-sm font-semibold"
            />
            <button
              onClick={searchNow}
              className="bg-green-700 text-white px-6 font-black"
            >
              🔍
            </button>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-3 text-center">
              <p className="text-xl">⚡</p>
              <p className="text-[11px] font-black">30–60 Min</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-3 text-center">
              <p className="text-xl">🛍️</p>
              <p className="text-[11px] font-black">Local Shops</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-3 text-center">
              <p className="text-xl">💰</p>
              <p className="text-[11px] font-black">Best Price</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-black">Shop by Category</h2>
          <button
            onClick={() => navigate("/products")}
            className="text-sm font-black text-green-700"
          >
            View all
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((item) => (
            <button
              key={item.name}
              onClick={() => goProducts(item.cat)}
              className="min-w-[88px] bg-white border border-gray-100 rounded-3xl px-3 py-4 shadow-sm text-center active:scale-95"
            >
              <div className="text-3xl">{item.icon}</div>
              <p className="text-xs font-black mt-2">{item.name}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Big Offer Cards */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <button
              key={offer.title}
              onClick={() => goProducts(offer.cat)}
              className="relative h-44 rounded-[28px] overflow-hidden shadow-md text-left active:scale-[0.98]"
            >
              <img
                src={offer.img}
                alt={offer.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
              <div className="absolute left-5 top-5 text-white">
                <span className="bg-yellow-400 text-black text-[11px] font-black px-3 py-1 rounded-full">
                  {offer.badge}
                </span>
                <h2 className="text-2xl font-black mt-3 leading-tight max-w-[220px]">
                  {offer.title}
                </h2>
                <p className="text-sm font-semibold mt-1">{offer.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Mini professional sections */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickSections.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100"
            >
              <p className="text-3xl">{item.icon}</p>
              <h3 className="font-black mt-2">{item.title}</h3>
              <p className="text-xs text-gray-500 font-semibold mt-1">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Offer Strip */}
      <section className="max-w-7xl mx-auto px-4 pb-6">
        <div className="bg-green-800 text-white rounded-[28px] p-5 flex items-center justify-between gap-4 shadow-md">
          <div>
            <p className="text-xs font-black text-green-200">TODAY SPECIAL</p>
            <h2 className="text-xl font-black">Order daily needs from nearby shops</h2>
            <p className="text-sm text-green-100 mt-1">
              Fast delivery in Benipatti area
            </p>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="bg-yellow-400 text-black px-4 py-3 rounded-2xl font-black whitespace-nowrap"
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="max-w-7xl mx-auto px-3 pb-28">
        <div className="flex justify-between items-end mb-4 px-1">
          <div>
            <h2 className="text-2xl font-black">
              {selectedCategory || "Popular Products"}
            </h2>
            <p className="text-sm text-gray-500 font-semibold">
              Fresh picks available near you
            </p>
          </div>

          <button
            onClick={() => navigate("/products")}
            className="text-green-700 font-black text-sm"
          >
            View all
          </button>
        </div>

        <Products selectedCategory={selectedCategory} />
      </section>
    </Layout>
  );
}