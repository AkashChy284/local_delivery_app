import { useState } from "react";

export default function AdminForm({ onProductAdded }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://local-delivery-app-l4je.onrender.com";

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image) {
      alert("⚠️ Please select an image");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("image", form.image);

    try {
      const token = localStorage.getItem("adminToken"); // optional

      const res = await fetch(`${BASE_URL}/api/products`, {
        method: "POST",
        headers: token ? { Authorization: token } : {}, // ✅ SAFE (won’t break)
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to add product");
      }

      await res.json();

      alert("✅ Product Added");

      setForm({
        name: "",
        price: "",
        category: "",
        image: null,
      });

      // 🔄 Refresh product list if function passed
      if (onProductAdded) {
        onProductAdded();
      }

    } catch (err) {
      console.error(err);
      alert("❌ Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white max-w-md mx-auto p-6 rounded-xl shadow"
    >
      <input
        name="name"
        placeholder="Product Name"
        value={form.name}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
        required
      />

      <input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
        required
      />

      <input
        name="category"
        placeholder="Category (Groceries, Fruits & Vegetables...)"
        value={form.category}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
        required
      />

      <input
        type="file"
        name="image"
        onChange={handleChange}
        className="w-full border p-2 mb-4 rounded"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-lg text-white ${
          loading ? "bg-gray-400" : "bg-green-600"
        }`}
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
}