import express from "express";
import {
  createOrder,
  getOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// 🟢 Create order (user)
router.post("/", createOrder);

// 🔐 Admin routes
router.get("/", authMiddleware, getOrders);
router.put("/:id", authMiddleware, updateOrderStatus);

export default router;