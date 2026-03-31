import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

const Products = ({ selectedCategory }) => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);

  const { cart, addToCart, increaseQty, decreaseQty } = useCart();

  const phoneNumber = "919876543210";

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    let url = "http://localhost:5000/api/products";

    if (selectedCategory) {
      url += `?category=${encodeURIComponent(selectedCategory)}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, [selectedCategory]);

  // ✅ FILTER SEARCH ONLY
  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ TOTALS
  const totalItems = cart.reduce((a, b) => a + b.qty, 0);
  const totalPrice = cart.reduce(
    (a, b) => a + b.price * b.qty,
    0
  );

  // ✅ WHATSAPP
  const placeOrder = () => {
    let message = "Hi, I want to place an order:\n\n";

    cart.forEach((item) => {
      message += `${item.name} - Qty: ${item.qty} - ₹${
        item.price * item.qty
      }\n`;
    });

    message += `\nSubtotal (Approx): ₹${totalPrice}`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
  };

  return (
    <div className="px-4">

      {/* SEARCH */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button className="bg-green-700 text-white px-4 rounded-lg">
          Search
        </button>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        {filteredProducts.map((item) => {
          const cartItem = cart.find((i) => i._id === item._id);

          return (
            <div
              key={item._id}
              className="border rounded-xl p-3 text-center shadow-sm"
            >
              <img
                src={item.image}
                className="h-20 mx-auto mb-2 object-contain"
              />

              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-gray-500">
                Approx ₹{item.price}
              </p>

              {!cartItem ? (
                <button
                  onClick={() => addToCart(item)}
                  className="mt-2 bg-green-600 text-white px-4 py-1 rounded-lg text-sm"
                >
                  Add
                </button>
              ) : (
                <div className="flex justify-center items-center gap-2 mt-2">
                  <button
                    onClick={() => decreaseQty(item._id)}
                    className="px-2 bg-gray-200 rounded"
                  >
                    -
                  </button>

                  <span>{cartItem.qty}</span>

                  <button
                    onClick={() => increaseQty(item._id)}
                    className="px-2 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}

      </div>

      {/* WHATSAPP BAR */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-green-600 text-white px-6 py-4 flex justify-between items-center">
          <div>
            <p>{totalItems} items</p>
            <p>₹{totalPrice}</p>
          </div>

          <button
            onClick={placeOrder}
            className="bg-white text-green-600 px-4 py-2 rounded-lg"
          >
            Order on WhatsApp
          </button>
        </div>
      )}

    </div>
  );
};

export default Products;