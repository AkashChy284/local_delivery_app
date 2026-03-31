import { useState } from "react";

export default function AdminForm() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: null,
  });

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

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("image", form.image);

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData,
      });

      await res.json();

      alert("✅ Product Added");

      setForm({
        name: "",
        price: "",
        category: "",
        image: null,
      });

    } catch (err) {
      console.error(err);
      alert("❌ Error adding product");
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

      <button className="w-full bg-green-600 text-white py-2 rounded-lg">
        Add Product
      </button>
    </form>
  );
}