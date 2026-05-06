import { useState } from "react";

export default function AdminForm({ onProductAdded }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    mrp: "",
    unit: "1 Pack",
    stock: "10",
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
      alert("Please select an image");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("mrp", form.mrp || form.price);
    formData.append("unit", form.unit);
    formData.append("stock", form.stock);
    formData.append("category", form.category);
    formData.append("image", form.image);

    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`${BASE_URL}/api/products`, {
        method: "POST",
        headers: token ? { Authorization: token } : {},
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add product");

      alert("✅ Product Added");

      setForm({
        name: "",
        price: "",
        mrp: "",
        unit: "1 Pack",
        stock: "10",
        category: "",
        image: null,
      });

      if (onProductAdded) onProductAdded();
    } catch (err) {
      console.error(err);
      alert("❌ Error adding product");
    } finally {
      setLoading(false);
    }
  };

  const discount =
    Number(form.mrp) > Number(form.price)
      ? Math.round(((Number(form.mrp) - Number(form.price)) / Number(form.mrp)) * 100)
      : 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white max-w-xl mx-auto p-6 rounded-2xl shadow"
    >
      <h2 className="text-xl font-bold mb-4">Add Product</h2>

      <input
        name="name"
        placeholder="Product Name"
        value={form.name}
        onChange={handleChange}
        className="w-full border p-3 mb-3 rounded-xl"
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <input
          name="price"
          type="number"
          placeholder="Selling Price ₹"
          value={form.price}
          onChange={handleChange}
          className="w-full border p-3 mb-3 rounded-xl"
          required
        />

        <input
          name="mrp"
          type="number"
          placeholder="MRP ₹"
          value={form.mrp}
          onChange={handleChange}
          className="w-full border p-3 mb-3 rounded-xl"
        />
      </div>

      {discount > 0 && (
        <div className="mb-3 bg-green-50 text-green-700 px-4 py-2 rounded-xl font-bold">
          Customer will see: {discount}% OFF on MRP
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <input
          name="unit"
          placeholder="Unit e.g. 200g, 1kg, 1 Pack"
          value={form.unit}
          onChange={handleChange}
          className="w-full border p-3 mb-3 rounded-xl"
        />

        <input
          name="stock"
          type="number"
          placeholder="Stock left"
          value={form.stock}
          onChange={handleChange}
          className="w-full border p-3 mb-3 rounded-xl"
        />
      </div>

      <input
        name="category"
        placeholder="Category e.g. Groceries"
        value={form.category}
        onChange={handleChange}
        className="w-full border p-3 mb-3 rounded-xl"
        required
      />

      <input
        type="file"
        name="image"
        onChange={handleChange}
        className="w-full border p-3 mb-4 rounded-xl"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-xl text-white font-bold ${
          loading ? "bg-gray-400" : "bg-green-600"
        }`}
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
}