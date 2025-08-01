const AdminModel = require("../models/adminmodel")
const bcrypt = require("bcrypt")
const sendMail = require("../config/nodemailer")
const jwt = require("jsonwebtoken")
const otpModel = require("../models/otpModel")
require("dotenv").config()


exports.AdminLogin = async (req, res) => {
    try {
      const { email, password, phone } = req.body;
  
      if (!email || !password || !phone)
        return res.status(400).json({ success: false, message: "All fields are required !!" });
  
      const admin = await AdminModel.findOne({ email });
      if (!admin)
        return res.status(404).json({ success: false, message: "Admin not found" });
  
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch)
        return res.status(401).json({ success: false, message: "Invalid password" })
  
      if (admin.phone !== phone)
        return res.status(400).json({ success: false, message: "Phone number does not match" });

  
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 5 * 60 * 1000);
  
      await otpModel.deleteMany({ email }); // Remove old OTPs
      await otpModel.create({ email, otp, expires });

      await sendMail(email, "login" , otp , null); // ✅ Add this line to actually send OTP

      return res.status(200).json({
        success: true,
        message: "OTP sent to email for verification"
      });
  
    } catch (err) {
      console.error("Admin Login Error:", err);
      res.status(500).json({ success: false, message: "Login failed" });
    }
};