import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useCart } from "../context/CartContext";

const BASE_URL = "https://local-delivery-app-l4je.onrender.com";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, increaseQty, decreaseQty } = useCart();

  const [products, setProducts] = useState([]);
  const product = products.find((p) => p._id === id);
  const cartItem = cart.find((i) => i._id === id);

  useEffect(() => {
    fetch(`${BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  }, []);

  const similarProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p._id !== product._id && p.category === product.category)
      .slice(0, 10);
  }, [products, product]);

  const totalItems = cart.reduce((a, b) => a + b.qty, 0);
  const totalPrice = cart.reduce((a, b) => a + b.price * b.qty, 0);

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          Loading product...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white min-h-screen pb-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 py-6">
          <div className="bg-white">
            <button
              onClick={() => navigate(-1)}
              className="mb-4 text-green-700 font-semibold"
            >
              ← Back
            </button>

            <div className="border rounded-3xl h-[360px] md:h-[520px] flex items-center justify-center bg-white">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[300px] md:max-h-[430px] object-contain"
              />
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">
              Home / {product.category || "Product"} / {product.name}
            </p>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              {product.category || "Daily Essential"}
            </p>

            <div className="mt-6">
              <p className="text-xs text-gray-500">Price</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{product.price}
              </p>
              <p className="text-xs text-gray-400">Inclusive of all taxes</p>
            </div>

            <div className="mt-6">
              {!cartItem ? (
                <button
                  onClick={() => addToCart(product)}
                  className="bg-green-700 text-white px-10 py-3 rounded-xl font-bold"
                >
                  Add to cart
                </button>
              ) : (
                <div className="inline-flex items-center bg-green-700 text-white rounded-xl overflow-hidden">
                  <button
                    onClick={() => decreaseQty(product._id)}
                    className="px-5 py-3 font-bold text-xl"
                  >
                    -
                  </button>
                  <span className="px-5 font-bold">{cartItem.qty}</span>
                  <button
                    onClick={() => increaseQty(product._id)}
                    className="px-5 py-3 font-bold text-xl"
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            <div className="mt-8">
              <h2 className="font-bold text-lg">Why shop from Shivam Express?</h2>

              <div className="mt-4 space-y-4">
                <div className="flex gap-3">
                  <div className="h-11 w-11 bg-yellow-100 rounded-full flex items-center justify-center">
                    🛵
                  </div>
                  <div>
                    <p className="font-semibold">Fast Local Delivery</p>
                    <p className="text-sm text-gray-500">
                      Get items delivered around Benipatti quickly.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-11 w-11 bg-yellow-100 rounded-full flex items-center justify-center">
                    💰
                  </div>
                  <div>
                    <p className="font-semibold">Best Local Prices</p>
                    <p className="text-sm text-gray-500">
                      Daily essentials at affordable prices.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-11 w-11 bg-yellow-100 rounded-full flex items-center justify-center">
                    🛒
                  </div>
                  <div>
                    <p className="font-semibold">Wide Assortment</p>
                    <p className="text-sm text-gray-500">
                      Grocery, food, fruits, drinks and essentials.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 mt-8">
            <h2 className="text-xl font-bold mb-4">Similar products</h2>

            <div className="flex gap-4 overflow-x-auto pb-4">
              {similarProducts.map((item) => {
                const itemInCart = cart.find((i) => i._id === item._id);

                return (
                  <div
                    key={item._id}
                    onClick={() => navigate(`/product/${item._id}`)}
                    className="min-w-[150px] bg-white border rounded-2xl p-3 cursor-pointer"
                  >
                    <div className="h-28 bg-gray-50 rounded-xl flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 object-contain"
                      />
                    </div>

                    <p className="text-xs font-semibold mt-2 line-clamp-2 min-h-[34px]">
                      {item.name}
                    </p>

                    <p className="font-bold text-sm mt-2">₹{item.price}</p>

                    {!itemInCart ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                        }}
                        className="mt-2 border border-green-600 text-green-700 rounded-lg px-4 py-1 text-xs font-bold"
                      >
                        ADD
                      </button>
                    ) : (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="mt-2 inline-flex items-center bg-green-700 text-white rounded-lg"
                      >
                        <button
                          onClick={() => decreaseQty(item._id)}
                          className="px-2"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs">{itemInCart.qty}</span>
                        <button
                          onClick={() => increaseQty(item._id)}
                          className="px-2"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {totalItems > 0 && (
          <button
            onClick={() => navigate("/cart")}
            className="fixed bottom-20 md:bottom-5 left-1/2 -translate-x-1/2 bg-green-700 text-white rounded-full px-6 py-3 shadow-2xl z-50 flex items-center gap-5"
          >
            <span>
              <b>View cart</b>
              <br />
              <span className="text-xs">
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