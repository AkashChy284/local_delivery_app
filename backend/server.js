import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import productRoutes from "./routes/productRoutes.js";
import { authRoutes } from "./routes/authRoutes.js"; // ✅ FIXED
import orderRoutes from "./routes/orderRoutes.js"; // ✅ NEW

dotenv.config();
connectDB();

const app = express();

// ✅ CORS
app.use(cors());

// ✅ Body parser
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Routes
app.use("/api/auth", authRoutes);        // login
app.use("/api/products", productRoutes); // products
app.use("/api/orders", orderRoutes);     // ✅ NEW (orders)

// ✅ PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);