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

      if (newUser) {
        const token = jwt.sign(
          { userId: newUser._id },
          process.env.JWT_SECRET,
          { expiresIn: '2h' }
        );
        await TempModel.deleteOne({ email });
        await OtpModel.deleteOne({ email });

        return res.status(200).json({ success: true, message: "Email verified and user registered successfully.", token });
      }
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

    const usernameOrEmail = findUser?.username || findAdmin?.email || "";

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
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ success: false, message: "New password is required" });
    }

    const isAdmin = req.admin;
    const isUser = req.user;

    if (!isAdmin && !isUser) {
      return res.status(401).json({ success: false, message: "Access Denied" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (isAdmin) {
      await AdminModel.findByIdAndUpdate(req.admin._id, { password: hashedPassword });
    } else if (isUser) {
      await UserModel.findByIdAndUpdate(req.user._id, { password: hashedPassword });
    }

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (err) {
    console.error("Reset Password Error:", err.message);
    return res.status(500).json({ success: false, message: "Reset Password Failed" });
  }
};


exports.ChangePassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // ✅ Check if user is authenticated
    const tokenEmail = req.user?.email || req.admin?.email;

    if (!tokenEmail) {
      return res.status(401).json({ success: false, message: "Unauthorized: Please login first" });
    }

    // ✅ Ensure provided email matches token email
    if (email !== tokenEmail) {
      return res.status(403).json({ success: false, message: "Email does not match your account" });
    }

    // ✅ Check email exists in User or Admin model
    const user = await UserModel.findOne({ email });
    const admin = await AdminModel.findOne({ email });

    if (!user && !admin) {
      return res.status(404).json({ success: false, message: "Email not registered" });
    }

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expires = Date.now() + 10 * 60 * 1000; // valid for 10 minutes

     await OtpModel.deleteMany({ email });
    await OtpModel.create({ email, otp, expires });

    // ✅ Send OTP via mail
    const usernameOrEmail = user?.username || admin?.email || "";
    await sendMail(email, "reset", otp, usernameOrEmail);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });

  } catch (error) {
    console.error("ChangePassword OTP Error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};



