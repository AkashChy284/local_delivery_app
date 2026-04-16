import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: String,
    phone: String,
    address: String,

    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    totalAmount: Number,

    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);