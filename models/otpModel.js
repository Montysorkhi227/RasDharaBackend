const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expires: { type: Date, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600  // 10 minutes = 600 seconds
  },
},{
  timestamps: true,
  autoIndex: true, 
});

module.exports = mongoose.model("OtpModel", otpSchema);
