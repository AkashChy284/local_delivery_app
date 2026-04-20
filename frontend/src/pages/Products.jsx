import React, { useState, useEffect, useMemo, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import OrderSuccess from "../components/OrderSuccess";

const Products = ({ selectedCategory }) => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [appliedSearch, setAppliedSearch] = useState("");

  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [checkoutForm, setCheckoutForm] = useState({
    customerName: "",
    phone: "",
    address: "",
  });

  const { cart, addToCart, increaseQty, decreaseQty } = useCart();

  const location = useLocation();
  const navigate = useNavigate();
  const resultsRef = useRef(null);

  const BASE_URL = "https://local-delivery-app-l4je.onrender.com";

  const queryParams = new URLSearchParams(location.search);
  const urlCategory = queryParams.get("cat");
  const urlSearch = queryParams.get("search") || "";

  const finalCategory = urlCategory || selectedCategory;

  // ✅ If rendered inside Home, selectedCategory prop exists
  const isEmbeddedInHome = selectedCategory !== undefined;

  useEffect(() => {
    setSearch(urlSearch);
    setAppliedSearch(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    let url = `${BASE_URL}/api/products`;

    if (finalCategory) {
      url += `?category=${encodeURIComponent(finalCategory)}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, [finalCategory]);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchCategory = finalCategory
        ? item.category?.trim().toLowerCase() === finalCategory.toLowerCase()
        : true;

      const matchSearch = appliedSearch
        ? item.name.toLowerCase().includes(appliedSearch.toLowerCase())
        : true;

      return matchCategory && matchSearch;
    });
  }, [products, finalCategory, appliedSearch]);

  const totalItems = cart.reduce((a, b) => a + b.qty, 0);
  const totalPrice = cart.reduce((a, b) => a + b.price * b.qty, 0);

  const runSearch = () => {
    const value = search.trim();
    setAppliedSearch(value);

    const params = new URLSearchParams();

    if (finalCategory) params.set("cat", finalCategory);
    if (value) params.set("search", value);

    const queryString = params.toString();

    if (!isEmbeddedInHome) {
      navigate(queryString ? `/products?${queryString}` : "/products");
    }

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      runSearch();
    }
  };

  const handleCheckoutChange = (e) => {
    const { name, value } = e.target;
    setCheckoutForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openCheckout = () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }
    setShowCheckout(true);
  };

  const closeCheckout = () => {
    if (isPlacingOrder) return;
    setShowCheckout(false);
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    if (!checkoutForm.customerName.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!checkoutForm.phone.trim()) {
      alert("Please enter your phone number");
      return;
    }

    if (!checkoutForm.address.trim()) {
      alert("Please enter your address");
      return;
    }

    try {
      setIsPlacingOrder(true);

      const orderData = {
        customerName: checkoutForm.customerName.trim(),
        phone: checkoutForm.phone.trim(),
        address: checkoutForm.address.trim(),
        items: cart.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.qty,
        })),
        totalAmount: totalPrice,
      };

      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("Order Error:", data);
        alert(data.message || "Order failed");
        setIsPlacingOrder(false);
        return;
      }

      setShowCheckout(false);
      setOrderSuccess(true);

      setTimeout(() => {
        setOrderSuccess(false);
        window.location.reload();
      }, 2200);
    } catch (err) {
      console.error(err);
      alert("Error placing order");
      setIsPlacingOrder(false);
    }
  };

  const content = (
    <div className={isEmbeddedInHome ? "" : "min-h-screen bg-[#f8f9fb] -mx-3 sm:-mx-6"}>
      {!isEmbeddedInHome && (
        <div className="bg-white border-b sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
            <div className="mb-4">
              {finalCategory ? (
                <>
                  <button
                    onClick={() => navigate("/categories")}
                    className="text-sm text-green-600 font-medium mb-2"
                  >
                    ← Back to Categories
                  </button>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {finalCategory}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Explore products in {finalCategory}
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    All Products
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Fast delivery to your doorstep
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={isEmbeddedInHome ? "" : "max-w-7xl mx-auto px-3 sm:px-6 py-5 pb-28"}>
        <div className={`${isEmbeddedInHome ? "mb-6" : "mb-5"} sticky top-0 z-10 bg-yellow-50 py-3`}>
          <div className="flex gap-2 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search milk, biscuits, fruits..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="flex-1 border border-gray-200 bg-white rounded-full px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={runSearch}
              className="bg-green-600 text-white px-4 rounded-full text-sm font-semibold"
            >
              🔍
            </button>
          </div>
        </div>

        {!isEmbeddedInHome && (
          <div ref={resultsRef} className="mb-4 text-sm text-gray-500">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""} found
            {appliedSearch ? ` for "${appliedSearch}"` : ""}
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-8 text-center text-gray-500">
            No products found.
          </div>
        ) : (
          <div
            ref={isEmbeddedInHome ? resultsRef : null}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5"
          >
            {filteredProducts.map((item) => {
              const cartItem = cart.find((i) => i._id === item._id);

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition flex flex-col justify-between border"
                >
                  <div className="bg-gray-50 rounded-xl h-28 sm:h-32 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 sm:h-24 object-contain"
                    />
                  </div>

                  <div className="mt-2 text-left">
                    <p className="text-[10px] sm:text-xs text-gray-400 font-medium">
                      {item.category || "Product"}
                    </p>

                    <p className="text-xs sm:text-sm font-semibold line-clamp-2 min-h-[36px] mt-1">
                      {item.name}
                    </p>

                    <p className="text-green-600 font-bold text-sm mt-2">
                      ₹{item.price}
                    </p>
                  </div>

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
        )}

        {totalItems > 0 && (
          <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[94%] sm:w-[430px] bg-green-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex justify-between items-center z-50">
            <div>
              <p className="text-xs opacity-90">{totalItems} items added</p>
              <p className="text-sm font-bold">₹{totalPrice}</p>
            </div>

            <button
              onClick={openCheckout}
              className="bg-white text-green-700 px-4 py-2 rounded-xl text-sm font-bold"
            >
              Checkout
            </button>
          </div>
        )}

        {showCheckout && (
          <div className="fixed inset-0 bg-black/50 z-[60] flex items-end sm:items-center justify-center">
            <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 animate-scale max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Checkout
                  </h2>
                  <p className="text-sm text-gray-500">
                    Enter delivery details
                  </p>
                </div>

                <button
                  onClick={closeCheckout}
                  className="text-gray-500 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <form onSubmit={placeOrder} className="space-y-4">
                <div className="bg-gray-50 rounded-2xl p-4 border">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={checkoutForm.customerName}
                    onChange={handleCheckoutChange}
                    placeholder="Enter your full name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  />
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 border">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={checkoutForm.phone}
                    onChange={handleCheckoutChange}
                    placeholder="Enter phone number"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  />
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 border">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Delivery Address
                  </label>
                  <textarea
                    name="address"
                    value={checkoutForm.address}
                    onChange={handleCheckoutChange}
                    placeholder="House no, area, landmark..."
                    rows="3"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 resize-none bg-white"
                  />
                </div>

                <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                  <div className="flex justify-between text-sm text-gray-700 mb-2">
                    <span>Items</span>
                    <span>{totalItems}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700 mb-2">
                    <span>Delivery</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-green-700 border-t pt-3 mt-3">
                    <span>Total</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPlacingOrder}
                  className="w-full bg-green-600 text-white py-3.5 rounded-2xl font-bold text-sm sm:text-base hover:bg-green-700 disabled:opacity-70"
                >
                  {isPlacingOrder ? "Placing Order..." : "Place Order"}
                </button>
              </form>
            </div>
          </div>
        )}

        <OrderSuccess show={orderSuccess} />
      </div>
    </div>
  );

  if (isEmbeddedInHome) {
    return content;
  }

  return <Layout>{content}</Layout>;
};

export default Products;