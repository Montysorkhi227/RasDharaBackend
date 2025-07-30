const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  }
});
const sendOtpEmail = async (to,type,otp,username) => {

  if (type === 'signup') {
    subject = `🔐 Your OTP for Registeration is ${otp} for RasDhara App`;
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="background: #4CAF50; color: #fff; text-align: center; padding: 20px;">
          <h1 style="margin: 0;">RasDhara</h1>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #333;">Hello ${username}👋,</h2>
          <p style="font-size: 16px; color: #555;">Your One-Time Password (OTP) for verifying your email address is:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 28px; font-weight: bold; color: #4CAF50; letter-spacing: 2px;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #777;">This OTP is valid for <b>10 minutes</b>. Please do not share it with anyone for security reasons.</p>
          <p style="font-size: 14px; color: #777;">If you did not request this, please ignore this email.</p>
        </div>
        <div style="background: #4CAF50; color: #fff; text-align: center; padding: 10px;">
          <p style="margin: 0; font-size: 14px;">&copy; ${new Date().getFullYear()} RasDhara App</p>
        </div>
      </div>
    `;
  } else if (type === 'login'  && otp === null) {
    subject = `✅ User Login Successful - RasDhara App`;
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="background: #4CAF50; color: #fff; text-align: center; padding: 20px;">
          <h1 style="margin: 0;">RasDhara</h1>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #333;">Hello ${username}👋,</h2>
          <p style="font-size: 16px; color: #555;">You have successfully logged into your RasDhara account.</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 20px; color: #4CAF50; font-weight: bold;">Welcome Back!</span>
          </div>
          <p style="font-size: 14px; color: #777;">If this wasn't you, please change your password immediately and contact our support team.</p>
        </div>
        <div style="background: #4CAF50; color: #fff; text-align: center; padding: 10px;">
          <p style="margin: 0; font-size: 14px;">&copy; ${new Date().getFullYear()} RasDhara App</p>
        </div>
      </div>
    `;
  } else if (type === 'login') {
    subject = `🔐𝙊𝙏𝙋 𝙁𝙊𝙍 𝘼𝘿𝙈𝙄𝙉 𝙇𝙊𝙂𝙄𝙉 𝙄𝙎 ${otp}- RasDhara App`;
    html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.15); border: 1px solid #e0e0e0;">
      <div style="background: linear-gradient(90deg, #43cea2, #185a9d); padding: 25px; color: white; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">🔐 RasDhara Admin</h1>
        <p style="margin: 5px 0 0; font-size: 16px;">Secure Login Verification</p>
      </div>
  
      <div style="padding: 30px; background-color: #ffffff;">
        <h2 style="color: #333333;">Hello Admin 👋,</h2>
        <p style="font-size: 16px; color: #555;">We received a request to log in to your <strong>RasDhara Admin</strong> account. Please use the OTP below to complete your login.</p>
  
        <div style="margin: 30px 0; text-align: center;">
          <div style="display: inline-block; background: #f0fdf4; padding: 15px 30px; border-radius: 10px; font-size: 32px; font-weight: bold; color: #2e7d32; letter-spacing: 3px; border: 2px dashed #a5d6a7;">
            ${otp}
          </div>
        </div>
  
        <p style="font-size: 14px; color: #777;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
        <p style="font-size: 14px; color: #777;">If you didn’t initiate this login, we recommend updating your password and contacting support immediately.</p>
      </div>
  
      <div style="background: #f1f1f1; padding: 15px; text-align: center; color: #888; font-size: 13px;">
        &copy; ${new Date().getFullYear()} RasDhara App — All Rights Reserved.
      </div>
    </div>
  `;  
  } else if (type === 'verifyadminotp') {
    subject = `✅ Admin Login Successful - RasDhara App`;
    html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.2); border: 1px solid #e0e0e0;">
      <div style="background: linear-gradient(135deg, #43cea2, #185a9d); padding: 30px; color: white; text-align: center;">
        <h1 style="margin: 0; font-size: 30px;">🌟RasDhara Admin🌟</h1>
        <p style="margin: 8px 0 0; font-size: 17px;">Login Successful</p>
      </div>
  
      <div style="padding: 35px 30px; background-color: #ffffff;">
        <h2 style="color: #333333;">Hello Admin 👋</h2>
        <p style="font-size: 16px; color: #555;">You have successfully logged into your RasDhara account.</p>
  
        <div style="margin: 30px 0; text-align: center;">
          <div style="
            display: inline-block;
            background: linear-gradient(90deg, #d4fc79, #96e6a1);
            padding: 20px 40px;
            border-radius: 14px;
            font-size: 38px;
            font-weight: bold;
            color: #1b5e20;
            letter-spacing: 5px;
            border: 3px dashed #66bb6a;
            box-shadow: 0 0 12px #a5d6a7, 0 0 24px #81c784;
          ">
            ${otp}
          </div>
        </div>
  
        <p style="font-size: 14px; color: #888; margin-top: 20px;">If this wasn’t you, please reset your password and contact support immediately.</p>
      </div>
  
      <div style="background: #f1f1f1; padding: 15px; text-align: center; color: #888; font-size: 13px;">
        &copy; ${new Date().getFullYear()} RasDhara App — All Rights Reserved.
      </div>
    </div>
  `;
  
  }else if (type === 'reset') {
    subject = `🔐 Password Reset OTP - RasDhara App`;
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="background: #f44336; color: #fff; text-align: center; padding: 20px;">
          <h1 style="margin: 0;">RasDhara</h1>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #333;">Hello 👋,</h2>
          <p style="font-size: 16px; color: #555;">We received a request to reset your password.</p>
          <p style="font-size: 16px; color: #555;">Your OTP for password reset is:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 28px; font-weight: bold; color: #f44336; letter-spacing: 2px;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #777;">This OTP is valid for <b>10 minutes</b>. Please do not share it with anyone for security reasons.</p>
          <p style="font-size: 14px; color: #777;">If you didn’t request a password reset, please ignore this email.</p>
        </div>
        <div style="background: #f44336; color: #fff; text-align: center; padding: 10px;">
          <p style="margin: 0; font-size: 14px;">&copy; ${new Date().getFullYear()} RasDhara App</p>
        </div>
      </div>
    `;
  }

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: to,
    subject,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ ${type.toUpperCase()} Email sent:`, info.response);
  } catch (error) {
    console.error(`❌ ${type.toUpperCase()} Email failed:`, error);
  }
};

module.exports = sendOtpEmail;
