import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ CORS (allow frontend domain later)
app.use(cors());

// ✅ Body parser
app.use(express.json());

// ✅ Test route (VERY IMPORTANT for Render)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Routes
app.use("/api/products", productRoutes);

// ✅ PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);