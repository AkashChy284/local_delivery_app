import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, distance } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status) {
      order.status = status;
    }

    if (distance !== undefined && distance !== null && distance !== "") {
      const km = Number(distance);

      if (Number.isNaN(km) || km <= 0) {
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
        deliveryCharge +
        (order.handlingCharge || 0);
    }

    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};