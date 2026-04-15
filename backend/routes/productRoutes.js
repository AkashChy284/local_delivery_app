import express from "express";
import {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";

import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// 📋 PUBLIC ROUTE (no auth)
router.get("/", getProducts);

// 🔐 PROTECTED ROUTES (admin only)
router.post("/", authMiddleware, upload.single("image"), addProduct);

router.delete("/:id", authMiddleware, deleteProduct);

router.put("/:id", authMiddleware, upload.single("image"), updateProduct);

export default router;