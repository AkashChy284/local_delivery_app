import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import authMiddleware from "../middleware/auth.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/", userAuth, createOrder);
router.get("/my/orders", userAuth, getMyOrders);

router.get("/", authMiddleware, getOrders);
router.get("/:id", getOrderById);
router.put("/:id", authMiddleware, updateOrderStatus);

export default router;