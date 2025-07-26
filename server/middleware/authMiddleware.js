// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_here";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No authorization header provided" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid authorization format. Use 'Bearer <token>'" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token has expired. Please login again." });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token format" });
    } else {
      return res.status(401).json({ message: "Token verification failed" });
    }
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin allowed" });
  }
  next();
};
