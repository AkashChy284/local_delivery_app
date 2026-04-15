import express from "express";

const router = express.Router();

router.post("/admin-login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    return res.json({ token: process.env.ADMIN_TOKEN });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

export { router as authRoutes };