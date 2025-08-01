const AdminModel = require("../models/adminmodel");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const authAdminMiddleware = async (req, res, next) => {
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

    // ✅ Check for adminId only
    if (!decoded.adminId) {
      return res.status(403).json({ success: false, message: "Access denied: Only admin can perform this action" });
    }

    const admin = await AdminModel.findById(decoded.adminId);

    if (!admin) {
      return res.status(403).json({ success: false, message: "Unauthorized: Admin not found" });
    }

    req.admin = admin; // ✅ Assign to request object
    next(); // ✅ Proceed
  } catch (err) {
    console.error("Auth Admin Error:", err);
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = authAdminMiddleware;
