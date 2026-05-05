import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const BASE_URL = "https://local-delivery-app-l4je.onrender.com";

export default function Products({ selectedCategory }) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { cart, addToCart, increaseQty, decreaseQty } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const urlCategory = queryParams.get("cat");
  const urlSearch = queryParams.get("search") || "";

  const finalCategory = urlCategory || selectedCategory;
  const isEmbeddedInHome = selectedCategory !== undefined;

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        let url = `${BASE_URL}/api/products`;

        if (finalCategory) {
          url += `?category=${encodeURIComponent(finalCategory)}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Products fetch error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [finalCategory]);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchCategory = finalCategory
        ? item.category?.trim().toLowerCase() === finalCategory.toLowerCase()
        : true;

      const matchSearch = search.trim()
        ? item.name?.toLowerCase().includes(search.trim().toLowerCase())
        : true;

      return matchCategory && matchSearch;
    });
  }, [products, finalCategory, search]);

  const groupedProducts = useMemo(() => {
    const groups = {};

    filteredProducts.forEach((item) => {
      const category = item.category || "Popular Products";
      if (!groups[category]) groups[category] = [];
      groups[category].push(item);
    });

    return groups;
  }, [filteredProducts]);

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const runSearch = () => {
    const value = search.trim();

    if (isEmbeddedInHome) {
      navigate(value ? `/products?search=${encodeURIComponent(value)}` : "/products");
      return;
    }

    const params = new URLSearchParams();
    if (finalCategory) params.set("cat", finalCategory);
    if (value) params.set("search", value);

    navigate(params.toString() ? `/products?${params.toString()}` : "/products");
  };

  const ProductCard = ({ item }) => {
    const cartItem = cart.find((i) => i._id === item._id);

    return (
      <div
        onClick={() => navigate(`/product/${item._id}`)}
        className="min-w-[155px] sm:min-w-[180px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer"
      >
        <div className="relative h-36 sm:h-40 bg-[#f7f8fa] flex items-center justify-center">
          <img
            src={item.image}
            alt={item.name}
            className="h-28 sm:h-32 w-full object-contain p-3"
          />

          <span className="absolute top-2 left-2 text-gray-300 text-lg">♡</span>

          <span className="absolute bottom-2 right-2 bg-white border rounded-md text-[10px] px-1">
            🟢
          </span>
        </div>

        <div className="p-3">
          <p className="text-[11px] text-gray-400 truncate">
            {item.category || "Product"}
          </p>

          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[38px]">
            {item.name}
          </h3>

          <p className="text-[11px] text-gray-400 mt-1">1 Pack</p>

          <div className="flex items-center justify-between mt-3">
            <div>
              <p className="font-black text-base text-gray-900">₹{item.price}</p>
              <p className="text-[10px] text-orange-500 font-bold">⚡Quick</p>
            </div>

            {!cartItem ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(item);
                }}
                className="border border-green-600 text-green-700 px-4 py-1.5 rounded-lg text-xs font-black bg-white"
              >
                Add
              </button>
            ) : (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center bg-green-600 text-white rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => decreaseQty(item._id)}
                  className="px-2 py-1 font-bold"
                >
                  -
                </button>

                <span className="px-2 text-xs font-bold">{cartItem.qty}</span>

                <button
                  onClick={() => increaseQty(item._id)}
                  className="px-2 py-1 font-bold"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const SkeletonRows = () => (
    <div className="space-y-8">
      {[1, 2, 3].map((row) => (
        <div key={row} className="bg-white rounded-3xl p-4">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-4" />

          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((card) => (
              <div
                key={card}
                className="min-w-[155px] sm:min-w-[180px] rounded-2xl border p-3"
              >
                <div className="h-36 bg-gray-100 rounded-xl animate-pulse" />
                <div className="h-3 bg-gray-100 rounded mt-3 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded mt-2 animate-pulse" />
                <div className="h-4 w-16 bg-gray-100 rounded mt-4 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const content = (
    <div className="bg-[#f6f7f8] min-h-screen pb-28">
      {!isEmbeddedInHome && (
        <div className="sticky top-0 z-40 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-black">
              {finalCategory || "All Products"}
            </h1>
            <p className="text-sm text-gray-500">
              Fast delivery from Shivam Express
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5">
        <div className="flex gap-2 mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
            placeholder='Search "milk", "fruits", "cake"...'
            className="flex-1 bg-white border rounded-2xl px-4 py-3 outline-none text-sm shadow-sm"
          />

          <button
            onClick={runSearch}
            className="bg-green-600 text-white px-5 rounded-2xl font-black"
          >
            🔍
          </button>
        </div>

        {loading ? (
          <SkeletonRows />
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center">
            <p className="text-gray-500 font-semibold">No products found</p>
            <button
              onClick={() => navigate("/products")}
              className="mt-4 bg-green-600 text-white px-5 py-2 rounded-xl font-bold"
            >
              View all products
            </button>
          </div>
        ) : finalCategory || search.trim() ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredProducts.map((item) => (
              <ProductCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedProducts).map(([category, items]) => (
              <section key={category} className="bg-white rounded-3xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black">{category}</h2>

                  <button
                    onClick={() =>
                      navigate(`/products?cat=${encodeURIComponent(category)}`)
                    }
                    className="text-green-700 text-sm font-black"
                  >
                    View all
                  </button>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {items.map((item) => (
                    <ProductCard key={item._id} item={item} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {totalItems > 0 && (
        <button
          onClick={() => navigate("/cart")}
          className="fixed bottom-20 md:bottom-5 left-1/2 -translate-x-1/2 z-50 bg-green-700 text-white rounded-full shadow-2xl px-6 py-3 flex items-center gap-5"
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
  );

  return isEmbeddedInHome ? content : <Layout>{content}</Layout>;
}