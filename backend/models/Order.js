import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    subtotal: {
      type: Number,
      default: 0,
    },

    deliveryCharge: {
      type: Number,
      default: 30,
    },

    handlingCharge: {
      type: Number,
      default: 10,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    distance: {
      type: String,
      default: "To be verified",
    },

    deliveryTime: {
      type: String,
      default: "30–60 mins",
    },

    mapOrigin: {
      type: String,
      default: "Vidyapati Chowk, Benipatti, Bihar",
    },

    mapDestination: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);