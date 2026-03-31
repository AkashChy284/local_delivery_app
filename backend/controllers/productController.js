import Product from "../models/Product.js";

// 📋 GET ALL OR FILTER
export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ➕ ADD PRODUCT WITH IMAGE UPLOAD
export const addProduct = async (req, res) => {
  try {
    const { name, price, category } = req.body;

    const product = new Product({
      name,
      price,
      category,
      image: req.file.path, // cloudinary URL
    });

    const saved = await product.save();

    res.json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ❌ DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const { name, price, category } = req.body;

    let updateData = {
      name,
      price,
      category,
    };

    // ✅ if new image uploaded
    if (req.file) {
      updateData.image = req.file.path;
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};