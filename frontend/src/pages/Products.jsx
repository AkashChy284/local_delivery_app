import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const {
    addToCart,
    cart,
    increaseQty,
    decreaseQty,
  } = useCart();

  const BASE_URL = "https://local-delivery-app-l4je.onrender.com";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/products`);
      const data = await res.json();

      setProducts(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Categories
  const groupedProducts = products.reduce((acc, item) => {
    const category = item.category || "General";

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(item);

    return acc;
  }, {});

  // 🔥 Filter Search
  const filteredGroups = {};

  Object.keys(groupedProducts).forEach((category) => {
    const filtered = groupedProducts[category].filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );

    if (filtered.length > 0) {
      filteredGroups[category] = filtered;
    }
  });

  // 🔥 Product Card
  const ProductCard = ({ item }) => {
    const cartItem = cart.find((i) => i._id === item._id);

    const mrp = Number(item.mrp || item.price);
    const price = Number(item.price);

    const discount =
      mrp > price
        ? Math.round(((mrp - price) / mrp) * 100)
        : 0;

    return (
      <div
        onClick={() => navigate(`/product/${item._id}`)}
        className="min-w-[170px] max-w-[170px] bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer"
      >
        {/* IMAGE */}
        <div className="relative h-40 bg-[#f7f8fa] flex items-center justify-center">
          <img
            src={item.image}
            alt={item.name}
            className="h-32 w-full object-contain p-3"
          />

          {/* Discount */}
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">
              {discount}% OFF
            </div>
          )}

          {/* Delivery */}
          <div className="absolute bottom-2 left-2 bg-black text-white text-[10px] px-2 py-1 rounded-md">
            ⏱ 17 mins
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-3">
          <p className="text-[11px] text-gray-400">
            {item.unit || "1 Pack"}
          </p>

          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 min-h-[40px]">
            {item.name}
          </h3>

          {/* PRICE */}
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <p className="font-black text-xl text-gray-900">
                ₹{price}
              </p>

              {mrp > price && (
                <p className="text-sm text-gray-400 line-through">
                  ₹{mrp}
                </p>
              )}
            </div>

            {discount > 0 && (
              <p className="text-xs text-green-700 font-black">
                {discount}% OFF on MRP
              </p>
            )}

            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-500 text-xs">
                ⭐⭐⭐⭐
              </span>

              <span className="text-[11px] text-gray-400">
                ({item.stock || 10} left)
              </span>
            </div>
          </div>

          {/* BUTTON */}
          <div className="mt-4">
            {!cartItem ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(item);
                }}
                className="w-full border-2 border-green-600 text-green-700 py-2 rounded-xl text-sm font-black bg-green-50"
              >
                ADD
              </button>
            ) : (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-between bg-green-600 text-white rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => decreaseQty(item._id)}
                  className="px-4 py-2 text-lg font-black"
                >
                  -
                </button>

                <span className="font-black">
                  {cartItem.qty}
                </span>

                <button
                  onClick={() => increaseQty(item._id)}
                  className="px-4 py-2 text-lg font-black"
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

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-24">

      {/* SEARCH */}
      <div className="sticky top-0 z-30 bg-[#f5f5f5] p-4">
        <div className="bg-white rounded-2xl flex items-center px-4 shadow-sm border">
          <input
            type="text"
            placeholder="Search for atta, dal, coke and more"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 py-4 outline-none text-gray-700"
          />

          <button className="text-2xl">
            🔍
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="p-4">
          {[1, 2, 3].map((section) => (
            <div key={section} className="mb-8">
              <div className="h-6 w-40 bg-gray-200 rounded mb-4 animate-pulse"></div>

              <div className="flex gap-4 overflow-x-auto">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="min-w-[170px] h-[280px] bg-white rounded-3xl animate-pulse"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {Object.keys(filteredGroups).map((category) => (
            <div key={category} className="mb-8">

              {/* CATEGORY HEADER */}
              <div className="flex justify-between items-center px-4 mb-4">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    {category}
                  </h2>

                  <p className="text-gray-500 text-sm">
                    Fresh products delivered fast
                  </p>
                </div>

                <button className="text-green-700 font-bold">
                  View all
                </button>
              </div>

              {/* PRODUCTS */}
              <div className="flex gap-4 overflow-x-auto px-4 scrollbar-hide">
                {filteredGroups[category].map((item) => (
                  <ProductCard
                    key={item._id}
                    item={item}
                  />
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}