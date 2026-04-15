import { useEffect, useState } from "react";

export default function AdminList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://local-delivery-app-l4je.onrender.com";

  // ✅ FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/products`);
      const data = await res.json();

      setProducts(data);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ DELETE PRODUCT (SAFE + CONFIRM)
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken"); // optional

      const res = await fetch(`${BASE_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: token } : {}, // safe
      });

      if (!res.ok) throw new Error();

      fetchProducts(); // refresh
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete product");
    }
  };

  return (
    <div className="mt-10 max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">All Products</h2>

      {/* 🔄 Loading */}
      {loading && <p className="text-center">Loading...</p>}

      {/* 📭 Empty State */}
      {!loading && products.length === 0 && (
        <p className="text-center text-gray-500">No products found</p>
      )}

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

            <button
              onClick={() => deleteProduct(item._id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}