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
  const [loading, setLoading] = useState(true);

  const product = products.find((p) => p._id === id);
  const cartItem = cart.find((i) => i._id === id);

  useEffect(() => {
    fetch(`${BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const similarProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p._id !== product._id && p.category === product.category)
      .slice(0, 10);
  }, [products, product]);

  const totalItems = cart.reduce((a, b) => a + b.qty, 0);
  const totalPrice = cart.reduce((a, b) => a + b.price * b.qty, 0);

  const getPriceInfo = (item) => {
    const price = Number(item?.price || 0);
    const mrp = Number(item?.mrp || item?.price || 0);
    const discount =
      mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    return { price, mrp, discount };
  };

  const SmallProductCard = ({ item }) => {
    const itemInCart = cart.find((i) => i._id === item._id);
    const { price, mrp, discount } = getPriceInfo(item);

    return (
      <div
        onClick={() => navigate(`/product/${item._id}`)}
        className="min-w-[165px] bg-white border border-gray-100 rounded-3xl p-3 cursor-pointer shadow-sm"
      >
        <div className="relative h-32 bg-[#f7f8fa] rounded-2xl flex items-center justify-center">
          <img
            src={item.image}
            alt={item.name}
            className="h-24 w-full object-contain p-2"
          />

          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">
              {discount}% OFF
            </span>
          )}
        </div>

        <p className="text-[11px] text-gray-400 mt-2">
          {item.unit || "1 Pack"}
        </p>

        <p className="text-sm font-bold mt-1 line-clamp-2 min-h-[40px]">
          {item.name}
        </p>

        <div className="mt-2">
          <div className="flex items-center gap-2">
            <p className="font-black text-gray-900">₹{price}</p>
            {mrp > price && (
              <p className="text-xs text-gray-400 line-through">₹{mrp}</p>
            )}
          </div>

          {discount > 0 && (
            <p className="text-[11px] text-green-700 font-black">
              {discount}% OFF
            </p>
          )}
        </div>

        {!itemInCart ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(item);
            }}
            className="mt-3 w-full border-2 border-green-600 text-green-700 rounded-xl py-2 text-xs font-black bg-green-50"
          >
            ADD
          </button>
        ) : (
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-3 flex items-center justify-between bg-green-700 text-white rounded-xl overflow-hidden"
          >
            <button
              onClick={() => decreaseQty(item._id)}
              className="px-3 py-2 font-black"
            >
              -
            </button>
            <span className="font-black text-sm">{itemInCart.qty}</span>
            <button
              onClick={() => increaseQty(item._id)}
              className="px-3 py-2 font-black"
            >
              +
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#f6f7f8] px-4 py-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-[360px] md:h-[520px] bg-gray-200 rounded-3xl animate-pulse" />
            <div>
              <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mt-4" />
              <div className="h-12 w-40 bg-gray-200 rounded animate-pulse mt-8" />
              <div className="h-14 w-48 bg-gray-200 rounded-2xl animate-pulse mt-8" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#f6f7f8] flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm">
            <h2 className="text-xl font-black">Product not found</h2>
            <button
              onClick={() => navigate("/products")}
              className="mt-5 bg-green-700 text-white px-6 py-3 rounded-2xl font-bold"
            >
              Back to products
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const { price, mrp, discount } = getPriceInfo(product);

  return (
    <Layout>
      <div className="bg-[#f6f7f8] min-h-screen pb-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-5">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-4 bg-white px-4 py-2 rounded-full text-green-700 font-black shadow-sm"
            >
              ← Back
            </button>

            <div className="relative bg-white border border-gray-100 rounded-[2rem] h-[360px] md:h-[520px] flex items-center justify-center shadow-sm overflow-hidden">
              {discount > 0 && (
                <div className="absolute top-5 left-5 bg-red-500 text-white px-3 py-2 rounded-xl font-black text-sm">
                  {discount}% OFF
                </div>
              )}

              <img
                src={product.image}
                alt={product.name}
                className="max-h-[300px] md:max-h-[430px] w-full object-contain p-6"
              />

              <div className="absolute bottom-5 left-5 bg-black/80 text-white text-xs px-3 py-2 rounded-xl font-bold">
                ⏱ 17 mins delivery
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-5 md:p-7 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 font-semibold mb-2">
              Home / {product.category || "Product"}
            </p>

            <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight">
              {product.name}
            </h1>

            <p className="mt-2 text-sm text-gray-500 font-semibold">
              {product.unit || "1 Pack"}
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span className="text-yellow-500 text-sm">⭐⭐⭐⭐</span>
              <span className="text-sm text-gray-500">
                ({product.stock || 10} left)
              </span>
            </div>

            <div className="mt-7 bg-[#f7f8fa] rounded-3xl p-5">
              <p className="text-xs text-gray-500 font-bold">Price</p>

              <div className="flex items-end gap-3 mt-1">
                <p className="text-4xl font-black text-gray-900">₹{price}</p>

                {mrp > price && (
                  <p className="text-xl text-gray-400 line-through mb-1">
                    ₹{mrp}
                  </p>
                )}
              </div>

              {discount > 0 && (
                <p className="mt-2 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-black">
                  {discount}% OFF on MRP
                </p>
              )}

              <p className="text-xs text-gray-400 mt-2">
                Inclusive of all taxes
              </p>
            </div>

            <div className="mt-6">
              {!cartItem ? (
                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-green-700 text-white py-4 rounded-2xl font-black text-lg shadow-lg"
                >
                  Add to cart
                </button>
              ) : (
                <div className="flex items-center justify-between bg-green-700 text-white rounded-2xl overflow-hidden">
                  <button
                    onClick={() => decreaseQty(product._id)}
                    className="px-8 py-4 font-black text-2xl"
                  >
                    -
                  </button>
                  <span className="font-black text-xl">{cartItem.qty}</span>
                  <button
                    onClick={() => increaseQty(product._id)}
                    className="px-8 py-4 font-black text-2xl"
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            <div className="mt-8">
              <h2 className="font-black text-xl">Why shop from Shivam Express?</h2>

              <div className="mt-4 grid gap-4">
                <div className="flex gap-3 bg-yellow-50 rounded-2xl p-4">
                  <div className="h-11 w-11 bg-yellow-200 rounded-full flex items-center justify-center">
                    🛵
                  </div>
                  <div>
                    <p className="font-black">Fast Local Delivery</p>
                    <p className="text-sm text-gray-500">
                      Delivered around Benipatti and nearby villages.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 bg-green-50 rounded-2xl p-4">
                  <div className="h-11 w-11 bg-green-200 rounded-full flex items-center justify-center">
                    💰
                  </div>
                  <div>
                    <p className="font-black">Best Local Prices</p>
                    <p className="text-sm text-gray-500">
                      Clear MRP, discount and selling price.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 bg-blue-50 rounded-2xl p-4">
                  <div className="h-11 w-11 bg-blue-200 rounded-full flex items-center justify-center">
                    🛒
                  </div>
                  <div>
                    <p className="font-black">Easy Ordering</p>
                    <p className="text-sm text-gray-500">
                      Add items, login and track your order easily.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-black">Similar products</h2>
              <button
                onClick={() => navigate("/products")}
                className="text-green-700 font-black text-sm"
              >
                View all
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4">
              {similarProducts.map((item) => (
                <SmallProductCard key={item._id} item={item} />
              ))}
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