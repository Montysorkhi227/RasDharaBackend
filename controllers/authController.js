const UserModel = require("../models/userModel");
const TempModel = require("../models/temporaryModel");
const OtpModel = require("../models/otpModel");
const AdminModel = require("../models/adminModel");
const sendMail = require("../config/nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

// ✅ 1. VERIFY OTP
exports.VerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const tempOtp = await OtpModel.findOne({ email });
    if (!tempOtp) {
      return res.status(400).json({ success: false, message: "OTP not found or expired" });
    }

    if (tempOtp.expires < Date.now()) {
      await OtpModel.deleteOne({ email });
      await TempModel.deleteOne({ email });
      return res.status(400).json({ success: false, message: "OTP expired. Please try again." });
    }

    if (tempOtp.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // 👉 Check for Temp User (Normal User Sign-up Verification)
    const tempUser = await TempModel.findOne({ email });
    if (tempUser) {
      const newUser = new UserModel({
        username: tempUser.username,
        email: tempUser.email,
        phone: tempUser.phone,
        password: tempUser.password,
      });

      await newUser.save();
      await TempModel.deleteOne({ email });
      await OtpModel.deleteOne({ email });

      return res.status(200).json({ success: true, message: "Email verified and user registered successfully." });
    }

    // 👉 Admin Login OTP Verification
    const admin = await AdminModel.findOne({ email });
    if (admin) {
      const token = jwt.sign(
        { adminId: admin._id },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      await sendMail(email, "verifyadminotp", "Welcome Back", "");
      await OtpModel.deleteOne({ email });

      return res.status(200).json({
        success: true,
        message: "Admin OTP verified. Login successful",
        token
      });
    }

    // 👉 Password Reset Flow - Don't delete user, just verify OTP
    const user = await UserModel.findOne({ email });
    if (user) {
      await OtpModel.deleteOne({ email });
      return res.status(200).json({
        success: true,
        message: "OTP verified. You can now reset your password.",
      });
    }

    return res.status(400).json({ success: false, message: "No user or admin found for this email" });

  } catch (err) {
    console.error("OTP Verification Error:", err);
    res.status(500).json({ success: false, message: "OTP verification failed" });
  }
};

// ✅ 2. FORGOT PASSWORD (Send OTP)
exports.ForgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const findUser = await UserModel.findOne({ email });
    const findAdmin = await AdminModel.findOne({ email });

    console.log(findAdmin);
    console.log(findUser);
    

    if (!findUser && !findAdmin) {
      return res.status(404).json({
        success: false,
        message: "User or Admin not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await OtpModel.deleteMany({ email });
    await OtpModel.create({ email, otp, expires });

    const usernameOrEmail = findUser?.username ||  findAdmin?.email || "";

    await sendMail(email, "reset", otp, usernameOrEmail);

    return res.status(200).json({
      success: true,
      message: "OTP sent to email for password reset",
    });

  } catch (err) {
    console.error("Forget Password Error:", err);
    res.status(500).json({ success: false, message: "Forget Password Failed" });
  }
};

// ✅ 3. RESET PASSWORD 
exports.ResetPassword = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("auth :",authHeader);
    

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    console.log("token:",token);
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ success: false, message: "New password is required" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await UserModel.findByIdAndUpdate(userId, { password: hashedPassword });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (err) {
    console.error("Reset Password Error:", err.message);
    return res.status(500).json({ success: false, message: "Reset Password Failed" });
  }
};

