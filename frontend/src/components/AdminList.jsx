import { useEffect, useState } from "react";

export default function AdminList() {
  const [products, setProducts] = useState([]);

  // ✅ Use deployed backend
  const BASE_URL = "https://local-delivery-app-l4je.onrender.com";

  // ✅ FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ❌ DELETE PRODUCT → FIXED
  const deleteProduct = async (id) => {
    try {
      await fetch(`${BASE_URL}/api/products/${id}`, {
        method: "DELETE",
      });

      fetchProducts(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-10 max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">All Products</h2>

      <div className="space-y-3">
        {products.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between bg-white p-3 rounded shadow"
          >
            <div className="flex items-center gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="h-12 w-12 object-cover rounded"
              />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">
                  ₹{item.price} | {item.category}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => deleteProduct(item._id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}