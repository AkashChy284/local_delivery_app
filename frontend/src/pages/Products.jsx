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
    <div className="px-4">

      {/* SEARCH */}
      <div className="mb-6 flex gap-2 max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button className="bg-yellow-400 px-5 rounded-lg font-semibold hover:bg-yellow-500 transition">
          Search
        </button>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">

        {filteredProducts.map((item) => {
          const cartItem = cart.find((i) => i._id === item._id);

          return (
            <div
              key={item._id}
              className="bg-white rounded-2xl p-4 text-center shadow-md hover:shadow-xl transition duration-300"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-24 mx-auto mb-3 object-contain"
              />

              <p className="text-sm font-semibold">{item.name}</p>
              <p className="text-red-600 font-bold mt-1">₹{item.price}</p>

              {!cartItem ? (
                <button
                  onClick={() => addToCart(item)}
                  className="mt-3 bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                >
                  Add to Cart
                </button>
              ) : (
                <div className="flex justify-center items-center gap-3 mt-3">
                  <button
                    onClick={() => decreaseQty(item._id)}
                    className="px-3 py-1 bg-gray-200 rounded-lg font-bold"
                  >
                    -
                  </button>

                  <span className="font-semibold">{cartItem.qty}</span>

                  <button
                    onClick={() => increaseQty(item._id)}
                    className="px-3 py-1 bg-gray-200 rounded-lg font-bold"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}

      </div>

      {/* WHATSAPP FLOAT BAR */}
      {totalItems > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-6">
          
          <div className="text-sm font-medium">
            {totalItems} items | ₹{totalPrice}
          </div>

          <button
            onClick={placeOrder}
            className="bg-white text-green-600 px-4 py-1.5 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            💬 Order Now
          </button>
        </div>
      )}

    </div>
  );
};

export default Products;