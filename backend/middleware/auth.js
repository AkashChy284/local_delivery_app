const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  next();
};

export default authMiddleware;