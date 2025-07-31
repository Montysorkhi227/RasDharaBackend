const UserModel = require("../models/userModel")
const TempModel = require("../models/temporaryModel")
const OtpModel = require("../models/otpModel")
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