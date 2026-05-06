import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useCart } from "../context/CartContext";

import heroImg from "../assets/hero.jpg";
import shopImg from "../assets/shop.jpg";
import fruitsImg from "../assets/fruits.jpg";

const BASE_URL = "https://local-delivery-app-l4je.onrender.com";

export default function Home() {
  const navigate = useNavigate();
  const { cart, addToCart, increaseQty, decreaseQty } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const groupedProducts = useMemo(() => {
    const groups = {};
    products.forEach((item) => {
      const cat = item.category || "Popular Products";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [products]);

  const bestSellers = products.slice(0, 12);
  const under99 = products.filter((p) => Number(p.price) <= 99).slice(0, 12);

  const goSearch = () => {
    const value = search.trim();
    navigate(value ? `/products?search=${encodeURIComponent(value)}` : "/products");
  };

  const categoryTiles = [
    { title: "Grocery & Kitchen", icon: "🛒", cat: "Groceries" },
    { title: "Fruits & Veg", icon: "🍎", cat: "Fruits & Vegetables" },
    { title: "Snacks", icon: "🍪", cat: "Snacks" },
    { title: "Drinks", icon: "🥤", cat: "Drinks" },
    { title: "Fast Food", icon: "🍕", cat: "Fast food" },
    { title: "Cake", icon: "🎂", cat: "Cake" },
    { title: "Dairy", icon: "🥛", cat: "Dairy" },
    { title: "Essentials", icon: "🧴", cat: "Home Essentials" },
  ];

  const ProductCard = ({ item }) => {
    const cartItem = cart.find((i) => i._id === item._id);
    const price = Number(item.price || 0);
    const mrp = Number(item.mrp || item.price || 0);
    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    return (
      <div
        onClick={() => navigate(`/product/${item._id}`)}
        className="min-w-[160px] max-w-[160px] bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="relative h-36 bg-[#f7f8fa] flex items-center justify-center">
          <img src={item.image} alt={item.name} className="h-28 w-full object-contain p-3" />

          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">
              {discount}% OFF
            </span>
          )}

          <span className="absolute bottom-2 left-2 bg-black text-white text-[10px] px-2 py-1 rounded-md">
            ⏱ 17 mins
          </span>
        </div>

        <div className="p-3">
          <p className="text-[11px] text-gray-400">{item.unit || "1 Pack"}</p>

          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 min-h-[40px]">
            {item.name}
          </h3>

          <div className="mt-2">
            <div className="flex items-center gap-2">
              <p className="font-black text-lg">₹{price}</p>
              {mrp > price && <p className="text-xs text-gray-400 line-through">₹{mrp}</p>}
            </div>

            {discount > 0 && (
              <p className="text-[11px] text-green-700 font-black">
                {discount}% OFF on MRP
              </p>
            )}
          </div>

          {!cartItem ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(item);
              }}
              className="mt-3 w-full border-2 border-green-600 text-green-700 py-1.5 rounded-xl text-xs font-black bg-green-50"
            >
              ADD
            </button>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              className="mt-3 flex items-center justify-between bg-green-600 text-white rounded-xl overflow-hidden"
            >
              <button onClick={() => decreaseQty(item._id)} className="px-3 py-1.5 font-black">
                -
              </button>
              <span className="font-black text-sm">{cartItem.qty}</span>
              <button onClick={() => increaseQty(item._id)} className="px-3 py-1.5 font-black">
                +
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ProductRow = ({ title, subtitle, items }) => {
    if (!items || items.length === 0) return null;

    return (
      <section className="px-4 mt-7">
        <div className="flex justify-between items-end mb-3">
          <div>
            <h2 className="text-xl font-black text-gray-900">{title}</h2>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>

          <button onClick={() => navigate("/products")} className="text-green-700 text-sm font-black">
            View all
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {items.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <Layout>
      <div className="bg-[#f7f8fa] min-h-screen pb-28">
        {/* BLINKIT STYLE HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img src={heroImg} alt="Shivam Express" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-[#f7f8fa]" />
          </div>

          <div className="relative px-4 pt-6 pb-7">
            <p className="text-white font-black text-lg">Shivam Express in</p>
            <h1 className="text-white text-4xl font-black mt-1">30–60 minutes</h1>
            <p className="text-white/90 font-semibold mt-2">
              HOME - Benipatti & nearby villages ▾
            </p>

            <div className="mt-5 bg-white rounded-3xl shadow-xl flex items-center overflow-hidden">
              <span className="pl-4 text-2xl">🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && goSearch()}
                placeholder='Search "atta, dal, coke and more"'
                className="flex-1 px-3 py-4 outline-none text-gray-700"
              />
              <button onClick={goSearch} className="px-5 text-2xl">
                🎙️
              </button>
            </div>

            {/* WHATSAPP + CALL */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <a
                href="https://wa.me/918935847223"
                target="_blank"
                rel="noreferrer"
                className="bg-green-600 text-white py-3 rounded-2xl text-center font-black shadow-lg"
              >
                💬 WhatsApp
              </a>

              <a
                href="tel:+918935847223"
                className="bg-red-600 text-white py-3 rounded-2xl text-center font-black shadow-lg"
              >
                📞 Call
              </a>
            </div>
          </div>
        </section>

        {/* TOP ICON TABS */}
        <section className="bg-[#fffdf1] sticky top-[65px] z-30 shadow-sm">
          <div className="flex justify-around text-center py-3">
            {[
              ["🛍️", "All"],
              ["🥤", "Drinks"],
              ["🍎", "Fruits"],
              ["🍪", "Snacks"],
              ["🎂", "Cake"],
            ].map(([icon, label]) => (
              <button
                key={label}
                onClick={() => navigate("/products")}
                className="text-gray-800 font-bold text-xs"
              >
                <div className="text-2xl">{icon}</div>
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* FEATURED OFFER CARDS */}
        <section className="px-4 mt-5">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[
              ["Fresh Fruits", "Daily fresh picks", fruitsImg],
              ["Grocery Deals", "Save more today", shopImg],
              ["Fast Delivery", "Around Benipatti", heroImg],
            ].map(([title, sub, img]) => (
              <div key={title} className="min-w-[180px] h-56 rounded-3xl overflow-hidden relative shadow-lg border-2 border-blue-400">
                <img src={img} alt={title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/35" />
                <div className="absolute top-3 left-3 bg-white text-red-600 text-xs font-black px-3 py-1 rounded-full">
                  Featured
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h2 className="text-xl font-black">{title}</h2>
                  <p className="text-sm">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CATEGORY GRID LIKE BLINKIT */}
        <section className="px-4 mt-7">
          <h2 className="text-2xl font-black mb-4">Grocery & Kitchen</h2>

          <div className="grid grid-cols-4 gap-3">
            {categoryTiles.map((item) => (
              <button
                key={item.title}
                onClick={() => navigate(`/products?cat=${encodeURIComponent(item.cat)}`)}
                className="text-center"
              >
                <div className="bg-[#eaf8f5] rounded-2xl h-20 flex items-center justify-center text-4xl shadow-sm">
                  {item.icon}
                </div>
                <p className="text-xs font-black mt-2 leading-tight">{item.title}</p>
              </button>
            ))}
          </div>
        </section>

        {loading ? (
          <div className="px-4 mt-8 space-y-6">
            {[1, 2, 3].map((row) => (
              <div key={row}>
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="flex gap-4 overflow-hidden">
                  {[1, 2, 3].map((card) => (
                    <div key={card} className="min-w-[160px] h-[260px] bg-white rounded-3xl animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <ProductRow title="Bestsellers" subtitle="Most loved products" items={bestSellers} />
            <ProductRow title="Under ₹99" subtitle="Budget friendly items" items={under99} />

            {Object.entries(groupedProducts).map(([category, items]) => (
              <ProductRow
                key={category}
                title={category}
                subtitle="Fresh products delivered fast"
                items={items.slice(0, 12)}
              />
            ))}
          </>
        )}

        {totalItems > 0 && (
          <button
            onClick={() => navigate("/cart")}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-green-700 text-white rounded-full px-6 py-3 shadow-2xl flex items-center gap-5"
          >
            <span className="font-black">
              View cart
              <br />
              <span className="text-xs font-normal">
                {totalItems} items | ₹{totalPrice}
              </span>
            </span>
            <span className="text-2xl">›</span>
          </button>
        )}
      </div>
    </Layout>
  );
}