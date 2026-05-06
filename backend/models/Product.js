import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,

    // Selling price
    price: Number,

    // MRP / cut price
    mrp: {
      type: Number,
      default: 0,
    },

    unit: {
      type: String,
      default: "1 Pack",
    },

    stock: {
      type: Number,
      default: 10,
    },

    category: String,
    image: String,
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);