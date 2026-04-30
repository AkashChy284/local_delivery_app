import Order from "../models/Order.js";

const estimateDistanceFromAddress = (address = "") => {
  const text = address.toLowerCase();

  // 🔴 FAR (6–10 km)
  if (
    text.includes("madhubani") ||
    text.includes("nagdah") ||
    text.includes("balain") ||
    text.includes("simri") ||
    text.includes("bisfi") ||

    // your added areas (far group)
    text.includes("muhammadpur") ||
    text.includes("gaibipur") ||
    text.includes("nandi") ||
    text.includes("bhawji") ||
    text.includes("ghamaria") ||
    text.includes("durgouli") ||
    text.includes("toeth") ||
    text.includes("kashuli") ||
    text.includes("mankaur") ||
    text.includes("akaur") ||
    text.includes("bharampura") ||
    text.includes("debpura") ||
    text.includes("sarso")
  ) {
    return {
      distance: "6–10 km",
      deliveryCharge: 80,
      deliveryTime: "60–90 mins",
    };
  }

  // 🟡 MEDIUM (3–6 km)
  if (
    text.includes("rahika") ||
    text.includes("arih") ||
    text.includes("saurath") ||
    text.includes("parsauni") ||
    text.includes("kerwar") ||

    // your added areas (medium group)
    text.includes("bankatta") ||
    text.includes("damodarpur") ||
    text.includes("katiya") ||
    text.includes("gongoli") ||
    text.includes("uchaith") ||
    text.includes("mahalamore") ||
    text.includes("baitona") ||
    text.includes("dhanuja")
  ) {
    return {
      distance: "3–6 km",
      deliveryCharge: 50,
      deliveryTime: "40–60 mins",
    };
  }

  // 🟢 NEAR (0–3 km)
  if (
    text.includes("vidyapati") ||
    text.includes("benipatti") ||
    text.includes("chowk") ||
    text.includes("market") ||
    text.includes("bus stand")
  ) {
    return {
      distance: "0–3 km",
      deliveryCharge: 30,
      deliveryTime: "30–45 mins",
    };
  }

  // ⚪ DEFAULT
  return {
    distance: "To be verified",
    deliveryCharge: 30,
    deliveryTime: "30–60 mins",
  };
};

export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      address,
      items = [],
      subtotal,
      handlingCharge,
    } = req.body;

    const calculatedSubtotal =
      subtotal ||
      items.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.quantity || 0),
        0
      );

    const finalHandlingCharge =
      handlingCharge !== undefined ? Number(handlingCharge) : 10;

    const estimate = estimateDistanceFromAddress(address);

    const totalAmount =
      calculatedSubtotal + estimate.deliveryCharge + finalHandlingCharge;

    const order = new Order({
      user: req.user.id,
      customerName,
      phone,
      address,
      items,
      subtotal: calculatedSubtotal,
      deliveryCharge: estimate.deliveryCharge,
      handlingCharge: finalHandlingCharge,
      totalAmount,
      distance: estimate.distance,
      deliveryTime: estimate.deliveryTime,
      mapOrigin: "Vidyapati Chowk, Benipatti, Bihar",
      mapDestination: address,
    });

    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create order error:", err);
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