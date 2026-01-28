import jwt from "jsonwebtoken";
import { connectDB } from "../config/db.js";
import User from "../models/userModel.js";

const jwt_Secret = process.env.JWT_SECRET;

export default async function authMiddleware(req, res, next) {
  try {
    if (!jwt_Secret) {
      throw new Error("JWT_SECRET not defined");
    }

    const authHeader = (req.headers.authorization || "").toString();

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no or invalid Authorization header",
      });
    }

    const token = authHeader.split(" ")[1];

    await connectDB(); // 🔴 REQUIRED on Vercel

    const payload = jwt.verify(token, jwt_Secret);

    const user = await User.findById(payload.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("jwt verify err:", error.message);
    return res.status(401).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
}
