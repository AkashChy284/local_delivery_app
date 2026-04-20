import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";

import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// 🟢 User routes
router.post("/", createOrder);
router.get("/:id", getOrderById);

// 🔐 Admin routes
router.get("/", authMiddleware, getOrders);
router.put("/:id", authMiddleware, updateOrderStatus);

export default router;