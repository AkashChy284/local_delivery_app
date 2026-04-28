import Order from "../models/Order.js";

// ➕ Create Order
export const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    const saved = await order.save();

    res.status(201).json(saved);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📋 Get All Orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔎 Get Single Order By ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("Get order by id error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔄 Update Order Status + Distance + Delivery Charge
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, distance } = req.body;

    const allowedStatuses = ["pending", "accepted", "delivered", "cancelled"];

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Update status if provided
    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      order.status = status;
    }

    // ✅ Admin distance update
    if (distance !== undefined && distance !== null && distance !== "") {
      const km = Number(distance);

      if (Number.isNaN(km) || km < 0) {
        return res.status(400).json({ message: "Invalid distance" });
      }

      let deliveryCharge = 30;

      if (km > 3) {
        deliveryCharge = 30 + Math.ceil(km - 3) * 10;
      }

      order.distance = `${km} km`;
      order.deliveryCharge = deliveryCharge;

      order.totalAmount =
        (order.subtotal || 0) +
        (order.deliveryCharge || 0) +
        (order.handlingCharge || 0);
    }

    const updated = await order.save();

    res.json(updated);
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: err.message });
  }
};