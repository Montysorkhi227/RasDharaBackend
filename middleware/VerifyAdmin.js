const jwt = require("jsonwebtoken");
const AdminModel = require("../models/adminModel");
require("dotenv").config();

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await AdminModel.findById(decoded.adminId);

    if (!admin) return res.status(403).json({ success: false, message: "Unauthorized: Not admin" });

    req.admin = admin;
    next();
  } catch (err) {
    console.error("Admin Auth Error:", err);
    res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = verifyAdmin;
