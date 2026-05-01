import React, { useState, useEffect, useMemo } from "react";
import { useCart } from "../context/CartContext";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const BASE_URL = "https://local-delivery-app-l4je.onrender.com";

export default function Products({ selectedCategory }) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);

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
    let url = `${BASE_URL}/api/products`;

    if (finalCategory) {
      url += `?category=${encodeURIComponent(finalCategory)}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  }, [finalCategory]);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchCategory = finalCategory
        ? item.category?.trim().toLowerCase() === finalCategory.toLowerCase()
        : true;

      const matchSearch = search
        ? item.name?.toLowerCase().includes(search.toLowerCase())
        : true;

      return matchCategory && matchSearch;
    });
  }, [products, finalCategory, search]);

  const totalItems = cart.reduce((a, b) => a + b.qty, 0);
  const totalPrice = cart.reduce((a, b) => a + b.price * b.qty, 0);

  const runSearch = () => {
    const params = new URLSearchParams();

    if (finalCategory) params.set("cat", finalCategory);
    if (search.trim()) params.set("search", search.trim());

    if (!isEmbeddedInHome) {
      navigate(params.toString() ? `/products?${params}` : "/products");
    }
  };

  const content = (
    <div className="bg-[#f7f8fa] min-h-screen pb-24">
      {!isEmbeddedInHome && (
        <div className="sticky top-0 z-40 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {finalCategory || "All Products"}
            </h1>
            <p className="text-sm text-gray-500">
              {filteredProducts.length} products available
            </p>

            <div className="mt-4 flex gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runSearch()}
                placeholder="Search for atta, dal, coke and more"
                className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 outline-none text-sm"
              />
              <button
                onClick={runSearch}
                className="bg-green-600 text-white px-5 rounded-2xl font-bold"
              >
                🔍
              </button>
            </div>
          </div>
        </div>
      )}

      {isEmbeddedInHome && (
        <div className="mb-5 flex gap-2 max-w-xl mx-auto">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search milk, biscuits, fruits..."
            className="flex-1 bg-white border rounded-full px-4 py-2 text-sm outline-none"
          />
          <button
            onClick={runSearch}
            className="bg-green-600 text-white px-4 rounded-full"
          >
            🔍
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center text-gray-500">
            No products found
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
            {filteredProducts.map((item) => {
              const cartItem = cart.find((i) => i._id === item._id);

              return (
                <div
                  key={item._id}
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="bg-white rounded-2xl border shadow-sm p-3 cursor-pointer hover:shadow-md transition"
                >
                  <div className="bg-gray-50 rounded-2xl h-32 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 object-contain"
                    />
                  </div>

                  <p className="text-[11px] text-gray-400 mt-3">
                    {item.category || "Product"}
                  </p>

                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 min-h-[40px]">
                    {item.name}
                  </h3>

                  <div className="flex justify-between items-center mt-3">
                    <p className="font-bold text-green-700">₹{item.price}</p>

                    {!cartItem ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                        }}
                        className="border border-green-600 text-green-700 px-4 py-1 rounded-lg text-xs font-bold"
                      >
                        ADD
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
                        <span className="px-2 text-xs font-bold">
                          {cartItem.qty}
                        </span>
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
              );
            })}
          </div>
        )}
      </div>

      {totalItems > 0 && (
        <button
          onClick={() => navigate("/cart")}
          className="fixed bottom-20 md:bottom-5 left-1/2 -translate-x-1/2 z-50 bg-green-700 text-white rounded-full shadow-2xl px-6 py-3 flex items-center gap-5"
        >
          <span className="font-bold">
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