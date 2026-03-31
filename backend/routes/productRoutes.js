import express from "express";
import {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct, // ✅ add this
} from "../controllers/productController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

// 📋 GET all products
router.get("/", getProducts);

// ➕ ADD product (with image upload)
router.post("/", upload.single("image"), addProduct);

// ❌ DELETE product
router.delete("/:id", deleteProduct);

// ✏️ UPDATE product
router.put("/:id", upload.single("image"), updateProduct);

export default router;