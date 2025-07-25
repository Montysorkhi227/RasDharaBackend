const UserModel = require("../models/userModel")
const TempModel = require("../models/temporaryModel")
const OtpModel = require("../models/otpModel")
const AdminModel = require("../models/adminModel")
const bcrypt = require("bcrypt")
const sendMail = require("../config/nodemailer")
const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.Signup = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const existingTempUser = await TempModel.findOne({ email });
    if (existingTempUser) {
      return res.status(400).json({ success: false, message: "Please verify your email first" });
    }

    const existingTempOtp = await OtpModel.findOne({ email });
    if (existingTempOtp) {
      return res.status(400).json({ success: false, message: `OTP already sent to your mail ${email}` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    const tempUser = new TempModel({
      username,
      email,
      phone,
      password: hashedPassword,
    });

    const tempOtp = new OtpModel({
      email,
      otp: otp,
      expires: otpExpires,
    })

    await tempUser.save();
    await tempOtp.save()
    console.log(email);
    
    await sendMail(email, "signup" , otp , tempUser.username);

    res.status(201).json({ success: true, message: "OTP sent to email. Please verify." });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ success: false, message: "Signup failed" });
  }
};

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

    // 👉 First try to find in TempModel (normal user)
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

    // 👉 Now check for Admin
    const admin = await AdminModel.findOne({ email });
    if (admin) {
      const token = jwt.sign(
        { adminId: admin._id},
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );


      await sendMail(email,"verifyadminotp","Welcome Back","")

      await OtpModel.deleteOne({ email });


      return res.status(200).json({
        success: true,
        message: "Admin OTP verified. Login successful",
        token
      });
    }

    return res.status(400).json({ success: false, message: "No user or admin found for this email" });

  } catch (err) {
    console.error("OTP Verification Error:", err);
    res.status(500).json({ success: false, message: "OTP verification failed" });
  }
};

exports.UserLogin = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        return res.status(400).json({ success: false, message: "Email and password are required" });

      const user = await UserModel.findOne({ email });
      if (!user)
        return res.status(400).json({ success: false, message: "User not found or not verified" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ success: false, message: "Invalid credentials" });

      sendMail(email , "login" , null , user.username)

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.status(200).json({ success: true, message: "Login successful", token });
    } catch (err) {
      console.error("User Login Error:", err);
      res.status(500).json({ success: false, message: "Login failed" });
    }
};

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
  
      await OtpModel.deleteMany({ email }); // Remove old OTPs
      await OtpModel.create({ email, otp, expires });

      await sendMail(email, "login" , otp , null); // ✅ Add this line to actually send OTP

      return res.status(200).json({
        success: true,
        next: "verify-otp",
        message: "OTP sent to email for verification"
      });
  
    } catch (err) {
      console.error("Admin Login Error:", err);
      res.status(500).json({ success: false, message: "Login failed" });
    }
};

exports.ForgotPassword = async (req,res) => {
  try {
      const email = req.body

      const findUser = await UserModel.findOne({email})
      const findAdmin = await AdminModel.findOne({email})

      if (!findUser || !findAdmin) {
        return res.status(404).json({
          success: false,
          message: !findUser ? "User not found" : "Admin not found",
        });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 5 * 60 * 1000);
  
      await OtpModel.deleteMany({ email }); // Remove old OTPs
      await OtpModel.create({ email, otp, expires });
      await sendMail(email , "reset", otp , findUser.username || ""); 

    
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ success: false, message: "Reset Password Failed" });
  }
}


