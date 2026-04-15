import express from "express";
import {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";

import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/auth.js"; // ✅ add this

const router = express.Router();

// 📋 PUBLIC
router.get("/", getProducts);

// 🔐 PROTECTED
router.post("/", authMiddleware, upload.single("image"), addProduct);

router.delete("/:id", authMiddleware, deleteProduct);

router.put("/:id", authMiddleware, upload.single("image"), updateProduct);

export default router;