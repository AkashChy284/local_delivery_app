import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

const Products = ({ selectedCategory }) => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);

  const { cart, addToCart, increaseQty, decreaseQty } = useCart();

  const phoneNumber = "918935847223";
  const BASE_URL = "https://local-delivery-app-l4je.onrender.com";

  useEffect(() => {
    let url = `${BASE_URL}/api/products`;

    if (selectedCategory) {
      url += `?category=${encodeURIComponent(selectedCategory)}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, [selectedCategory]);

  const filteredProducts = products.filter((item) => {
    const matchCategory = selectedCategory
      ? item.category?.trim().toLowerCase() === selectedCategory.toLowerCase()
      : true;

    const matchSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  const totalItems = cart.reduce((a, b) => a + b.qty, 0);
  const totalPrice = cart.reduce((a, b) => a + b.price * b.qty, 0);

  const placeOrder = () => {
    let message = "Hi, I want to place an order:\n\n";

    cart.forEach((item) => {
      message += `${item.name} - Qty: ${item.qty} - ₹${
        item.price * item.qty
      }\n`;
    });

    message += `\nTotal: ₹${totalPrice}`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="px-3 sm:px-4">

      {/* 🔍 SEARCH BAR */}
      <div className="mb-5 sticky top-0 z-10 bg-yellow-50 py-3">
        <div className="flex gap-2 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search groceries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border rounded-full px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button className="bg-green-600 text-white px-4 rounded-full text-sm">
            🔍
          </button>
        </div>
      </div>

      {/* 🛍️ PRODUCTS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5">

        {filteredProducts.map((item) => {
          const cartItem = cart.find((i) => i._id === item._id);

          return (
            <div
              key={item._id}
              className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              {/* IMAGE */}
              <img
                src={item.image}
                alt={item.name}
                className="h-20 sm:h-24 mx-auto object-contain"
              />

              {/* INFO */}
              <div className="mt-2 text-left">
                <p className="text-xs sm:text-sm font-semibold line-clamp-2">
                  {item.name}
                </p>

                <p className="text-green-600 font-bold text-sm mt-1">
                  ₹{item.price}
                </p>
              </div>

              {/* ACTION */}
              {!cartItem ? (
                <button
                  onClick={() => addToCart(item)}
                  className="mt-2 bg-green-600 text-white text-xs sm:text-sm py-1.5 rounded-lg hover:bg-green-700"
                >
                  Add
                </button>
              ) : (
                <div className="flex justify-between items-center mt-2 bg-gray-100 rounded-lg px-2 py-1">
                  <button
                    onClick={() => decreaseQty(item._id)}
                    className="text-lg font-bold px-2"
                  >
                    −
                  </button>

                  <span className="text-sm font-semibold">
                    {cartItem.qty}
                  </span>

                  <button
                    onClick={() => increaseQty(item._id)}
                    className="text-lg font-bold px-2"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 🟢 FLOATING CART BAR (LIKE BLINKIT) */}
      {totalItems > 0 && (
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[92%] sm:w-[400px] bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg flex justify-between items-center">
          
          <div className="text-xs sm:text-sm">
            {totalItems} items | ₹{totalPrice}
          </div>

          <button
            onClick={placeOrder}
            className="bg-white text-green-600 px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold"
          >
            Order Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;