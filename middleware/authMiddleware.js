const AdminModel = require("../models/adminModel");
const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const id = decoded.adminId || decoded.userId;
    const model = decoded.adminId ? AdminModel : decoded.userId ? UserModel : null;

    if (!id || !model) {
      return res.status(403).json({ success: false, message: "Please Login first to your Account" });
    }

    const account = await model.findById(id);

    if (!account) {
      return res.status(403).json({
        success: false,
        message: `Unauthorized: ${decoded.adminId ? "Admin" : decoded.userId ? "User" : "Unknown"} not found`,
      });
    }

    // Assign to req based on role
    decoded.adminId ? (req.admin = account) : (req.user = account);

    next(); // ✅ Proceed to next middleware or route


  } catch (err) {
    console.error("Auth Error:", err);
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
